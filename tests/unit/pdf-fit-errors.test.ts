import { describe, expect, test } from "vitest";
import { createPuzzlePdf, PdfLayoutError } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const puzzle = generatePuzzle({ title: "Fit Check", wordsText: "garden\nflower\nplant", seed: "fit-check", alphabetPack: "latin", difficulty: "easy", rows: 12, cols: 12, autoSize: false, directions: ["E", "S"], allowOverlap: true });
const options = { ...defaultPuzzleOutputOptions, qrCode: false };
const exportPdf = (request: Parameters<typeof generatePuzzle>[0], output = options) => createPuzzlePdf({ puzzle: generatePuzzle(request), options: output, shareUrl: "https://www.ilovewordsearch.com/" });
describe("single-PDF fit errors", () => {
  test("rejects silent instruction truncation and oversized subtitles", async () => {
    await expect(exportPdf({ ...puzzle.request, instructions: "Find each word and explain its meaning. ".repeat(10) })).rejects.toThrow("Instructions are too long");
    await expect(exportPdf({ ...puzzle.request, subtitle: "A".repeat(150) })).rejects.toThrow("subtitle is too long");
  });
  test("rejects beside-bank unbreakable text and colliding multi-character cells", async () => {
    const wide = generatePuzzle({ ...puzzle.request, rows: 30, cols: 30, wordsText: "W".repeat(25) });
    await expect(createPuzzlePdf({ puzzle: wide, options: { ...options, wordBankPlacement: "beside" }, shareUrl: "https://www.ilovewordsearch.com/" })).rejects.toBeInstanceOf(PdfLayoutError);
    const binary = generatePuzzle({ ...puzzle.request, alphabetPack: "binary", wordsText: "cat\ndog" });
    await expect(createPuzzlePdf({ puzzle: binary, options, shareUrl: "https://www.ilovewordsearch.com/" })).rejects.toThrow("multi-character cells");
  });
  test("turning off name/date recovers without changing the puzzle definition", async () => {
    const long = generatePuzzle({ ...puzzle.request, title: "Wide Title ".repeat(5).trim() });
    const before = structuredClone(long);
    await expect(createPuzzlePdf({ puzzle: long, options, shareUrl: "https://www.ilovewordsearch.com/" })).rejects.toThrow("shorter title");
    expect((await createPuzzlePdf({ puzzle: long, options: { ...options, nameDateLine: false }, shareUrl: "https://www.ilovewordsearch.com/" })).length).toBeGreaterThan(1000);
    expect(long).toEqual(before);
  });
  test("uses a meaningful footer instead of a truncated encoded link on measured worksheets", async () => {
    const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/play/private-encoded-definition", layoutProfile: "pack" });
    const task = getDocument({ data: bytes.slice(), useSystemFonts: true });
    const document = await task.promise;
    try {
      const text = (await (await document.getPage(1)).getTextContent()).items.map((item) => "str" in item ? item.str : "").join(" ");
      expect(text).toContain("Recreate with the same words, seed and puzzle settings.");
      expect(text).not.toContain("private-encoded-definition");
    } finally { await task.destroy(); }
  });
});
