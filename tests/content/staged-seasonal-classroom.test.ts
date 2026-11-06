import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { routeInventory } from "@/content/registry";
import { christmasCandidates } from "@/content/staged/christmas";
import { seasonalClassroomCandidates, seasonalClassroomStatus } from "@/content/staged/seasonal-classroom";
import { seasonalDraftPacks } from "@/content/staged/seasonal-packs";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";
import { validateStaged } from "@/lib/content/staged-validation";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { buildStagedSeasonalPack } from "@/lib/content/staged-seasonal-pack";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { pdfPageSpec } from "@/lib/puzzle/output-options";

const candidates = [...christmasCandidates, ...seasonalClassroomCandidates];
const redirects = readSourceInventory().redirects.map(({ source }) => source);

describe("unpublished seasonal classroom inventory", () => {
  test("keeps all new activity assets outside runtime routes and checks cross-batch collisions", () => {
    expect(seasonalClassroomStatus.runtimeImportAllowed).toBe(false);
    expect(seasonalClassroomStatus.humanEditorialApprovalRequired).toBe(true);
    expect(seasonalClassroomCandidates).toHaveLength(16);
    expect(auditCandidates(candidates, routeInventory, redirects)).toEqual([]);
    expect(validateStaged(seasonalClassroomCandidates, redirects).issues).toEqual([]);
    for (const candidate of seasonalClassroomCandidates) {
      expect(candidate.status).toBe("drafted");
      expect(routeInventory.some((record) => record.canonicalPath === candidate.proposedPath)).toBe(false);
      expect(Object.hasOwn(candidate, "approval")).toBe(false);
    }
  });

  test("freezes request, grid and ordered answer fingerprints for review", () => {
    const validation = validateStaged(seasonalClassroomCandidates, redirects);
    expect(validation.freezes.map(({ id, requestSha256, gridSha256, answerSha256 }) => ({ id, requestSha256, gridSha256, answerSha256 }))).toMatchSnapshot();
    for (const { result } of validation.freezes) {
      expect(result.excluded).toEqual([]);
      expect(result.grid).toEqual(generatePuzzle(result.request).grid);
      for (const word of result.placed) expect(word.cells.map(({ row, col }) => result.grid[row][col])).toEqual(word.tokens);
    }
  });

  test.each(seasonalDraftPacks)("exports $id with complete distinct puzzles and paired Letter/A4 answers", async (manifest) => {
    const pack = buildStagedSeasonalPack(manifest.id);
    expect(new Set(pack.puzzles.map(({ puzzle }) => JSON.stringify(puzzle.grid))).size).toBe(manifest.children.length);
    for (const paperSize of ["letter", "a4"] as const) {
      for (const order of ["answers-last", "interleaved"] as const) {
        const bytes = await createPuzzlePackPdf(pack, { paperSize, order });
        const pdf = await PDFDocument.load(bytes);
        expect(pdf.getPageCount()).toBe(manifest.children.length * 2);
        for (const page of pdf.getPages()) {
          expect(page.getWidth()).toBeCloseTo(pdfPageSpec(paperSize, "portrait").width);
          expect(page.getHeight()).toBeCloseTo(pdfPageSpec(paperSize, "portrait").height);
        }
        expect(bytes.length).toBeLessThan(2_000_000);
      }
    }
  }, 60_000);
});
