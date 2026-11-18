import { createHash } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";
import { measurePdfBytes } from "@/tests/helpers/measure-pdf";

const stressWords = Array.from({ length: 30 }, (_, i) => Array.from({ length: 10 }, (_, j) => j === i % 10 ? String.fromCharCode(66 + Math.floor(i / 10)) : "A").join(""));
const longTitle = "Christmas Classroom Vocabulary Activity";

describe("measured pack PDF layout", () => {
  test("preserves legacy PDF byte fingerprints on Letter and A4", async () => {
    const puzzle = generatePuzzle({ title: "Legacy PDF fingerprint", wordsText: "planet\ncomet\nstar", seed: "legacy-sample", difficulty: "medium", alphabetPack: "latin", autoSize: false, rows: 10, cols: 10, directions: ["E", "S", "SE"], allowOverlap: true, fillerMode: "alphabet" });
    const expected = { letter: "8c014a73d2fede365ef0b514e4d1ba1560d50438a5ed98397b510450c7a5a56e", a4: "6c14f4c39f5b7b77c99b4ec1470f16fd9238707a3d0f14cd1b2cd6dad2f691f1" };
    for (const paperSize of ["letter", "a4"] as const) {
      const bytes = await createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, paperSize, includeAnswerKey: true, qrCode: false }, shareUrl: puzzlePlayUrl(puzzle.request) });
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(expected[paperSize]);
    }
  });
  test.each([[5, 20, "letter", "answers-last"], [10, 30, "a4", "interleaved"], [5, 30, "letter", "interleaved"], [10, 20, "a4", "answers-last"]] as const)("measures %i sheets with %i long labels on %s", async (count, wordCount, paperSize, order) => {
    const pack = buildClassroomPack({ title: longTitle, wordsText: stressWords.slice(0, wordCount).join("\n"), seed: "s0", count });
    const bytes = await createPuzzlePackPdf(pack, { paperSize, order, layoutProfile: "pack" });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(count * 2);
    const options = { ...defaultPuzzleOutputOptions, paperSize, orientation: "portrait" as const, qrCode: false, inkSaving: true, includeAnswerKey: true };
    const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
    const renderedTask = getDocument({ data: bytes.slice(), standardFontDataUrl });
    const rendered = await renderedTask.promise;
    for (let i = 0; i < count; i++) {
      const page = order === "interleaved" ? i * 2 + 1 : i + 1;
      const measurement = await measurePdfBytes(bytes, pack.puzzles[i].puzzle, options, page);
      expect(measurement.findings).toEqual([]);
      expect(measurement.titleLines.length).toBeGreaterThan(1);
      const studentPage = await rendered.getPage(page);
      const studentText = await studentPage.getTextContent();
      const labels = studentText.items.filter((item) => "str" in item && (item.str === "Name" || item.str === "Date"));
      expect(labels).toHaveLength(2);
      for (const line of measurement.titleLines) for (const label of labels) {
        if ("transform" in label) expect(line.x + line.width).toBeLessThan(label.transform[4] - 10);
      }
      expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
      expect(measurement.wordBank.length).toBe(wordCount);
      expect(Math.min(...measurement.wordBank.map((box) => box.fontPt))).toBeGreaterThanOrEqual(9.5);
      expect(Math.min(...measurement.wordBank.map((box) => box.y))).toBeGreaterThan(65);
      const answerPage = order === "interleaved" ? i * 2 + 2 : count + i + 1;
      const singleBytes = await createPuzzlePdf({ puzzle: pack.puzzles[i].puzzle, options, shareUrl: puzzlePlayUrl(pack.puzzles[i].puzzle.request), layoutProfile: "pack" });
      const singleTask = getDocument({ data: singleBytes.slice(), standardFontDataUrl });
      const single = await singleTask.promise;
      const actualAnswer = await rendered.getPage(answerPage);
      const expectedAnswer = await single.getPage(2);
      const actualText = await actualAnswer.getTextContent();
      const expectedText = await expectedAnswer.getTextContent();
      const titleLines = actualText.items.filter((item) => "str" in item && "transform" in item && item.str.trim() && item.transform[3] === 18);
      const titleText = titleLines.map((item) => "str" in item ? item.str.trim() : "").join(" ");
      expect(titleText).toBe(`${pack.puzzles[i].puzzle.request.title} - Answer Key`);
      for (const item of titleLines) if ("transform" in item) {
        expect(item.transform[4]).toBeGreaterThanOrEqual(36);
        expect(item.transform[4] + item.width).toBeLessThanOrEqual(doc.getPage(answerPage - 1).getWidth() - 36);
      }
      expect(actualText.items.some((item) => "str" in item && (item.str === "Name" || item.str === "Date"))).toBe(false);
      const answerGrid = actualText.items.filter((item) => "str" in item && "transform" in item && /^[A-Z]$/.test(item.str));
      expect(answerGrid).toHaveLength(pack.puzzles[i].puzzle.rows * pack.puzzles[i].puzzle.cols);
      const gridTop = Math.max(...answerGrid.map((item) => "transform" in item ? item.transform[5] + item.height : 0));
      expect(Math.min(...titleLines.map((item) => "transform" in item ? item.transform[5] : Infinity))).toBeGreaterThan(gridTop);
      const textGeometry = (items: typeof actualText.items) => items.map((item) => "str" in item ? { str: item.str, transform: item.transform, width: item.width, height: item.height } : item);
      expect(textGeometry(actualText.items)).toEqual(textGeometry(expectedText.items));
      const actualOps = await actualAnswer.getOperatorList();
      const expectedOps = await expectedAnswer.getOperatorList();
      expect(actualOps.argsArray.filter((_, index) => actualOps.fnArray[index] === OPS.constructPath)).toEqual(expectedOps.argsArray.filter((_, index) => expectedOps.fnArray[index] === OPS.constructPath));
      await singleTask.destroy();
    }
    await renderedTask.destroy();
  }, 60000);
  test("fails closed when an unbreakable title cannot fit", async () => {
    const pack = buildClassroomPack({ title: "W".repeat(70), wordsText: "planet\ncomet", seed: "s0", count: 5 });
    await expect(createPuzzlePackPdf(pack, { paperSize: "letter", order: "answers-last", layoutProfile: "pack" })).rejects.toThrow("title");
  });
  test("rejects dense layouts rather than shrinking the grid below 9 points", async () => {
    const words = Array.from({ length: 30 }, (_, i) => Array.from({ length: 19 }, (_, j) => j === i % 19 ? String.fromCharCode(66 + Math.floor(i / 19)) : "W").join("")).join("\n");
    const puzzle = generatePuzzle({ title: "Long Words For Classroom Vocabulary Print Activities With Many Assignment Details", wordsText: words, seed: "s0", difficulty: "medium", alphabetPack: "latin", autoSize: false, rows: 20, cols: 20, directions: ["E", "S", "SE", "NE"], allowOverlap: true, fillerMode: "alphabet" });
    await expect(createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, includeAnswerKey: true, qrCode: false, inkSaving: true }, shareUrl: puzzlePlayUrl(puzzle.request), layoutProfile: "pack" })).rejects.toThrow("minimum 9-point");
  });
});
