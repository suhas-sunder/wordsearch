import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3302";
const key = "ilws:puzzle-library:v1";
const artifacts = join(tmpdir(), "ilws-local-library");
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    // Keep the existing ad script out of this local-data test; protected ad behavior has its own suite.
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage();
    const errors = [], uploads = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => { if (!["GET", "HEAD"].includes(request.method())) uploads.push(request.url()); });
    await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
    await page.getByText("Saved puzzles on this device", { exact: true }).click();
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), null);
    const title = page.getByLabel("Puzzle title", { exact: true });
    const words = page.getByLabel("Words and clues");
    await title.fill("PRIVATE ALPHA");
    await words.fill("CAT\nDOG\nBIRD\nFISH\nMOUSE\nHORSE");
    const name = page.getByLabel("Saved puzzle name", { exact: true });
    await name.fill("Week one");
    const save = page.getByRole("button", { name: "Save puzzle on this device", exact: true });
    await save.click();
    await page.getByText("Puzzle saved on this device.", { exact: true }).waitFor();
    const savedGrid = await page.locator(".builder-preview .puzzle-svg").textContent();
    const raw = await page.evaluate((key) => localStorage.getItem(key), key);
    const entry = JSON.parse(raw).entries[0];
    const accessibility = await new AxeBuilder({ page }).include(".local-puzzle-library").analyze();
    assert.deepEqual(accessibility.violations.filter((violation) => ["serious", "critical"].includes(violation.impact)), []);
    await page.locator(".local-puzzle-library").screenshot({ path: join(artifacts, `library-${width}.png`) });
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".local-puzzle-library").isVisible(), false);
    await page.emulateMedia({ media: "screen" });
    const decode = await page.evaluate((encoded) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)))), entry.state);
    assert.equal(decode.title, "PRIVATE ALPHA"); assert.equal(decode.wordsText, "CAT\nDOG\nBIRD\nFISH\nMOUSE\nHORSE");
    const mirror = width === 1280 ? await context.newPage() : null;
    if (mirror) {
      await mirror.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
      await mirror.getByText("Saved puzzles on this device", { exact: true }).click();
      await mirror.getByRole("button", { name: "Open saved puzzle Week one", exact: true }).waitFor();
    }
    await title.fill("Different edits"); await words.fill("PLANET\nCOMET\nSTAR\nMOON\nEARTH\nMARS");
    page.once("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("button", { name: "Open saved puzzle Week one", exact: true }).click();
    assert.equal(await title.inputValue(), "Different edits");
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Open saved puzzle Week one", exact: true }).click();
    await page.getByText("Opened Week one. The original seed and puzzle definition were restored.", { exact: true }).waitFor();
    assert.equal(await title.inputValue(), "PRIVATE ALPHA");
    await page.waitForFunction(() => document.querySelector(".builder-status")?.textContent?.includes("placed"));
    assert.equal(await page.locator(".builder-preview .puzzle-svg").textContent(), savedGrid);
    await name.fill("week ONE"); await save.click();
    await page.getByText("That saved name already exists. Choose another name or delete the old entry.", { exact: true }).waitFor();
    await page.reload({ waitUntil: "networkidle" }); await page.getByText("Saved puzzles on this device", { exact: true }).click();
    await page.getByRole("button", { name: "Open saved puzzle Week one", exact: true }).waitFor();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete saved puzzle Week one", exact: true }).click();
    await page.getByText("No named puzzles saved yet.", { exact: true }).waitFor();
    if (mirror) { await mirror.getByText("No named puzzles saved yet.", { exact: true }).waitFor(); await mirror.close(); }
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), null);
    await page.evaluate((key) => { localStorage.setItem(key, "{broken"); localStorage.setItem("unrelated", "kept"); }, key);
    await page.reload({ waitUntil: "networkidle" }); await page.getByText("Saved puzzles on this device", { exact: true }).click();
    await page.getByText("The saved library is invalid or from an unsupported version.", { exact: false }).waitFor();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Clear saved puzzle library", exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem("unrelated")), "kept");
    assert.deepEqual(uploads, []); assert.deepEqual(errors, []);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await context.close();
  }
  {
    const context = await browser.newContext(); const page = await context.newPage();
    await page.addInitScript(() => Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new DOMException("Blocked", "SecurityError"); } }));
    await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
    await page.getByText("Saved puzzles on this device", { exact: true }).click();
    await page.getByText("Device storage is unavailable. Puzzle creation still works.", { exact: true }).waitFor();
    await page.getByLabel("Puzzle title", { exact: true }).fill("Still editable");
    assert.equal(await page.getByLabel("Puzzle title", { exact: true }).inputValue(), "Still editable");
    await context.close();
  }
  {
    const context = await browser.newContext(); const page = await context.newPage();
    await page.addInitScript((key) => { const original = Storage.prototype.setItem; Storage.prototype.setItem = function (name, value) { if (name === key) throw new DOMException("Quota", "QuotaExceededError"); return original.call(this, name, value); }; }, key);
    await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
    await page.getByText("Saved puzzles on this device", { exact: true }).click();
    await page.getByLabel("Saved puzzle name", { exact: true }).fill("No space");
    await page.getByRole("button", { name: "Save puzzle on this device", exact: true }).click();
    await page.getByText("Device storage is unavailable or full. You can keep editing without saving.", { exact: true }).waitFor();
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), null);
    await page.getByLabel("Puzzle title", { exact: true }).fill("Still editable after quota");
    await context.close();
  }
} finally { await browser.close(); }
console.log("PASS opt-in named library, exact reopen, cancel, duplicate, reload, delete, corruption clear, storage denial, mobile/desktop and no uploads");
