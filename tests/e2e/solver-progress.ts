import assert from "node:assert/strict";
import { chromium, type Page } from "playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3288";
const request = { title: "PRIVATE CLASSROOM TITLE", seed: "private-seed", wordsText: "CAT\nDOG", autoSize: false, rows: 8, cols: 8, directions: ["E"] as const, allowOverlap: false };
const puzzle = generatePuzzle({ ...request, directions: [...request.directions] });
const urlFor = (seed: string) => `${base}/play/${Buffer.from(JSON.stringify({ ...request, seed })).toString("base64url")}`;
async function select(page: Page, index: number, touch: boolean) {
  const placement = puzzle.placed[index], start = placement.cells[0], end = placement.cells[placement.cells.length - 1];
  const first = page.locator(`[data-solver-cell][data-row="${start.row}"][data-col="${start.col}"]`);
  if (touch) { await first.tap(); await page.locator(`[data-solver-cell][data-row="${end.row}"][data-col="${end.col}"]`).tap(); }
  else { await page.waitForFunction(() => document.activeElement?.hasAttribute("data-solver-cell")); await first.focus(); await page.keyboard.press("Enter"); for (let i = 1; i < placement.cells.length; i++) await page.keyboard.press("ArrowRight"); await page.keyboard.press("Enter"); }
}
const browser = await chromium.launch({ headless: true });
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: { width: mobile ? 390 : 1280, height: 900 }, hasTouch: mobile, isMobile: mobile });
    const page = await context.newPage();
    const errors: string[] = [], calls: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (req) => { if (!["fetch", "xhr"].includes(req.resourceType())) return; const url = new URL(req.url()); const isStaticPrefetch = req.method() === "GET" && url.origin === new URL(base).origin && url.pathname.endsWith(".txt") && [...url.searchParams.keys()].every((key) => key === "_rsc") && !req.postData(); if (!isStaticPrefetch) calls.push(req.url()); });
    await page.clock.install();
    await page.goto(urlFor(request.seed), { waitUntil: "networkidle" });
    const remember = page.getByRole("checkbox", { name: "Remember progress on this device" });
    await remember.waitFor({ state: "visible" }); await page.waitForFunction(() => !document.querySelector<HTMLInputElement>(".solver-save-progress input")?.disabled);
    assert.equal(await remember.isChecked(), false);
    assert.equal(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ilws:solver-progress:v1:")).length), 0);
    await remember.check();
    if (mobile) { await page.getByRole("button", { name: "Accessibility and controls" }).click(); await page.getByLabel("Tap endpoints").check(); await page.getByRole("button", { name: "Done" }).click(); }
    await page.getByRole("button", { name: "Begin puzzle" }).click();
    await page.clock.fastForward(65_000); await select(page, 0, mobile);
    await page.getByText("1 of 2 words found", { exact: true }).first().waitFor();
    const records = await page.evaluate(() => Object.entries(localStorage).filter(([key]) => key.startsWith("ilws:solver-progress:v1:")));
    assert.equal(records.length, 1); assert.doesNotMatch(JSON.stringify(records), /PRIVATE|CLASSROOM|CAT|DOG|private-seed|\/play\//i);
    const record = JSON.parse(records[0][1]); assert.deepEqual(Object.keys(record).sort(), ["elapsedMs", "fingerprint", "indices", "v"]); assert.deepEqual(record.indices, [0]); assert.ok(record.elapsedMs >= 65_000);
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Resume saved progress" }).waitFor();
    assert.equal(await page.getByTestId("solver-progress").innerText(), "0 of 2 words found");
    await page.getByRole("button", { name: "Resume saved progress" }).click();
    assert.equal(await page.getByTestId("solver-progress").innerText(), "1 of 2 words found");
    await page.clock.fastForward(10_000); await select(page, 1, mobile);
    await page.getByRole("heading", { name: "Puzzle complete", exact: true }).waitFor();
    const elapsed = await page.getByTestId("completion-elapsed").innerText(); assert.match(elapsed, /^1:1[5-9]$/);
    await page.reload({ waitUntil: "networkidle" }); await page.getByRole("button", { name: "Resume saved progress" }).click();
    assert.equal(await page.getByTestId("completion-elapsed").innerText(), elapsed);
    await page.goto(urlFor("another-seed"), { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("button", { name: "Resume saved progress" }).count(), 0);
    await page.goto(urlFor(request.seed), { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Resume saved progress" }).click();
    page.once("dialog", (dialog) => dialog.accept()); await page.getByRole("button", { name: "Replay this puzzle" }).click();
    assert.equal(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ilws:solver-progress:v1:")).length), 0);
    await page.getByRole("button", { name: "Begin puzzle" }).click(); await select(page, 0, mobile);
    await page.close();
    const corruptPage = await context.newPage();
    await corruptPage.goto(urlFor(request.seed), { waitUntil: "networkidle" });
    await corruptPage.evaluate(() => {
      const key = Object.keys(localStorage).find((item) => item.startsWith("ilws:solver-progress:v1:"))!;
      const value = JSON.parse(localStorage.getItem(key)!); value.indices = [0, 0]; localStorage.setItem(key, JSON.stringify(value));
    });
    await corruptPage.reload({ waitUntil: "networkidle" });
    await corruptPage.getByText("Saved progress for this puzzle is invalid or unsupported. Clear it to start saving again.").waitFor();
    assert.equal(await corruptPage.getByRole("button", { name: "Resume saved progress" }).count(), 0);
    await corruptPage.getByRole("button", { name: "Clear saved progress" }).click();
    assert.equal(await corruptPage.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ilws:solver-progress:v1:")).length), 0);
    assert.deepEqual(calls, []); assert.deepEqual(errors, []);
    assert.equal(await corruptPage.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    await context.close();
  }
  {
    const context = await browser.newContext(); const page = await context.newPage();
    await page.addInitScript(() => { Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new DOMException("Blocked", "SecurityError"); } }); });
    const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(urlFor(request.seed), { waitUntil: "networkidle" });
    await page.getByText("Device storage or secure puzzle identification is unavailable. You can still solve without saving.").waitFor();
    await page.getByRole("button", { name: "Begin puzzle" }).click(); await select(page, 0, false);
    await page.getByText("1 of 2 words found", { exact: true }).first().waitFor(); assert.deepEqual(errors, []);
    await context.close();
  }
  {
    const context = await browser.newContext(); const page = await context.newPage();
    await page.addInitScript(() => { Object.defineProperty(window, "crypto", { configurable: true, value: {} }); });
    await page.goto(urlFor(request.seed), { waitUntil: "networkidle" });
    await page.getByText("Device storage or secure puzzle identification is unavailable. You can still solve without saving.").waitFor();
    await page.getByRole("button", { name: "Begin puzzle" }).click(); await select(page, 0, false);
    await page.getByText("1 of 2 words found", { exact: true }).first().waitFor();
    await context.close();
  }
  {
    const context = await browser.newContext(); const page = await context.newPage();
    await page.addInitScript(() => { const original = Storage.prototype.setItem; Storage.prototype.setItem = function(key, value) { if (key.startsWith("ilws:solver-progress:v1:")) throw new DOMException("Full", "QuotaExceededError"); return original.call(this, key, value); }; });
    await page.goto(urlFor(request.seed), { waitUntil: "networkidle" });
    const remember = page.getByRole("checkbox", { name: "Remember progress on this device" }); await page.waitForFunction(() => !document.querySelector<HTMLInputElement>(".solver-save-progress input")?.disabled); await remember.check();
    await page.getByRole("button", { name: "Begin puzzle" }).click();
    await page.getByText("Device storage is unavailable. You can keep solving, but progress may not be saved.").waitFor();
    await select(page, 0, false); await page.getByText("1 of 2 words found", { exact: true }).first().waitFor();
    await context.close();
  }
} finally { await browser.close(); }
console.log("PASS opt-in, local-only progress, resume, seed isolation, replay, keyboard/touch, storage denial and quota");
