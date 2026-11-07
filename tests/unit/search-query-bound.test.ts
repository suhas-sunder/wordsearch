import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { boundSearchQuery, searchQueryMaxLength } from "@/lib/search/query";
import { rankSearchCatalog } from "@/lib/search/search";
import { searchCatalog } from "@/lib/search/catalog";
import { findCollectionItems, type CollectionFinderItem } from "@/lib/content/collection-finder";

describe("shared search workload bound", () => {
  test("preserves the exact prior ranking and tie/limit behavior of normal real-catalog queries", () => {
    const queries = ["animals", "summer", "teachers worksheet", "PDF", " christmas ", "", "math", "astronomy", "zz"];
    const results = queries.map(q => ({ q, ids: rankSearchCatalog(searchCatalog, q).map(r => r.id), limited: rankSearchCatalog(searchCatalog, q, 7).map(r => r.id) }));
    expect(createHash("sha256").update(JSON.stringify(results)).digest("hex")).toBe("ead3e49db98c0657a3a1e329cf7de136987d86e02f6c727c3297639ac611c4f4");
  });

  test("bounds helper entrypoints even when callers bypass input maxLength", () => {
    const query = "a ".repeat(100_000);
    expect(boundSearchQuery(query)).toHaveLength(searchQueryMaxLength);
    expect(rankSearchCatalog(searchCatalog, query)).toEqual(rankSearchCatalog(searchCatalog, query.slice(0, searchQueryMaxLength)));
    // A term beyond the bound must not silently change title/subject filtering.
    const items: CollectionFinderItem[] = [{ id: "a", title: "Algebra", subject: "Mathematics", difficulty: "hard" }];
    const prefix = "algebra".padEnd(searchQueryMaxLength, " ");
    expect(findCollectionItems(items, prefix + "not-matching ".repeat(20_000), "hard", "title")).toEqual(items);
    expect(findCollectionItems(items, " álgebra MATH ", "hard", "editorial")).toEqual(items);
  });

  test("does not split an astral character at the native UTF-16 limit", () => {
    expect(boundSearchQuery("a".repeat(158) + "😀extra")).toBe("a".repeat(158) + "😀");
    expect(boundSearchQuery("a".repeat(159) + "😀extra")).toBe("a".repeat(159));
    expect(boundSearchQuery("😀".repeat(100_000))).toBe("😀".repeat(80));
    expect(() => encodeURIComponent(boundSearchQuery("a".repeat(159) + "😀extra"))).not.toThrow();
    expect(boundSearchQuery("Latin café 日本語 😀")).toBe("Latin café 日本語 😀");
  });

  test("keeps malformed programmatic UTF-16 safe for popup URL submission", () => {
    const value = boundSearchQuery("one\ud800two\udc00three");
    expect(value).toBe("one\ufffdtwo\ufffdthree");
    expect(() => encodeURIComponent(value)).not.toThrow();
    expect(boundSearchQuery("a".repeat(159) + "\ud83d")).toBe("a".repeat(159));
  });
});
