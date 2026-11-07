import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildThirtyTargetChallenge } from "@/lib/content/thirty-target-challenge";
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { allStagedCandidates } from "@/content/staged/catalog";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { inspectPacketAnswerPaths } from "@/tests/helpers/packet-answer-paths";

describe("H08 thirty-target source-only challenge packet", () => {
  test("objectively adds ten targets per sheet within unchanged twenty-square hard bounds", () => {
    const review = buildThirtyTargetChallenge();
    expect(review.pack.puzzles).toHaveLength(5);
    expect(review.baselineTargetCount).toBe(20);
    expect(review.additionalTargetsPerSheet).toBe(10);
    expect(review.targetCountIncreasePercent).toBe(50);
    for (const { puzzle } of review.pack.puzzles) {
      expect(puzzle.placed).toHaveLength(30);
      expect(puzzle.rows).toBe(20);
      expect(puzzle.cols).toBe(20);
      expect(puzzle.request.directions).toHaveLength(8);
      expect(puzzle.excluded).toEqual([]);
      expect(puzzle.warnings).toEqual([]);
      expect(generatePuzzle(puzzle.request).grid).toEqual(puzzle.grid);
      for (const placement of puzzle.placed) expect(placement.cells.map(({ row, col }) => puzzle.grid[row][col])).toEqual(placement.tokens);
    }
    expect(createHash("sha256").update(JSON.stringify(review.pack.puzzles.map(({ id, puzzle }) => ({ id, request: puzzle.request, grid: puzzle.grid, answers: puzzle.placed })))).digest("hex")).toBe("1bdac06008332cd4780b56c5d85bbd358f1d0fae974211d36bac61200b5134fb");
  });

  test("reuses explicitly mapped source terms without cloning indexable candidates or claiming expert certification", () => {
    const review = buildThirtyTargetChallenge();
    expect(allStagedCandidates).toHaveLength(61);
    expect(allStagedCandidates.some(({ id }) => id === "H08")).toBe(false);
    expect(review.newIndexableUrlAllowance).toBe(0);
    expect(review.runtimeImportAllowed).toBe(false);
    expect(review.editorialApproval).toBe(false);
    expect(review.publicationAuthorized).toBe(false);
    for (const [index, sheet] of review.provenance.entries()) {
      expect(sheet.sources).toHaveLength(2);
      const words = sheet.sources.flatMap(source => {
        expect(source.words).toEqual(evergreenHardBatch.find(({ id }) => id === source.id)!.puzzle.words.slice(0, 15));
        return source.words;
      });
      expect(words.join("\n")).toBe(review.pack.puzzles[index].puzzle.request.wordsText);
    }
  });

  test("fails closed if an original source vocabulary changes instead of silently changing the utility packet", () => {
    const words = evergreenHardBatch[0].puzzle.words;
    const original = words[0];
    try {
      words[0] = "POLLEN GRAIN";
      expect(() => buildThirtyTargetChallenge()).toThrow("differs from its frozen vocabulary");
    } finally { words[0] = original; }
  });

  test.each(["letter", "a4"] as const)("fits all thirty targets and actual answer strokes in %s student/teacher packets", async paperSize => {
    const { pack } = buildThirtyTargetChallenge();
    for (const pages of ["students", "answers"] as const) {
      const bytes = await createPuzzlePackPdf(pack, { paperSize, pages, order: "answers-last", layoutProfile: "pack" });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(5);
      expect(bytes.length).toBeLessThan(2_000_000);
      if (pages === "answers") expect(await inspectPacketAnswerPaths(bytes, pack)).toBe(150);
      for (const [index, { puzzle }] of pack.puzzles.entries()) {
        const measurement = await measurePdfBytes(bytes, puzzle, { ...defaultPuzzleOutputOptions, paperSize, qrCode: false, inkSaving: true }, index + 1, pages === "answers");
        expect(measurement.findings).toEqual([]);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
        if (pages === "students") {
          expect(measurement.wordBank).toHaveLength(30);
          expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(9.5);
        }
      }
    }
  });
});
