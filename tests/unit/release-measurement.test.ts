import { describe, expect, test } from "vitest";
import { measurementBaseline } from "@/content/measurement-baseline";
import { releaseMeasurement, type ReleaseEvidenceInput } from "@/lib/analytics/release-measurement";

const fixture = (): ReleaseEvidenceInput => ({
  asOf: "2026-11-20", windows: [],
  publishedCohorts: [{ id: "C1", publishedOn: "2026-11-13", productionCommit: "a".repeat(40), deploymentId: "synthetic-test-deploy", paths: ["/word-searches/holidays/example-hard-christmas"] }],
  observations: []
});

describe("offline release measurement", () => {
  test("retains dated Google/Bing grains and the non-hard acquisition denominator", () => {
    const report = releaseMeasurement(measurementBaseline);
    expect(report.asOf).toBe("2026-11-06");
    expect(report.windows[0].clicksExcludingHard).toBe(568);
    expect(report.windows[0].hardSharePercent).toBe(80.88);
    expect(report.windows.filter((row) => row.source === "bing-web").every((row) => row.clicksExcludingHard === null)).toBe(true);
    expect(report.cohorts).toEqual([]); // No draft PR or UI release becomes a new content cohort.
  });
  test("does not invent zero or negative non-hard traffic for missing/incompatible grains", () => {
    const input = structuredClone(measurementBaseline);
    input.windows[0].hardCollectionClicks = input.windows[0].clicks + 1;
    const report = releaseMeasurement(input);
    expect(report.windows[0].clicksExcludingHard).toBeNull();
    expect(report.windows[0].limitation).toMatch(/do not reconcile/);
    expect(report.windows[1].clicksExcludingHard).toBeNull();
    input.windows[0].completeness = "partial-export";
    expect(releaseMeasurement(input).windows[0].limitation).toMatch(/denominator/);
  });
  test("calculates UTC checkpoint ages without scheduling actions or treating missing observations as zero", () => {
    const cohort = releaseMeasurement(fixture()).cohorts[0];
    expect(cohort.ageDays).toBe(7);
    expect(cohort.checkpoints.map((item) => item.date)).toEqual(["2026-11-20", "2026-11-27", "2026-12-11", "2027-01-08", "2027-02-11"]);
    expect(cohort.checkpoints.map((item) => item.due)).toEqual([true, false, false, false, false]);
    expect(cohort.observations).toEqual([]);
    expect(cohort.interpretation).toMatch(/unverified, not zero/);
  });
  test("rejects future/draft publication, short SHAs and invented dates", () => {
    for (const patch of [{ publishedOn: "2026-11-21" }, { productionCommit: "abc123" }, { publishedOn: "2026-02-29" }]) {
      const input = fixture(); Object.assign(input.publishedCohorts[0], patch);
      expect(() => releaseMeasurement(input)).toThrow();
    }
    expect(() => releaseMeasurement({ ...fixture(), asOf: "tomorrow" })).toThrow();
  });
  test("rejects raw/private unexpected fields and non-finite counts", () => {
    expect(() => releaseMeasurement({ ...fixture(), puzzleWords: "private classroom list" })).toThrow(/Unexpected/);
    for (const count of [-1, 0.1, NaN, Infinity, "2970"]) {
      const input: unknown = { ...measurementBaseline, windows: [{ ...measurementBaseline.windows[0], clicks: count }] };
      expect(() => releaseMeasurement(input)).toThrow(/Counts/);
    }
  });
  test("keeps observations from each engine distinct and requires actual cohort references", () => {
    const input = fixture();
    input.observations = [
      { cohortId: "C1", source: "google-web", start: "2026-11-13", end: "2026-11-20", clicks: 5 },
      { cohortId: "C1", source: "bing-web", start: "2026-11-13", end: "2026-11-20", clicks: 2 }
    ];
    expect(releaseMeasurement(input).cohorts[0].observations.map((row) => row.clicks)).toEqual([5, 2]);
    input.observations[0].cohortId = "READY-DRAFT";
    expect(() => releaseMeasurement(input)).toThrow(/published cohort/);
  });
  test("rejects duplicate cohorts/URLs and state/utility URLs", () => {
    for (const path of ["/play/encoded-private-state", "/search", "/word-search-generator?state=secret", "https://example.com/puzzle", "/../private", "/word-searches/example/"]) {
      const input = fixture(); input.publishedCohorts[0].paths = [path];
      expect(() => releaseMeasurement(input)).toThrow(/canonical/);
    }
    const input = fixture(); input.publishedCohorts.push({ ...input.publishedCohorts[0], id: "C2" });
    expect(() => releaseMeasurement(input)).toThrow(/multiple/);
  });
  test("rejects incompatible observation windows and inflated indexing counts", () => {
    for (const patch of [{ start: "2026-11-12" }, { end: "2026-11-21" }, { indexedUrls: 2 }, { canonicalVerifiedUrls: 2 }]) {
      const input = fixture();
      input.observations = [{ cohortId: "C1", source: "google-web", start: "2026-11-13", end: "2026-11-20", ...patch }];
      expect(() => releaseMeasurement(input)).toThrow();
    }
  });
  test("prevents duplicate provider windows and cohort observations", () => {
    const input = structuredClone(measurementBaseline); input.windows.push({ ...input.windows[0] });
    expect(() => releaseMeasurement(input)).toThrow(/Duplicate/);
    const cohortInput = fixture();
    cohortInput.observations = Array(2).fill({ cohortId: "C1", source: "google-web", start: "2026-11-13", end: "2026-11-20" });
    expect(() => releaseMeasurement(cohortInput)).toThrow(/Duplicate/);
  });
});
