import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { evergreenHardBatch, evergreenHardBatchStatus } from "@/content/staged/evergreen-hard-batch";
import { christmasCandidates } from "@/content/staged/christmas";
import { winterSeasonalCandidates } from "@/content/staged/winter-seasonal";
import { evergreenPilotCandidates } from "@/content/staged/evergreen-pilot";
import { routeInventory } from "@/content/registry";
import { readSourceInventory } from "@/lib/content/inventory";
import { auditCandidates } from "@/lib/content/candidates";
import { validateStaged } from "@/lib/content/staged-validation";
import { buildStagedEvergreenPack, evergreenDraftPackIds } from "@/lib/content/staged-evergreen-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatePuzzle } from "@/lib/puzzle/generate";

describe("source-only evergreen hard batch", () => {
  test("validates distinct source inventory, complete placements and frozen answers", () => {
    expect(evergreenHardBatchStatus.runtimeImportAllowed).toBe(false);
    expect(evergreenHardBatchStatus.editorialStatus).toBe("unreviewed");
    const redirects = readSourceInventory().redirects.map(({ source }) => source);
    expect(auditCandidates([...christmasCandidates, ...winterSeasonalCandidates, ...evergreenPilotCandidates, ...evergreenHardBatch], routeInventory, redirects)).toEqual([]);
    const validation = validateStaged(evergreenHardBatch, redirects);
    expect(validation.issues).toEqual([]);
    expect(validation.freezes).toHaveLength(10);
    expect(validation.freezes.map(({ id, requestSha256, gridSha256, answerSha256 }) => ({ id, requestSha256, gridSha256, answerSha256 }))).toMatchSnapshot();
    for (const { result } of validation.freezes) {
      expect(result.excluded).toEqual([]);
      expect(result.placed).toHaveLength(20);
      expect(generatePuzzle(result.request).grid).toEqual(result.grid);
      for (const word of result.placed) expect(word.cells.map(({ row, col }) => result.grid[row][col])).toEqual(word.tokens);
    }
  });

  test.each(evergreenDraftPackIds)("measures real composed %s PDFs on Letter and A4", async (id) => {
    const pack = buildStagedEvergreenPack(id);
    expect(new Set(pack.puzzles.map(({ puzzle }) => JSON.stringify(puzzle.grid))).size).toBe(pack.puzzles.length);
    for (const paperSize of ["letter", "a4"] as const) {
      const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", layoutProfile: "pack" });
      const pdf = await PDFDocument.load(bytes);
      expect(pdf.getPageCount()).toBe(pack.puzzles.length * 2);
      expect(bytes.length).toBeLessThan(2_000_000);
      for (const [index, entry] of pack.puzzles.entries()) {
        const measurement = await measurePdfBytes(bytes, entry.puzzle, { ...defaultPuzzleOutputOptions, paperSize, qrCode: false, inkSaving: true }, index + 1);
        expect(measurement.findings, `${entry.id}:${paperSize}`).toEqual([]);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
        expect(measurement.wordBank).toHaveLength(20);
        expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(9.5);
      }
    }
  }, 60_000);

  test("rejects unknown editorial pack identities", () => {
    expect(() => buildStagedEvergreenPack("../../drafts")).toThrow("Unknown");
  });
});
