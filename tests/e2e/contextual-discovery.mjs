import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3266";
const routes = ["/", "/free-printable-word-searches", "/word-searches/animals/dog-word-search", "/categories/animals-word-searches", "/collections/hard-printable-word-searches", "/guides/how-to-print-a-word-search", "/topics"];
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    for (const path of routes) {
      const response = await page.goto(`${base}${path}`, { waitUntil: "networkidle" });
      const html = await response.text();
      assert.ok(html.includes("Search the puzzle catalog"), `${path} server-rendered search label`);
      const tools = page.locator("main .tools-section").last();
      await tools.getByRole("heading", { name: "All tools", exact: false }).waitFor();
      const input = tools.getByRole("combobox", { name: "Search the puzzle catalog" });
      await input.fill("food");
      await tools.locator('[role="option"]').first().waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      const overlap = await tools.locator(".search-suggestions").evaluate((suggestions) => {
        const panel = suggestions.getBoundingClientRect();
        return [...document.querySelectorAll("[data-ad-placement]")].some((ad) => {
          const r = ad.getBoundingClientRect();
          return r.width && r.height && r.top < panel.bottom && r.bottom > panel.top && r.left < panel.right && r.right > panel.left;
        });
      });
      assert.equal(overlap, false, `${path} suggestions stay clear of ads`);
      const axe = await new AxeBuilder({ page }).include("main .tools-section").analyze();
      assert.deepEqual(axe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact)), []);
      await input.press("Escape");
      assert.equal(await tools.locator(".search-suggestions").count(), 0);
      // Native search inputs can clear their query on Escape; submit a fresh query.
      await input.fill("food");
      await tools.getByRole("button", { name: "Search", exact: true }).focus();
      await page.keyboard.press("Enter");
      await page.waitForURL("**/search?q=food");
    }
    await context.close();
  }
  const page = await browser.newPage();
  await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  assert.ok(await page.locator("main .faq-list summary").count() > 0, "authored generator FAQ survives");
  await page.goto(`${base}/faq`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("main .faq-list summary").count(), 3, "dedicated FAQ retains three existing answers");
  await page.close();
} finally { await browser.close(); }
console.log("PASS seven template searches at mobile/desktop, SSR labels, in-flow suggestions clear of ads, keyboard/axe and explicit FAQs");
