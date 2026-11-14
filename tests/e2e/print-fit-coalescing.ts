import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

type FrameRecord = { html: string; start: number; end: number | null; measuredBody?: string; geometry?: unknown[]; fonts?: unknown; parentFontsAtWrite?: unknown; fontCheck?: boolean; glyphBoundsFit?: boolean; contentBoundsFit?: boolean };
type Sample = { name: string; run: number; grid: string[]; fingerprints: string[]; measuredBodies: string[]; measuredGeometry: unknown[]; fonts: unknown[]; writes: number; frameWallMs: number };
declare global { interface Window { __printFitFrames: FrameRecord[] } }
const baseline = process.env.FIT_BASELINE_URL;
const candidate = process.env.BASE_URL;
const output = process.env.FIT_OUTPUT;
const fontControl = process.env.FIT_FONT_CONTROL === "block";
assert.ok(baseline && candidate && output, "Set FIT_BASELINE_URL, BASE_URL and external FIT_OUTPUT");
await mkdir(output, { recursive: true });
const rows: Sample[] = [];
const geometryComparisons: boolean[] = [];
const browser = await chromium.launch({ headless: true });
try {
  for (let run = 1; run <= 3; run++) {
    const pair: Sample[] = [];
    const sources: Array<[string, string]> = [["baseline", baseline], ["candidate", candidate]];
    for (const [name, base] of sources) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" });
      try {
        const page = await context.newPage();
        const fontResponses: Array<Promise<unknown>> = [];
        page.on("response", (response) => {
          if (/\.woff2?(?:\?|$)/.test(response.url())) fontResponses.push((async () => {
            try { return { url: response.url(), status: response.status(), sha256: createHash("sha256").update(await response.body()).digest("hex") }; }
            catch (error) { return { url: response.url(), status: response.status(), error: String(error) }; }
          })());
        });
        page.on("requestfailed", (request) => { if (/\.woff2?(?:\?|$)/.test(request.url())) fontResponses.push(Promise.resolve({ url: request.url(), failure: request.failure() })); });
        await page.addInitScript((blockFonts) => {
          window.__printFitFrames = [];
          const append = Node.prototype.appendChild, remove = Element.prototype.remove;
          const records = new WeakMap<Element, FrameRecord>();
          Node.prototype.appendChild = function<T extends Node>(node: T): T {
            const result = append.call(this, node) as T;
            if (node instanceof HTMLIFrameElement && node.title === "Checking worksheet print fit") {
              const doc = node.contentDocument!;
              const write = doc.write.bind(doc);
              doc.write = (...text: string[]) => {
                const record = { html: text.join(""), start: performance.now(), end: null, parentFontsAtWrite: [...document.fonts].map((font) => ({ family: font.family, weight: font.weight, status: font.status })) };
                window.__printFitFrames.push(record); records.set(node, record);
                // Explicit causal diagnostic only: change font swap policy in
                // measurement frames, never parent UI or application source.
                write(...(blockFonts ? text.map((value) => value.replaceAll("font-display: optional", "font-display: block")) : text));
              };
            }
            return result;
          };
          Element.prototype.remove = function() {
            const record = records.get(this);
            if (record && this instanceof HTMLIFrameElement) {
              const doc = this.contentDocument!;
              record.end = performance.now();
              // Observe the actual measured DOM, after measureHtml's existing
              // fit-status removal. Do not alter input CSS or worksheet nodes.
              record.measuredBody = doc.body.outerHTML;
              record.fonts = [...doc.fonts].map((font) => ({ family: font.family, weight: font.weight, status: font.status }));
              record.fontCheck = doc.fonts.check('850 24.36px "Atkinson Hyperlegible Next"', "ANUBIS");
              record.glyphBoundsFit = [...doc.querySelectorAll<SVGTextElement>(".puzzle-token")].every((token) => {
                const cell = token.parentElement?.querySelector("rect");
                if (!cell) return false;
                const glyph = token.getBoundingClientRect(), box = cell.getBoundingClientRect();
                return glyph.left >= box.left - 0.25 && glyph.right <= box.right + 0.25 && glyph.top >= box.top - 0.25 && glyph.bottom <= box.bottom + 0.25;
              });
              record.contentBoundsFit = [...doc.querySelectorAll("article.print-sheet")].every((article) => {
                const bounds = article.getBoundingClientRect();
                return [...article.querySelectorAll(".puzzle-token,.grid-coordinate,.print-word-bank span,.print-header h1,.print-header h2,.print-header p,.name-date span,.print-footer img,.print-footer > div")].every((node) => {
                  const box = node.getBoundingClientRect();
                  return box.width > 0 && box.height > 0 && box.left >= bounds.left - 2 && box.right <= bounds.right + 2 && box.top >= bounds.top - 2 && box.bottom <= bounds.bottom + 2;
                });
              });
              record.geometry = [...doc.querySelectorAll("article.print-sheet,.puzzle-svg,.puzzle-token,.grid-coordinate,.print-word-bank span,.print-header h1,.print-header h2,.print-header p,.name-date span,.print-footer img,.print-footer > div")].map((node) => {
                const box = node.getBoundingClientRect(), css = doc.defaultView!.getComputedStyle(node);
                return { text: node.textContent, tag: node.tagName, box: [box.x, box.y, box.width, box.height], font: [css.fontFamily, css.fontSize, css.fontWeight, css.lineHeight], display: css.display, overflow: css.overflow };
              });
            }
            remove.call(this);
          };
        }, fontControl);
        const cdp = await context.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await cdp.send("Profiler.enable"); await cdp.send("Profiler.start");
        // Normal provider loading: no advertising mocks or network blocking.
        await page.goto(`${base}/word-searches/history/ancient-egypt-word-search`, { waitUntil: "networkidle" });
        await page.getByRole("heading", { name: "Build a word search", exact: true }).waitFor();
        await page.waitForFunction(() => document.querySelectorAll(".print-fit-status").length === 2 && [...document.querySelectorAll<HTMLElement>(".print-fit-status")].every((node) => node.dataset.fitState === "ready"));
        await page.waitForTimeout(300);
        const { profile } = await cdp.send("Profiler.stop");
        await writeFile(join(output, `${name}-${run}.cpuprofile`), JSON.stringify(profile));
        const frames = await page.evaluate(() => window.__printFitFrames);
        assert.ok(frames.every((frame) => frame.end !== null), "all real measurement frames removed");
        assert.ok(frames.every((frame) => frame.glyphBoundsFit), "actual glyphs fit the cells with unchanged quarter-pixel rounding");
        assert.ok(frames.every((frame) => frame.contentBoundsFit), "actual content remains inside the worksheet with unchanged two-pixel rounding");
        if (fontControl) assert.ok(frames.every((frame) => frame.html.includes("font-display: optional")), "control actually addresses the existing optional font policy");
        assert.equal(await page.locator('iframe[title="Checking worksheet print fit"]').count(), 0);
        const grid = await page.locator(".preview-paper .puzzle-token").allTextContents();
        assert.equal(grid.length, 324);
        const fingerprints = frames.map((frame) => createHash("sha256").update(frame.html).digest("hex"));
        const measuredBodies = [...new Set(frames.map((frame) => createHash("sha256").update(frame.measuredBody!).digest("hex")))].sort();
        const measuredGeometry = [...new Map(frames.map((frame) => [JSON.stringify(frame.geometry), frame.geometry!])).values()];
        await writeFile(join(output, `${name}-${run}-frames.json`), JSON.stringify(frames, null, 2));
        const record = { name, run, grid, fingerprints, measuredBodies, measuredGeometry, fonts: await Promise.all(fontResponses), writes: frames.length, frameWallMs: frames.reduce((total, frame) => total + frame.end! - frame.start, 0) };
        await writeFile(join(output, `${name}-${run}-result.json`), JSON.stringify(record, null, 2));
        pair.push(record); rows.push(record);
      } finally { await context.close(); }
    }
    assert.deepEqual(pair[1].grid, pair[0].grid);
    assert.deepEqual(pair[1].measuredBodies, pair[0].measuredBodies, "actual measured worksheet markup stays byte-identical");
    const geometryEqual = JSON.stringify(pair[1].measuredGeometry) === JSON.stringify(pair[0].measuredGeometry);
    geometryComparisons.push(geometryEqual);
    if (fontControl) assert.deepEqual(pair[1].measuredGeometry, pair[0].measuredGeometry, "controlled-font actual geometry, glyphs and relevant computed styles stay identical");
    assert.ok(pair[0].writes > new Set(pair[0].fingerprints).size, "baseline repeats exact full HTML/CSS inputs");
    assert.equal(pair[1].writes, new Set(pair[1].fingerprints).size, "candidate does not repeat an in-flight full HTML/CSS input");
    assert.ok(pair[1].writes < pair[0].writes, "candidate performs fewer expensive actual checks");
  }
  await writeFile(join(output, "summary.json"), JSON.stringify({ baseline, candidate, cpuSlowdown: 4, fontControl: fontControl ? "block in isolated measurement frame only; diagnostic" : "unchanged optional; descriptive observation", geometryComparisons, network: "Normal provider loading, no mocks", notReleasePass: true, rows }, null, 2));
  console.log(JSON.stringify(rows.map(({ name, run, writes, frameWallMs }) => ({ name, run, writes, frameWallMs }))));
} finally { await browser.close(); }
