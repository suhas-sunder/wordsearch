import { describe, expect, test } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
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
  test("rejects an oversized legacy word bank before returning a broken PDF", async () => {
    const many = generatePuzzle({ ...puzzle.request, title: "Crowded Bank", wordsText: Array.from({ length: 40 }, (_, index) => `VOCABULARY${String(index).padStart(2, "0")}`).join("\n"), rows: 40, cols: 40 });
    await expect(measurePuzzlePdf(many, options)).rejects.toThrow("word bank cannot fit above the footer");
  });
  test("includes a short final line of a wrapped title", async () => {
    const titled = generatePuzzle({ ...puzzle.request, title: "Wrapped Title 01" });
    const document = await PDFDocument.create();
    const font = await document.embedFont(StandardFonts.HelveticaBold);
    const page = document.addPage([612, 792]);
    page.drawText("Wrapped Title", { x: 36, y: 730, size: 18, font });
    page.drawText("01", { x: 36, y: 708, size: 18, font });
    titled.grid.forEach((row, r) => row.forEach((token, c) => page.drawText(token, { x: 40 + c * 25, y: 650 - r * 25, size: 12, font })));
    const result = await measurePdfBytes(await document.save(), titled, options);
    expect(result.titleLines.map((line) => line.text)).toEqual(["Wrapped Title", "01"]);
    expect(result.findings.map((finding) => finding.code)).not.toContain("title-text-clipped");
  });
  test("rejects a long legacy title before it overlaps name and date", async () => {
    const long = generatePuzzle({ ...puzzle.request, title: "A Very Long Descriptive Word Search Worksheet Title For Classroom Use" });
    await expect(measurePuzzlePdf(long, options)).rejects.toThrow("title is too long");
  });
  test("still diagnoses actual title and footer collisions in independently constructed PDFs", async () => {
    const long = generatePuzzle({ ...puzzle.request, title: "A Very Long Descriptive Word Search Worksheet Title For Classroom Use" });
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const page = doc.addPage([612, 792]);
    page.drawText(long.request.title, { x: 36, y: 730, size: 18, font });
    page.drawText("Name", { x: 460, y: 730, size: 8, font });
    long.grid.forEach((row, r) => row.forEach((token, c) => page.drawText(token, { x: 40 + c * 25, y: 650 - r * 25, size: 12, font })));
    long.placed.forEach(({ label }, i) => page.drawText(label, { x: 40 + i * 110, y: 50, size: 9.5, font }));
    page.drawText("Exact seeded word search", { x: 36, y: 50, size: 8, font });
    const result = await measurePdfBytes(await doc.save(), long, options);
    expect(result.findings.map(({ code }) => code)).toContain("title-name-date-overlap");
    expect(result.findings.map(({ code }) => code)).toContain("word-bank-footer-overlap");
    expect(result.unmeasuredWords).toEqual([]);
  });
});
