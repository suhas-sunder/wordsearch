import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { teacherSubjectCandidates, teacherSubjectStatus } from "@/content/staged/teacher-subjects";
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { christmasCandidates } from "@/content/staged/christmas";
import { winterSeasonalCandidates } from "@/content/staged/winter-seasonal";
import { evergreenPilotCandidates } from "@/content/staged/evergreen-pilot";
import { routeInventory } from "@/content/registry";
import { readSourceInventory } from "@/lib/content/inventory";
import { auditCandidates } from "@/lib/content/candidates";
import { validateStaged } from "@/lib/content/staged-validation";
import { buildStagedTeacherPack, teacherDraftPackIds } from "@/lib/content/staged-teacher-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatePuzzle } from "@/lib/puzzle/generate";

describe("unpublished teacher-subject inventory", () => {
  test("keeps distinct, completely placed, deterministically answered candidates source-only", () => {
    expect(teacherSubjectStatus.runtimeImportAllowed).toBe(false);
    const redirects = readSourceInventory().redirects.map(({ source }) => source);
    expect(auditCandidates([...christmasCandidates, ...winterSeasonalCandidates, ...evergreenPilotCandidates, ...evergreenHardBatch, ...teacherSubjectCandidates], routeInventory, redirects)).toEqual([]);
    const validation = validateStaged(teacherSubjectCandidates, redirects);
    expect(validation.issues).toEqual([]);
    expect(validation.freezes).toHaveLength(10);
    expect(validation.freezes.map(({ id, requestSha256, gridSha256, answerSha256 }) => ({ id, requestSha256, gridSha256, answerSha256 }))).toMatchSnapshot();
    for (const { result } of validation.freezes) {
      expect(result.excluded).toEqual([]);
      expect(generatePuzzle(result.request).grid).toEqual(result.grid);
      for (const word of result.placed) expect(word.cells.map(({ row, col }) => result.grid[row][col])).toEqual(word.tokens);
    }
  });
  test.each(teacherDraftPackIds)("measures complete Letter/A4 %s worksheets and answer packet", async (id) => {
    const pack = buildStagedTeacherPack(id);
    expect(new Set(pack.puzzles.map(({ puzzle }) => JSON.stringify(puzzle.grid))).size).toBe(pack.puzzles.length);
    for (const paperSize of ["letter", "a4"] as const) {
      const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", layoutProfile: "pack" });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(pack.puzzles.length * 2);
      for (const [index, entry] of pack.puzzles.entries()) {
        const measurement = await measurePdfBytes(bytes, entry.puzzle, { ...defaultPuzzleOutputOptions, paperSize, qrCode: false, inkSaving: true }, index + 1);
        expect(measurement.findings, `${entry.id}:${paperSize}`).toEqual([]);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
        expect(measurement.wordBank).toHaveLength(entry.puzzle.placed.length);
        expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(9.5);
      }
    }
  }, 60_000);
  test("rejects a pack identity outside the explicit review manifests", () => {
    expect(() => buildStagedTeacherPack("other-pack")).toThrow("Unknown");
  });
});
