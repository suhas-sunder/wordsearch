import { pdfPageSpec, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";

export const browserPrintFitHelp = "This worksheet does not fit the selected paper. Try a word bank below the grid, fewer words, shorter title or instructions, or another orientation.";

function printRules(rules: CSSRuleList): string {
  return Array.from(rules).flatMap((rule) => {
    if (rule.type === CSSRule.MEDIA_RULE) {
      const media = rule as CSSMediaRule;
      return media.conditionText === "print" ? [Array.from(media.cssRules).map((child) => child.cssText).join("\n")] : [];
    }
    return [];
  }).join("\n");
}

/** Actual DOM/layout measurement, not a word-count or estimated-font cutoff. */
async function measureHtml(html: string, options: PuzzleOutputOptions, offline: boolean, signal?: AbortSignal): Promise<void> {
  signal?.throwIfAborted();
  const page = pdfPageSpec(options.paperSize, options.orientation);
  const frame = document.createElement("iframe");
  frame.title = "Checking worksheet print fit";
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.setAttribute("sandbox", "allow-same-origin");
  Object.assign(frame.style, { position: "fixed", left: "-20000px", top: "0", width: `${page.width * 4 / 3}px`, height: `${page.height * 4 / 3}px`, border: "0", visibility: "hidden" });
  document.body.appendChild(frame);
  try {
    const doc = frame.contentDocument;
    if (!doc) throw new Error("Print measurement could not open.");
    doc.open(); doc.write(html); doc.close();
    // Flatten only explicit print rules inside this isolated frame. Never
    // activate print styles on the interactive document or change ad geometry.
    const print = doc.createElement("style");
    print.textContent = Array.from(doc.styleSheets).map((sheet) => printRules(sheet.cssRules)).join("\n");
    doc.head.appendChild(print);
    doc.querySelectorAll(".print-fit-status").forEach((node) => node.remove());
    const margin = offline || options.paperSize === "letter" ? 0.45 * 96 : 11 * 96 / 25.4;
    Object.assign(doc.body.style, { margin: `${margin}px`, padding: "0", width: `${page.width * 4 / 3 - margin * 2}px` });
    // Start font discovery/layout before taking the font readiness promise.
    doc.body.getBoundingClientRect();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        Promise.all([doc.fonts.ready, ...Array.from(doc.images).map((image) => image.decode())]),
        new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error("Print fonts or QR image are not ready. Please retry.")), 5000); })
      ]);
    } finally { clearTimeout(timeout); }
    signal?.throwIfAborted();
    const articles = Array.from(doc.querySelectorAll<HTMLElement>("article.print-sheet"));
    if (!articles.length || articles.length > 2) throw new Error("Print worksheet is not ready.");
    for (const article of articles) {
      const bounds = article.getBoundingClientRect();
      const grid = article.querySelector<SVGSVGElement>(".puzzle-svg");
      if (!grid || bounds.height <= 0 || bounds.height > page.height * 4 / 3 - margin * 2 + 2 || article.scrollHeight > article.clientHeight + 2 || article.scrollWidth > article.clientWidth + 2) throw new Error(browserPrintFitHelp);
      const content = article.querySelectorAll<HTMLElement | SVGGraphicsElement>(".puzzle-token,.grid-coordinate,.print-word-bank span,.print-header h1,.print-header h2,.print-header p,.name-date span,.print-footer img,.print-footer > div");
      for (const node of content) {
        const box = node.getBoundingClientRect();
        if (box.width <= 0 || box.height <= 0 || box.left < bounds.left - 2 || box.right > bounds.right + 2 || box.top < bounds.top - 2 || box.bottom > bounds.bottom + 2) throw new Error(browserPrintFitHelp);
      }
      for (const token of article.querySelectorAll<SVGTextElement>(".puzzle-token")) {
        const cell = token.parentElement?.querySelector("rect");
        if (!cell) throw new Error("A printable grid cell could not be measured.");
        const glyph = token.getBoundingClientRect(), box = cell.getBoundingClientRect();
        // These share the same SVG transform. A quarter CSS pixel allows only
        // numeric rounding, never an extra token or an arbitrary type-size cut.
        if (glyph.left < box.left - 0.25 || glyph.right > box.right + 0.25 || glyph.top < box.top - 0.25 || glyph.bottom > box.bottom + 0.25) throw new Error("Some grid labels do not fit inside their cells. Choose a shorter-token alphabet pack or edit the puzzle before printing.");
      }
    }
  } finally { frame.remove(); }
}

// Multiple previews/answer sheets share a bounded serial measurement queue.
let measurementQueue: Promise<unknown> = Promise.resolve();
function serialMeasure(html: string, options: PuzzleOutputOptions, offline: boolean, signal?: AbortSignal): Promise<void> {
  const next = measurementQueue.then(() => measureHtml(html, options, offline, signal));
  measurementQueue = next.catch(() => undefined);
  return next;
}

export function validateBrowserPrintSheet(article: HTMLElement, options: PuzzleOutputOptions, signal?: AbortSignal): Promise<void> {
  try {
    const css = Array.from(document.styleSheets).map((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n")).join("\n");
    const html = document.createElement("html");
    html.className = document.documentElement.className;
    const head = document.createElement("head");
    const style = document.createElement("style"); style.textContent = css; head.appendChild(style);
    const body = document.createElement("body"); body.className = document.body.className;
    // This is an isolated worksheet, never a utility portal or pending shell.
    body.classList.remove("utility-print-enabled");
    body.appendChild(article.cloneNode(true));
    html.append(head, body);
    return serialMeasure(`<!doctype html>${html.outerHTML}`, options, false, signal);
  } catch {
    return Promise.reject(new Error("Print styles could not be measured. Please retry after the page finishes loading."));
  }
}

export function validateOfflinePrintHtml(html: string, options: PuzzleOutputOptions): Promise<void> {
  return serialMeasure(html, options, true);
}
