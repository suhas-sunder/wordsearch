import { normalizePuzzleOutputOptions, pdfPageSpec, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { validateOfflinePrintHtml } from "@/lib/print/browser-fit";

export function htmlWorksheetFilename(title: string): string {
  const stem = title.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80).replace(/-$/, "");
  return `${stem || "word-search"}-worksheet.html`;
}

function escapedText(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

/** Serialize only the existing rendered worksheet articles; never regenerate the puzzle. */
export function createOfflineWorksheetHtml(portal: HTMLElement, title: string, options: PuzzleOutputOptions): string {
  const articles = Array.from(portal.children).filter((element) => element.matches("article.print-sheet"));
  if (!articles.length || articles.length > 2 || articles[0].getAttribute("aria-label") !== "Printable word search") throw new Error("The worksheet is not ready. Try again after the preview finishes updating.");
  const markup = articles.map((article, index) => {
    const copy = article.cloneNode(true) as HTMLElement;
    copy.querySelectorAll(".print-fit-status,.print-footer,script,iframe,object,embed,link,meta,style,form,input,button,textarea,select,img").forEach((element) => element.remove());
    for (const element of [copy, ...copy.querySelectorAll("*")]) {
      for (const attribute of [...element.attributes]) {
        if (attribute.name.toLowerCase().startsWith("on") || ["href", "src", "srcset", "style", "formaction"].includes(attribute.localName)) element.removeAttribute(attribute.name);
      }
    }
    if (!copy.querySelector("svg.puzzle-svg .puzzle-token")) throw new Error("The worksheet grid is unavailable. Nothing was downloaded.");
    if (index === 0) {
      const heading = copy.querySelector(".print-header h2");
      if (heading) { const h1 = document.createElement("h1"); h1.textContent = heading.textContent; heading.replaceWith(h1); }
    }
    return copy.outerHTML;
  }).join("\n");
  const safe = normalizePuzzleOutputOptions(options);
  const page = pdfPageSpec(safe.paperSize, safe.orientation);
  const width = `${page.width / 72}in`, height = `${page.height / 72}in`;
  const css = `
:root{color-scheme:light;font-family:Arial,Helvetica,sans-serif;color:#111;background:#eef1f4}
*{box-sizing:border-box}body{margin:0;padding:16px}main{max-width:${width};margin:auto}
.print-sheet{background:white;padding:.4in;margin:0 auto 20px;overflow-wrap:anywhere}
.print-header{display:flex;gap:16px;justify-content:space-between;align-items:flex-start}
h1,h2{font-size:20pt;line-height:1.15;margin:0 0 10px}p{margin:8px 0}.print-brand{font-size:10pt}
.print-subtitle,.print-instructions{font-size:11pt;line-height:1.4}.name-date{min-width:8em;font-size:11pt;display:grid;gap:14px}
.name-date span{border-bottom:1px solid #333;padding-bottom:12px}.print-grid-wrap{margin:16px auto}
.puzzle-svg{display:block;width:100%;height:auto;max-height:calc(${height} - 3.1in);margin:auto;overflow:visible}
.puzzle-token{font-family:Arial,Helvetica,sans-serif;fill:#111}.grid-coordinate{font-family:Arial,Helvetica,sans-serif;fill:#333;font-size:11px}
.print-word-bank{display:grid;grid-template-columns:repeat(auto-fit,minmax(8em,1fr));gap:8px 18px;font-size:12pt;line-height:1.4}
.print-word-bank span{break-inside:avoid;overflow-wrap:anywhere}.print-scale-large .print-word-bank{font-size:17pt}
.print-bank-beside .print-puzzle-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(7em,.35fr);gap:18px;align-items:center}
.print-bank-beside .print-word-bank{grid-template-columns:1fr}
@page{size:${safe.paperSize === "a4" ? "A4" : "letter"} ${safe.orientation};margin:.45in}
@media(max-width:600px){body{padding:8px}.print-sheet{padding:16px}.print-header{flex-wrap:wrap}.print-bank-beside .print-puzzle-body{display:block}}
@media print{:root,body{background:white}body{padding:0}main{max-width:none}.print-sheet{margin:0;padding:0;break-after:page}.print-sheet:last-child{break-after:auto}.print-answer-sheet{break-before:page}.print-header{break-inside:avoid}.print-grid-wrap{break-inside:avoid}}
@media print{
.print-sheet{height:calc(${height} - .9in - 1px);display:grid;grid-template-rows:auto minmax(0,1fr);break-inside:avoid}
.print-header{flex-wrap:nowrap}.print-header>div{min-width:0}
.print-sheet .print-puzzle-body{min-height:0;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:12px}
.print-sheet.print-bank-beside:not(.print-answer-sheet) .print-puzzle-body{grid-template-columns:minmax(0,1fr) minmax(7em,.35fr);grid-template-rows:minmax(0,1fr);align-items:stretch}
.print-sheet.print-answer-sheet .print-puzzle-body{grid-template-columns:minmax(0,1fr)}
.print-sheet .print-grid-wrap{width:100%;height:100%;min-height:0;min-width:0;margin:0}
.print-sheet .puzzle-svg{width:100%;height:100%;max-height:none;overflow:hidden}
.print-word-bank{align-content:start}
}
`;
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"><title>${escapedText(title)} — offline worksheet</title><style>${css}</style></head><body><main>${markup}</main></body></html>`;
}

export async function downloadOfflineWorksheet(portal: HTMLElement, title: string, options: PuzzleOutputOptions): Promise<void> {
  const html = createOfflineWorksheetHtml(portal, title, options);
  await validateOfflinePrintHtml(html, options);
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = htmlWorksheetFilename(title);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
