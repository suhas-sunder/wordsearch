import { describe, expect, test } from "vitest";
import { helpNavigation, primaryNavigation, secondaryNavigation } from "@/content/navigation";
import { getRouteRecord } from "@/content/registry";

describe("menu destinations", () => {
  test("retains all original destinations and links only to known canonical routes", () => {
    const originals = ["/", "/free-printable-word-searches", "/online-word-search", "/word-search-generator", "/categories", "/large-print-word-searches", "/word-searches-for-teachers", "/guides", "/word-searches-for-kids", "/word-searches-for-adults", "/word-search-worksheets", "/word-search-pdf"];
    const items = [...primaryNavigation, ...secondaryNavigation, ...helpNavigation];
    expect(items.map((item) => item.href)).toEqual(expect.arrayContaining(originals));
    for (const item of items) {
      expect(getRouteRecord(item.href), item.href).toBeDefined();
      expect(getRouteRecord(item.href)?.canonicalPath).toBe(item.href);
      if (item.href === "/search") expect(getRouteRecord(item.href)?.indexable).toBe(false);
      else expect(getRouteRecord(item.href)?.publicationStatus).toBe("published");
    }
  });
});
