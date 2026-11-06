import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3102";
const baselineUrl = process.env.BASELINE_URL ?? "http://localhost:3117";
const output = process.env.FOOTER_AUDIT_OUTPUT ?? join(tmpdir(), "wordsearch-fast-track-footer");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const routes = ["/", "/about", "/word-searches/animals/dog-word-search"];

async function inspect(page, url, imagePath) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  const record = await page.evaluate(() => ({
    title: document.title,
    metadata: Array.from(document.head.querySelectorAll("meta[name]:not([name='next-size-adjust']), meta[property], link[rel='canonical']"), (node) => node.outerHTML).sort(),
    structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), (node) => node.textContent),
    mainText: document.querySelector("main")?.textContent,
    headings: Array.from(document.querySelectorAll("main h1, main h2, main h3"), (node) => node.textContent),
    footerLinks: Array.from(document.querySelectorAll(".site-footer a"), (node) => [node.getAttribute("href"), node.textContent.trim()]).sort(),
    header: document.querySelector(".site-header").innerHTML,
    ads: Array.from(document.querySelectorAll("[data-ad-placement]"), (node) => [node.getAttribute("data-ad-placement"), node.getAttribute("data-ad-template"), node.className]),
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    cls: window.__footerCls ?? 0
  }));
  // Capture after measurement: tall element screenshots temporarily resize the viewport.
  await page.locator(".site-footer").screenshot({ path: imagePath, style: ".site-header, .skip-link { visibility: hidden !important; }" });
  return record;
}

try {
  for (const width of [320, 390, 768, 1280]) {
    for (const [index, route] of routes.entries()) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await context.newPage();
      await page.addInitScript(() => {
        window.__footerCls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__footerCls += entry.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      // Keep the comparison deterministic without changing application advertising behavior.
      await page.route(/googlesyndication|doubleclick/, (request) => request.abort());
      const before = await inspect(page, `${baselineUrl}${route}`, join(output, `before-${width}-${index}.png`));
      const after = await inspect(page, `${baseUrl}${route}`, join(output, `after-${width}-${index}.png`));
      assert.equal(after.title, before.title);
      assert.deepEqual(after.metadata, before.metadata, `${route}: metadata`);
      assert.deepEqual(after.structuredData, before.structuredData, `${route}: structured data`);
      assert.equal(after.mainText, before.mainText, `${route}: main content`);
      assert.deepEqual(after.headings, before.headings, `${route}: editorial headings`);
      assert.deepEqual(after.footerLinks, before.footerLinks, `${route}: crawlable footer links`);
      // React-generated identifiers may vary between builds; header artwork and link inventory may not.
      assert.equal(await page.locator(".site-header .brand-mark").getAttribute("src"), "/brand-icon.webp");
      assert.equal(await page.locator(".site-footer .brand-mark").getAttribute("src"), "/brand-icon.webp");
      assert.equal(await page.locator(".site-footer .brand-wordmark").textContent(), await page.locator(".site-header .brand-wordmark").textContent());
      assert.deepEqual(after.ads, before.ads, `${route}: ad placement DOM`);
      assert.ok(after.cls <= 0.1, `${route}: unexpected layout shifts at ${width}: CLS ${after.cls}`);
      assert.equal(after.overflow, false, `${route}: horizontal overflow at ${width}`);
      assert.equal(await page.locator(".footer-legal a").count(), 3);
      assert.equal(await page.locator(".footer-tool-link svg[aria-hidden='true']").count(), 5);
      assert.equal(await page.locator(".site-footer [data-ad-placement]").count(), 0);
      const footerViolations = await new AxeBuilder({ page }).include(".site-footer").analyze();
      assert.deepEqual(footerViolations.violations.map((item) => item.id), [], `${route}: footer accessibility`);
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator(".site-footer").isVisible(), false, "footer remains excluded from print");
      await context.close();
    }
  }
  console.log(`PASS footer presentation: four widths, three archetypes, baseline metadata/structured data/links/ad parity, footer accessibility, print hiding. Screenshots: ${output}`);
} finally {
  await browser.close();
}
