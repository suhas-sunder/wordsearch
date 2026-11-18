import type { ReleaseEvidenceInput } from "@/lib/analytics/release-measurement";

/** Dated aggregates already authorized in public planning PR #14, not raw exports. */
export const measurementBaseline: ReleaseEvidenceInput = {
  asOf: "2026-11-06",
  windows: [
    { source: "google-web", start: "2026-08-04", end: "2026-11-03", clicks: 2970, impressions: 50794, hardCollectionClicks: 2402, completeness: "complete-window", provenance: "Owner GSC Chart.csv + Pages.csv aggregates recorded in planning PR #14 (2525e8c); Web; raw exports remain private." },
    { source: "google-web", start: "2026-09-09", end: "2026-10-06", clicks: 1022, impressions: 15376, completeness: "complete-window", provenance: "Owner GSC Chart.csv aggregate in planning PR #14; hard-page breakdown not supplied for this window." },
    { source: "google-web", start: "2026-10-07", end: "2026-11-03", clicks: 1792, impressions: 25002, completeness: "complete-window", provenance: "Owner GSC Chart.csv aggregate in planning PR #14; no causal attribution." },
    { source: "bing-web", start: "2026-09-09", end: "2026-10-06", clicks: 494, impressions: 10208, completeness: "complete-window", provenance: "Owner Bing daily CSV aggregates recorded in planning PR #14; no query/page grain supplied." },
    { source: "bing-web", start: "2026-10-07", end: "2026-11-03", clicks: 384, impressions: 11475, completeness: "complete-window", provenance: "Owner Bing daily CSV aggregates recorded in planning PR #14; no query/page grain supplied." }
  ],
  // #1 was a UI release, not a cohort of new indexed URLs. #15/#16 are drafts.
  publishedCohorts: [],
  observations: []
};
