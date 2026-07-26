import { describe, expect, test } from "vitest";
import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { curatedTopicsPrompt6 } from "@/content/curated-topics-prompt6";
import { curatedTopics } from "@/content/curated-topics";
import { guides } from "@/content/guides";
import type { PuzzleContentRecord } from "@/content/model";
import { getSitemapRecords, routeInventory } from "@/content/registry";
import { generatedPuzzleFingerprints, normalizeWords } from "@/lib/content/fingerprint";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import { searchCatalog } from "@/lib/search/catalog";
import { decodePuzzleShareState } from "@/lib/share-state/state";
import { topics } from "@/content/topics";

const puzzleRecords = routeInventory.filter(
  (record): record is PuzzleContentRecord => record.contentType === "puzzle" && record.indexable
);
const recordsByPath = new Map(puzzleRecords.map((record) => [record.canonicalPath, record]));
const prompt5Records = curatedTopics.map((topic) => recordsByPath.get(`/word-searches/${topic.routeSlug}`)!);
const prompt6Records = curatedTopicsPrompt6.map((topic) => recordsByPath.get(`/word-searches/${topic.routeSlug}`)!);

function generate(record: PuzzleContentRecord) {
  return generatePuzzle({
    title: record.puzzle.puzzleTitle,
    wordsText: record.puzzle.words.join("\n"),
    seed: record.puzzle.seed,
    difficulty: record.puzzle.difficulty,
    alphabetPack: record.puzzle.alphabetPack,
    rows: record.puzzle.rows,
    cols: record.puzzle.columns,
    autoSize: false,
    directions: record.puzzle.directions,
    allowOverlap: record.puzzle.allowOverlap,
    fillerMode: "alphabet"
  });
}

