import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3520").replace(/\/$/u, "");
const output = process.env.NATIVE_SEARCH_OUTPUT;
if (output) await mkdir(output, { recursive: true });
const result = { base, node: process.version, native: [], hydrated: [], limitations: ["True JavaScript-disabled browser fallback, not server-side search results.", "Standard ad-loader mock bounds correctness checks; no genuine-fill or provider acceptance."] };
const browser = await chromium.launch();
try {
  for (const path of ["/free-printable-word-searches", "/word-searches-for-teachers"]) for (const width of [390, 1280]) for (const scope of ["inline", "header"]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      assert.equal((await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded" })).status(), 200);
      if (scope === "header") { await page.locator(".site-header summary").focus(); await page.keyboard.press("Enter"); }
      const form = page.locator(scope === "header" ? ".site-header form" : ".tools-section form");
      const input = form.getByRole("combobox");
      await input.fill("animals");
      await Promise.all([page.waitForURL((url) => url.pathname === "/search" && url.searchParams.get("q") === "animals"), form.getByRole("button", { name: "Search", exact: true }).click()]);
      await page.waitForLoadState("domcontentloaded");
      const actual = new URL(page.url());
      assert.equal(actual.searchParams.getAll("q").length, 1, "Only the submitted form contributes its query");
      assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, follow");
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://www.ilovewordsearch.com/search");
      assert.equal(await page.locator("main h1").textContent(), "Search Word Searches");
      assert.equal(await page.locator("main input[type=search]").inputValue(), "", "Static HTML does not pretend to restore query results/value without JavaScript");
      assert.equal(await page.getByText(/Search results need JavaScript\. Without it, your query stays in the address bar/u).isVisible(), true);
      const browse = page.locator("main .search-result-list a");
      assert.deepEqual(await browse.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))), ["/topics", "/categories", "/guides"]);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (output && path === "/free-printable-word-searches" && scope === "inline") await page.screenshot({ path: `${output}/nojs-search-${width}.png` });
      await page.locator('main .search-result-list a[href="/categories"]').focus();
      await Promise.all([page.waitForURL(`${base}/categories`), page.keyboard.press("Enter")]);
      assert.equal(await page.locator("main h1").textContent(), "Word Search Categories", "Real SSR browse fallback remains usable by keyboard");
      result.native.push({ path, width, scope, q: actual.searchParams.get("q"), dedicatedSearchReached: true, blankStaticInputTruthful: true, browseFallbackKeyboardWorks: true });
      console.log(`Native search ${path}/${width}/${scope}: query and real browse fallback passed.`);
    } finally { await context.close(); }
  }
  {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    try {
      await page.goto(`${base}/search?q=previous`);
      const query = "été & atlas";
      const form = page.locator("main form");
      await form.getByRole("combobox").fill(query);
      await Promise.all([page.waitForURL((url) => url.searchParams.get("q") === query), form.getByRole("button", { name: "Search", exact: true }).click()]);
      await page.waitForLoadState("domcontentloaded");
      assert.deepEqual([...new URL(page.url()).searchParams.keys()], ["q"]);
      assert.equal(await page.locator("main input[type=search]").getAttribute("maxlength"), "160");
      result.native.push({ path: "/search?q=previous", scope: "dedicated", query, unicodeAmpersandAndSpacesPreserved: true, previousQueryReplaced: true });
    } finally { await context.close(); }
  }
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      await page.goto(`${base}/free-printable-word-searches`);
      const form = page.locator(".tools-section form");
      await form.getByRole("combobox").fill("animals");
      await page.locator(".tools-section [role=option]").first().waitFor();
      await page.evaluate(() => { window.__nativeSearchSpaMarker = "same-document"; });
      await Promise.all([page.waitForURL((url) => url.pathname === "/search" && url.searchParams.get("q") === "animals"), form.getByRole("button", { name: "Search", exact: true }).click()]);
      assert.equal(await page.evaluate(() => window.__nativeSearchSpaMarker), "same-document", "Hydrated submission still uses the client router");
      await page.getByRole("heading", { name: "Results for “animals”", exact: true }).waitFor();
      assert.equal(await page.locator("main noscript p").isVisible(), false);
      await page.locator(".site-header summary").focus(); await page.keyboard.press("Enter");
      const header = page.locator(".site-header form");
      await header.getByRole("combobox").fill("science");
      await page.locator(".site-header [role=option]").first().waitFor();
      await header.getByRole("combobox").press("ArrowDown");
      const chosen = await page.locator('.site-header [role=option][aria-selected="true"]').getAttribute("href");
      await Promise.all([page.waitForURL((url) => url.pathname === new URL(chosen, base).pathname), header.getByRole("combobox").press("Enter")]);
      assert.equal(await page.evaluate(() => window.__nativeSearchSpaMarker), "same-document", "Suggestion keyboard activation remains client navigation");
      assert.deepEqual(errors, []);
      result.hydrated.push({ width, inlineClientSubmitPreserved: true, keyboardSuggestionHref: chosen, appErrors: errors });
    } finally { await context.close(); }
  }
  if (output) await writeFile(`${output}/result.json`, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ nativeCases: result.native.length, hydratedCases: result.hydrated.length, passed: true }));
} finally { await browser.close(); }
