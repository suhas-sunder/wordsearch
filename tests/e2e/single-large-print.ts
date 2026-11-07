import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { encodeShareState } from "@/lib/share-state/state";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { measuredLargePrintOptions } from "@/lib/pdf/browser-download";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3278";
const output = process.env.SINGLE_LARGE_OUTPUT ?? join(tmpdir(), "ilws-single-large-print");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const reports: unknown[] = [];
const request = { title: "Single measured print", wordsText: "CAT\nDOG\nBIRD", seed: "single-browser-large", rows: 8, cols: 12, autoSize: false, directions: ["E" as const], instructions: "Find the three listed words." };
try {
  for (const [width, colorScheme] of [[320, "light"], [390, "dark"], [1280, "light"], [844, "dark"]] as const) {
    const context = await browser.newContext({ viewport: { width, height: width === 844 ? 390 : 1000 }, colorScheme, acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    for (const paperSize of ["letter", "a4"] as const) {
      await page.goto(`${base}/word-search-generator?state=${encodeShareState(request)}`, { waitUntil: "networkidle" });
      await page.locator(".builder-preview .puzzle-token").last().waitFor();
      const expected = generatePuzzle(request);
      const tokens = await page.locator(".builder-preview .puzzle-token").allTextContents();
      assert.deepEqual(tokens, expected.grid.flat());
      await page.locator(".preview-toolbar-actions").getByRole("button", { name: "Download PDF", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Download PDF", exact: true });
      await dialog.getByRole("combobox", { name: "Paper size", exact: true }).selectOption(paperSize);
      await dialog.getByRole("combobox", { name: "Orientation", exact: true }).selectOption("landscape");
      await dialog.getByRole("combobox", { name: "Word bank", exact: true }).selectOption("beside");
      await dialog.getByLabel("Answer key page", { exact: true }).check();
      const fields = width !== 320;
      await dialog.getByLabel("Name/date line", { exact: true }).setChecked(fields);
      await dialog.getByLabel("Instructions", { exact: true }).setChecked(fields);
      await dialog.getByLabel("Coordinates", { exact: true }).check();
      await dialog.getByLabel("QR code", { exact: true }).check();
      const action = dialog.getByRole("button", { name: "Download measured large-print PDF", exact: true });
      await action.scrollIntoViewIfNeeded();
      assert.equal(await dialog.evaluate(el => el.scrollWidth > el.clientWidth + 1), false, "large-print dialog overflows horizontally");
      assert.ok((await action.boundingBox())!.height >= 40);
      const axe = await new AxeBuilder({ page }).include("dialog[open]").analyze();
      assert.deepEqual(axe.violations, []);
      await page.screenshot({ path: join(output, `${width}-${paperSize}-choice.png`) });
      const pending = page.waitForEvent("download"); await action.click();
      const downloaded = await pending;
      assert.match(downloaded.suggestedFilename(), /-large-print\.pdf$/);
      const bytes = await readFile((await downloaded.path())!);
      const options = measuredLargePrintOptions({ ...defaultPuzzleOutputOptions, paperSize, includeAnswerKey: true, nameDateLine: fields, instructions: fields });
      const measurement = await measurePdfBytes(new Uint8Array(bytes), expected, options);
      assert.ok(measurement.grid.minFontPt >= 16);
      assert.equal(measurement.wordBank.length, 3);
      assert.ok(measurement.wordBank.every(word => word.fontPt === 18));
      assert.deepEqual(measurement.findings, []);
      const task = getDocument({ data: new Uint8Array(bytes), useSystemFonts: true });
      try {
        const document = await task.promise;
        assert.equal(document.numPages, 2);
        for (let number = 1; number <= 2; number++) {
          const content = await (await document.getPage(number)).getTextContent();
          const text = content.items.flatMap(item => "str" in item ? [item] : []);
          assert.deepEqual(text.filter(item => /^[A-Z]$/.test(item.str)).map(item => item.str), tokens, "student and answer page use the exact preview grid");
          assert.ok(text.every(item => !item.str.includes("Scan to open")), "measured file omits QR instructions");
          if (number === 1) {
            assert.equal(text.some(item => item.str === "Name"), fields, "selected name/date choice reaches the actual file");
            assert.equal(text.some(item => item.str.includes(request.instructions)), fields, "selected instructions choice reaches the actual file");
          }
        }
      } finally { await task.destroy(); }
      await writeFile(join(output, `${width}-${paperSize}.pdf`), bytes);
      await dialog.waitFor({ state: "hidden" });
      await page.locator(".preview-toolbar-actions").getByRole("button", { name: "Download PDF", exact: true }).click();
      assert.equal(await dialog.getByRole("combobox", { name: "Orientation", exact: true }).inputValue(), "landscape");
      assert.equal(await dialog.getByRole("combobox", { name: "Word bank", exact: true }).inputValue(), "beside");
      assert.equal(await dialog.getByLabel("Coordinates", { exact: true }).isChecked(), true);
      assert.equal(await dialog.getByLabel("QR code", { exact: true }).isChecked(), true);
      await page.keyboard.press("Escape");
      assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), tokens);
      reports.push({ width, colorScheme, paperSize, measurement, exactAnswerParity: true, ordinaryChoicesPreserved: true });
    }
    await context.close();
  }
  const page = await browser.newPage();
  // This separate crowded-layout context needs the same correctness-test mock.
  await page.context().route("https://pagead2.googlesyndication.com/**", route => route.fulfill({ contentType: "application/javascript", body: "" }));
  await page.goto(`${base}/word-search-generator?state=${encodeShareState({ ...request, rows: 40, cols: 40 })}`, { waitUntil: "networkidle" });
  const crowded = await page.locator(".builder-preview .puzzle-token").allTextContents();
  let downloads = 0; page.on("download", () => downloads++);
  await page.locator(".preview-toolbar-actions").getByRole("button", { name: "Download PDF", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Download PDF", exact: true });
  await dialog.getByRole("button", { name: "Download measured large-print PDF", exact: true }).click();
  await dialog.getByRole("alert").filter({ hasText: /16-point/ }).waitFor();
  assert.equal(downloads, 0);
  assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), crowded);
  assert.equal(await dialog.getByRole("button", { name: "Download measured large-print PDF", exact: true }).isEnabled(), true);
  await page.close();
  await writeFile(join(output, "measurements.json"), JSON.stringify({ base, cases: reports, crowdedFitRejection: "pass", limitations: "Measured PDF at100%; physical printing, browser/device acceptance and audience suitability remain separate." }, null, 2));
  console.log(`PASS ${reports.length} actual single large-print PDFs: exact student/answer grids, Letter/A4, min16pt grid/18pt bank, no geometry findings, unchanged ordinary choices; crowded request fails visibly.`);
} finally { await browser.close(); }
