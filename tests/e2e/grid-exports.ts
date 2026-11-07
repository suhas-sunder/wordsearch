import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { chromium } from "playwright";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { encodeShareState } from "@/lib/share-state/state";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const output = process.env.GRID_EXPORT_OUTPUT ?? join(tmpdir(), "ilws-grid-exports");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const report: { cases: number; checks: string[]; failures: string[] } = { cases: 0, checks: [], failures: [] };
try {
  for (const width of [320, 390, 1280]) for (const colorScheme of ["light", "dark"] as const) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme, acceptDownloads: true });
    await context.route("https://pagead2.googlesyndication.com/**", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
    const page = await context.newPage();
    const errors: string[] = []; page.on("pageerror", (error) => errors.push(error.message));
    for (const [rows, cols] of [[8, 12], [6, 40], [40, 6]]) {
      const request = { title: "Grid export <&> é", wordsText: "CAT\nDOG\nBIRD", seed: "grid-export", rows, cols, autoSize: false, directions: ["E" as const], alphabetPack: "latin" as const };
      const expected = generatePuzzle(request);
      await page.goto(`${base}/word-search-generator?state=${encodeShareState(request)}`, { waitUntil: "networkidle" });
      const grid = page.locator(".builder-preview svg.puzzle-svg");
      await grid.locator(".puzzle-token").last().waitFor();
      assert.deepEqual(await grid.locator(".puzzle-token").allTextContents(), expected.grid.flat());
      const tokens = await grid.locator(".puzzle-token").allTextContents();
      for (const format of ["svg", "png", "txt"] as const) {
        const downloadPromise = page.waitForEvent("download");
        await page.getByRole("button", { name: format === "svg" ? "SVG grid" : format === "png" ? "PNG grid" : "Grid text", exact: true }).click();
        const download = await downloadPromise;
        assert.match(download.suggestedFilename(), new RegExp(`^grid-export-e-grid\\.${format}$`));
        const bytes = await readFile((await download.path())!);
        if (format === "txt") assert.equal(bytes.toString(), expected.grid.map((row) => row.join("\t")).join("\n") + "\n");
        if (format === "svg") {
          const svg = bytes.toString(); assert.match(svg, /font-family="Arial, Helvetica, sans-serif"/);
          assert.equal((svg.match(/class="puzzle-token"/g) ?? []).length, rows * cols);
          assert.ok(!svg.includes("http://127.0.0.1"));
        }
        if (format === "png") {
          assert.equal(bytes.subarray(1, 4).toString(), "PNG");
          assert.ok(bytes.readUInt32BE(16) <= 3200 && bytes.readUInt32BE(20) <= 3200);
          const inkedCells = await page.evaluate(async ({ data, rows, cols }) => {
            const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
            const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
            const ctx = canvas.getContext("2d")!; ctx.drawImage(image, 0, 0);
            let inked = 0;
            for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
              const pixels = ctx.getImageData(Math.floor((col + .2) * image.width / cols), Math.floor((row + .2) * image.height / rows), Math.floor(.6 * image.width / cols), Math.floor(.6 * image.height / rows)).data;
              for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 150 && pixels[i + 1] < 150 && pixels[i + 2] < 150) { inked++; break; }
            }
            return inked;
          }, { data: bytes.toString("base64"), rows, cols });
          assert.equal(inkedCells, rows * cols, "PNG has actual letter ink inside every cell, apart from grid borders");
          if (rows === 8 && width === 390) await writeFile(join(output, `${colorScheme}-grid.png`), bytes);
        }
      }
      await page.getByRole("button", { name: "Show Answers", exact: true }).click();
      const answerDownload = page.waitForEvent("download"); await page.getByRole("button", { name: "SVG grid", exact: true }).click();
      assert.ok((await readFile((await (await answerDownload).path())!, "utf8")).includes("<line"));
      assert.deepEqual(await grid.locator(".puzzle-token").allTextContents(), tokens);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      report.cases++;
    }
    assert.deepEqual(errors, []); await context.close();
  }
  // Simulate a rasterization failure; inputs and exact grid must remain recoverable.
  const page = await browser.newPage();
  await page.addInitScript(() => { HTMLCanvasElement.prototype.toBlob = function (callback) { callback(null); }; });
  await page.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  const before = await page.locator(".builder-preview .puzzle-token").allTextContents();
  await page.getByRole("button", { name: "PNG grid", exact: true }).click();
  await page.getByRole("status").filter({ hasText: "PNG export failed" }).waitFor();
  assert.deepEqual(await page.locator(".builder-preview .puzzle-token").allTextContents(), before);
  await page.close();
  const delayed = await browser.newPage();
  await delayed.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      const canvas = this;
      window.setTimeout(() => original.call(canvas, callback, type, quality), 600);
    };
  });
  await delayed.goto(`${base}/word-search-generator`, { waitUntil: "networkidle" });
  let staleDownloads = 0; delayed.on("download", () => { staleDownloads++; });
  await delayed.getByRole("button", { name: "PNG grid", exact: true }).click();
  await delayed.getByRole("button", { name: "Creating PNG…", exact: true }).waitFor();
  await delayed.getByLabel("Puzzle title", { exact: true }).fill("Edited while PNG was being made");
  await delayed.getByRole("button", { name: "PNG grid", exact: true }).waitFor();
  assert.equal(staleDownloads, 0, "An edited request cancels its old async PNG download");
  assert.equal(await delayed.getByLabel("Puzzle title", { exact: true }).inputValue(), "Edited while PNG was being made");
  await delayed.close();
  report.checks.push("18 shape/width/theme cases: exact TXT/SVG cell parity, real bounded PNG with visible letter ink, answer SVG, responsive layout, no runtime errors; rasterization failure retains grid.");
  report.checks.push("Editing the definition during delayed rasterization cancels the stale PNG download.");
} catch (error) { report.failures.push(error instanceof Error ? error.stack ?? error.message : String(error)); process.exitCode = 1; }
finally { await browser.close(); await writeFile(join(output, "report.json"), JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2)); }
