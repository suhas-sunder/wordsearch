import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { guides } from "@/content/guides";
import { getSitemapRecords } from "@/content/registry";
import { articleJsonLd } from "@/lib/seo/structured-data";
import sitemap from "@/app/sitemap";

describe("guide date provenance under owner issue117", () => {
  test("retains stored dates but withdraws exactly twelve unverified guide lastmod claims", () => {
    const indexedGuides = getSitemapRecords().filter(record => record.contentType === "guide");
    expect(indexedGuides).toHaveLength(12);
    for (const record of indexedGuides) {
      expect(guides.find(guide => `/guides/${guide.slug}` === record.canonicalPath)?.reviewedOn).toBe("2026-07-25");
      expect(record.lastReviewed).toBe("2026-07-25");
      expect(record.metadata.lastModified).toBeUndefined();
      expect(sitemap().find(entry => entry.url.endsWith(record.canonicalPath))).not.toHaveProperty("lastModified");
    }
    expect(sitemap()).toHaveLength(217);
    expect(getSitemapRecords().filter(record => record.contentType === "puzzle").every(record => record.metadata.lastModified === "2026-07-25")).toBe(true);
  });
  test("omits an absent Article date and preserves an explicitly supplied date", () => {
    const input = { headline: "Guide", description: "Useful task help", path: "/guides/example", authorName: "Suhas Sunder", authorPath: "/about" };
    expect(articleJsonLd(input)).not.toHaveProperty("dateModified");
    expect(articleJsonLd({ ...input, dateModified: "2026-07-25" })).toEqual({ ...articleJsonLd(input), dateModified: "2026-07-25" });
    const source = readFileSync("app/guides/[slug]/page.tsx", "utf8");
    expect(source).not.toContain("Reviewed on");
    expect(source).not.toContain("dateModified:");
    expect(source).toContain("Written by");
  });
});
