import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3507";
const output = process.env.ENLARGED_TEXT_OUTPUT;
assert.ok(output, "Set an outside-repository ENLARGED_TEXT_OUTPUT directory");
await mkdir(output, { recursive: true });
const routes = ["/", "/word-search-generator", "/collections/hard-printable-word-searches", "/categories/animals-word-searches", "/word-searches/animals/dog-word-search", "/pack-builder", "/guides", "/guides/how-to-print-a-word-search", "/about", "/contact", "/privacy", "/search?q=food", "/specialty/asl-fingerspelling-word-search-generator", "/print/invalid-state"];
const report = { base, node: process.version, sourceSha: process.env.ENLARGED_TEXT_SOURCE_SHA ?? null, method: "CSS root font size 200% with actual computed-size proof; tests text resizing, not native browser zoom or SVG glyph magnification", rows: [], failures: [] };
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 1024]) for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: "reduce" });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    for (const path of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      try {
        const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        if (path === "/word-search-generator" || path.includes("/dog-word-search")) await page.locator(".builder-surface").waitFor();
        const before = await page.locator("html").evaluate((element) => getComputedStyle(element).fontSize);
        await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
        await page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
        const layout = await page.evaluate(() => ({
          rootFont: getComputedStyle(document.documentElement).fontSize,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          clippedControls: [...document.querySelectorAll("main button,main summary")].filter((element) => {
            const box = element.getBoundingClientRect();
            return box.width > 0 && box.height > 0 && element.scrollWidth > element.clientWidth + 2;
          }).map((element) => ({ text: element.textContent.trim(), width: element.clientWidth, content: element.scrollWidth })),
          mainHeading: document.querySelector("main h1")?.textContent
        }));
        assert.ok(parseFloat(layout.rootFont) >= parseFloat(before) * 1.9, "actual root text size doubled");
        const row = { path, width, theme, before, ...layout, errors };
        report.rows.push(row);
        if (layout.overflow || layout.clippedControls.length || errors.length) {
          const screenshot = `${report.rows.length}-${width}-${theme}.png`;
          await page.screenshot({ path: `${output}/${screenshot}`, fullPage: false });
          report.failures.push({ ...row, screenshot });
        }
      } finally { await page.close(); }
    }
    await context.close();
  }
  await writeFile(`${output}/result.json`, `${JSON.stringify(report, null, 2)}\n`);
  assert.deepEqual(report.failures, [], "text resizing must preserve responsive layout and readable controls");
  console.log(`Enlarged text: ${report.rows.length} actual 200% root-font cases passed.`);
} finally { await browser.close(); }
