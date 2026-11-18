import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { boundSearchQuery, searchQueryMaxLength } from "@/lib/search/query";

const base = process.env.BASE_URL;
const output = process.env.SEARCH_QUERY_OUTPUT;
assert.ok(base && output, "Set BASE_URL and external SEARCH_QUERY_OUTPUT");
await mkdir(output, { recursive: true });
const rows: object[] = [];
const browser = await chromium.launch();
try {
  for (const [width, theme] of [[390, "dark"], [1280, "light"]] as const) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme });
    await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ body: "", contentType: "application/javascript" }));
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Search word searches", exact: true }).click();
    const menu = page.getByRole("combobox", { name: "Search from the menu", exact: true });
    assert.equal(await menu.getAttribute("maxlength"), String(searchQueryMaxLength));
    await menu.fill("animals");
    await page.locator("header [role=option]").first().waitFor();
    const menuResult = await page.locator("header [role=option]").first().getAttribute("href");
    const pasted = "a ".repeat(100_000);
    const start = performance.now();
    await menu.fill(pasted);
    assert.equal(await menu.inputValue(), boundSearchQuery(pasted));
    const pasteMs = performance.now() - start;
    await menu.fill("x".repeat(159) + "😀tail");
    assert.equal(await menu.inputValue(), "x".repeat(159));
    const form = menu.locator("xpath=ancestor::form");
    await form.getByRole("button", { name: "Search", exact: true }).click();
    await page.waitForURL(url => url.pathname === "/search");
    assert.equal(new URL(page.url()).searchParams.get("q"), "x".repeat(159));
    const full = page.locator("main").getByRole("combobox", { name: "Search puzzles and categories", exact: true });
    await full.fill("x".repeat(158) + "😀tail");
    assert.equal(await full.inputValue(), "x".repeat(158) + "😀");
    await full.locator("xpath=ancestor::form").getByRole("button", { name: "Search", exact: true }).click();
    await page.waitForURL(url => url.searchParams.get("q") === "x".repeat(158) + "😀");
    const recovery = page.locator("main").getByRole("combobox", { name: "Search puzzles and categories", exact: true });
    await recovery.fill("animals");
    await recovery.locator("xpath=ancestor::form").getByRole("button", { name: "Search", exact: true }).click();
    await page.waitForURL(url => url.searchParams.get("q") === "animals");
    await page.getByRole("heading", { name: "Results for “animals”", exact: true }).waitFor();
    await page.goto(`${base}/search?q=${encodeURIComponent("x".repeat(159) + "😀tail")}`, { waitUntil: "networkidle" });
    assert.equal(await page.locator("main").getByRole("combobox", { name: "Search puzzles and categories", exact: true }).inputValue(), "x".repeat(159));
    for (const slug of ["hard-printable-word-searches", "word-searches-with-answer-keys"]) {
      await page.goto(`${base}/collections/${slug}`, { waitUntil: "networkidle" });
      const controls = page.locator('[data-collection-controls][data-ready="true"]');
      await controls.waitFor();
      const input = controls.getByRole("searchbox", { name: "Title or subject", exact: true });
      assert.equal(await input.getAttribute("maxlength"), String(searchQueryMaxLength));
      const original = await page.locator("[data-collection-id]").count();
      await input.fill(pasted);
      assert.equal(await input.inputValue(), boundSearchQuery(pasted));
      await input.fill("x".repeat(159) + "😀tail");
      assert.equal(await input.inputValue(), "x".repeat(159));
      await controls.getByRole("button", { name: "Reset filters" }).click();
      await page.waitForFunction(() => [...document.querySelectorAll<HTMLElement>("[data-collection-id]")].every(element => !element.hidden));
      assert.equal(await page.locator("[data-collection-id]:visible").count(), original);
      rows.push({ width, theme, scope: slug, original, boundedLength: searchQueryMaxLength });
    }
    assert.deepEqual(errors, []);
    rows.push({ width, theme, scope: "menu/full-page", pasteMs, menuResult, surrogateSplitAvoided: true, normalRecovery: true, errors });
    await page.screenshot({ path: resolve(output, `recovered-${width}-${theme}.png`), fullPage: true });
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(resolve(output, "browser.json"), JSON.stringify({ base, sourceSha: process.env.SEARCH_QUERY_SOURCE_SHA, rows, limitations: ["Desktop Chromium emulation; advertising loader substituted, not provider approval", "Input timings are descriptive, not stable benchmark thresholds"] }, null, 2));
console.log(`PASS ${rows.length} bounded search/collection cases`);
