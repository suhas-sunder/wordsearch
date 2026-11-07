import assert from "node:assert/strict";
import { chromium } from "playwright";
import { generatePuzzle } from "../../lib/puzzle/generate";
import { decodePuzzleShareState } from "../../lib/share-state/state";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3318";
const request = { title: "Settings fallbacks", wordsText: "CAT\nDOG", seed: "settings-fallback", rows: 6, cols: 6, autoSize: false, directions: ["E"] as const, allowOverlap: false, fillerMode: "alphabet", customFiller: "XYZ" };
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.abort());
    const page = await context.newPage(), errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${base}/word-search-generator?state=${Buffer.from(JSON.stringify(request)).toString("base64url")}`, { waitUntil: "networkidle" });
    const controls = page.locator(".builder-controls");
    await controls.getByText("Advanced print and fill controls", { exact: true }).click();
    async function current() {
      const play = page.getByRole("link", { name: "Play", exact: true }); await play.waitFor();
      const decoded = decodePuzzleShareState((await play.getAttribute("href"))?.split("/").at(-1)); assert.ok(decoded);
      const puzzle = generatePuzzle(decoded);
      assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), puzzle.grid.flat());
      return puzzle;
    }
    const legacy = await current(); assert.equal(legacy.request.fillerMode, "alphabet");
    await controls.getByText(/This saved definition has a custom filler override/).waitFor();
    await controls.getByRole("button", { name: "Use alphabet defaults", exact: true }).click();
    const defaults = await current(); assert.equal(defaults.request.customFiller, "");
    await controls.getByRole("combobox", { name: "Filler mode", exact: true }).selectOption("custom");
    assert.deepEqual((await current()).grid, defaults.grid);
    await controls.getByText(/Custom filler is empty/).waitFor();
    await controls.getByLabel("Custom filler alphabet", { exact: true }).fill("😀");
    const unsupported = await current(); assert.deepEqual(unsupported.grid, defaults.grid);
    await page.getByText("Custom filler has no supported tokens for this alphabet pack; alphabet defaults are used.", { exact: true }).waitFor();
    await controls.getByLabel("Custom filler alphabet", { exact: true }).fill("XYZ");
    await current();
    await controls.getByLabel("Hidden message", { exact: true }).fill("😀");
    assert.equal((await current()).hiddenMessageApplied, undefined);
    await page.getByText("The hidden message has no supported tokens for this alphabet pack; no message was applied.", { exact: true }).waitFor();
    await controls.getByLabel("Hidden message", { exact: true }).fill("HI");
    const hidden = await current(), occupied = new Set(hidden.placed.flatMap((word) => word.cells.map((cell) => `${cell.row}:${cell.col}`)));
    const unused = hidden.grid.flatMap((row, r) => row.filter((_token, c) => !occupied.has(`${r}:${c}`)));
    assert.deepEqual(unused.slice(0, 2), ["H", "I"]); assert.ok(unused.slice(2).every((token) => /^[XYZ]$/.test(token)));
    await controls.getByLabel("Hidden message", { exact: true }).fill("Z".repeat(100));
    assert.equal((await current()).hiddenMessageApplied, "Z".repeat(30));
    await page.getByText("The hidden message is too long for the remaining cells.", { exact: true }).waitFor();
    await controls.getByLabel("Hidden message", { exact: true }).fill(""); await current();
    for (const alphabetPack of ["morse", "binary", "hex"]) {
      await controls.getByRole("combobox", { name: "Alphabet pack", exact: true }).selectOption(alphabetPack);
      const saved = await current(); assert.equal(saved.request.customFiller, "XYZ"); assert.equal(saved.request.fillerMode, "custom");
      assert.equal(await controls.getByLabel("Custom filler alphabet", { exact: true }).isDisabled(), true);
      assert.equal(await controls.locator('select[aria-label="Filler mode"] option[value="custom"]').evaluate((option) => (option as HTMLOptionElement).disabled), true);
      await page.getByText("Custom filler is not implemented for this alphabet pack; its original alphabet defaults are used.", { exact: true }).waitFor();
      await controls.getByRole("combobox", { name: "Filler mode", exact: true }).selectOption("used");
      const used = await current(); assert.equal(used.request.fillerMode, "used");
      await controls.getByRole("combobox", { name: "Alphabet pack", exact: true }).selectOption("latin"); await current();
      await controls.getByRole("combobox", { name: "Filler mode", exact: true }).selectOption("custom"); await current();
    }
    assert.deepEqual(errors, []); await context.close();
  }
} finally { await browser.close(); }
console.log("PASS mobile/desktop empty/unsupported custom filler, preserved legacy override, hidden unsupported/overflow/remainder behavior and disabled unimplemented filler choices with exact legacy grids");
