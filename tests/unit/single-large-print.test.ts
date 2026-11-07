import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { createBrowserPuzzlePdf, downloadBrowserPuzzlePdf, measuredLargePrintOptions } from "@/lib/pdf/browser-download";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

const puzzle = generatePuzzle({ title: "Single large print", wordsText: "CAT\nDOG\nBIRD", seed: "single-large-print", rows: 8, cols: 12, autoSize: false, directions: ["E"], instructions: "Find the listed words." });
const target = puzzlePlayUrl(puzzle.request);

describe("explicit single measured large-print download", () => {
  test.each(["letter", "a4"] as const)("measures the actual %s file without altering puzzle or saved choices", async paperSize => {
    const options = { ...defaultPuzzleOutputOptions, paperSize, orientation: "landscape" as const, wordBankPlacement: "beside" as const, includeAnswerKey: true, coordinates: true };
    const unchanged = structuredClone(options), grid = structuredClone(puzzle.grid);
    const result = await createBrowserPuzzlePdf(puzzle, options, target, "large-print");
    expect(result.filename).toBe("single-large-print-word-search-large-print.pdf");
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    const measured = await measurePdfBytes(bytes, puzzle, measuredLargePrintOptions(options));
    expect(measured.grid.minFontPt).toBeGreaterThanOrEqual(16);
    expect(measured.wordBank).toHaveLength(puzzle.placed.length);
    expect(measured.wordBank.every(word => word.fontPt === 18)).toBe(true);
    expect(measured.findings).toEqual([]);
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBe(2);
    expect(document.getPage(0).getWidth()).toBeLessThan(document.getPage(0).getHeight());
    expect(options).toEqual(unchanged);
    expect(puzzle.grid).toEqual(grid);
  });

  test("preserves the legacy wrapper bytes by default", async () => {
    const options = { ...defaultPuzzleOutputOptions, qrCode: false, printScale: "large" as const };
    const existing = await createPuzzlePdf({ puzzle, options, shareUrl: target });
    const ordinary = await createBrowserPuzzlePdf(puzzle, options, target);
    expect(new Uint8Array(await ordinary.blob.arrayBuffer())).toEqual(existing);
    expect(ordinary.filename).toBe("single-large-print-word-search.pdf");
  });

  test("rejects a crowded exact grid instead of silently shrinking it", async () => {
    const crowded = generatePuzzle({ ...puzzle.request, rows: 40, cols: 40 });
    await expect(createBrowserPuzzlePdf(crowded, defaultPuzzleOutputOptions, puzzlePlayUrl(crowded.request), "large-print")).rejects.toThrow(/16-point/);
  });

  test("does not enter the browser download path for a canceled async job", async () => {
    await expect(downloadBrowserPuzzlePdf(puzzle, defaultPuzzleOutputOptions, target, "large-print", () => false)).resolves.toBe(false);
  });
});
