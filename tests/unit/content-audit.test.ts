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
    lastReviewed: "2026-07-25",
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
    expect(codes([record])).toEqual(expect.arrayContaining(["missing-content", "missing-seed", "empty-word-list", "broken-related-id", "thin-indexable-puzzle", "puzzle-generation-failed"]));
  });

  test("requires real, non-future review dates for published puzzle records", () => {
    const missing = puzzle("missing-date", { lastReviewed: "" });
    const invalid = puzzle("invalid-date", { lastReviewed: "2026-02-30" });
    const future = puzzle("future-date", { lastReviewed: "2100-01-01" });
    const result = auditContent([missing, invalid, future]);
    expect(result.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "missing-review-date",
      "invalid-review-date",
      "future-review-date"
    ]));
  });

  test("rejects empty, unsupported, or repeated puzzle directions", () => {
    const missing = puzzle("missing-direction", { puzzle: { ...puzzle("source").puzzle, directions: [] } });
    const invalid = puzzle("invalid-direction", { puzzle: { ...puzzle("source").puzzle, directions: ["E", "OTHER"] as unknown as PuzzleContentRecord["puzzle"]["directions"] } });
    const repeated = puzzle("repeated-direction", { puzzle: { ...puzzle("source").puzzle, directions: ["E", "E"] } });
    const wrongType = puzzle("wrong-type-directions", { puzzle: { ...puzzle("source").puzzle, directions: null as unknown as PuzzleContentRecord["puzzle"]["directions"] } });
    const sparse = puzzle("sparse-directions", { puzzle: { ...puzzle("source").puzzle, directions: new Array(1) as PuzzleContentRecord["puzzle"]["directions"] } });
    const result = auditContent([missing, invalid, repeated, wrongType, sparse]);
    expect(result.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      "missing-directions",
      "invalid-direction",
      "duplicate-direction"
    ]));
    expect(auditContent([sparse]).errors.map((issue) => issue.code)).toContain("invalid-direction");
  });

  test("allows a noindex draft with incomplete editorial fields", () => {
    const draft = puzzle("draft", { publicationStatus: "draft", indexable: false, editorialStatus: "unreviewed", description: "", relatedContentIds: [], metadata: { title: "Draft", description: "", canonical: "/word-searches/animals/draft", noindex: true, includeInSitemap: false }, puzzle: { ...puzzle("source").puzzle, seed: "", words: [] }, editorial: {} });
    expect(auditContent([draft]).errors).toEqual([]);
  });

  test("allows distinct reviewed puzzle records", () => {
    expect(auditContent([puzzle("alpha"), puzzle("beta")]).errors).toEqual([]);
  });
});
