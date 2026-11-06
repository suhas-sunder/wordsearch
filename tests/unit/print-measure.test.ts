import { describe, expect, test } from "vitest";
import { measurePdfBytes, measurePuzzlePdf } from "@/lib/pdf/measure-pdf";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

const puzzle = generatePuzzle({ title: "Print Test", wordsText: "snow\nfrost\ncoat\nscarf", seed: "measure-test", rows: 12, cols: 12, autoSize: false, directions: ["E", "S"], allowOverlap: true, alphabetPack: "latin", difficulty: "easy" });
const options = { ...defaultPuzzleOutputOptions, qrCode: false, includeAnswerKey: true };

describe("rendered PDF measurements", () => {
  test("measures actual Letter and A4 page, grid and word bank in standard and large print", async () => {
    for (const paperSize of ["letter", "a4"] as const) {
      const standard = await measurePuzzlePdf(puzzle, { ...options, paperSize, printScale: "standard" });
      const large = await measurePuzzlePdf(puzzle, { ...options, paperSize, printScale: "large" });
      expect(standard.page.widthPt).toBeCloseTo(paperSize === "letter" ? 612 : 595.28, 1);
      expect(standard.grid.rows).toBe(12);
      expect(standard.grid.cellWidthPt).toBeGreaterThan(0);
      expect(standard.unmeasuredWords).toEqual([]);
      expect(standard.wordBank[0].fontPt).toBeCloseTo(9.5, 1);
      expect(large.wordBank[0].fontPt).toBeCloseTo(11.5, 1);
      expect(large.grid.minFontPt).toBeGreaterThan(standard.grid.minFontPt);
    }
  });
  test("inspects an explicitly selected page in composed PDF bytes", async () => {
    const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/" });
    const answer = await measurePdfBytes(bytes, puzzle, options, 2);
    expect(answer.grid.rows).toBe(puzzle.rows);
    expect(answer.grid.columns).toBe(puzzle.cols);
    expect(answer.unmeasuredWords).toHaveLength(puzzle.placed.length);
  });
  test("reconstructs wrapped word-bank labels on an actual PDF", async () => {
    const beside = generatePuzzle({ ...puzzle.request, title: "Wrapped Bank", wordsText: "EXTRAORDINARY CLASSROOM\nWINTER ACTIVITIES\nSNOW", rows: 30, cols: 30 });
    const result = await measurePuzzlePdf(beside, { ...options, wordBankPlacement: "beside" });
    expect(result.unmeasuredWords).toEqual([]);
    expect(result.wordBank.length).toBeGreaterThan(beside.placed.length);
  });
  test("prefers exact word-bank labels over shorter prefixes", async () => {
    const similar = generatePuzzle({ ...puzzle.request, title: "Biology Test", wordsText: "ORGANISM\nORGAN\nCELL" });
    const result = await measurePuzzlePdf(similar, options);
    expect(result.unmeasuredWords).toEqual([]);
  });
  test("reports overflow or footer collision for an oversized word bank", async () => {
    const many = generatePuzzle({ ...puzzle.request, title: "Crowded Bank", wordsText: Array.from({ length: 40 }, (_, index) => `VOCABULARY${String(index).padStart(2, "0")}`).join("\n"), rows: 40, cols: 40 });
    const result = await measurePuzzlePdf(many, options);
    expect(result.findings.some((finding) => ["outside-page", "word-bank-footer-overlap", "words-not-measured"].includes(finding.code))).toBe(true);
  });
  test("detects a long title colliding with name and date", async () => {
    const long = generatePuzzle({ ...puzzle.request, title: "A Very Long Descriptive Word Search Worksheet Title For Classroom Use" });
    const result = await measurePuzzlePdf(long, options);
    expect(result.findings.map((finding) => finding.code)).toContain("title-name-date-overlap");
  });
});
