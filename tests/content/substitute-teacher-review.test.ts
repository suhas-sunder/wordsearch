import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildSubstituteTeacherReview } from "@/lib/content/substitute-teacher-review";
import { buildStagedTeacherPack } from "@/lib/content/staged-teacher-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { allStagedCandidates } from "@/content/staged/catalog";
import { collections } from "@/content/collections";
import { getSitemapRecords } from "@/content/registry";
import { inspectPacketAnswerPaths } from "@/tests/helpers/packet-answer-paths";

describe("T12 source-only substitute folder curation", () => {
  test("resolves every selection to the exact original packet without new grids or candidates", () => {
    const review = buildSubstituteTeacherReview();
    expect(review.pack).toEqual(buildStagedTeacherPack("math-science-history-5"));
    expect(review.worksheets.map(({ sourceId }) => sourceId)).toEqual(["T08-A", "T08-B", "T09-A", "T09-B", "T10-A"]);
    for (const [index, worksheet] of review.worksheets.entries()) {
      expect(worksheet.words.join("\n")).toBe(review.pack.puzzles[index].puzzle.request.wordsText);
      expect(worksheet.seed).toBe(review.pack.puzzles[index].puzzle.request.seed);
      expect(worksheet.selectionNote.length).toBeGreaterThan(60);
    }
    expect(allStagedCandidates).toHaveLength(61);
    expect(allStagedCandidates.some(({ id }) => id === "T12")).toBe(false);
  });

  test("retains unresolved source/audience/reuse/publication gates and the existing draft collection", () => {
    const review = buildSubstituteTeacherReview();
    expect(review.runtimeImportAllowed).toBe(false);
    expect(review.runtimeActivation).toBe(false);
    expect(review.publicationAuthorized).toBe(false);
    expect(review.newIndexableUrlAllowance).toBe(0);
    expect(review.audienceSuitabilityApproved).toBe(false);
    expect(review.worksheetReuseApproved).toBe(false);
    expect(review.collectionEditorialApproved).toBe(false);
    expect(review.ownerPublicationApproved).toBe(false);
    expect(review.blockingReasons).toHaveLength(3);
    expect(collections.find(({ slug }) => slug === "substitute-teacher-word-searches")?.relatedTopics).toEqual([]);
    expect(getSitemapRecords().some(({ canonicalPath }) => canonicalPath === review.existingDraftPath)).toBe(false);
  });

  test.each(["letter", "a4"] as const)("renders real %s separate student and teacher packets with unchanged grids", async paperSize => {
    const { pack } = buildSubstituteTeacherReview();
    for (const pages of ["students", "answers"] as const) {
      const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", layoutProfile: "pack", pages });
      expect((await PDFDocument.load(bytes)).getPageCount()).toBe(5);
      if (pages === "answers") expect(await inspectPacketAnswerPaths(bytes, pack)).toBe(pack.puzzles.reduce((count, { puzzle }) => count + puzzle.placed.length, 0));
      for (const [index, { puzzle }] of pack.puzzles.entries()) {
        const measurement = await measurePdfBytes(bytes, puzzle, { ...defaultPuzzleOutputOptions, paperSize, qrCode: false, inkSaving: true }, index + 1, pages === "answers");
        expect(measurement.findings).toEqual([]);
        expect(measurement.grid.rows).toBe(puzzle.rows);
        expect(measurement.grid.columns).toBe(puzzle.cols);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
        if (pages === "students") {
          expect(measurement.wordBank).toHaveLength(puzzle.placed.length);
          expect(Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt))).toBeGreaterThanOrEqual(9.5);
        }
      }
    }
  });
});
