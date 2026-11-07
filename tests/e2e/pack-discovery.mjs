import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3446";
for (const path of ["/word-searches-for-teachers", "/word-search-worksheets", "/collections/classroom-word-search-worksheets", "/word-searches/animals/dog-word-search"]) {
  const html = await (await fetch(`${base}${path}`)).text();
  assert.ok(html.includes('href="/pack-builder"'), `${path} has an SSR worksheet-pack link`);
}
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
assert.equal(sitemap.includes("/pack-builder"), false, "a utility link does not activate sitemap indexing");
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 390, 768, 1024, 1280, 1600]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    for (const path of ["/word-searches-for-teachers", "/word-search-worksheets"]) {
      await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      const action = page.locator('.hero-actions a[href="/pack-builder"]');
      assert.equal(await action.count(), 1);
      await action.focus();
      assert.equal(await action.evaluate((link) => document.activeElement === link && getComputedStyle(link).outlineStyle !== "none"), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      const boxes = await action.evaluate((link) => {
        const a = link.getBoundingClientRect();
        return [...document.querySelectorAll("[data-ad-placement]")].every((ad) => { const b = ad.getBoundingClientRect(); return !b.width || !b.height || a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom; });
      });
      assert.equal(boxes, true, "worksheet CTA cannot overlap ad geometry");
      if ([390, 1280].includes(width)) await page.keyboard.press("Enter");
      else await action.click();
      await page.waitForURL("**/pack-builder");
      assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
      assert.equal(await page.locator("[data-ad-placement]").count(), 0);
      assert.equal(await page.getByRole("heading", { name: "Word Search Pack Builder", exact: true }).count(), 1);
      if (width === 390) {
        const result = await new AxeBuilder({ page }).analyze();
        assert.deepEqual(result.violations.filter(({ impact }) => ["serious", "critical"].includes(impact)), []);
      }
    }
    await context.close();
  }
  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  await noScript.goto(`${base}/word-searches-for-teachers`);
  await noScript.locator('.hero-actions a[href="/pack-builder"]').click();
  await noScript.waitForURL("**/pack-builder");
  assert.match(await noScript.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  await noScript.close();
} finally { await browser.close(); }
console.log("Worksheet packs: crawlable discovery, six widths, keyboard, no-JS links, noindex, ad-free and axe passed.");
