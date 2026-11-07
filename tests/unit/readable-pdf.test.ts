import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import legacy from "../fixtures/legacy-small-landscape.json";
import { routeInventory } from "@/content/registry";
import { createBrowserPuzzlePdf, readablePdfOptions } from "@/lib/pdf/browser-download";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions, type PaperSize, type PrintScale } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

function publishedPuzzle(path: string) {
  const record = routeInventory.find(record => record.canonicalPath === path);
  if (!record || record.contentType !== "puzzle") throw new Error(`Missing frozen source: ${path}`);
  const p = record.puzzle;
  return generatePuzzle({ title: p.puzzleTitle, wordsText: p.words.join("\n"), seed: p.seed, rows: p.rows, cols: p.columns, autoSize: !p.rows || !p.columns, directions: p.directions, allowOverlap: p.allowOverlap, alphabetPack: p.alphabetPack, difficulty: p.difficulty });
}

const subjects = [...new Set(legacy.cases.map(({ path }) => path))];
const readableCases = subjects.flatMap(path => (["letter", "a4"] as const).map(paperSize => ({ path, paperSize })));

describe("opt-in measured readable PDFs", () => {
  test("maps all48 frozen landscape variants to32 paper-specific alternatives", () => {
    expect(legacy.cases).toHaveLength(48);
    expect(subjects).toHaveLength(16);
    expect(readableCases).toHaveLength(32);
    expect(legacy.cases.every(record => record.orientation === "landscape" && record.minGridPt < 9)).toBe(true);
  });

  test.each(readableCases)("measures $paperSize student/teacher output for $path", async ({ path, paperSize }) => {
    const puzzle = publishedPuzzle(path);
    const before = JSON.stringify(puzzle);
    const options = { ...defaultPuzzleOutputOptions, paperSize, orientation: "landscape" as const, printScale: "large" as const, coordinates: true, qrCode: true, includeAnswerKey: true };
    const savedChoices = structuredClone(options);
    const result = await createBrowserPuzzlePdf(puzzle, options, puzzlePlayUrl(puzzle.request), "readable");
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    const adjusted = readablePdfOptions(options);
    const student = await measurePdfBytes(bytes, puzzle, adjusted);
    const answer = await measurePdfBytes(bytes, puzzle, adjusted, 2, true);
    expect(student.grid.minFontPt).toBeGreaterThanOrEqual(9);
    expect(answer.grid.minFontPt).toBeGreaterThanOrEqual(9);
    expect(student.wordBank).toHaveLength(puzzle.placed.length);
    expect(student.wordBank.every(word => word.fontPt === 9.5)).toBe(true);
    expect(student.findings).toEqual([]);
    expect(answer.findings).toEqual([]);
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBe(2);
    expect(document.getPage(0).getWidth()).toBeLessThan(document.getPage(0).getHeight());
    expect(result.filename).toMatch(/-readable\.pdf$/);
    expect(options).toEqual(savedChoices);
    expect(JSON.stringify(puzzle)).toBe(before);
  });

  test.each(legacy.cases)("retains legacy $paperSize/$printScale bytes for $path", async fixture => {
    const puzzle = publishedPuzzle(fixture.path);
    const options = { ...defaultPuzzleOutputOptions, paperSize: fixture.paperSize as PaperSize, printScale: fixture.printScale as PrintScale, orientation: "landscape" as const, qrCode: true, includeAnswerKey: true };
    const result = await createBrowserPuzzlePdf(puzzle, options, puzzlePlayUrl(puzzle.request));
    expect(createHash("sha256").update(new Uint8Array(await result.blob.arrayBuffer())).digest("hex")).toBe(fixture.pdfSha256);
  });

  test("keeps requested paper, answer and presentation flags without mutating ordinary choices", async () => {
    const options = { ...defaultPuzzleOutputOptions, paperSize: "a4" as const, includeAnswerKey: false, nameDateLine: false, instructions: false, inkSaving: true, letterCase: "lowercase" as const, orientation: "landscape" as const, coordinates: true, qrCode: true };
    expect(readablePdfOptions(options)).toEqual({ ...options, orientation: "portrait", printScale: "standard", wordBankPlacement: "below", qrCode: false, coordinates: false });
    const puzzle = generatePuzzle({ title: "Readable choices", wordsText: "CAT\nDOG", seed: "readable-options", rows: 8, cols: 8, autoSize: false, directions: ["E"] });
    const result = await createBrowserPuzzlePdf(puzzle, options, puzzlePlayUrl(puzzle.request), "readable");
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(1);
    expect((await measurePdfBytes(bytes, puzzle, readablePdfOptions(options))).findings).toEqual([]);
  });

  test("rejects oversized grids and overlong clue banks rather than shrinking below the contract", async () => {
    const crowded = generatePuzzle({ title: "Crowded readable", wordsText: "CAT\nDOG", seed: "readable-too-dense", rows: 40, cols: 40, autoSize: false, directions: ["E"] });
    await expect(createBrowserPuzzlePdf(crowded, defaultPuzzleOutputOptions, puzzlePlayUrl(crowded.request), "readable")).rejects.toThrow(/minimum 9-point/);
    const clues = generatePuzzle({ title: "Long clues", wordsText: ["CAT", "DOG", "COW", "HEN", "ANT", "BEE", "FLY", "FOX", "OWL", "PIG"].map(word => `${word} | ${"A long clue ".repeat(40)}`).join("\n"), seed: "readable-clue-fit", rows: 12, cols: 12, autoSize: false, directions: ["E"], wordBankMode: "clues" });
    await expect(createBrowserPuzzlePdf(clues, defaultPuzzleOutputOptions, puzzlePlayUrl(clues.request), "readable")).rejects.toThrow(/room|fit/);
  });

  test("explains the unsupported multi-character cell limit before exporting", async () => {
    const puzzle = generatePuzzle({ title: "Morse readable limit", wordsText: "CAT\nDOG", seed: "readable-morse", rows: 8, cols: 8, autoSize: false, directions: ["E"], alphabetPack: "morse" });
    await expect(createBrowserPuzzlePdf(puzzle, defaultPuzzleOutputOptions, puzzlePlayUrl(puzzle.request), "readable")).rejects.toThrow(/one character per grid cell/);
  });
});
