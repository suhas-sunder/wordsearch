import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
// Test-only JS deliberately shares the exact comparator used by the CLI.
// @ts-expect-error Browser/Node audit scripts do not emit TypeScript declarations.
import { compareSnapshots, semanticHash } from "../e2e/seo-semantic-compare.mjs";

const snapshot = () => ({ origin: "https://www.ilovewordsearch.com", sitemap: { status: 200, paths: ["/puzzle"] }, sourceVocabularyFiles: [{ path: "authored-bank", sha256: "original" }], redirects: [{ source: "/old", expectedTarget: "/puzzle", status: 301, location: "/puzzle" }], pages: [{ path: "/puzzle", status: 200, location: null, robotsHeader: null, semantic: { title: "Published title", description: ["Useful description"], canonical: ["https://www.ilovewordsearch.com/puzzle"], robotsHtml: ["index, follow"], h1: [{ level: "h1", text: "Published puzzle", partition: "editorial" }], headings: [{ level: "h2", text: "Using this puzzle", partition: "editorial" }], body: { editorial: "Original useful copy", header: "Main navigation", "shared-tools": "All tools" }, links: { editorial: [{ href: "/other", label: "Other puzzle", rel: "" }] }, vocabulary: ["CAT DOG"], schema: [{ "@type": "CreativeWork", name: "Published puzzle" }], noscript: ["Use printed page"] } }] });

describe("exact indexed semantic preservation", () => {
  it("keeps the reviewed C4 fixture's thirteen owner holds and protects metadata", () => {
    const allowlist = JSON.parse(readFileSync("tests/seo/semantic-preservation-allowlist.json", "utf8")) as Array<{ path?: string; paths?: string[]; field: string; beforeSha256: string; afterSha256: string; reviewDisposition: string }>;
    const decisions = JSON.parse(readFileSync("docs/releases/QUALITY-INDEXED-HOLDS.json", "utf8")) as { ownerApprovalRecorded: boolean; fields: Array<{ path: string; field: string; originalSha256: string; candidateSha256: string; approvalRecorded: boolean }> };
    const held = allowlist.filter(entry => entry.reviewDisposition === "owner-review-required").flatMap(entry => (entry.paths ?? [entry.path!]).map(path => ({ path, field: entry.field, before: entry.beforeSha256, after: entry.afterSha256 })));
    const sort = <T extends { path: string; field: string }>(rows: T[]) => rows.sort((a, b) => `${a.path}:${a.field}`.localeCompare(`${b.path}:${b.field}`));
    expect(held).toHaveLength(13);
    expect(new Set(held.map(entry => entry.path)).size).toBe(7);
    expect(sort(held)).toEqual(sort(decisions.fields.map(entry => ({ path: entry.path, field: entry.field, before: entry.originalSha256, after: entry.candidateSha256 }))));
    expect(decisions.ownerApprovalRecorded).toBe(false);
    expect(decisions.fields.every(entry => !entry.approvalRecorded)).toBe(true);
    const protectedFields = new Set(["title", "description", "canonical", "robotsHtml", "h1", "vocabulary", "schema", "sourceVocabularyFiles", "sitemap.paths", "sitemap.entries"]);
    expect(allowlist.filter(entry => protectedFields.has(entry.field))).toEqual([]);
  });
  it("ignores harmless object-key order, preserving array order and all text", () => {
    const before = snapshot(), after = snapshot();
    after.pages[0].semantic.schema = [{ name: "Published puzzle", "@type": "CreativeWork" }];
    expect(compareSnapshots(before, after).passed).toBe(true);
  });
  for (const field of ["title", "description", "canonical", "robotsHtml", "h1", "headings", "vocabulary", "schema", "noscript"] as const) it(`detects changed ${field}`, () => {
    const before = snapshot(), after = snapshot();
    Object.assign(after.pages[0].semantic, { [field]: field === "title" ? "changed" : field === "headings" ? [{ level: "h2", text: "Changed heading", partition: "editorial" }] : ["changed"] });
    expect(compareSnapshots(before, after).passed).toBe(false);
  });
  for (const partition of ["editorial", "header", "shared-tools"]) it(`does not ignore ${partition} text`, () => {
    const before = snapshot(), after = snapshot();
    Object.assign(after.pages[0].semantic.body, { [partition]: "Changed paragraph" });
    expect(compareSnapshots(before, after).differences.some((diff: { field: string }) => diff.field === `body.${partition}`)).toBe(true);
  });
  it("detects removed link, source bank, redirect, status, header and sitemap/page membership changes", () => {
    const before = snapshot(), after = snapshot();
    after.pages[0].semantic.links.editorial = [];
    after.sourceVocabularyFiles[0].sha256 = "changed";
    after.redirects[0].status = 302;
    after.pages[0].status = 404;
    after.pages[0].robotsHeader = "noindex" as unknown as null;
    after.sitemap.paths.push("/new");
    const fields = compareSnapshots(before, after).differences.map((diff: { field: string }) => diff.field);
    for (const field of ["links.editorial", "sourceVocabularyFiles", "redirects", "status", "robotsHeader", "sitemap.paths", "page.presence"]) expect(fields).toContain(field);
  });
  it("accepts only an exact explained field and rejects stale, wildcard or reused explanations", () => {
    const before = snapshot(), after = snapshot();
    after.pages[0].semantic.body.header = "New navigation";
    const entry = { path: "/puzzle", field: "body.header", beforeSha256: semanticHash("Main navigation"), afterSha256: semanticHash("New navigation"), category: "expected-ui-structure", reviewDisposition: "technical-intent-recorded", reason: "Reviewed navigation reorganization", reviewReference: "https://example.test/review" };
    expect(compareSnapshots(before, after, [entry]).passed).toBe(true);
    after.pages[0].semantic.body.editorial = "Unexpected rewrite";
    expect(compareSnapshots(before, after, [entry]).passed).toBe(false);
    expect(compareSnapshots(before, before, [entry]).staleAllowlist).toHaveLength(1);
    expect(() => compareSnapshots(before, after, [{ ...entry, path: "/*" }])).toThrow();
    expect(() => compareSnapshots(before, after, [{ ...entry, reason: "" }])).toThrow();
    expect(() => compareSnapshots(before, after, [entry, entry])).toThrow();
    expect(compareSnapshots(before, snapshot(), [{ ...entry, paths: ["/puzzle"], path: undefined }]).staleAllowlist).toHaveLength(1);
    const pending = compareSnapshots(before, { ...snapshot(), pages: [{ ...snapshot().pages[0], semantic: { ...snapshot().pages[0].semantic, body: { ...snapshot().pages[0].semantic.body, header: "New navigation" } } }] }, [{ ...entry, reviewDisposition: "owner-review-required" }]);
    expect(pending.ownerReviewRequired).toBe(1);
    expect(pending.passed).toBe(false);
    expect(pending.ownerApprovalRecorded).toBe(false);
  });
});
