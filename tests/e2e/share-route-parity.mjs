import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// Run against npm start after npm run build; the server consumes out/_redirects.
const base = process.env.BASE_URL ?? "http://127.0.0.1:3220";
const fixture = { title: "Route parity", wordsText: "horizontal\nvertical\ndiagonal", seed: "route-parity-fixed", difficulty: "hard", alphabetPack: "latin", autoSize: false, rows: 12, cols: 12, directions: ["E", "S", "SE"], allowOverlap: true, fillerMode: "alphabet" };
const encoded = Buffer.from(JSON.stringify(fixture)).toString("base64url");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
try {
  let grid, solverLines, qr;
  for (const kind of ["play", "print", "pdf", "answer-key", "embed", "custom"]) {
    const response = await page.goto(`${base}/${kind}/${encoded}?qrCode=true`, { waitUntil: "networkidle" });
    check(response?.status() === 200, `${kind}: rewrite did not return 200`);
    check((response?.headers()["x-robots-tag"] ?? "").includes("noindex"), `${kind}: missing noindex header`);
    await page.locator('[data-utility-state="ready"]').waitFor();
    check((await page.locator('meta[name="robots"]').getAttribute("content") ?? "").includes("noindex"), `${kind}: missing robots noindex`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href").catch(() => null);
    check(!canonical || !canonical.includes(encoded), `${kind}: encoded state was canonicalized`);
    const tokens = kind === "play" || kind === "custom"
      ? await page.locator(".solver-grid [data-solver-cell]").allTextContents()
      : await page.locator(".puzzle-svg .puzzle-token").allTextContents();
    check(tokens.length === 144, `${kind}: expected 144 cells, got ${tokens.length}`);
    if (!grid) grid = tokens;
    else check(JSON.stringify(tokens) === JSON.stringify(grid), `${kind}: grid differs from play`);
    if (kind === "play") {
      await page.getByRole("button", { name: "Begin puzzle" }).click();
      await page.locator(".solver-control-row").getByRole("button", { name: "Show Answers" }).click();
      await page.getByRole("dialog", { name: "Show puzzle answers?" }).getByRole("button", { name: "Show answers" }).click();
      solverLines = await page.locator(".solver-answer-line").evaluateAll(lines => lines.map(line => ["x1", "y1", "x2", "y2"].map(key => Number(line.getAttribute(key)))));
      check(solverLines.length === 3, `play: expected 3 answer paths, got ${solverLines.length}`);
    }
    if (["print", "pdf", "answer-key"].includes(kind)) {
      await page.locator('.print-footer img').waitFor();
      const image = await page.locator('.print-footer img').getAttribute('src');
      if (!qr) qr = image;
      else check(image === qr, `${kind}: QR image differs`);
    }
    if (kind === "answer-key") {
      const lines = await page.locator(".puzzle-svg line").evaluateAll(lines => lines.map(line => ["x1", "y1", "x2", "y2"].map(key => Number(line.getAttribute(key)) / 34)));
      check(JSON.stringify(lines) === JSON.stringify(solverLines), "answer-key paths differ from play answers");
    }
    if (kind === "pdf") {
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download this PDF" }).click();
      const download = await downloadPromise;
      const bytes = await readFile(await download.path());
      const loadingTask = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
      const doc = await loadingTask.promise;
      const text = (await (await doc.getPage(1)).getTextContent()).items.map(item => "str" in item ? item.str : "").join("").replace(/\s/g, "").toUpperCase();
      for (let row = 0; row < 12; row++) check(text.includes(grid.slice(row * 12, row * 12 + 12).join("").toUpperCase()), `PDF: row ${row + 1} differs`);
      await loadingTask.destroy();
    }
  }
  for (const kind of ["play", "print", "pdf", "answer-key", "embed", "custom"]) {
    await page.goto(`${base}/${kind}/invalid-state`, { waitUntil: "networkidle" });
    check(await page.locator('[data-utility-state="invalid"]').isVisible(), `${kind}: invalid state not explicit`);
    check(await page.locator('.solver-grid, .puzzle-svg').count() === 0, `${kind}: invalid state generated a fallback grid`);
  }
  const response = await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  check(response?.status() === 200, "generator failed");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  check(canonical === "https://www.ilovewordsearch.com/word-search-generator", `unexpected generator canonical: ${canonical}`);
  if (failures.length) throw new Error(failures.join("\n"));
  console.log("Static encoded-route parity passed: six rewrites, grid tokens, PDF rows, answer paths, QR images, invalid states and indexability.");
} finally { await browser.close(); }
