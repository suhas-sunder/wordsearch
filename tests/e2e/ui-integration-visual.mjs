import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseline = process.env.BASELINE_URL ?? "http://localhost:3252";
const candidate = process.env.BASE_URL ?? "http://localhost:3250";
const output = process.env.VISUAL_OUTPUT;
if (!output) throw new Error("VISUAL_OUTPUT must point outside the repository.");
await mkdir(output, { recursive: true });
const state = Buffer.from(JSON.stringify({ title: "UI review", wordsText: "CAT\nDOG", seed: "ui-review", alphabetPack: "latin", directions: ["E"], rows: 8, cols: 8, autoSize: false })).toString("base64url");
const routes = [{ name: "home", path: "/" }, { name: "categories", path: "/categories" }, { name: "search", path: "/search?q=food" }, { name: "utility", path: `/pdf/${state}` }];
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1440]) {
    for (const route of routes) {
      const results = [];
      for (const [label, base] of [["before", baseline], ["after", candidate]]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.route("https://pagead2.googlesyndication.com/**", (request) => request.fulfill({ contentType: "application/javascript", body: "" }));
        await page.addInitScript(() => {
          window.__visualCls = 0;
          new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) window.__visualCls += entry.value; })).observe({ type: "layout-shift", buffered: true });
        });
        await page.goto(`${base}${route.path}`, { waitUntil: "networkidle" });
        if (route.name === "utility") await page.locator('[data-utility-state="ready"]').waitFor();
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
        const result = await page.evaluate(() => ({
          text: document.querySelector("main").innerText,
          links: [...document.querySelectorAll("a[href]")].map((link) => link.getAttribute("href")),
          seo: [...document.querySelectorAll('link[rel="canonical"],meta[name="robots"],meta[name="description"],script[type="application/ld+json"]')].map((node) => node.outerHTML),
          adTop: document.querySelector('[data-ad-placement="top-banner"]')?.getBoundingClientRect().toJSON(),
          cls: window.__visualCls
        }));
        results.push(result);
        await page.screenshot({ path: `${output}/${label}-${route.name}-${width}.png`, fullPage: true });
        await page.close();
      }
      assert.equal(results[1].text, results[0].text, "visible main content preserved");
      assert.deepEqual(results[1].links, results[0].links, "crawlable links preserved");
      assert.deepEqual(results[1].seo, results[0].seo, "canonical, metadata and JSON-LD preserved");
      assert.deepEqual(results[1].adTop, results[0].adTop, "top ad geometry preserved");
      assert.ok(results[1].cls <= results[0].cls + 0.01, `new layout shift: before=${results[0].cls}, after=${results[1].cls}`);
      console.log(JSON.stringify({ route: route.name, width, beforeCls: results[0].cls, afterCls: results[1].cls, contentLinksSeoAdGeometry: "unchanged" }));
    }
  }
} finally { await browser.close(); }
