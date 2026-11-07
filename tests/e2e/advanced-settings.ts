import assert from "node:assert/strict";
import { chromium } from "playwright";
import { decodePuzzleShareState } from "../../lib/share-state/state";
import { generatePuzzle } from "../../lib/puzzle/generate";
import { puzzleWordBank } from "../../lib/puzzle/word-bank";
import { specialtyRoutes } from "../../content/specialty";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3312";
const request = { title: "Advanced settings acceptance", wordsText: "OX\nPLANET\nCAT\nALBATROSS\nDOG\nSTAR", seed: "advanced-settings", rows: 12, cols: 12, autoSize: false, directions: ["E"] as const, wordBankOrder: "custom", fillerMode: "alphabet", customFiller: "XYZ" };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(), errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(request)).toString("base64url")}`, { waitUntil: "networkidle" });
    const controls = page.locator(".builder-controls");
    await controls.getByText("Advanced print and fill controls", { exact: true }).click();
    const play = page.getByRole("link", { name: "Play", exact: true });
    async function current() {
      await play.waitFor();
      const href = await play.getAttribute("href");
      const decoded = decodePuzzleShareState(href?.split("/").at(-1));
      assert.ok(decoded);
      const puzzle = generatePuzzle(decoded);
      assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), puzzle.grid.flat());
      assert.deepEqual(await page.locator(".builder-preview .print-word-bank span").allTextContents(), puzzleWordBank(puzzle).map((word) => word.label));
      return puzzle;
    }
    const original = await current();
    assert.equal(await controls.getByRole("combobox", { name: /^Word bank order/ }).inputValue(), "custom");
    await controls.getByText(/This saved definition has a custom filler override/).waitFor();
    for (const order of ["input", "length", "alphabetical"]) {
      await controls.getByRole("combobox", { name: /^Word bank order/ }).selectOption(order);
      const puzzle = await current();
      assert.equal(puzzle.request.wordBankOrder, order);
      assert.deepEqual(puzzle.grid, original.grid);
    }
    await controls.getByRole("button", { name: "Use alphabet defaults", exact: true }).click();
    assert.equal((await current()).request.customFiller, "");
    for (const mode of ["used", "rare"]) {
      await controls.getByRole("combobox", { name: /^Filler mode/ }).selectOption(mode);
      assert.equal((await current()).request.fillerMode, mode);
    }
    await controls.getByLabel("Custom filler alphabet", { exact: true }).fill("XYZ");
    const custom = await current();
    assert.equal(custom.request.fillerMode, "custom");
    const occupied = new Set(custom.placed.flatMap((word) => word.cells.map((cell) => `${cell.row}:${cell.col}`)));
    custom.grid.forEach((row, r) => row.forEach((token, c) => { if (!occupied.has(`${r}:${c}`)) assert.match(token, /^[XYZ]$/); }));
    const seed = controls.getByLabel("Puzzle seed", { exact: true });
    await seed.fill("another-seed"); const changed = await current(); assert.notDeepEqual(changed.grid, custom.grid);
    await seed.fill("advanced-settings"); assert.deepEqual((await current()).grid, custom.grid);
    await seed.fill(" ");
    await page.getByRole("alert").filter({ hasText: "Enter a nonblank puzzle seed" }).first().waitFor();
    assert.equal(await play.count(), 0);
    await seed.fill("advanced-settings"); await current();
    await controls.getByLabel("Hidden message", { exact: true }).fill("GREAT JOB");
    assert.equal((await current()).hiddenMessageApplied, "GREATJOB");
    assert.deepEqual(errors, []);
    await context.close();
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of specialtyRoutes) {
    await page.goto(`${base}/specialty/${route.slug}`, { waitUntil: "domcontentloaded" });
    const note = page.getByRole("note", { name: "Format readiness" });
    assert.ok((await note.textContent())?.includes(route.status));
    assert.ok((await note.textContent())?.toLowerCase().includes(route.implementation));
    assert.ok(await page.locator('meta[name="robots"]').getAttribute("content").then((value) => value?.includes("noindex")));
  }
  await context.close();
} finally { await browser.close(); }
console.log("PASS advanced seed/filler/bank controls replay exact grids on mobile/desktop; legacy definitions preserved; all specialty limitations available without JavaScript");
