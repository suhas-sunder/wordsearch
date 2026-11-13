import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { largePrintDraftSelections, largePrintDraftPackSelections, largePrintSelectionStatus } from "@/content/staged/large-print-selections";
import { routeInventory } from "@/content/registry";
import { buildStagedLargePrintPack, generateLargePrintDraft } from "@/lib/content/staged-large-print-pack";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatePuzzle } from "@/lib/puzzle/generate";

describe("source-only larger-type utility selections", () => {
  test("provides L01–L16 as output assets without sixteen indexed variants", () => {
    expect(largePrintSelectionStatus.createsIndexableVariants).toBe(false);
    expect(largePrintSelectionStatus.runtimeImportAllowed).toBe(false);
    expect(largePrintDraftSelections.map(({ id }) => id)).toEqual(Array.from({ length: 16 }, (_, i) => `L${String(i + 1).padStart(2, "0")}`));
    expect(routeInventory.filter((record) => record.contentType === "puzzle" && record.publicationStatus === "published" && record.indexable)).toHaveLength(150);
    for (const selection of largePrintDraftSelections) {
      expect(Object.hasOwn(selection, "proposedPath")).toBe(false);
      expect(Object.hasOwn(selection, "approval")).toBe(false);
      expect(selection.puzzle.words).toHaveLength(12);
    }
    const results = largePrintDraftSelections.map(({ id }) => generateLargePrintDraft(id));
    expect(new Set(results.map(({ grid }) => JSON.stringify(grid))).size).toBe(16);
    for (const result of results) {
      expect(generatePuzzle(result.request).grid).toEqual(result.grid);
      for (const word of result.placed) expect(word.cells.map(({ row, col }) => result.grid[row][col])).toEqual(word.tokens);
    }
    expect(results.map((result, i) => ({ id: largePrintDraftSelections[i].id, fingerprint: createHash("sha256").update(JSON.stringify({ request: result.request, grid: result.grid, answers: result.placed })).digest("hex") }))).toMatchSnapshot();
  });

  test("measures every L01–L16 Letter/A4 grid and word bank", async () => {
    for (const { id } of largePrintDraftSelections) {
      const puzzle = generateLargePrintDraft(id);
      for (const paperSize of ["letter", "a4"] as const) {
        const options = { ...defaultPuzzleOutputOptions, paperSize, printScale: "large" as const, includeAnswerKey: true, qrCode: false, inkSaving: true };
        const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/", layoutProfile: "large-print" });
        expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2);
        const measurement = await measurePdfBytes(bytes, puzzle, options);
        expect(measurement.findings, `${id}:${paperSize}`).toEqual([]);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(16);
        expect(measurement.wordBank).toHaveLength(12);
        expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(18);
      }
    }
  }, 60_000);

  test.each(largePrintDraftPackSelections)("exports separate student/teacher pages for $id", async ({ id, children }) => {
    const pack = buildStagedLargePrintPack(id);
    for (const paperSize of ["letter", "a4"] as const) for (const pages of ["students", "answers"] as const) {
      const bytes = await createPuzzlePackPdf(pack, { paperSize, pages, order: "answers-last", layoutProfile: "large-print" });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(children.length);
    }
  }, 60_000);
});
