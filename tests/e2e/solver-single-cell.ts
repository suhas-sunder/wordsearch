import assert from "node:assert/strict";
import { chromium, type Page } from "playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";
import type { DirectionKey, Placement } from "../../lib/puzzle/types";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3306";
const request = { title: "One-letter puzzle acceptance", wordsText: "A\nDOG", seed: "single-letter-support", rows: 6, cols: 6, autoSize: false, directions: ["E"] as DirectionKey[], allowOverlap: false };
const puzzle = generatePuzzle(request);
const one = puzzle.placed.find((placement) => placement.tokens.length === 1)!;
const longer = puzzle.placed.find((placement) => placement.tokens.length > 1)!;
async function select(page: Page, placement: Placement, method: string) {
  const first = placement.cells[0], last = placement.cells.at(-1)!;
  const start = page.locator(`[data-solver-cell][data-row="${first.row}"][data-col="${first.col}"]`);
  const end = page.locator(`[data-solver-cell][data-row="${last.row}"][data-col="${last.col}"]`);
  if (method === "keyboard") {
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-solver-cell"));
    await start.focus(); await page.keyboard.press("Enter");
    for (let i = 1; i < placement.cells.length; i++) await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
  } else if (method === "tap") { await start.tap(); await end.tap(); }
  else {
    await start.scrollIntoViewIfNeeded(); await end.scrollIntoViewIfNeeded();
    const a = (await start.boundingBox())!, b = (await end.boundingBox())!;
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 3 }); await page.mouse.up();
  }
}
const browser = await chromium.launch({ headless: true });
try {
  for (const method of ["keyboard", "drag", "tap"]) {
    const context = await browser.newContext({ viewport: { width: method === "tap" ? 390 : 1280, height: 900 }, hasTouch: method === "tap", isMobile: method === "tap" });
    const page = await context.newPage(); const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/play/${Buffer.from(JSON.stringify(request)).toString("base64url")}`, { waitUntil: "networkidle" });
    if (method === "tap") { await page.getByRole("button", { name: "Accessibility and controls", exact: true }).click(); await page.getByRole("radio", { name: /^Tap endpoints/ }).check(); await page.getByRole("button", { name: "Done", exact: true }).click(); }
    await page.getByRole("button", { name: "Begin puzzle", exact: true }).click();
    await select(page, one, method);
    await page.getByTestId("solver-progress").filter({ hasText: "1 of 2 words found" }).waitFor();
    await select(page, one, method);
    assert.equal(await page.getByTestId("solver-progress").innerText(), "1 of 2 words found");
    await select(page, longer, method);
    await page.getByRole("heading", { name: "Puzzle complete", exact: true }).waitFor();
    assert.equal(await page.getByTestId("solver-progress").innerText(), "2 of 2 words found");
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally { await browser.close(); }
console.log("PASS one-cell words complete by keyboard, pointer and mobile tap; duplicate finding does not count twice; mixed-length puzzle completes");
