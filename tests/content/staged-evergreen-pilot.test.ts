import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import { routeInventory } from "@/content/registry";
import type { PuzzleContentRecord } from "@/content/model";
import { evergreenPilotCandidates, evergreenPilotStatus } from "@/content/staged/evergreen-pilot";
import { readSourceInventory } from "@/lib/content/inventory";
import { validateStaged } from "@/lib/content/staged-validation";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions, pdfPageSpec } from "@/lib/puzzle/output-options";

const publishedPuzzleCount = routeInventory.filter(
  (record): record is PuzzleContentRecord => record.contentType === "puzzle" && record.publicationStatus === "published" && record.indexable
).length;

function generate(candidate: (typeof evergreenPilotCandidates)[number]) {
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

describe("staged evergreen hard pilot", () => {
  test("keeps the bounded H02/H03 candidates source-only and correctly keyed", () => {
    expect(evergreenPilotCandidates.map(({ id }) => id)).toEqual(["H02-01", "H03-01"]);
    expect(evergreenPilotStatus).toEqual({
      publicationStatus: "draft",
      editorialStatus: "unreviewed",
      runtimeImportAllowed: false,
      humanEditorialApprovalRequired: true
    });
    expect(publishedPuzzleCount).toBe(150);

    for (const candidate of evergreenPilotCandidates) {
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

    expect(evergreenPilotCandidates[0].proposedPath).toBe("/word-searches/geography/selected-us-mountain-ranges-word-search");
    expect(evergreenPilotCandidates[1].proposedPath).toBe("/word-searches/science/observational-astronomy-word-search");
    expect(routeInventory.some(({ canonicalPath }) => evergreenPilotCandidates.some(({ proposedPath }) => canonicalPath === proposedPath))).toBe(false);
  });

  test("passes the independent inventory collision, route and placement validator", () => {
    const redirects = readSourceInventory().redirects.map(({ source }) => source);
    const result = validateStaged(evergreenPilotCandidates, redirects);
    expect(result.issues).toEqual([]);
    expect(result.freezes.map(({ id }) => id)).toEqual(["H02-01", "H03-01"]);
    expect(result.freezes.every(({ rows, columns }) => rows === 18 && columns === 18)).toBe(true);
  });

  test("repeats complete placements and produces Letter/A4 two-page PDFs", async () => {
    for (const candidate of evergreenPilotCandidates) {
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
          shareUrl: "https://www.ilovewordsearch.com/",
          layoutProfile: "pack"
        });
        expect(Buffer.from(bytes.subarray(0, 5)).toString("ascii"), `${candidate.id} ${paperSize}`).toBe("%PDF-");
        const document = await PDFDocument.load(bytes);
        expect(document.getPageCount(), `${candidate.id} ${paperSize}`).toBe(2);
        expect(document.getPage(0).getWidth(), `${candidate.id} ${paperSize} width`).toBeCloseTo(pdfPageSpec(paperSize, "portrait").width, 1);
        expect(document.getPage(0).getHeight(), `${candidate.id} ${paperSize} height`).toBeCloseTo(pdfPageSpec(paperSize, "portrait").height, 1);
        const measurement = await measurePdfBytes(bytes, first, { ...defaultPuzzleOutputOptions, paperSize, qrCode: false });
        expect(measurement.findings, `${candidate.id} ${paperSize} geometry`).toEqual([]);
        expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(9);
      }
    }
  });
});
