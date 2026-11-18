import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import { routeInventory } from "@/content/registry";
import type { PuzzleContentRecord } from "@/content/model";
import { christmasCandidates, christmasDraftProposals, christmasSourceOnlyStatus, newYearDraftProposal } from "@/content/staged/christmas";
import { curatedTopics } from "@/content/curated-topics";
import { curatedTopicsPrompt6 } from "@/content/curated-topics-prompt6";
import { generatedPuzzleFingerprints, normalizeText } from "@/lib/content/fingerprint";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";
import { createPuzzlePdf, validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions, pdfPageSpec } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

const publishedPuzzles = routeInventory.filter(
  (record): record is PuzzleContentRecord => record.contentType === "puzzle" && record.publicationStatus === "published" && record.indexable
);

function answerTokens(words: string[]) {
  return words.map((word) => normalizeText(word).replace(/[^a-z0-9]/g, "")).filter(Boolean);
}

function answerTokenJaccard(left: string[], right: string[]) {
  const a = new Set(answerTokens(left));
  const b = new Set(answerTokens(right));
  const intersection = [...a].filter((token) => b.has(token)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 1;
}

function generate(candidate: (typeof christmasCandidates)[number]) {
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

describe("staged Christmas source assets", () => {
  test("freezes distinct puzzle candidates and stable seeds", () => {
    expect(christmasCandidates.map(({ id }) => id)).toEqual(["X01", "X02", "X04", "X11", "X15"]);
    expect(new Set(christmasCandidates.map(({ puzzle }) => puzzle.seed)).size).toBe(christmasCandidates.length);
    expect(new Set(christmasCandidates.map(({ proposedPath }) => proposedPath)).size).toBe(christmasCandidates.length);
    const candidatesById = new Map(christmasCandidates.map((candidate) => [candidate.id, candidate]));
    expect(candidatesById.get("X01")?.puzzle.directions).toEqual(["E", "W", "S", "N", "SE", "SW", "NE", "NW"]);
    expect(candidatesById.get("X02")?.puzzle.directions).toEqual(["E", "S"]);
    for (const id of ["X04", "X11", "X15"] as const) {
      expect(candidatesById.get(id)?.puzzle.directions, id).toEqual(["E", "S", "SE", "NE"]);
    }

    for (const candidate of christmasCandidates) {
      const normalizedWords = answerTokens(candidate.puzzle.words);
      expect(candidate.status).toBe("drafted");
      expect(candidate.id).toMatch(/^X(?:01|02|04|11|15)$/);
      expect(candidate.puzzle.seed).toMatch(/^staged-x(?:01|02|04|11|15)-[a-z0-9-]+-v1$/);
      expect(new Set(normalizedWords).size, candidate.id).toBe(normalizedWords.length);
      expect(candidate.puzzle.words.every((word) => /^[A-Z]+(?: [A-Z]+)*$/.test(word)), candidate.id).toBe(true);
      expect(candidate.sourceReferences.length, candidate.id).toBeGreaterThan(0);
      expect(candidate.sourceReferences.every(({ url }) => url.startsWith("https://")), candidate.id).toBe(true);
      expect(Object.hasOwn(candidate, "approval"), candidate.id).toBe(false);
    }
  });

  test("keeps every candidate outside published routes, sitemap and the 150 existing puzzles", () => {
    expect(publishedPuzzles).toHaveLength(150);
    expect(curatedTopics).toHaveLength(60);
    expect(curatedTopicsPrompt6).toHaveLength(90);
    expect(christmasSourceOnlyStatus).toEqual({
      publicationStatus: "draft",
      editorialStatus: "unreviewed",
      runtimeImportAllowed: false,
      humanEditorialApprovalRequired: true
    });

    const existingPaths = new Set(routeInventory.map(({ canonicalPath }) => canonicalPath));
    const existingSeeds = new Set(publishedPuzzles.map(({ puzzle }) => puzzle.seed));
    const existingWordLists = new Set(publishedPuzzles.map(({ puzzle }) => [...answerTokens(puzzle.words)].sort().join("\u001f")));
    const existingFingerprints = new Set(publishedPuzzles.map((record) => generatedPuzzleFingerprints(record).complete));

    for (const candidate of christmasCandidates) {
      expect(existingPaths.has(candidate.proposedPath), candidate.id).toBe(false);
      expect(existingSeeds.has(candidate.puzzle.seed), candidate.id).toBe(false);
      expect(existingWordLists.has([...answerTokens(candidate.puzzle.words)].sort().join("\u001f")), candidate.id).toBe(false);
      for (const existing of publishedPuzzles) {
        expect(answerTokenJaccard(candidate.puzzle.words, existing.puzzle.words), `${candidate.id} vs ${existing.canonicalPath}`).toBeLessThan(0.8);
      }
    }

    for (let left = 0; left < christmasCandidates.length; left += 1) {
      for (let right = left + 1; right < christmasCandidates.length; right += 1) {
        expect(answerTokenJaccard(christmasCandidates[left].puzzle.words, christmasCandidates[right].puzzle.words), `${christmasCandidates[left].id} vs ${christmasCandidates[right].id}`).toBeLessThan(0.8);
      }
    }
    expect(auditCandidates(christmasCandidates, routeInventory, readSourceInventory().redirects.map(({ source }) => source))).toEqual([]);

    expect(christmasDraftProposals.map(({ id }) => id)).toEqual(["X03", "X05", "X06", "X07", "X08"]);
    expect(christmasDraftProposals.every(({ status }) => status === "draft")).toBe(true);
    expect(christmasDraftProposals.find(({ id }) => id === "X07")?.dependsOn).toEqual([
      "published:christmas-word-search", "X01", "X02", "X04", "X15"
    ]);
    expect(newYearDraftProposal.id).toBe("X14");
    expect(newYearDraftProposal.dependsOn).toEqual(["published:new-year-word-search"]);
    expect(existingFingerprints.size).toBe(150);
  });

  test("generates stable complete grids, placements, answer keys and PDF-valid output", () => {
    for (const candidate of christmasCandidates) {
      const first = generate(candidate);
      const second = generate(candidate);
      const expectedWords = answerTokens(candidate.puzzle.words).sort();
      expect(first.request.seed, candidate.id).toBe(candidate.puzzle.seed);
      expect(first.request.directions, candidate.id).toEqual(candidate.puzzle.directions);
      expect(first.excluded, candidate.id).toEqual([]);
      expect(answerTokens(first.placed.map(({ label }) => label)).sort(), candidate.id).toEqual(expectedWords);
      expect(first.grid, candidate.id).toEqual(second.grid);
      expect(first.placed, candidate.id).toEqual(second.placed);
      expect(validatePuzzleForPdf(first), candidate.id).toBe(true);

      for (const placement of first.placed) {
        expect(placement.cells.map(({ row, col }) => first.grid[row]?.[col]).join(""), `${candidate.id}:${placement.label}`).toBe(placement.tokens.join(""));
      }
    }
  });

  test("emits Letter and A4 PDFs with separate answer pages", async () => {
    for (const candidate of christmasCandidates) {
      const puzzle = generate(candidate);
      for (const paperSize of ["letter", "a4"] as const) {
        const bytes = await createPuzzlePdf({
          puzzle,
          options: { ...defaultPuzzleOutputOptions, paperSize, orientation: "portrait", includeAnswerKey: true, qrCode: false },
          shareUrl: puzzlePlayUrl(puzzle.request)
        });
        expect(Buffer.from(bytes.subarray(0, 5)).toString("ascii"), `${candidate.id} ${paperSize}`).toBe("%PDF-");
        const document = await PDFDocument.load(bytes);
        expect(document.getPageCount(), `${candidate.id} ${paperSize}`).toBe(2);
        expect(document.getPage(0).getWidth(), `${candidate.id} ${paperSize} width`).toBeCloseTo(pdfPageSpec(paperSize, "portrait").width, 1);
        expect(document.getPage(0).getHeight(), `${candidate.id} ${paperSize} height`).toBeCloseTo(pdfPageSpec(paperSize, "portrait").height, 1);
      }
    }
  });

  test("matches the bounded pack, format and collection proposals without creating duplicate puzzle records", () => {
    const proposalsById = new Map(christmasDraftProposals.map((proposal) => [proposal.id, proposal]));
    expect(proposalsById.get("X03")?.dependsOn).toContain("X01");
    expect(proposalsById.get("X05")?.dependsOn).toContain("X15");
    expect(proposalsById.get("X06")?.dependsOn).toEqual(["X02"]);
    expect(proposalsById.get("X07")?.constraints.join(" ")).toContain("existing published medium Christmas puzzle");
    expect(proposalsById.get("X08")?.dependsOn).toEqual(["X07"]);
    expect(christmasCandidates.find(({ id }) => id === "X11")?.taxonomy.season).toBe("winter");
  });
});
