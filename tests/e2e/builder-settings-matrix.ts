import assert from "node:assert/strict";
import { chromium } from "playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";
import { decodePuzzleShareState } from "../../lib/share-state/state";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3316";
const request = { title: "Settings matrix", wordsText: "STAR\nSTART\nART\nRAT\nTAR\nSTARS", seed: "matrix-1", rows: 12, cols: 12, autoSize: false, directions: ["E", "S", "SE", "NE"] as const, allowOverlap: true };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(), errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(request)).toString("base64url")}`, { waitUntil: "networkidle" });
    const controls = page.locator(".builder-controls");
    async function current() {
      const play = page.getByRole("link", { name: "Play", exact: true }); await play.waitFor();
      const decoded = decodePuzzleShareState((await play.getAttribute("href"))?.split("/").at(-1)); assert.ok(decoded);
      const puzzle = generatePuzzle(decoded);
      assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), puzzle.grid.flat());
      assert.equal(await page.locator(".builder-preview").getAttribute("aria-busy"), "false");
      return puzzle;
    }
    const original = await current(), cells = original.placed.flatMap((word) => word.cells);
    assert.ok(new Set(cells.map((cell) => `${cell.row}:${cell.col}`)).size < cells.length, "fixture actually exercises shared cells");
    await controls.getByRole("checkbox", { name: "Allow overlap", exact: true }).uncheck();
    const separate = await current(), disjoint = separate.placed.flatMap((word) => word.cells);
    assert.equal(separate.request.allowOverlap, false); assert.equal(new Set(disjoint.map((cell) => `${cell.row}:${cell.col}`)).size, disjoint.length);
    await controls.getByRole("checkbox", { name: "Allow overlap", exact: true }).check();
    assert.deepEqual((await current()).grid, original.grid);
    await controls.getByRole("checkbox", { name: "Auto size", exact: true }).check();
    assert.equal((await current()).rows, 10);
    await controls.getByRole("checkbox", { name: "Larger grid type", exact: true }).check();
    assert.equal((await current()).rows, 12);
    await controls.getByRole("checkbox", { name: "Larger grid type", exact: true }).uncheck();
    assert.equal((await current()).rows, 10);
    await controls.getByRole("checkbox", { name: "Auto size", exact: true }).uncheck();
    await controls.getByLabel("Rows", { exact: true }).fill("8");
    await controls.getByLabel("Columns", { exact: true }).fill("14");
    const manual = await current(); assert.equal(manual.rows, 8); assert.equal(manual.cols, 14);
    await controls.getByRole("checkbox", { name: "Larger grid type", exact: true }).check();
    assert.deepEqual((await current()).grid, manual.grid);
    await controls.getByRole("checkbox", { name: "Larger grid type", exact: true }).uncheck(); await current();
    for (const [difficulty, directions] of [["easy", ["E", "S"]], ["medium", ["E", "S", "SE", "NE"]], ["hard", ["E", "W", "S", "N", "SE", "SW", "NE", "NW"]]] as const) {
      await controls.getByRole("button", { name: difficulty, exact: true }).click();
      const puzzle = await current(); assert.equal(puzzle.request.difficulty, difficulty); assert.deepEqual(puzzle.request.directions, directions);
    }
    await controls.getByRole("button", { name: "Toggle NE direction", exact: true }).click();
    const customized = await current(); assert.equal(customized.request.directions.includes("NE"), false);
    await controls.getByRole("button", { name: "hard", exact: true }).click(); assert.deepEqual((await current()).request.directions, customized.request.directions);
    let uploadedGrid: string[][] | undefined;
    for (const [extension, wordsText] of [["txt", "CAT\nDOG\nBIRD"], ["csv", "CAT,DOG\nBIRD"], ["tsv", "CAT\tDOG\tBIRD"]]) {
      await controls.locator('input[type="file"]').setInputFiles({ name: `matrix.${extension}`, mimeType: "text/plain", buffer: Buffer.from(wordsText) });
      await page.waitForFunction((value) => (document.querySelector(".builder-controls textarea") as HTMLTextAreaElement | null)?.value === value, wordsText);
      const puzzle = await current(); assert.equal(puzzle.request.wordsText, wordsText);
      assert.deepEqual(puzzle.words.map((word) => word.label), ["CAT", "DOG", "BIRD"]);
      if (uploadedGrid) assert.deepEqual(puzzle.grid, uploadedGrid); else uploadedGrid = puzzle.grid;
    }
    await controls.getByText("Advanced print and fill controls", { exact: true }).click();
    await controls.getByRole("textbox", { name: /^Instructions/ }).fill("Circle each animal once. Work independently.");
    await current(); assert.equal(await page.locator(".builder-preview .print-instructions").textContent(), "Circle each animal once. Work independently.");
    const beforeSeed = await current();
    await controls.getByLabel("Puzzle seed", { exact: true }).fill("matrix-alternate"); assert.notDeepEqual((await current()).grid, beforeSeed.grid);
    await controls.getByLabel("Puzzle seed", { exact: true }).fill(beforeSeed.request.seed); assert.deepEqual((await current()).grid, beforeSeed.grid);
    await page.getByRole("button", { name: "Shuffle", exact: true }).click(); assert.notEqual((await current()).request.seed, beforeSeed.request.seed);
    await controls.getByLabel("Puzzle seed", { exact: true }).fill(beforeSeed.request.seed); assert.deepEqual((await current()).grid, beforeSeed.grid);
    for (const alphabetPack of ["latin", "morse", "braille", "binary", "hex", "greek", "kana", "asl"]) {
      await controls.getByRole("combobox", { name: "Alphabet pack", exact: true }).selectOption(alphabetPack);
      assert.equal((await current()).request.alphabetPack, alphabetPack);
    }
    assert.deepEqual(errors, []); await context.close();
  }
} finally { await browser.close(); }
console.log("PASS mobile/desktop actual overlap, auto/manual sizing, larger-grid defaults, difficulty/custom directions, TXT/CSV/TSV, instructions, seed/shuffle replay and eight existing maker pack choices with their limitations retained; exact shared grids");
