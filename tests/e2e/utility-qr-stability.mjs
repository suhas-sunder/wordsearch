import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { chromium } from "playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.BASE_URL;
const output = process.env.UTILITY_QR_OUTPUT;
assert.ok(base && output, "Set BASE_URL and outside-repository UTILITY_QR_OUTPUT");
const local = relative(process.cwd(), resolve(output));
assert.ok(local.startsWith("..") || isAbsolute(local));
await mkdir(output, { recursive: true });
const state = Buffer.from(JSON.stringify({ title: "UI review", wordsText: "CAT\nDOG", seed: "ui-review", alphabetPack: "latin", directions: ["E"], rows: 8, cols: 8, autoSize: false })).toString("base64url");
const report = { base, sourceSha: process.env.UTILITY_SOURCE_SHA, sourcePatchSha256: process.env.UTILITY_SOURCE_PATCH_SHA256, screen: [], native: [], failures: [], limitations: ["Controlled QR timing adopts the real canvas data URL; image content is not fabricated", "Observer starts before navigation and is never reset; screen CLS is measured before test-induced print media changes", "Desktop Chromium, not physical printer/Safari or field CWV"] };
const save = () => writeFile(resolve(output, "manifest.json"), `${JSON.stringify(report, null, 2)}\n`);
const browser = await chromium.launch();
let activePage;
let activeCase;
async function prepare(page, mode) {
  await page.addInitScript(({ mode }) => {
    window.__qrCalls = 0; window.__qrReleases = []; window.__qrShifts = [];
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__qrShifts.push({ t: entry.startTime, value: entry.value, hadRecentInput: entry.hadRecentInput }); }).observe({ type: "layout-shift", buffered: true });
    const original = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      window.__qrCalls++;
      if (mode === "normal") return original.apply(this, args);
      return new Promise((resolve, reject) => window.__qrReleases.push(() => {
        if (mode === "error") reject(new Error("Expected QR preparation error"));
        else resolve(original.apply(this, args));
      }));
    };
  }, { mode });
}
const guardsReady = (page) => page.waitForFunction(() => { const nodes = [...document.querySelectorAll(".print-fit-status")]; return nodes.length && nodes.every((node) => node.dataset.fitState === "ready"); });
const settle = (page) => page.evaluate(async () => { await document.fonts.ready; await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
const grid = async (page) => createHash("sha256").update(JSON.stringify(await page.locator(".print-sheet").first().locator(".puzzle-token").allTextContents())).digest("hex");
async function boxes(page, selector) { return page.locator(selector).first().evaluate((node) => { const box = node.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight }; }); }
async function nativePdf(page, name, warning) {
  const bytes = await page.pdf({ preferCSSPageSize: true, printBackground: true });
  await writeFile(resolve(output, `${name}.pdf`), bytes);
  const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
  try {
    const pdf = await task.promise;
    assert.equal(pdf.numPages, 2, `${name}: student plus answer, no blank page`);
    const text = [];
    for (let number = 1; number <= 2; number++) {
      const sheet = await pdf.getPage(number);
      const viewport = sheet.getViewport({ scale: 1 });
      const content = (await sheet.getTextContent()).items.filter((item) => "str" in item);
      const tokens = content.filter((item) => /^[A-Z]$/.test(item.str));
      assert.equal(tokens.length, 64, `${name} page${number}: complete grid glyphs`);
      for (const item of content) {
        assert.ok(item.transform[4] >= -1 && item.transform[4] + item.width <= viewport.width + 1, `${name}: horizontal text clipping`);
        assert.ok(item.transform[5] >= -1 && item.transform[5] <= viewport.height + 1, `${name}: vertical baseline clipping`);
      }
      text.push(content.map(({ str }) => str).join(" "));
    }
    if (warning) assert.match(text.join(" "), /QR code not ready/);
    else assert.doesNotMatch(text.join(" "), /QR code not ready|Checking worksheet print fit/);
    return { file: `${name}.pdf`, pages: pdf.numPages, completeGridGlyphs: 128, qrWarning: warning };
  } finally { await task.destroy(); }
}
try {
  for (const kind of ["print", "pdf", "answer-key"]) for (const width of [320, 390]) for (const theme of ["light", "dark"]) for (const mode of ["delayed", "error", "off"]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
    const page = await context.newPage(); activePage = page; activeCase = { kind, width, theme, mode };
    const errors = []; page.on("pageerror", (error) => errors.push(error.message));
    await prepare(page, mode);
    await page.goto(`${base}/${kind}/${state}${mode === "off" ? "?qr=0" : ""}`, { waitUntil: "networkidle" });
    await guardsReady(page); await settle(page);
    const beforeHash = await grid(page);
    const before = await boxes(page, ".static-utility-controls");
    let pendingAsset;
    if (mode !== "off") {
      await page.locator('[data-qr-readiness="preparing"]').waitFor();
      assert.equal(await page.getByRole("button", { name: "Print", exact: true }).isDisabled(), true);
      pendingAsset = await boxes(page, ".print-qr-unavailable");
      assert.equal(pendingAsset.width, 72); assert.equal(pendingAsset.height, 72);
      assert.ok(pendingAsset.scrollHeight <= pendingAsset.clientHeight);
      await page.evaluate(() => { for (const release of window.__qrReleases) release(); });
      await page.locator(`[data-qr-readiness="${mode === "error" ? "error" : "ready"}"]`).waitFor();
      await guardsReady(page); await settle(page);
      assert.equal(await page.getByRole("button", { name: "Print", exact: true }).isDisabled(), mode === "error");
      const after = await boxes(page, ".static-utility-controls");
      for (const key of ["x", "y", "width", "height"]) assert.ok(Math.abs(before[key] - after[key]) < 0.1, `${kind}/${mode}: status geometry changed ${key}`);
      const statusLine = await boxes(page, "[data-qr-readiness] > span");
      const lineHeight = await page.locator("[data-qr-readiness] > span").evaluate((node) => parseFloat(getComputedStyle(node).lineHeight));
      assert.ok(statusLine.height <= lineHeight + 0.1, "QR status wraps at supported mobile width");
      if (mode === "delayed") {
        const asset = await boxes(page, ".print-footer img");
        assert.equal(asset.width, pendingAsset.width); assert.equal(asset.height, pendingAsset.height);
      }
      assert.equal(await page.getByRole("link", { name: "Print without a QR code", exact: true }).count(), 1);
    } else {
      assert.equal(await page.locator("[data-qr-readiness],.print-footer").count(), 0);
      assert.equal(await page.evaluate(() => window.__qrCalls), 0);
      assert.equal(await page.getByRole("button", { name: "Print", exact: true }).isEnabled(), true);
    }
    assert.equal(await grid(page), beforeHash);
    const shifts = await page.evaluate(() => window.__qrShifts);
    const cls = shifts.filter(({ hadRecentInput }) => !hadRecentInput).reduce((sum, { value }) => sum + value, 0);
    assert.ok(cls <= 0.001, `${kind}/${width}/${theme}/${mode}: startup CLS${cls}`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.filter(({ impact }) => ["serious", "critical"].includes(impact)), []);
    assert.deepEqual(errors, []);
    const screenshot = `${kind}-${width}-${theme}-${mode}.png`;
    await page.locator(".static-utility-controls").screenshot({ path: resolve(output, screenshot) });
    report.screen.push({ ...activeCase, cls, shifts, before, pendingAsset, gridSha256: beforeHash, notices: axe.violations.map(({ id, impact }) => ({ id, impact })), screenshot });
    await save(); await context.close(); activePage = null;
    console.log(`PASS ${kind} ${width} ${theme} ${mode}: CLS${cls}, stable status/asset/grid`);
  }
  for (const paper of ["letter", "a4"]) for (const orientation of ["portrait", "landscape"]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    const page = await context.newPage(); activePage = page; activeCase = { paper, orientation, native: true };
    await prepare(page, "delayed");
    const url = `${base}/print/${state}?paper=${paper}&orientation=${orientation}&answers=1&qr=1`;
    await page.goto(url, { waitUntil: "networkidle" }); await guardsReady(page);
    assert.equal(await page.getByRole("button", { name: "Print", exact: true }).isDisabled(), true);
    await page.emulateMedia({ media: "print" });
    const placeholder = await boxes(page, ".print-qr-unavailable");
    assert.equal(placeholder.width, orientation === "landscape" ? 68 : 72); assert.equal(placeholder.height, placeholder.width);
    const pending = await nativePdf(page, `${paper}-${orientation}-pending`, true);
    await page.emulateMedia({ media: "screen" });
    await page.evaluate(() => { for (const release of window.__qrReleases) release(); });
    await page.locator('[data-qr-readiness="ready"]').waitFor(); await guardsReady(page);
    await page.emulateMedia({ media: "print" });
    const image = await boxes(page, ".print-footer img");
    assert.equal(image.width, placeholder.width); assert.equal(image.height, placeholder.height);
    const ready = await nativePdf(page, `${paper}-${orientation}-ready`, false);
    report.native.push({ paper, orientation, placeholder, image, pending, ready });
    await save(); await context.close(); activePage = null;
  }
  const page = await browser.newPage({ viewport: { width: 320, height: 900 } }); activePage = page; activeCase = { native: true, errorRecovery: true };
  await prepare(page, "error");
  await page.goto(`${base}/print/${state}?paper=a4&orientation=landscape&answers=1&qr=1`, { waitUntil: "networkidle" }); await guardsReady(page);
  await page.evaluate(() => { for (const release of window.__qrReleases) release(); });
  await page.locator('[data-qr-readiness="error"]').waitFor(); await guardsReady(page);
  assert.equal(await page.getByRole("button", { name: "Print", exact: true }).isDisabled(), true);
  const beforeHash = await grid(page);
  const failed = await nativePdf(page, "a4-landscape-qr-error", true);
  await page.getByRole("link", { name: "Print without a QR code", exact: true }).click();
  await page.locator('[data-utility-state="ready"]').waitFor(); await guardsReady(page);
  assert.equal(await page.getByRole("button", { name: "Print", exact: true }).isEnabled(), true);
  assert.equal(await page.locator(".print-footer,[data-qr-readiness]").count(), 0);
  assert.equal(new URL(page.url()).searchParams.get("paper"), "a4"); assert.equal(new URL(page.url()).searchParams.get("orientation"), "landscape");
  assert.equal(new URL(page.url()).pathname, `/print/${state}`);
  assert.equal(await grid(page), beforeHash);
  const recovered = await nativePdf(page, "a4-landscape-no-qr-recovered", false);
  report.native.push({ errorRecovery: true, failed, recovered, gridSha256: beforeHash });
  await save(); await page.close(); activePage = null;
} catch (error) {
  report.failures.push({ ...activeCase, error: error.message });
  if (activePage && !activePage.isClosed()) try { await activePage.screenshot({ path: resolve(output, "failed-case.png"), fullPage: true }); } catch { /* preserve original assertion */ }
  await save(); throw error;
} finally { await browser.close(); }
console.log(`PASS ${report.screen.length} controlled QR screen cases and${report.native.length} native print profiles/recovery`);
