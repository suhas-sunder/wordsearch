import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getSitemapRecords } from "@/content/registry";

interface Allowance {
  path?: string;
  paths?: string[];
  field: string;
  beforeSha256: string;
  afterSha256: string;
  category: string;
  reason: string;
  reviewDisposition: string;
  reviewReference: string;
  ownerDecisionReference?: string;
  verificationReference?: string;
}

interface HoldDecision {
  id: string;
  path: string;
  field: string;
  historicalProductionSha256: string;
  historicalCandidateSha256: string;
  integrationBaselineSha256: string;
  finalSha256: string;
}

const ownerIssue = "https://github.com/suhas-sunder/wordsearch/issues/117";
const ownerDisposition = "owner-decision-verified";
const sha256 = /^[0-9a-f]{64}$/u;
const protectedFields = new Set([
  "title", "description", "canonical", "robotsHtml", "h1", "vocabulary", "status", "location",
  "page.presence", "sitemap.paths", "sitemap.locations", "sitemap.status", "redirects", "redirect.invariant"
]);

const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8"));
const allowanceKey = ({ path, field }: { path: string; field: string }) => `${path} ${field}`;

function readAllowances(filename: string) {
  const entries = readJson<Allowance[]>(`tests/seo/${filename}`);
  const map = new Map<string, Allowance & { path: string }>();
  for (const entry of entries) {
    expect(entry.path !== undefined && entry.paths !== undefined, entry.field).toBe(false);
    const paths = entry.paths ?? [entry.path!];
    expect(paths.length, entry.field).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path, entry.field).toMatch(/^\/[^*]*$/u);
      const key = allowanceKey({ path, field: entry.field });
      expect(map.has(key), key).toBe(false);
      expect(entry.beforeSha256, key).toMatch(sha256);
      expect(entry.afterSha256, key).toMatch(sha256);
      expect(entry.beforeSha256, key).not.toBe(entry.afterSha256);
      expect(entry.reason.trim(), key).not.toBe("");
      expect(entry.reviewReference.trim(), key).not.toBe("");
      map.set(key, { ...entry, path });
    }
  }
  return map;
}

describe("issue 117 exact semantic allowances", () => {
  it("limits the release delta to the individually reviewed paths and fields", () => {
    const delta = readAllowances("issue117-delta-allowlist.json");
    const rows = [...delta.values()];
    const fieldCounts = new Map<string, number>();
    for (const row of rows) {
      expect(row.reviewDisposition, row.path).toBe(ownerDisposition);
      expect(row.ownerDecisionReference, row.path).toBe(ownerIssue);
      expect(row.verificationReference?.trim(), row.path).toBeTruthy();
      fieldCounts.set(row.field, (fieldCounts.get(row.field) ?? 0) + 1);
    }
    expect(delta.size).toBe(243);
    expect(Object.fromEntries(fieldCounts)).toEqual({
      "body.editorial": 199,
      "links.editorial": 29,
      "body.faq": 1,
      schema: 12,
      "sitemap.entries": 1,
      sourceVocabularyFiles: 1
    });
    expect(rows.filter(({ field }) => field === "schema").map(({ path }) => path).sort()).toEqual(
      getSitemapRecords().filter(({ contentType }) => contentType === "guide").map(({ canonicalPath }) => canonicalPath).sort()
    );
    expect(delta.has("/online-word-search body.faq")).toBe(true);
    expect(delta.has("/sitemap.xml sitemap.entries")).toBe(true);
    expect(delta.has("/@published-source sourceVocabularyFiles")).toBe(true);
  });

  it("preserves the old technical review and resolves only its thirteen exact holds", () => {
    const historical = readAllowances("semantic-preservation-allowlist.json");
    const delta = readAllowances("issue117-delta-allowlist.json");
    const combined = readAllowances("issue117-semantic-allowlist.json");
    const decisions = readJson<{
      ownerDecisionReference: string;
      fieldCount: number;
      releaseApproved: boolean;
      fields: HoldDecision[];
    }>("docs/releases/ISSUE117-DECISIONS.json");
    const decisionsByKey = new Map(decisions.fields.map((decision) => [allowanceKey(decision), decision]));
    const oldHolds = [...historical].filter(([, row]) => row.reviewDisposition === "owner-review-required");

    expect(decisions.ownerDecisionReference).toBe(ownerIssue);
    expect(decisions.releaseApproved).toBe(false);
    expect(decisions.fieldCount).toBe(13);
    expect(decisions.fields).toHaveLength(13);
    expect(decisions.fields.map(({ id }) => id).sort()).toEqual(
      Array.from({ length: 13 }, (_, index) => `H${String(index + 1).padStart(2, "0")}`)
    );
    expect([...decisionsByKey.keys()].sort()).toEqual(oldHolds.map(([key]) => key).sort());
    expect([...combined.keys()].sort()).toEqual([...new Set([...historical.keys(), ...delta.keys()])].sort());

    for (const [key, row] of combined) {
      expect(protectedFields.has(row.field), key).toBe(false);
      const legacy = historical.get(key);
      const change = delta.get(key);
      const decision = decisionsByKey.get(key);

      expect(row.beforeSha256, key).toBe(legacy?.beforeSha256 ?? change?.beforeSha256);
      expect(row.afterSha256, key).toBe(change?.afterSha256 ?? legacy?.afterSha256);
      if (legacy && change) expect(change.beforeSha256, key).toBe(legacy.afterSha256);
      if (decision) {
        expect(legacy?.beforeSha256, key).toBe(decision.historicalProductionSha256);
        expect(legacy?.afterSha256, key).toBe(decision.historicalCandidateSha256);
        expect(change?.beforeSha256 ?? legacy?.afterSha256, key).toBe(decision.integrationBaselineSha256);
        expect(row.afterSha256, key).toBe(decision.finalSha256);
      }
      if (change || decision) {
        expect(row.reviewDisposition, key).toBe(ownerDisposition);
        expect(row.ownerDecisionReference, key).toBe(ownerIssue);
        expect(row.verificationReference?.trim(), key).toBeTruthy();
      } else {
        expect(row.reviewDisposition, key).toBe("technical-intent-recorded");
        expect(row.category, key).toBe(legacy?.category);
        expect(row.reason, key).toBe(legacy?.reason);
        expect(row.reviewReference, key).toBe(legacy?.reviewReference);
        expect(row.ownerDecisionReference, key).toBeUndefined();
        expect(row.verificationReference, key).toBeUndefined();
      }
    }
  });
});
