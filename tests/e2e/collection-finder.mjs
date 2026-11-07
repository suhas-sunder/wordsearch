import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL;
const output = process.env.COLLECTION_FINDER_OUTPUT;
const sourceSha = process.env.COLLECTION_FINDER_SOURCE_SHA;
assert.ok(base && output && /^[a-f0-9]{40}$/.test(sourceSha ?? ""), "Set BASE_URL, COLLECTION_FINDER_OUTPUT and full COLLECTION_FINDER_SOURCE_SHA");
const local = relative(process.cwd(), resolve(output));
assert.ok(local.startsWith("..") || isAbsolute(local), "Keep evidence outside Git");
await mkdir(output, { recursive: true });
const slugs = ["hard-printable-word-searches", "word-searches-with-answer-keys"];
const evidence = { sourceSha, sourcePatchSha256: process.env.COLLECTION_FINDER_SOURCE_PATCH_SHA256 ?? null, base, rows: [], noJavaScript: [], failures: [], limitations: ["Desktop Chromium emulation, not physical-device acceptance", "Advertising loader substituted; provider lifecycle is a separate gate", "Hydration CLS delta is measured after fonts settle; initial page CLS is retained separately"] };
const save = () => writeFile(resolve(output, "manifest.json"), `${JSON.stringify(evidence, null, 2)}\n`);
const browser = await chromium.launch();
let activePage;
let activeCase;
try {
  for (const slug of slugs) for (const theme of ["light", "dark"]) for (const width of [320, 390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion: "reduce" });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ body: "", contentType: "application/javascript" }));
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    await context.route(/\/_next\/static\/.*\.js(?:\?.*)?$/, async (route) => { await gate; await route.continue(); });
    const page = await context.newPage();
    activePage = page; activeCase = { slug, theme, width };
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => { window.__finderCLS = 0; new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__finderCLS += entry.value; }).observe({ type: "layout-shift", buffered: true }); });
    const path = `/collections/${slug}`;
    const response = await page.goto(`${base}${path}`, { waitUntil: "commit" });
    assert.equal(response.status(), 200);
    const html = await response.text();
    const serverIds = [...html.matchAll(/data-collection-id="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(serverIds.length > 1, "All public cards must exist in the raw response");
    const controls = page.locator("[data-collection-controls]");
    await controls.waitFor();
    assert.equal(await controls.getAttribute("disabled"), "");
    const settle = () => page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
    await settle();
    const before = await controls.boundingBox();
    const clsBefore = await page.evaluate(() => window.__finderCLS);
    const original = await page.locator("[data-collection-id]").evaluateAll((cards) => cards.map((card) => ({ id: card.dataset.collectionId, title: card.querySelector("strong").textContent, href: card.getAttribute("href") })));
    assert.deepEqual(original.map(({ id }) => id), serverIds);
    const jsonLdBefore = await page.locator('script[type="application/ld+json"]').allTextContents();
    release();
    await page.locator('[data-collection-controls][data-ready="true"]').waitFor();
    await settle();
    const after = await controls.boundingBox();
    const clsAfter = await page.evaluate(() => window.__finderCLS);
    for (const key of ["x", "y", "width", "height"]) assert.ok(Math.abs(after[key] - before[key]) <= 0.5, `Hydration changed control ${key}`);
    assert.ok(clsAfter - clsBefore <= 0.001, `Hydration CLS regression: ${clsBefore} -> ${clsAfter}`);
    const visible = () => page.locator("[data-collection-id]:visible").evaluateAll((cards) => cards.map((card) => ({ id: card.dataset.collectionId, title: card.querySelector("strong").textContent })));
    assert.deepEqual((await visible()).map(({ id }) => id), serverIds);
    const query = controls.getByRole("searchbox", { name: "Title or subject", exact: true });
    const order = controls.getByRole("combobox", { name: "Order", exact: true });
    const difficulty = controls.getByRole("combobox", { name: "Difficulty", exact: true });
    const reset = controls.getByRole("button", { name: "Reset filters", exact: true });
    assert.equal(await difficulty.count(), slug === "word-searches-with-answer-keys" ? 1 : 0);
    await query.fill(original[0].title);
    await page.waitForFunction(({ id, total }) => { const found = [...document.querySelectorAll("[data-collection-id]")].filter((node) => !node.hidden); return found.length < total && found.some((node) => node.dataset.collectionId === id); }, { id: original[0].id, total: original.length });
    assert.ok((await visible()).some(({ id }) => id === original[0].id));
    await query.fill("science");
    await page.waitForFunction((total) => { const count = [...document.querySelectorAll("[data-collection-id]")].filter((node) => !node.hidden).length; return count > 0 && count < total; }, original.length);
    const subjectCount = (await visible()).length;
    await query.fill("no-matching-subject-acceptance-7391");
    await page.waitForFunction(() => [...document.querySelectorAll("[data-collection-id]")].every((node) => node.hidden));
    await page.getByText("No puzzles match these filters. Try another title or subject, or reset filters.", { exact: true }).waitFor();
    await controls.getByRole("status").getByText(`0 of ${original.length} puzzles`, { exact: true }).waitFor();
    const emptyScreenshot = `${slug}-${theme}-${width}-empty.png`;
    await controls.locator("..").screenshot({ path: resolve(output, emptyScreenshot) });
    await reset.click();
    await page.waitForFunction(() => [...document.querySelectorAll("[data-collection-id]")].every((node) => !node.hidden));
    assert.equal(await query.evaluate((element) => element === document.activeElement), true);
    assert.deepEqual((await visible()).map(({ id }) => id), serverIds);
    await query.press("Tab");
    assert.equal(await (await difficulty.count() ? difficulty : order).evaluate((element) => element === document.activeElement), true);
    await order.selectOption("title");
    const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
    const sorted = [...original].sort((left, right) => collator.compare(left.title, right.title));
    await page.waitForFunction((expected) => JSON.stringify([...document.querySelectorAll("[data-collection-id]")].map((node) => node.dataset.collectionId)) === JSON.stringify(expected), sorted.map(({ id }) => id));
    if (await difficulty.count()) {
      await difficulty.selectOption("hard");
      await page.waitForFunction(() => [...document.querySelectorAll("[data-collection-id]")].filter((node) => !node.hidden).every((node) => node.querySelector("small").textContent.startsWith("hard ·")));
      assert.ok((await visible()).length > 0);
    }
    await reset.focus(); await reset.press("Enter");
    await page.waitForFunction(() => [...document.querySelectorAll("[data-collection-id]")].every((node) => !node.hidden));
    assert.deepEqual((await visible()).map(({ id }) => id), serverIds);
    await order.focus(); await order.press("Tab");
    assert.equal(await reset.evaluate((element) => element === document.activeElement), true);
    await reset.press("Tab");
    assert.equal(await page.locator("[data-collection-id]").first().evaluate((element) => element === document.activeElement), true);
    assert.equal(new URL(page.url()).pathname, path); assert.equal(new URL(page.url()).search, "");
    assert.deepEqual(await page.locator('script[type="application/ld+json"]').allTextContents(), jsonLdBefore);
    const geometry = await page.evaluate(() => { const control = document.querySelector("[data-collection-controls]").getBoundingClientRect(); return { overflow: document.documentElement.scrollWidth > innerWidth + 1, adOverlap: [...document.querySelectorAll("[data-ad-placement]")].some((ad) => { const box = ad.getBoundingClientRect(); return box.width && box.height && box.top < control.bottom && box.bottom > control.top && box.left < control.right && box.right > control.left; }) }; });
    assert.deepEqual(geometry, { overflow: false, adOverlap: false });
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.filter(({ impact }) => ["serious", "critical"].includes(impact)), []);
    assert.deepEqual(errors, []);
    const screenshot = `${slug}-${theme}-${width}-controls.png`;
    await controls.screenshot({ path: resolve(output, screenshot) });
    evidence.rows.push({ slug, theme, width, rawResponseSha256: createHash("sha256").update(html).digest("hex"), publicCards: original.length, subjectCount, before, after, clsBefore, clsAfter, hydrationClsDelta: clsAfter - clsBefore, geometry, axeNotices: axe.violations.map(({ id, impact }) => ({ id, impact })), screenshot, emptyScreenshot });
    await save(); await context.close(); activePage = null;
    console.log(`PASS ${slug} ${theme} ${width}: SSR cards, filters/order/reset/keyboard, no hydration shift`);
  }
  for (const slug of slugs) {
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 1000 } });
    activePage = page; activeCase = { slug, javaScript: false, width: 320 };
    await page.goto(`${base}/collections/${slug}`);
    assert.ok(await page.locator("[data-collection-id]:visible").count() > 1);
    assert.equal(await page.getByRole("searchbox", { name: "Title or subject", exact: true }).isDisabled(), true);
    await page.getByText("Finding and sorting need JavaScript. All reviewed puzzles are listed below in editorial order.", { exact: true }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    evidence.noJavaScript.push({ slug, visiblePublicCards: await page.locator("[data-collection-id]:visible").count(), disabledControls: true, usefulListing: true });
    await page.close(); activePage = null; await save();
  }
} catch (error) {
  const screenshot = "failed-case.png";
  evidence.failures.push({ ...activeCase, error: error.message, screenshot });
  if (activePage && !activePage.isClosed()) {
    try { await activePage.screenshot({ path: resolve(output, screenshot), fullPage: true, timeout: 10000 }); }
    catch { evidence.failures.at(-1).screenshot = null; }
  }
  await save();
  throw error;
} finally { await browser.close(); }
console.log(`PASS ${evidence.rows.length} collection control cases and ${evidence.noJavaScript.length} no-JS listings`);
