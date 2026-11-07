import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL ?? "http://localhost:3268";
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    let release;
    const pendingCatalog = new Promise((resolve) => { release = resolve; });
    await page.route("**/search-index.json", async (route) => { await pendingCatalog; await route.continue(); });
    await page.goto(`${base}/search?q=food`, { waitUntil: "domcontentloaded" });
    const input = page.locator(".search-page").getByRole("combobox");
    await input.waitFor();
    await page.getByRole("heading", { name: "Searching reviewed puzzles…" }).waitFor();
    assert.equal(await page.getByRole("heading", { name: /^No results/ }).count(), 0, "pending catalog never claims no results");
    assert.equal(await page.locator(".search-result-skeleton").count(), 3);
    await page.waitForFunction(() => document.querySelector(".search-page input")?.value === "food");
    const position = await input.boundingBox();
    release();
    await page.getByRole("heading", { name: "Results for “food”", exact: true }).waitFor();
    const readyPosition = await input.boundingBox();
    assert.equal(readyPosition.y, position.y, "control position stays stable as results load");
    assert.equal(readyPosition.height, position.height);
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact)), []);
    await input.fill("zzqqxx-no-matching-term");
    await page.locator(".search-page form").getByRole("button", { name: "Search", exact: true }).click();
    await page.getByRole("heading", { name: "No results for “zzqqxx-no-matching-term”", exact: true }).waitFor();
    assert.equal(await page.locator(".search-no-results .search-result-list > a").count(), 3, "empty state offers useful browse destinations");
    await input.fill("food");
    await page.locator(".search-page form").getByRole("button", { name: "Search", exact: true }).click();
    await page.getByRole("heading", { name: "Results for “food”", exact: true }).waitFor();
    assert.equal(await page.getByRole("heading", { name: /^No results/ }).count(), 0);
    await context.close();
  }
  const noScript = await browser.newPage({ javaScriptEnabled: false });
  await noScript.goto(`${base}/search?q=food`);
  assert.equal(await noScript.locator(".search-page input[role=combobox]").count(), 1, "actual search control is server-rendered");
  for (const href of ["/topics", "/categories", "/guides"]) assert.equal(await noScript.locator(`.search-page a[href="${href}"]`).count(), 1, "no-JS browsing remains useful");
  await noScript.close();
  const failed = await browser.newPage();
  await failed.route("**/search-index.json", (route) => route.fulfill({ status: 503, contentType: "application/json", body: "{}" }));
  await failed.goto(`${base}/search?q=food`);
  await failed.getByRole("heading", { name: "Search could not be loaded" }).waitFor();
  assert.equal(await failed.locator(".search-no-results .search-result-list > a").count(), 3);
  await failed.close();
} finally { await browser.close(); }
console.log("PASS delayed catalog/loading truth, stable controls, query replacement, real empty/error browsing, no-JS HTML and mobile/desktop axe");
