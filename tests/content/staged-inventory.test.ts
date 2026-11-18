import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { getRouteRecord, getSitemapRecords, routeInventory } from "@/content/registry";
import { topics } from "@/content/topics";
import { searchCatalog } from "@/lib/search/catalog";
import { auditCandidates } from "@/lib/content/candidates";
import { sourceInventory } from "@/lib/content/inventory";
import { transitionLifecycle, type StagedPuzzleCandidate } from "@/content/staged/model";
import { featuredPuzzles, printablePicks, onlinePicks } from "@/content/discovery";

const candidate: StagedPuzzleCandidate = {
  id: "X-test", proposedPath: "/word-searches/holidays/unreleased-test", intent: "A unique test intent", title: "Unreleased test",
  status: "drafted", sourceReferences: [], editorial: {}, taxonomy: { primaryCategory: "holidays" },
  puzzle: { puzzleTitle: "Unreleased test", words: ["snow", "ice"], seed: "test-seed", directions: ["E"], allowOverlap: true, alphabetPack: "latin", difficulty: "easy", answerKeyAvailable: true, onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: true }
};

describe("source-only editorial inventory", () => {
  test("never exposes a staged candidate through public sources", () => {
    const paths = [candidate.proposedPath];
    expect(getRouteRecord(candidate.proposedPath)).toBeUndefined();
    expect(getSitemapRecords().map((r) => r.canonicalPath)).not.toContain(candidate.proposedPath);
    expect(searchCatalog.map((r) => r.href)).not.toContain(candidate.proposedPath);
    expect([...featuredPuzzles, ...printablePicks, ...onlinePicks].map((r) => r.href)).not.toContain(candidate.proposedPath);
    expect(topics.filter((t) => t.publicationStatus === "published").map((t) => `/word-searches/${t.slug}`)).not.toEqual(expect.arrayContaining(paths));
    expect(readFileSync("scripts/generate-search-index.ts", "utf8")).toContain("searchCatalog");
  });
  test("finds collisions with registry, redirect paths and other candidates", () => {
    const other = { ...candidate, id: routeInventory[0].id, proposedPath: "/old-path", intent: candidate.intent };
    const issues = auditCandidates([candidate, other], routeInventory, ["/old-path"]);
    expect(issues.map((i) => i.code)).toEqual(expect.arrayContaining(["duplicate-id", "duplicate-path", "duplicate-intent", "duplicate-seed", "duplicate-words"]));
  });
  test("cannot skip QA or manufacture editorial approval from QA", () => {
    expect(() => transitionLifecycle({ status: "unknown" as never }, "proposal")).toThrow();
    expect(transitionLifecycle({ status: "drafted" }, "retired").status).toBe("retired");
    expect(() => transitionLifecycle({ status: "scheduled", approval: { reviewer: "Editor", reviewedOn: "2026-01-01", reference: "review/1" } }, "published")).toThrow();
    expect(transitionLifecycle({ status: "scheduled", approval: { reviewer: "Editor", reviewedOn: "2026-01-01", reference: "review/1" } }, "published", undefined, { contentCommit: "a".repeat(40), releaseCommit: "b".repeat(40), deploymentReference: "deployment/1" }).status).toBe("published");
    expect(() => transitionLifecycle({ status: "drafted" }, "editorial-approved")).toThrow();
    expect(() => transitionLifecycle({ status: "qa" }, "editorial-approved")).toThrow();
    expect(() => transitionLifecycle({ status: "qa" }, "editorial-approved", { reviewer: "", reviewedOn: "2026-02-30", reference: "" })).toThrow();
    expect(transitionLifecycle({ status: "qa" }, "editorial-approved", { reviewer: "Editor", reviewedOn: "2026-01-01", reference: "review/1" }).status).toBe("editorial-approved");
  });
  test("inventory keeps source records, aliases and explicit catalog ranges", () => {
    const manifest = sourceInventory("/old /new 301!\n/play/* /play.html 200", "X01–X03 and H01");
    expect(manifest.records).toHaveLength(routeInventory.length);
    expect(manifest.redirects).toEqual([{ source: "/old", target: "/new", status: "301!" }]);
    expect(manifest.catalogIds.map((i) => i.id)).toEqual(["H01", "X01", "X02", "X03"]);
  });
});


