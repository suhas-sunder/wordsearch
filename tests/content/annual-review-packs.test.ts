import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { annualReviewPacks, annualReviewPackStatus } from "@/content/staged/annual-review-packs";
import { buildAnnualReviewPack } from "@/lib/content/annual-review-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

describe("source-only annual review pack inventory", () => {
  test("keeps annual selections unapproved and avoids duplicate compositions", () => {
    expect(annualReviewPackStatus.runtimeImportAllowed).toBe(false);
    expect(annualReviewPackStatus.createsIndexableVariants).toBe(false);
    expect(annualReviewPacks).toHaveLength(14);
    expect(new Set(annualReviewPacks.map(({ children }) => [...children].sort().join("\n"))).size).toBe(14);
    expect(() => buildAnnualReviewPack("unknown")).toThrow("Unknown");
  });
  test.each(annualReviewPacks)("validates real Letter/A4 student and teacher outputs for $id", async ({ id }) => {
    const pack = buildAnnualReviewPack(id);
    expect(pack.puzzles).toHaveLength(5);
    expect(new Set(pack.puzzles.map(({ puzzle }) => JSON.stringify(puzzle.grid))).size).toBe(5);
    for (const paperSize of ["letter", "a4"] as const) {
      const students = await createPuzzlePackPdf(pack, { paperSize, pages: "students", order: "answers-last", layoutProfile: "pack" });
      const answers = await createPuzzlePackPdf(pack, { paperSize, pages: "answers", order: "answers-last", layoutProfile: "pack" });
      expect((await PDFDocument.load(students)).getPageCount()).toBe(5);
      expect((await PDFDocument.load(answers)).getPageCount()).toBe(5);
      for (const [index, entry] of pack.puzzles.entries()) {
        const measurement = await measurePdfBytes(students, entry.puzzle, { ...defaultPuzzleOutputOptions, paperSize, qrCode: false, inkSaving: true }, index + 1);
        expect(measurement.findings, `${id}:${entry.id}:${paperSize}`).toEqual([]);
        expect(measurement.wordBank).toHaveLength(entry.puzzle.placed.length);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
        expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(9.5);
      }
    }
  }, 60_000);
});
