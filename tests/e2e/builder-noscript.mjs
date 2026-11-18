import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = (process.env.BASE_URL ?? "http://127.0.0.1:3521").replace(/\/$/u, "");
const baseline = (process.env.BUILDER_NOSCRIPT_BASELINE_URL ?? "https://6aef563c4102a969d4da62b5--ilovewordsearch.netlify.app").replace(/\/$/u, "");
const output = process.env.BUILDER_NOSCRIPT_OUTPUT;
assert.ok(output, "Set outside-repository BUILDER_NOSCRIPT_OUTPUT");
await mkdir(output, { recursive: true });
const notice = "JavaScript is required for the interactive puzzle";
const help = "The puzzle editor, online play, puzzle printing and downloads need JavaScript. You can still read this page and browse the published catalog or guides.";
const cases = [["generator", "/word-search-generator", 390], ["dog", "/word-searches/animals/dog-word-search", 1280]];
const report = { base, baseline, node: process.version, cases: [], limitations: ["True no-JavaScript and controlled loading correctness; standard empty ad-loader mock, not ordinary advertising/performance or manual assistive-device approval."] };
const browser = await chromium.launch();
async function context(options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, ...options });
  await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
  return context;
}
async function editorial(page) {
  return page.evaluate(() => {
    const copy = document.querySelector("main").cloneNode(true);
    copy.querySelectorAll(".above-fold-builder,script,style").forEach((node) => node.remove());
    return { title: document.title, h1: document.querySelector("main h1").textContent, canonical: document.querySelector('link[rel="canonical"]').href,
      description: document.querySelector('meta[name="description"]').content, robots: document.querySelector('meta[name="robots"]')?.content,
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent), text: copy.textContent.replace(/\s+/gu, " ").trim(),
      ads: [...document.querySelectorAll('[data-ad-placement]')].map((node) => ({ placement: node.dataset.adPlacement, tag: node.tagName })) };
  });
}
async function ready(page) {
  await page.locator(".builder-surface").waitFor();
  await page.locator(".builder-preview .puzzle-token").first().waitFor();
  await page.waitForFunction(() => document.querySelector(".builder-preview")?.getAttribute("aria-busy") === "false");
  assert.equal(await page.locator('[data-builder-loading-shell],[data-builder-noscript]').count(), 0);
  return createHash("sha256").update(JSON.stringify(await page.locator(".builder-preview .puzzle-token").allTextContents())).digest("hex");
}
const holdIdle = `window.requestIdleCallback = () => 717; window.cancelIdleCallback = () => {};`;
try {
  for (const [name, path, width] of cases) {
    const beforeContext = await context({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    let expected;
    try { const before = await beforeContext.newPage(); await before.goto(baseline + path, { waitUntil: "domcontentloaded" }); expected = await editorial(before); }
    finally { await beforeContext.close(); }
    const noJs = await context({ javaScriptEnabled: false, viewport: { width, height: 900 } });
    try {
      const page = await noJs.newPage(); assert.equal((await page.goto(base + path, { waitUntil: "domcontentloaded" })).status(), 200);
      const fallback = page.locator('[data-builder-noscript]');
      assert.equal(await fallback.getByRole("heading", { name: notice, exact: true }).isVisible(), true);
      assert.equal(await fallback.getByText(help, { exact: true }).isVisible(), true);
      assert.deepEqual(await fallback.locator("a").evaluateAll((nodes) => nodes.map((node) => [node.textContent, node.getAttribute("href")])), [["Browse published topics", "/topics"], ["Read word search guides", "/guides"]]);
      assert.equal(await page.locator('[data-builder-loading-shell]').isVisible(), false);
      assert.equal(await page.getByRole("button", { name: "Load puzzle now", exact: true }).isVisible(), false);
      assert.equal(await page.locator('[aria-busy="true"]:visible').count(), 0);
      assert.equal(await page.locator('.builder-surface,.puzzle-svg,.solver-grid').count(), 0);
      assert.deepEqual(await editorial(page), expected, "All non-tool editorial, H1/meta/schema and ad definitions match exact C3");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      await fallback.scrollIntoViewIfNeeded(); await page.screenshot({ path: `${output}/nojs-${name}-${width}.png` });
      const destination = name === "generator" ? "/topics" : "/guides";
      await fallback.locator(`a[href="${destination}"]`).focus();
      await Promise.all([page.waitForURL(base + destination), page.keyboard.press("Enter")]);
      assert.equal((await page.locator("main h1").innerText()).length > 0, true);
      report.cases.push({ name, width, mode: "true-noJS", editorialAndMetadataExact: true, noBusyOrFallbackGrid: true, keyboardRecovery: destination });
    } finally { await noJs.close(); }
  }
  // With JavaScript enabled but its files withheld, the original loading state
  // remains accurate. A noscript notice must never replace genuine pending work.
  {
    const ctx = await context(); let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await ctx.route(/\/_next\/static\/.*\.js(?:\?.*)?$/u, async (route) => { await gate; await route.continue(); });
    try {
      const page = await ctx.newPage(); await page.goto(base + cases[0][1], { waitUntil: "commit" });
      await page.locator('[data-builder-loading-shell][aria-busy="true"]').waitFor();
      assert.equal(await page.locator('[data-builder-noscript]').count(), 0);
      assert.equal(await page.locator('.builder-surface,.puzzle-svg,.solver-grid').count(), 0);
      await page.screenshot({ path: `${output}/withheld-js.png` });
      release(); await ready(page); report.cases.push({ mode: "withheld-JS", originalBusyWhilePending: true, releasedToReady: true });
    } finally { release(); await ctx.close(); }
  }
  const normal = new Map();
  for (const [name, path, width] of cases) {
    const ctx = await context({ viewport: { width, height: 900 } });
    try { const page = await ctx.newPage(); await page.goto(base + path); const gridSha = await ready(page); normal.set(name, gridSha); report.cases.push({ name, mode: "normal-idle", gridSha }); }
    finally { await ctx.close(); }
  }
  for (const mode of ["manual", "delayed-chunk", "failed-chunk-retry"]) {
    const ctx = await context(); await ctx.addInitScript(holdIdle);
    let release, observedChunk = null, attempts = 0;
    const gate = new Promise((resolve) => { release = resolve; });
    if (mode !== "manual") await ctx.route(/\/_next\/static\/chunks\/.*\.js(?:\?.*)?$/u, async (route) => {
      const response = await route.fetch(); const body = await response.text();
      if (body.includes("ilws:last-builder-state")) {
        attempts++; observedChunk = route.request().url();
        if (mode === "delayed-chunk") await gate;
        if (mode === "failed-chunk-retry" && attempts === 1) return route.abort("failed");
      }
      await route.fulfill({ response });
    });
    try {
      const page = await ctx.newPage(); await page.goto(base + cases[0][1]);
      await page.locator('[data-builder-loading-shell][aria-busy="true"]').waitFor();
      assert.equal(await page.locator('.builder-surface,[data-builder-noscript]').count(), 0);
      await page.getByRole("button", { name: "Load puzzle now", exact: true }).click();
      if (mode === "delayed-chunk") {
        await page.waitForFunction(() => [...document.scripts].some((script) => script.src.includes("/_next/static/chunks/")));
        await new Promise((resolve, reject) => { const deadline = Date.now() + 20000; const wait = () => observedChunk ? resolve() : Date.now() > deadline ? reject(new Error("Builder chunk was not observed within20s")) : setTimeout(wait, 20); wait(); });
        assert.equal(await page.locator('[data-builder-loading-shell][aria-busy="true"]').isVisible(), true);
        assert.equal(await page.locator('.builder-surface,[data-builder-noscript]').count(), 0); release();
      }
      if (mode === "failed-chunk-retry") {
        await page.getByRole("heading", { name: "The interactive puzzle did not load", exact: true }).waitFor();
        assert.equal(await page.locator('[data-builder-loading-shell]').getAttribute("aria-busy"), "false");
        assert.equal(await page.getByText("Check the connection and retry. The page guidance and links remain available.", { exact: true }).isVisible(), true);
        await page.screenshot({ path: `${output}/failed-chunk.png` });
        await page.getByRole("button", { name: "Retry puzzle", exact: true }).click();
      }
      const gridSha = await ready(page); assert.equal(gridSha, normal.get("generator"), "Manual/delayed/retried loading keeps the exact normal grid");
      const axe = await new AxeBuilder({ page }).include(".above-fold-builder").analyze();
      assert.deepEqual(axe.violations.filter((issue) => ["serious", "critical"].includes(issue.impact ?? "")), []);
      report.cases.push({ mode, observedChunk, attempts, gridSha, recoveredToReady: true });
    } finally { release(); await ctx.close(); }
  }
  await writeFile(`${output}/result.json`, JSON.stringify(report, null, 2));
  console.log("PASS true-noJS generator/Dog, exact C3 non-tool content/meta/ad definitions, keyboard browse, withheld JS, normal idle/manual/delayed/failed-chunk retry and exact grids");
} finally { await browser.close(); }
