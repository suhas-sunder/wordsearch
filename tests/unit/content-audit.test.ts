import { describe, expect, test } from "vitest";
import type { PuzzleContentRecord } from "@/content/model";
import { auditContent } from "@/lib/content/audit";

function puzzle(id: string, overrides: Partial<PuzzleContentRecord> = {}): PuzzleContentRecord {
  const path = `/word-searches/animals/${id}`;
  return {
    id,
    slug: id,
    canonicalPath: path,
    contentType: "puzzle",
    publicationStatus: "published",
    indexable: true,
    title: `${id} title`,
    h1: `${id} H1`,
    introduction: `${id} has a useful topic-specific introduction.`,
    description: `${id} has a distinct and useful full description for puzzle visitors.`,
    metadata: { title: `${id} title`, description: `${id} metadata description`, canonical: path, noindex: false, includeInSitemap: true },
    breadcrumbs: [{ label: `${id} H1` }],
    relatedContentIds: [id],
    editorialStatus: "reviewed",
    puzzle: { puzzleTitle: `${id} puzzle`, words: [`${id}one`, `${id}two`, `${id}three`, `${id}four`, `${id}five`, `${id}six`, `${id}seven`, `${id}eight`, `${id}nine`, `${id}ten`], seed: `${id}-seed`, directions: ["E", "S"], allowOverlap: true, alphabetPack: "latin", difficulty: "easy", answerKeyAvailable: true, onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: true },
    taxonomy: { primaryCategory: "animals" },
    editorial: { puzzleNote: `${id} editorial note` },
    ...overrides
  };
}

function codes(records: PuzzleContentRecord[]) {
  return auditContent(records).errors.map((issue) => issue.code);
}

describe("content audit safeguards", () => {
  test("rejects duplicate identity, metadata, words, and puzzle fingerprints", () => {
    const a = puzzle("alpha");
    const b = puzzle("beta", { id: "alpha", slug: "alpha", canonicalPath: a.canonicalPath, title: a.title, h1: a.h1, introduction: a.introduction, description: a.description, metadata: a.metadata, puzzle: a.puzzle, relatedContentIds: ["alpha"] });
    const resultCodes = codes([a, b]);
    expect(resultCodes).toEqual(expect.arrayContaining(["duplicate-id", "duplicate-path", "duplicate-slug", "duplicate-title", "duplicate-h1", "duplicate-meta-title", "duplicate-meta-description", "duplicate-ordered-words", "duplicate-input-fingerprint", "duplicate-puzzle"]));
  });

  test("warns at the documented 80% Jaccard overlap threshold", () => {
    const a = puzzle("alpha");
    const b = puzzle("beta");
    b.puzzle.words = [...a.puzzle.words.slice(0, 9), "different"];
    const result = auditContent([a, b]);
    expect(result.warnings.map((issue) => issue.code)).toContain("high-word-overlap");
  });

  test("rejects missing seed, words, description, related IDs, and thin content", () => {
    const record = puzzle("broken", {
      description: "",
      relatedContentIds: ["missing"],
      puzzle: { ...puzzle("source").puzzle, seed: "", words: [] },
      editorial: {}
    });
    expect(codes([record])).toEqual(expect.arrayContaining(["missing-content", "missing-seed", "empty-word-list", "broken-related-id", "thin-indexable-puzzle"]));
  });

  test("allows a noindex draft with incomplete editorial fields", () => {
    const draft = puzzle("draft", { publicationStatus: "draft", indexable: false, editorialStatus: "unreviewed", description: "", relatedContentIds: [], metadata: { title: "Draft", description: "", canonical: "/word-searches/animals/draft", noindex: true, includeInSitemap: false }, puzzle: { ...puzzle("source").puzzle, seed: "", words: [] }, editorial: {} });
    expect(auditContent([draft]).errors).toEqual([]);
  });

  test("allows distinct reviewed puzzle records", () => {
    expect(auditContent([puzzle("alpha"), puzzle("beta")]).errors).toEqual([]);
  });
});
