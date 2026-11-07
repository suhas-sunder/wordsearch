import { describe, expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CollectionPage from "@/app/collections/[slug]/page";
import { routeInventory } from "@/content/registry";
import { collectionFinderSlugs, findCollectionItems, type CollectionFinderItem } from "@/lib/content/collection-finder";

// The unrelated site-wide search island needs an App Router. Collection SSR,
// finder controls/cards and JSON-LD remain real; browser checks use the full page.
vi.mock("@/components/search/PuzzleSearch", () => ({ PuzzleSearch: () => null }));

const entries: CollectionFinderItem[] = [
  { id: "z", title: "Zebra", subject: "Animals", difficulty: "easy" },
  { id: "a", title: "Álgebra 10", subject: "Mathematics", difficulty: "hard" },
  { id: "b", title: "Algebra 2", subject: "Mathematics", difficulty: "medium" },
  { id: "c", title: "Zebra", subject: "Animals", difficulty: "hard" }
];

describe("bounded collection finding", () => {
  test("finds title/subject terms together, folds accents/case and respects difficulty", () => {
    expect(findCollectionItems(entries, " algebra MATH ", "all", "editorial").map(({ id }) => id)).toEqual(["a", "b"]);
    expect(findCollectionItems(entries, "animals", "hard", "editorial").map(({ id }) => id)).toEqual(["c"]);
    expect(findCollectionItems(entries, "nonexistent", "all", "editorial")).toEqual([]);
  });
  test("preserves stable editorial/tied title order without changing the source", () => {
    const before = JSON.stringify(entries);
    expect(findCollectionItems(entries, "", "all", "title").map(({ id }) => id)).toEqual(["b", "a", "z", "c"]);
    expect(findCollectionItems(entries, "", "all", "editorial")).toEqual(entries);
    expect(JSON.stringify(entries)).toBe(before);
  });
  test("keeps all published cards crawlable in SSR, with only the two allowed control islands", async () => {
    for (const slug of collectionFinderSlugs) {
      const record = routeInventory.find((item) => item.canonicalPath === `/collections/${slug}`);
      if (record?.contentType !== "collection") throw new Error("Missing collection source");
      const html = renderToStaticMarkup(await CollectionPage({ params: Promise.resolve({ slug }) }));
      expect(html).toContain("Find in this collection");
      expect(html).toContain("All reviewed puzzles are listed below in editorial order.");
      expect(html).toContain('data-ready="false"');
      expect((html.match(/data-collection-id=/g) ?? []).length).toBe(record.childContentIds?.length);
      for (const id of record.childContentIds ?? []) {
        const child = routeInventory.find((item) => item.id === id);
        expect(child?.publicationStatus).toBe("published");
        expect(html).toContain(`href="${child!.canonicalPath}"`);
      }
      expect(html).toContain('type="application/ld+json"');
      expect(html.includes("All difficulties")).toBe(slug === "word-searches-with-answer-keys");
    }
    const other = renderToStaticMarkup(await CollectionPage({ params: Promise.resolve({ slug: "easy-printable-word-searches" }) }));
    expect(other).not.toContain("data-collection-controls");
    expect(other).not.toContain("data-collection-id");
  });
});
