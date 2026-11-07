import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { calendarGapCandidates, calendarGapStatus } from "@/content/staged/calendar-gap-candidates";
import { preservedGrowthEnhancements } from "@/content/staged/preserved-growth-enhancements";
import { christmasCandidates } from "@/content/staged/christmas";
import { winterSeasonalCandidates } from "@/content/staged/winter-seasonal";
import { evergreenPilotCandidates } from "@/content/staged/evergreen-pilot";
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { teacherSubjectCandidates } from "@/content/staged/teacher-subjects";
import { routeInventory } from "@/content/registry";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";
import { validateStaged } from "@/lib/content/staged-validation";
import { generateCalendarReviewAsset } from "@/lib/content/calendar-review-assets";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatePuzzle } from "@/lib/puzzle/generate";

describe("calendar gap inventory remains an editorial draft", () => {
  test("collision-checks every new topic against the published and staged siblings", () => {
    expect(calendarGapStatus.runtimeImportAllowed).toBe(false);
    expect(calendarGapCandidates).toHaveLength(15);
    const redirects = readSourceInventory().redirects.map(({ source }) => source);
    expect(auditCandidates([...christmasCandidates, ...winterSeasonalCandidates, ...evergreenPilotCandidates, ...evergreenHardBatch, ...seasonalClassroomCandidates, ...teacherSubjectCandidates, ...calendarGapCandidates], routeInventory, redirects)).toEqual([]);
    expect(validateStaged(calendarGapCandidates, redirects).issues).toEqual([]);
    for (const candidate of calendarGapCandidates) {
      expect(candidate.proposedPath).not.toContain("2027");
      expect(Object.hasOwn(candidate, "approval")).toBe(false);
    }
  });
  test("preserves owner parks/landmarks work as existing-canonical enhancements without inferred review", () => {
    for (const record of preservedGrowthEnhancements) {
      const target = routeInventory.find((target) => target.canonicalPath === record.targetCanonicalPath);
      expect(target?.contentType).toBe("puzzle");
      expect(target?.publicationStatus).toBe("draft");
      expect(record.newIndexableUrlAllowance).toBe(0);
      expect(record.editorialStatus).toBe("unreviewed");
      expect(record.originalReviewDateIgnored).toBe(true);
      expect(record.sourceFileSha256).toBe("b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c");
    }
  });
  test("freezes complete requests, grids and answer cells for all seventeen review assets", () => {
    const results = [...calendarGapCandidates, ...preservedGrowthEnhancements].map(({ id }) => ({ id, result: generateCalendarReviewAsset(id) }));
    expect(results.map(({ id, result }) => ({ id, hash: createHash("sha256").update(JSON.stringify({ request: result.request, grid: result.grid, answers: result.placed })).digest("hex") }))).toMatchSnapshot();
    for (const { result } of results) {
      expect(result.grid).toEqual(generatePuzzle(result.request).grid);
      for (const word of result.placed) expect(word.cells.map(({ row, col }) => result.grid[row][col])).toEqual(word.tokens);
    }
  });
  test("measures actual Letter/A4 puzzle and answer PDFs for every asset", async () => {
    for (const { id } of [...calendarGapCandidates, ...preservedGrowthEnhancements]) {
      const puzzle = generateCalendarReviewAsset(id);
      for (const paperSize of ["letter", "a4"] as const) {
        const options = { ...defaultPuzzleOutputOptions, paperSize, includeAnswerKey: true, qrCode: false, inkSaving: true };
        const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/", layoutProfile: "pack" });
        expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2);
        const measurement = await measurePdfBytes(bytes, puzzle, options);
        expect(measurement.findings, `${id}:${paperSize}`).toEqual([]);
        expect(measurement.wordBank).toHaveLength(puzzle.placed.length);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
        expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(9.5);
      }
    }
  }, 60_000);
});
