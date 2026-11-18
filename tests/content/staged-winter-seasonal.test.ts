import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import { routeInventory } from "@/content/registry";
import type { PuzzleContentRecord } from "@/content/model";
import { winterSeasonalCandidates, winterSeasonalStatus } from "@/content/staged/winter-seasonal";
import { readSourceInventory } from "@/lib/content/inventory";
import { validateStaged } from "@/lib/content/staged-validation";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions, pdfPageSpec } from "@/lib/puzzle/output-options";

const publishedPuzzleCount = routeInventory.filter(
  (record): record is PuzzleContentRecord => record.contentType === "puzzle" && record.publicationStatus === "published" && record.indexable
).length;

function generate(candidate: (typeof winterSeasonalCandidates)[number]) {
  const { puzzle } = candidate;
  return generatePuzzle({
    title: puzzle.puzzleTitle,
    wordsText: puzzle.words.join("\n"),
    seed: puzzle.seed,
    difficulty: puzzle.difficulty,
    alphabetPack: puzzle.alphabetPack,
    rows: puzzle.rows,
    cols: puzzle.columns,
    autoSize: false,
    directions: puzzle.directions,
    allowOverlap: puzzle.allowOverlap,
    fillerMode: "alphabet"
  });
}

describe("staged X12/X13 winter candidates", () => {
  test("keeps the seasonal candidates source-only and correctly keyed", () => {
    expect(winterSeasonalCandidates.map(({ id }) => id)).toEqual(["X12-01", "X13-01"]);
    expect(winterSeasonalStatus).toEqual({
      publicationStatus: "draft",
      editorialStatus: "unreviewed",
      runtimeImportAllowed: false,
      humanEditorialApprovalRequired: true
    });
    expect(publishedPuzzleCount).toBe(150);

    for (const candidate of winterSeasonalCandidates) {
      expect(candidate.status).toBe("drafted");
      expect(candidate.puzzle.difficulty).toBe("hard");
      expect(candidate.puzzle.rows).toBe(18);
      expect(candidate.puzzle.columns).toBe(18);
      expect(candidate.puzzle.words).toHaveLength(20);
      expect(candidate.puzzle.directions).toEqual(["E", "W", "S", "N", "SE", "SW", "NE", "NW"]);
      expect(new Set(candidate.puzzle.words.map((word) => word.replace(/[^a-z0-9]/gi, "").toLowerCase())).size).toBe(20);
      expect(candidate.puzzle.words.every((word) => /^[A-Z]+(?: [A-Z]+)*$/.test(word))).toBe(true);
      expect(candidate.sourceReferences.length).toBeGreaterThan(0);
      expect(candidate.sourceReferences.every(({ url }) => /^https:\/\//.test(url))).toBe(true);
      expect(Object.hasOwn(candidate, "approval")).toBe(false);
    }

    expect(winterSeasonalCandidates[0].proposedPath).toBe("/word-searches/sports/snow-and-ice-sports-word-search");
    expect(winterSeasonalCandidates[1].proposedPath).toBe("/word-searches/animals/winter-animal-adaptations-word-search");
    expect(routeInventory.some(({ canonicalPath }) => winterSeasonalCandidates.some(({ proposedPath }) => canonicalPath === proposedPath))).toBe(false);
  });

  test("passes route, normalized-token, inventory and placement validation", () => {
    const redirects = readSourceInventory().redirects.map(({ source }) => source);
    const result = validateStaged(winterSeasonalCandidates, redirects);
    expect(result.issues).toEqual([]);
    expect(result.freezes.map(({ id }) => id)).toEqual(["X12-01", "X13-01"]);
    expect(result.freezes.every(({ rows, columns }) => rows === 18 && columns === 18)).toBe(true);
  });

  test("repeats complete placements and produces Letter/A4 two-page PDFs", async () => {
    for (const candidate of winterSeasonalCandidates) {
      const first = generate(candidate);
      const second = generate(candidate);
      expect(first.excluded, candidate.id).toEqual([]);
      expect(first.placed, candidate.id).toHaveLength(20);
      expect(first.grid, candidate.id).toEqual(second.grid);
      expect(first.placed, candidate.id).toEqual(second.placed);

      for (const placement of first.placed) {
        expect(placement.cells.map(({ row, col }) => first.grid[row]?.[col]).join(""), `${candidate.id}:${placement.label}`).toBe(placement.tokens.join(""));
      }

      for (const paperSize of ["letter", "a4"] as const) {
        const bytes = await createPuzzlePdf({
          puzzle: first,
          options: { ...defaultPuzzleOutputOptions, paperSize, orientation: "portrait", includeAnswerKey: true, qrCode: false },
          shareUrl: "https://www.ilovewordsearch.com/"
        });
        expect(Buffer.from(bytes.subarray(0, 5)).toString("ascii"), `${candidate.id} ${paperSize}`).toBe("%PDF-");
        const document = await PDFDocument.load(bytes);
        expect(document.getPageCount(), `${candidate.id} ${paperSize}`).toBe(2);
        expect(document.getPage(0).getWidth(), `${candidate.id} ${paperSize} width`).toBeCloseTo(pdfPageSpec(paperSize, "portrait").width, 1);
        expect(document.getPage(0).getHeight(), `${candidate.id} ${paperSize} height`).toBeCloseTo(pdfPageSpec(paperSize, "portrait").height, 1);
      }
    }
  });
});
