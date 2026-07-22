import { describe, expect, test } from "vitest";
import { findSearchResults, searchCatalog } from "@/lib/search/catalog";

describe("curated search catalog", () => {
  test("matches a known puzzle and category from real content", () => {
    const animalResults = findSearchResults("animals");
    expect(animalResults.some((item) => item.type === "Category" && item.title === "Animals Word Searches")).toBe(true);
    expect(animalResults.some((item) => item.type === "Puzzle")).toBe(true);
  });

  test("matches audience, format, and seasonal fields", () => {
    expect(findSearchResults("teachers worksheet").some((item) => item.audience === "Teachers")).toBe(true);
    expect(findSearchResults("summer").some((item) => item.season === "summer")).toBe(true);
    expect(findSearchResults("PDF").some((item) => item.format === "PDF")).toBe(true);
  });

  test("returns no fake fallback records for an unmatched query", () => {
    expect(findSearchResults("zzzz-no-real-puzzle-zzzz")).toEqual([]);
    expect(new Set(searchCatalog.map((item) => item.id)).size).toBe(searchCatalog.length);
  });
});
