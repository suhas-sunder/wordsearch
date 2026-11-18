import assert from "node:assert/strict";
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3251";
const before = process.env.WORKLOAD_BEFORE === "1";
const words = (count, length) => Array.from({ length: count }, (_, i) =>
  "A".repeat(length - 3) + String.fromCharCode(66 + Math.floor(i / 676), 65 + Math.floor(i / 26) % 26, 65 + i % 26)).join("\n");
const common = { title: "Workload benchmark", seed: "workload-review", difficulty: "medium", alphabetPack: "latin", autoSize: false, rows: 40, cols: 40 };
const cases = [
  { name: "legacy-nine", patch: { directions: Array(9).fill("E"), wordsText: "puzzle\nsearch\nletters\nprint\nteacher\nfamily\nwords\nsolve\nbrain\npaper" }, reject: false },
  { name: "dense-repeat-overlap", patch: { directions: Array(128).fill("E"), wordsText: words(200, 20), allowOverlap: true }, reject: true },
  { name: "dense-repeat-no-overlap", patch: { directions: Array(128).fill("E"), wordsText: words(200, 20), allowOverlap: false }, reject: true },
  { name: "dense-eight-directions", patch: { directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"], wordsText: words(200, 20), allowOverlap: true }, reject: true },
  { name: "long-forty", patch: { directions: Array(128).fill("E"), wordsText: words(100, 40), allowOverlap: true }, reject: true },
  { name: "ordinary-large-list", patch: { directions: ["E"], wordsText: words(200, 10), allowOverlap: false }, reject: false },
  { name: "admitted-dense-boundary", patch: { directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"], wordsText: words(125, 10), allowOverlap: true }, reject: false },
  { name: "admitted-repeated-boundary", patch: { directions: Array(12).fill("E"), wordsText: words(39, 20), allowOverlap: false }, reject: false }
];
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    for (const fixture of cases) {
      const state = Buffer.from(JSON.stringify({ ...common, ...fixture.patch })).toString("base64url");
      for (const kind of ["builder", "pdf"]) {
        const page = await context.newPage();
        await page.addInitScript(() => {
          window.__workloadLongTasks = [];
          new PerformanceObserver((list) => window.__workloadLongTasks.push(...list.getEntries().map((entry) => entry.duration))).observe({ type: "longtask", buffered: true });
        });
        const started = performance.now();
        await page.goto(`${base}${kind === "builder" ? `/word-search-generator?state=${state}` : `/pdf/${state}`}`, { waitUntil: "domcontentloaded", timeout: 120000 });
        const reject = !before && fixture.reject;
        if (reject) {
          await page.locator(kind === "builder" ? '.builder-surface [role="alert"]' : '[data-utility-state="invalid"]').waitFor({ timeout: 120000 });
          if (kind === "builder") assert.match(await page.locator('.builder-surface [role="alert"]').innerText(), /workload/i);
          assert.equal(await page.locator(".puzzle-svg, .utility-print-portal").count(), 0);
        } else {
          await page.locator(kind === "builder" ? ".builder-preview .puzzle-svg" : '[data-utility-state="ready"]').waitFor({ timeout: 120000 });
        }
        const elapsedMs = Math.round(performance.now() - started);
        await page.waitForTimeout(100);
        const longTaskMs = await page.evaluate(() => Math.round(Math.max(0, ...window.__workloadLongTasks)));
        console.log(JSON.stringify({ width, name: fixture.name, kind, result: reject ? "rejected" : "generated", elapsedMs, longTaskMs }));
        await page.close();
      }
    }
    await context.close();
  }
} finally { await browser.close(); }
