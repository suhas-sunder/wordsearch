import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { collections } from "@/content/collections";
import { routeInventory } from "@/content/registry";
import { christmasCollectionReviews } from "@/content/staged/christmas-collections";
import { buildCollectionReview, collectionReviewHtml } from "@/lib/content/collection-review";

describe("source-only Christmas collection review", () => {
  test("resolves actual authored children without replacing published sources", () => {
    const traditions = buildCollectionReview(christmasCollectionReviews[0]);
    expect(traditions.children.map(({ id }) => id)).toEqual(["published:christmas-word-search", "X02", "X01"]);
    const published = routeInventory.find((record) => record.canonicalPath === traditions.children[0].canonicalPath);
    expect(published?.contentType).toBe("puzzle");
    if (published?.contentType !== "puzzle") throw new Error("Missing published Christmas source");
    expect(traditions.children[0].words).toEqual(published.puzzle.words);
    expect(traditions.children[0].seed).toBe(published.puzzle.seed);
    expect(traditions.children[0].existingEditorialStatus).toBe("reviewed");
    expect(traditions.children[1].directions).toEqual(["E", "S"]);
    expect(traditions.children[2].directions).toHaveLength(8);
    expect(traditions.excludedSelections.map(({ id }) => id)).toEqual(["X04", "X15"]);
  });

  test("fails closed on independent suitability/reuse and does not pad kids inventory", () => {
    const traditions = christmasCollectionReviews[0];
    const approvedReuse = { ...traditions.children[0], collectionFitApproved: true, audienceSuitabilityApproved: true, reuseApproved: true };
    expect(buildCollectionReview({ ...traditions, children: [approvedReuse] }).approvedPublishedChildCount).toBe(1);
    for (const gate of ["collectionFitApproved", "audienceSuitabilityApproved", "reuseApproved"] as const) {
      expect(buildCollectionReview({ ...traditions, children: [{ ...approvedReuse, [gate]: false }] }).approvedPublishedChildCount, gate).toBe(0);
    }
    const kids = christmasCollectionReviews[1];
    const report = buildCollectionReview(kids);
    expect(report.children.map(({ id }) => id)).toEqual(["X02"]);
    expect(report.approvedPublishedChildCount).toBe(0);
    expect(report.blockingReasons.join(" ")).toContain("at least 2 required");
    expect(report.publicationAuthorized).toBe(false);
    expect(report.runtimeActivation).toBe(false);
    const simulated = buildCollectionReview({ ...kids, collectionEditorialApproved: true, ownerPublicationApproved: true, children: kids.children.map((child) => ({ ...child, collectionFitApproved: true, audienceSuitabilityApproved: true, reuseApproved: true })) });
    expect(simulated.approvedPublishedChildCount).toBe(0); // X02 is still unpublished.
    expect(simulated.publicationAuthorized).toBe(false);
    expect(simulated.blockingReasons).toContain("X02: source puzzle is unpublished.");
    const originalDraft = collections.find(({ slug }) => slug === "christmas-word-searches-for-kids");
    expect(originalDraft?.publicationStatus).toBe("draft");
  });

  test("rejects broken or duplicate exact child references", () => {
    const asset = christmasCollectionReviews[0];
    expect(() => buildCollectionReview({ ...asset, children: [asset.children[0], asset.children[0]] })).toThrow("Duplicate");
    expect(() => buildCollectionReview({ ...asset, children: [{ ...asset.children[1], canonicalPath: "/invented" }] })).toThrow("Unresolved");
    expect(() => buildCollectionReview({ ...asset, children: [{ ...asset.children[0], id: "published:invented" }] })).toThrow("ID does not match");
  });

  test("renders useful private review HTML with complete banks, escaped content and no live activation", () => {
    for (const asset of christmasCollectionReviews) {
      const report = buildCollectionReview(asset);
      const html = collectionReviewHtml(report);
      expect(html).toContain('name="robots" content="noindex,nofollow"');
      expect(html).toContain("Publication authorized: false");
      expect(html).toContain("Classroom and printing instructions");
      for (const child of report.children) {
        expect(html).toContain(child.canonicalPath);
        expect(html).toContain(child.seed);
        for (const word of child.words) expect(html).toContain(`<li>${word}</li>`);
      }
      expect(html).not.toMatch(/<script\b|<iframe\b|<img\b|href=|src=/i);
      expect(collectionReviewHtml({ ...report, title: '<img src=x onerror="bad">' })).toContain("&lt;img src=x onerror=&quot;bad&quot;&gt;");
    }
    expect(readFileSync("content/registry.ts", "utf8")).not.toContain("christmas-collections");
    expect(readFileSync("content/collections.ts", "utf8")).not.toContain("christmas-collections");
  });
});
