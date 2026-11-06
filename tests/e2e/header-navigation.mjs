import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3262";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320, 390, 768, 1100, 1280, 1600]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    await page.goto(base, { waitUntil: "networkidle" });
    const trigger = page.locator('header summary[aria-label="Open navigation menu"]');
    await trigger.focus(); await page.keyboard.press("Enter");
    const panel = page.getByRole("navigation", { name: "All site navigation" });
    await panel.waitFor();
    const hrefs = await panel.getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    for (const href of ["/", "/categories", "/large-print-word-searches", "/word-searches-for-teachers", "/guides", "/word-search-pdf", "/word-searches-for-kids", "/search"]) assert.ok(hrefs.includes(href), `missing ${href}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    const overlap = await page.evaluate(() => {
      const header = document.querySelector("header.site-header").getBoundingClientRect();
      return [...document.querySelectorAll("[data-ad-placement]")].some((ad) => {
        const rect = ad.getBoundingClientRect();
        return rect.width && rect.height && rect.top < header.bottom - 1 && rect.bottom > header.top + 1 && rect.left < header.right && rect.right > header.left;
      });
    });
    assert.equal(overlap, false, "in-flow navigation does not cover ad geometry");
    const axe = await new AxeBuilder({ page }).include("header.site-header").analyze();
    assert.deepEqual(axe.violations.filter((item) => ["serious", "critical"].includes(item.impact)), []);
    if (process.env.NAV_VISUAL_OUTPUT) {
      await mkdir(process.env.NAV_VISUAL_OUTPUT, { recursive: true });
      await page.locator("header.site-header").screenshot({ path: `${process.env.NAV_VISUAL_OUTPUT}/navigation-${width}.png` });
    }
    await page.keyboard.press("Escape");
    assert.equal(await panel.isVisible(), false);
    assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
    const searchButton = page.getByRole("link", { name: "Search word searches", exact: true });
    await searchButton.click();
    const input = page.getByRole("combobox", { name: "Search from the menu" });
    await input.waitFor();
    await page.waitForFunction((id) => document.activeElement?.id === id, await input.getAttribute("id"));
    await input.fill("food");
    await page.locator('header [role="option"]').first().waitFor();
    await page.locator("header form").getByRole("button", { name: "Search", exact: true }).click();
    await page.waitForURL("**/search?q=food");
    assert.equal(await panel.isVisible(), false);
    await searchButton.click();
    await page.locator("main").click({ position: { x: 10, y: 10 } });
    assert.equal(await panel.isVisible(), false, "outside pointer closes menu");
    assert.deepEqual(errors, []);
    await context.close();
  }
  const noScript = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  await noScript.goto(base);
  await noScript.locator('header summary[aria-label="Open navigation menu"]').click();
  assert.equal(await noScript.getByRole("navigation", { name: "All site navigation" }).isVisible(), true);
  assert.equal(await noScript.getByRole("link", { name: "Search word searches", exact: true }).getAttribute("href"), "/search");
  await noScript.close();
} finally { await browser.close(); }
console.log("PASS menu/search/keyboard/focus/outside/no-JS, crawlable destinations, mobile/desktop, header axe and no ad-geometry overlap");
