import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";

const base = process.env.BASE_URL, output = process.env.CLASSROOM_SEED_OUTPUT;
assert.ok(base && output, "Set BASE_URL and outside-Git CLASSROOM_SEED_OUTPUT");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report: object[] = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, colorScheme: "dark", acceptDownloads: true });
  await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  let downloads = 0;
  page.on("download", () => downloads++);
  await page.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
  const seedInput = page.getByLabel("Base seed", { exact: true });
  assert.equal(await seedInput.inputValue(), "");
  await page.getByLabel("Pack title", { exact: true }).fill("Teacher set");
  await page.getByLabel("Words or phrases", { exact: true }).fill("CAT\nDOG\nBIRD");
  assert.equal(await seedInput.inputValue(), "", "typing other entries never chooses a seed automatically");
  const choose = page.getByRole("button", { name: "Choose for me: Base seed", exact: true });
  assert.equal(await choose.getAttribute("type"), "button");
  assert.ok((await choose.getAttribute("aria-label"))!.startsWith((await choose.innerText()).trim()), "The accessible name starts with the complete visible label for speech input");
  assert.ok((await choose.boundingBox())!.height >= 44);
  await choose.focus();
  await page.keyboard.press("Enter");
  const seed = await seedInput.inputValue();
  assert.match(seed, /^classroom-[a-f0-9]{16}$/);
  assert.equal(downloads, 0, "choosing a seed never submits the form");
  assert.equal(await page.evaluate(() => localStorage.getItem("ilws:classroom-presets:v1")), null);
  await page.getByLabel("Download pages", { exact: true }).selectOption("students");
  let firstFive: Uint8Array | undefined;
  for (const count of [5, 10, 20, 5] as const) {
    await page.getByLabel("Puzzles", { exact: true }).selectOption(String(count));
    assert.equal(await seedInput.inputValue(), seed, "rerenders and downloads retain the selected seed");
    const expected = buildClassroomPack({ title: "Teacher set", wordsText: "CAT\nDOG\nBIRD", seed, count });
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download PDF pack", exact: true }).click();
    const download = await pending, bytes = new Uint8Array(await readFile((await download.path())!));
    const file = `${count}-${report.length ? "repeat-or-next" : "first"}.pdf`;
    await download.saveAs(resolve(output, file));
    const task = getDocument({ data: bytes.slice(), useSystemFonts: true });
    try {
      const pdf = await task.promise, grids = [];
      assert.equal(pdf.numPages, count);
      for (let index = 0; index < count; index++) {
        const text = (await (await pdf.getPage(index + 1)).getTextContent()).items.flatMap(item => "str" in item ? [item.str] : []);
        const grid = text.filter(item => /^[A-Z]$/.test(item));
        assert.deepEqual(grid, expected.puzzles[index].puzzle.grid.flat());
        assert.ok(text.join(" ").includes(expected.puzzles[index].puzzle.request.title));
        assert.ok(!text.join(" ").includes("Answer Key"));
        grids.push(grid.join(""));
      }
      assert.equal(new Set(grids).size, count);
    } finally { await task.destroy(); }
    if (count === 5) {
      if (firstFive) assert.deepEqual(bytes, firstFive, "the same entries recreate the exact student packet bytes");
      else firstFive = bytes;
    }
    report.push({ count, file, seedPreserved: true, allGridsDistinctAndExact: true });
  }
  assert.equal(await page.evaluate(() => localStorage.getItem("ilws:classroom-presets:v1")), null, "downloads never autosave a preset");
  await page.getByRole("button", { name: "Save preset on this device", exact: true }).click();
  const stored = JSON.parse((await page.evaluate(() => localStorage.getItem("ilws:classroom-presets:v1")))!);
  assert.equal(stored.presets[0].input.seed, seed);
  await seedInput.fill("my-own-seed");
  await page.getByLabel("Pack title", { exact: true }).fill("Teacher set");
  assert.equal(await seedInput.inputValue(), "my-own-seed", "typed seeds are not overwritten unless the chooser is clicked");
  await page.getByRole("button", { name: "Load Teacher set", exact: true }).click();
  assert.equal(await seedInput.inputValue(), seed, "explicit presets keep their original exact seed");
  const axe = await new AxeBuilder({ page }).include("main").analyze();
  assert.deepEqual(axe.violations.filter(item => ["serious", "critical"].includes(item.impact ?? "")), []);
  assert.deepEqual(errors, []);
  await choose.scrollIntoViewIfNeeded();
  await page.screenshot({ path: resolve(output, "mobile-seed-choice.png") });
  await context.close();

  const blocked = await browser.newContext();
  await blocked.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
  const errorPage = await blocked.newPage();
  await errorPage.goto(`${base}/pack-builder`, { waitUntil: "networkidle" });
  await errorPage.getByLabel("Base seed", { exact: true }).fill("keep-my-code");
  // Keep the fault entirely in the page realm; a nested TSX-transformed arrow
  // would otherwise reference the Node-side esbuild function-name helper.
  await errorPage.evaluate("Object.defineProperty(window.crypto, 'getRandomValues', { configurable: true, value: function () { throw new Error('Test crypto unavailable'); } })");
  await errorPage.getByRole("button", { name: "Choose for me: Base seed", exact: true }).click();
  await errorPage.getByRole("alert").filter({ hasText: "Enter a code in Base seed" }).waitFor();
  assert.equal(await errorPage.getByLabel("Base seed", { exact: true }).inputValue(), "keep-my-code");
  report.push({ blockedCryptoExplained: true, existingSeedPreserved: true, explicitSaveOnly: true });
  await blocked.close();
} finally {
  await browser.close();
  await writeFile(resolve(output, "report.json"), JSON.stringify({ base, cases: report }, null, 2));
}
console.log("PASS novice seed choice: no submit/autosave,5/10/20 exact distinct assignments, byte-identical replay, presets and blocked-crypto recovery.");
