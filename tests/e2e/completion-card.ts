import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";

const base = process.env.BASE_URL ?? "http://localhost:3260";
const request = { title: "PRIVATE CLASSROOM TITLE", seed: "private-result-words", wordsText: "CAT\nDOG", autoSize: false, rows: 8, cols: 8, directions: ["E"] as const, allowOverlap: false };
const puzzle = generatePuzzle({ ...request, directions: [...request.directions] });
const encoded = Buffer.from(JSON.stringify(request)).toString("base64url");
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
    await context.addInitScript(`
      Object.defineProperty(navigator, "canShare", { configurable: true, value: () => true });
      Object.defineProperty(navigator, "share", { configurable: true, value: async (data) => {
        window.__sharedResult = { title: data.title, text: data.text, url: data.url, files: data.files?.map((file) => ({ name: file.name, type: file.type, size: file.size })) };
      } });
    `);
    const page = await context.newPage();
    const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.clock.install();
    await page.goto(`${base}/play/${encoded}`, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("button", { name: "Download result image" }).count(), 0);
    await page.getByRole("button", { name: "Begin puzzle" }).click();
    await page.clock.fastForward(125_000);
    for (const placement of puzzle.placed) {
      const start = placement.cells[0];
      const cell = page.locator(`[data-solver-cell][data-row="${start.row}"][data-col="${start.col}"]`);
      await cell.focus(); await page.keyboard.press("Enter");
      for (let i = 1; i < placement.cells.length; i++) await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Enter");
    }
    const completion = page.locator(".solver-completion");
    await completion.getByRole("heading", { name: "Puzzle complete", exact: true }).waitFor();
    const axe = await new AxeBuilder({ page }).include(".solver-completion").analyze();
    assert.deepEqual(axe.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), []);
    const elapsed = await page.getByTestId("completion-elapsed").innerText();
    assert.match(elapsed, /^2:0[5-9]$/);
    await page.clock.fastForward(60_000);
    assert.equal(await page.getByTestId("completion-elapsed").innerText(), elapsed, "completion time is frozen");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download result image", exact: true }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "word-search-result.png");
    const bytes = await readFile((await download.path())!);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), 1200); assert.equal(bytes.readUInt32BE(20), 630);
    if (process.env.COMPLETION_VISUAL_OUTPUT) {
      await mkdir(process.env.COMPLETION_VISUAL_OUTPUT, { recursive: true });
      await download.saveAs(`${process.env.COMPLETION_VISUAL_OUTPUT}/result-${width}.png`);
      await completion.screenshot({ path: `${process.env.COMPLETION_VISUAL_OUTPUT}/completion-${width}.png` });
    }
    await page.getByRole("button", { name: "Share result image", exact: true }).click();
    await page.getByText("Result image handed to your sharing app.").waitFor();
    const shared = await page.evaluate(() => (window as unknown as { __sharedResult: { title: string; text: string; url?: string; files: { name: string; type: string; size: number }[] } }).__sharedResult);
    assert.equal(shared.url, undefined);
    assert.equal(shared.files[0].type, "image/png");
    assert.ok(shared.files[0].size > 1000);
    assert.doesNotMatch(JSON.stringify(shared), /PRIVATE|CLASSROOM|CAT|DOG|private-result|\/play\//);
    await page.evaluate(`Object.defineProperty(navigator, "share", { configurable: true, value: async () => { throw new DOMException("Cancelled", "AbortError"); } });`);
    await page.getByRole("button", { name: "Share result image", exact: true }).click();
    await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) => button.textContent?.includes("Download result image") && !button.disabled));
    assert.equal(await page.getByText("Result image could not be shared or downloaded. Try again.").count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Replay this puzzle" }).click();
    await page.getByRole("button", { name: "Begin puzzle" }).waitFor();
    assert.equal(await page.getByTestId("completion-elapsed").count(), 0);
    await page.evaluate(`Object.defineProperty(navigator, "share", { configurable: true, value: undefined }); window.__originalToBlob = HTMLCanvasElement.prototype.toBlob; HTMLCanvasElement.prototype.toBlob = function(callback) { callback(null); };`);
    await page.getByRole("button", { name: "Begin puzzle" }).click();
    await page.clock.fastForward(1000);
    for (const placement of puzzle.placed) {
      const start = placement.cells[0];
      await page.locator(`[data-solver-cell][data-row="${start.row}"][data-col="${start.col}"]`).focus();
      await page.keyboard.press("Enter");
      for (let i = 1; i < placement.cells.length; i++) await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Enter");
    }
    await completion.getByRole("heading", { name: "Puzzle complete", exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: "Share result image", exact: true }).count(), 0, "unsupported file sharing keeps local download available");
    await page.getByRole("button", { name: "Download result image", exact: true }).click();
    await page.getByText("Result image could not be shared or downloaded. Try again.").waitFor();
    await page.evaluate(`HTMLCanvasElement.prototype.toBlob = window.__originalToBlob;`);
    const retryPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download result image", exact: true }).click();
    assert.equal((await retryPromise).suggestedFilename(), "word-search-result.png");
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally { await browser.close(); }
console.log("PASS completion timing, frozen/replay state, actual private PNG, file-only native share/cancel and mobile/desktop layouts");