describe("reviewed curated publication", () => {
  test("preserves exactly the supplied Prompt 5 set of 60 puzzle records", () => {
    expect(curatedTopics).toHaveLength(60);
    expect(prompt5Records).toHaveLength(60);
    expect(prompt5Records.every(Boolean)).toBe(true);
    expect(prompt5Records.every((record) => record.publicationStatus === "published" && record.editorialStatus === "reviewed")).toBe(true);
  });

  test("publishes exactly the supplied Prompt 6 set of 90 puzzle records", () => {
    expect(curatedTopicsPrompt6).toHaveLength(90);
    expect(prompt6Records).toHaveLength(90);
    expect(prompt6Records.every(Boolean)).toBe(true);
    for (const [index, topic] of curatedTopicsPrompt6.entries()) {
      const record = prompt6Records[index];
      expect(record.puzzle.words, topic.routeSlug).toEqual(topic.words);
      expect(record.puzzle.difficulty).toBe(topic.difficulty);
      expect(record.puzzle.seed).toBe(topic.seed);
      expect(record.introduction).toBe(topic.introduction);
      expect(record.description).toBe(topic.context);
    }
    expect(curatedTopicsPrompt6.filter((topic) => topic.difficulty === "easy")).toHaveLength(27);
    expect(curatedTopicsPrompt6.filter((topic) => topic.difficulty === "medium")).toHaveLength(51);
    expect(curatedTopicsPrompt6.filter((topic) => topic.difficulty === "hard")).toHaveLength(12);
    for (const segment of new Set(curatedTopicsPrompt6.map((topic) => topic.categorySegment))) {
      expect(curatedTopicsPrompt6.filter((topic) => topic.categorySegment === segment), segment).toHaveLength(6);
    }
  });

  test("keeps all 150 published puzzles globally unique and reviewed", () => {
    expect(puzzleRecords).toHaveLength(150);
    expect(new Set(puzzleRecords.map((record) => record.canonicalPath)).size).toBe(150);
    expect(new Set(puzzleRecords.map((record) => record.puzzle.seed)).size).toBe(150);
    expect(new Set(puzzleRecords.map((record) => normalizeWords(record.puzzle.words).join("\u001f"))).size).toBe(150);
    expect(new Set(puzzleRecords.map((record) => [...normalizeWords(record.puzzle.words)].sort().join("\u001f"))).size).toBe(150);
    expect(new Set(puzzleRecords.map((record) => generatedPuzzleFingerprints(record).complete)).size).toBe(150);
    expect(new Set(puzzleRecords.map((record) => record.metadata.title)).size).toBe(150);
    expect(new Set(puzzleRecords.map((record) => record.metadata.description)).size).toBe(150);
    expect(puzzleRecords.every((record) => record.lastReviewed === "2026-07-25")).toBe(true);
  });

  test("places every supplied word deterministically with exact A-Z answer paths", () => {
    for (const record of puzzleRecords) {
      const first = generate(record);
      const second = generate(record);
      expect(first.excluded, record.canonicalPath).toEqual([]);
      expect(first.placed, record.canonicalPath).toHaveLength(record.puzzle.words.length);
      expect(second.grid).toEqual(first.grid);
      expect(second.placed).toEqual(first.placed);
      expect(first.grid.flat().every((token) => /^[A-Z]$/.test(token))).toBe(true);
      expect(validatePuzzleForPdf(first)).toBe(true);
      for (const placement of first.placed) {
        expect(placement.cells.map((cell) => first.grid[cell.row]?.[cell.col]).join("")).toBe(placement.tokens.join(""));
      }
      const encoded = first.sharePath.split("state=")[1];
      expect(decodePuzzleShareState(encoded)).toMatchObject({
        seed: record.puzzle.seed,
        rows: record.puzzle.rows,
        cols: record.puzzle.columns,
        directions: record.puzzle.directions
      });
    }
  });

  test("uses the approved difficulty presets and output availability", () => {
    for (const record of puzzleRecords) {
      const expected = record.puzzle.difficulty === "easy"
        ? { size: 12, count: 12, directions: ["E", "S", "SE"] }
        : record.puzzle.difficulty === "medium"
          ? { size: 15, count: 16, directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"] }
          : { size: 18, count: 20, directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"] };
      expect(record.puzzle.rows).toBe(expected.size);
      expect(record.puzzle.columns).toBe(expected.size);
      expect(record.puzzle.words).toHaveLength(expected.count);
      expect(record.puzzle.directions).toEqual(expected.directions);
      expect(record.puzzle).toMatchObject({
        allowOverlap: true,
        alphabetPack: "latin",
        answerKeyAvailable: true,
        onlinePlayAvailable: true,
        printableAvailable: true,
        pdfAvailable: true,
        largePrintSuitable: true
      });
    }
  });

  test("resolves deliberate related links and leaves no curated puzzle orphaned", () => {
    const ids = new Set(routeInventory.map((record) => record.id));
    const inbound = new Set<string>();
    for (const record of puzzleRecords) {
      expect(record.relatedContentIds?.length).toBeGreaterThanOrEqual(4);
      expect(record.relatedContentIds?.length).toBeLessThanOrEqual(8);
      for (const id of record.relatedContentIds ?? []) {
        expect(ids.has(id), `${record.id} -> ${id}`).toBe(true);
        inbound.add(id);
      }
    }
    expect(puzzleRecords.every((record) => inbound.has(record.id))).toBe(true);
  });

  test("publishes thirteen non-empty collections with reviewed-only inventories", () => {
    const published = collections.filter((collection) => collection.publicationStatus === "published");
    expect(published).toHaveLength(13);
    for (const collection of published) {
      expect(collection.relatedTopics.length).toBeGreaterThan(0);
      expect(new Set(collection.relatedTopics).size).toBe(collection.relatedTopics.length);
      expect(collection.relatedTopics.every((slug) => topics.some((topic) => topic.slug === slug && topic.publicationStatus === "published"))).toBe(true);
      expect(collection.reviewedOn).toBe("2026-07-25");
    }
    expect(published.find((collection) => collection.slug === "word-searches-with-answer-keys")?.relatedTopics).toHaveLength(150);
    expect(published.find((collection) => collection.slug === "animal-word-search-printables")?.relatedTopics).toHaveLength(14);
    expect(published.find((collection) => collection.slug === "hard-printable-word-searches")?.relatedTopics).toHaveLength(16);
    expect(published.find((collection) => collection.slug === "geography-word-search-worksheets")?.relatedTopics).toHaveLength(14);
    expect(published.find((collection) => collection.slug === "language-arts-word-search-worksheets")?.relatedTopics).toHaveLength(14);
    expect(published.find((collection) => collection.slug === "math-word-search-worksheets")?.relatedTopics).toHaveLength(12);
    expect(published.find((collection) => collection.slug === "history-word-search-worksheets")?.relatedTopics).toHaveLength(6);
    expect(published.find((collection) => collection.slug === "travel-word-search-printables")?.relatedTopics).toHaveLength(10);
  });

  test("publishes twelve substantial attributed guides without FAQ data", () => {
    const published = guides.filter((guide) => guide.publicationStatus === "published");
    expect(published).toHaveLength(12);
    for (const guide of published) {
      expect(guide.authorId).toBe("suhas-sunder");
      expect(guide.reviewedOn).toBe("2026-07-25");
      expect(guide.sections.length).toBeGreaterThanOrEqual(9);
      expect(JSON.stringify(guide)).not.toContain("faq");
    }
    for (const slug of ["large-print-word-searches", "classroom-word-search-ideas", "homeschool-word-search-ideas", "esl-word-search-activities", "custom-word-lists-for-word-searches", "vocabulary-practice-with-word-searches"]) {
      expect(published.find((guide) => guide.slug === slug)?.sections, slug).toHaveLength(10);
    }
  });

  test("publishes fifteen non-empty enriched category hubs", () => {
    const published = categories.filter((category) => category.publicationStatus === "published");
    expect(published).toHaveLength(15);
    for (const category of published) {
      const children = topics.filter((topic) => topic.categorySegment === category.pathSegment && topic.publicationStatus === "published");
      expect(children.length, category.slug).toBeGreaterThan(0);
      expect(category.introduction).toBeTruthy();
      expect(category.metaTitle).toBeTruthy();
      expect(category.metaDescription).toBeTruthy();
    }
  });

  test("keeps the exact justified indexation and sitemap inventory", () => {
    const sitemap = getSitemapRecords();
    expect(sitemap).toHaveLength(217);
    expect(sitemap.filter((record) => record.contentType === "puzzle")).toHaveLength(150);
    expect(sitemap.filter((record) => record.contentType === "collection")).toHaveLength(13);
    expect(sitemap.filter((record) => record.contentType === "guide")).toHaveLength(12);
    expect(sitemap.filter((record) => record.id.startsWith("category-"))).toHaveLength(15);
    expect(sitemap.every((record) => record.indexable && record.publicationStatus === "published")).toBe(true);
  });

  test("publishes only the requested new core and trust routes while deferred routes stay noindex", () => {
    const requested = [
      "/easy-word-searches",
      "/hard-word-searches",
      "/word-search-with-answer-key",
      "/word-searches-for-seniors",
      "/homeschool-word-searches",
      "/esl-word-searches",
      "/topics",
      "/copyright"
    ];
    const deferred = [
      "/daily-word-search",
      "/specialty-word-search-generators",
      "/collections/brain-training-word-searches",
      "/collections/baby-shower-word-searches",
      "/collections/bridal-shower-word-searches",
      "/guides/how-hidden-message-word-searches-work",
      "/guides/word-search-ideas-for-parties",
      "/categories/health-and-wellness-word-searches",
      "/categories/faith-word-searches",
      "/faq",
      "/search"
    ];
    for (const path of requested) expect(routeInventory.find((record) => record.canonicalPath === path)?.indexable, path).toBe(true);
    for (const path of deferred) expect(routeInventory.find((record) => record.canonicalPath === path)?.indexable, path).toBe(false);
  });

  test("searches all published puzzles, collections, and guides without draft leakage", () => {
    expect(searchCatalog.filter((item) => item.type === "Puzzle")).toHaveLength(150);
    expect(searchCatalog.filter((item) => item.type === "Collection")).toHaveLength(13);
    expect(searchCatalog.filter((item) => item.type === "Guide")).toHaveLength(12);
    expect(searchCatalog.some((item) => item.title === "Dog Word Search" && item.terms.includes("PUPPY"))).toBe(true);
    expect(searchCatalog.some((item) => item.title === "Science Word Search Worksheets")).toBe(true);
    expect(searchCatalog.some((item) => item.title === "Word Search Rules")).toBe(true);
    expect(searchCatalog.some((item) => item.title === "Ancient Egypt Word Search" && item.terms.includes("PHARAOH"))).toBe(true);
    expect(searchCatalog.some((item) => item.title === "Daily Word Search")).toBe(false);
  });
});
