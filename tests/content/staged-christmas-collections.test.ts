import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { collections } from "@/content/collections";
import { routeInventory } from "@/content/registry";
import { christmasCollectionReviews } from "@/content/staged/christmas-collections";
import { buildCollectionReview, collectionReviewHtml } from "@/lib/content/collection-review";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { allStagedCandidates } from "@/content/staged/catalog";
import { validateStaged } from "@/lib/content/staged-validation";
import { inspectCandidatePdfs } from "@/lib/content/staged-output";

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
    expect(report.children.map(({ id }) => id)).toEqual(["X02", "X08-A"]);
    expect(report.proposedIndexableChildCount).toBe(1);
    expect(report.optionalCompanionCount).toBe(1);
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

  test("resolves the exact seasonal action companion with truthful source provenance and no new candidate", () => {
    const report = buildCollectionReview(christmasCollectionReviews[1]);
    const companion = report.children[1];
    const original = seasonalClassroomCandidates.find(({ id }) => id === "X08-A")!;
    expect(companion.words).toEqual(original.puzzle.words);
    expect(companion.seed).toBe(original.puzzle.seed);
    expect(companion.directions).toEqual(["E", "S"]);
    expect(companion.rows).toBe(12);
    expect(companion.columns).toBe(12);
    expect(companion.sourceFile).toBe("content/staged/seasonal-classroom.ts");
    expect(companion.sourceCommit).toBe("bd6f2d12098968c094cdd05eba122fe5b59b2c46");
    expect(companion.sourceSha256).toBe("9a1008f683d74ecac1f434d75d2ac8c6ea5b5557eff4feaf8719599d20b6cdc7");
    expect(companion.role).toBe("optional-companion");
    expect(companion.newIndexableUrlAllowance).toBe(0);
    expect(companion.standaloneIndexableIntentApproved).toBe(false);
    expect(companion.eligiblePublishedChild).toBe(false);
    expect(allStagedCandidates).toHaveLength(61);
    const html = collectionReviewHtml(report);
    expect(html).toContain("Proposed independent children: 1. Optional companions: 1. Approved published children: 0; at least 2 required.");
    expect(html).toContain("Optional companion — zero new URLs; not an independently indexable child");
    expect(html).toContain(companion.sourceSha256);
  });

  test("never counts a companion toward the activation gate even if its source is published and reuse flags are simulated true", () => {
    const asset = christmasCollectionReviews[0];
    const companion = { ...asset.children[0], role: "optional-companion" as const, newIndexableUrlAllowance: 0 as const, standaloneIndexableIntentApproved: false as const, collectionFitApproved: true, audienceSuitabilityApproved: true, reuseApproved: true };
    const report = buildCollectionReview({ ...asset, children: [companion], collectionEditorialApproved: true, ownerPublicationApproved: true });
    expect(report.children[0].existingPublicationStatus).toBe("published");
    expect(report.approvedPublishedChildCount).toBe(0);
    expect(report.proposedIndexableChildCount).toBe(0);
    expect(report.blockingReasons.join(" ")).toContain("at least 2 required");
    expect(report.publicationAuthorized).toBe(false);
  });

  test("rejects source drift, unknown IDs and attempts to promote the action companion into a standalone child", () => {
    const asset = christmasCollectionReviews[1];
    const source = seasonalClassroomCandidates.find(({ id }) => id === "X08-A")!;
    const seed = source.puzzle.seed;
    try {
      source.puzzle.seed = "changed-source-seed";
      expect(() => buildCollectionReview(asset)).toThrow("source drift");
    } finally { source.puzzle.seed = seed; }
    expect(() => buildCollectionReview({ ...asset, children: [{ ...asset.children[1], id: "X08-unknown" }] })).toThrow("Unresolved");
    expect(() => buildCollectionReview({ ...asset, children: [{ ...asset.children[1], role: "candidate-child" }] })).toThrow("must remain an optional companion");
    expect(() => buildCollectionReview({ ...asset, children: [{ ...asset.children[1], newIndexableUrlAllowance: undefined }] })).toThrow("zero-new-URL");
  });

  test("preserves actual Letter/A4 source banks, complete grids and every answer endpoint for both easy selections", async () => {
    const report = buildCollectionReview(christmasCollectionReviews[1]);
    const selected = allStagedCandidates.filter(({ id }) => report.children.some(child => child.id === id));
    const validation = validateStaged(selected);
    expect(validation.issues).toEqual([]);
    expect(validation.freezes).toHaveLength(2);
    for (const freeze of validation.freezes) {
      const output = await inspectCandidatePdfs(freeze);
      expect(output.issues).toEqual([]);
      expect(output.evidence).toHaveLength(2);
      for (const evidence of output.evidence) {
        expect("pages" in evidence ? evidence.pages : 0).toBe(2);
        expect("minGridGlyphPt" in evidence ? evidence.minGridGlyphPt : 0).toBeGreaterThanOrEqual(9);
        expect("minWordBankPt" in evidence ? evidence.minWordBankPt : 0).toBeGreaterThanOrEqual(9.5);
      }
    }
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
