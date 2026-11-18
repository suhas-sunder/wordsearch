/** Offline, aggregate-only release evidence. This module installs no telemetry. */
export type SearchSource = "google-web" | "bing-web";
export interface SearchWindow {
  source: SearchSource;
  start: string;
  end: string;
  clicks: number;
  impressions: number;
  hardCollectionClicks?: number;
  completeness: "complete-window" | "partial-export";
  provenance: string;
}
export interface PublishedCohort {
  id: string;
  publishedOn: string;
  productionCommit: string;
  deploymentId: string;
  paths: string[];
}
export interface CohortObservation {
  cohortId: string;
  source: SearchSource;
  start: string;
  end: string;
  clicks?: number;
  impressions?: number;
  indexedUrls?: number;
  canonicalVerifiedUrls?: number;
  note?: string;
}
export interface ReleaseEvidenceInput {
  asOf: string;
  windows: SearchWindow[];
  publishedCohorts: PublishedCohort[];
  observations: CohortObservation[];
}

const dayMs = 86_400_000;
export const cohortCheckpointDays = [7, 14, 28, 56, 90] as const;
export const hardCollectionPath = "/collections/hard-printable-word-searches";

function day(value: unknown): number {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Dates must use YYYY-MM-DD.");
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error("Date does not exist.");
  return time;
}
function object(value: unknown, allowed: string[]): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an aggregate evidence object.");
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new Error("Unexpected evidence field; do not supply puzzle text, query exports or private identifiers.");
}
function count(value: unknown, optional = false) {
  if (optional && value === undefined) return;
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error("Counts must be nonnegative safe integers.");
}
function text(value: unknown, max: number) {
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`Expected nonempty evidence text of at most ${max} characters.`);
}
function source(value: unknown) {
  if (value !== "google-web" && value !== "bing-web") throw new Error("Keep Google Web and Bing Web evidence separate.");
}
function windowDates(value: Record<string, unknown>, asOf: number) {
  const start = day(value.start), end = day(value.end);
  if (end < start || end > asOf) throw new Error("Evidence window is reversed or extends beyond asOf.");
}
function path(value: unknown) {
  if (typeof value !== "string" || !/^\/[a-z0-9/-]+$/.test(value) || value.endsWith("/") || value.includes("//") || /\/(?:play|print|pdf|answer-key|embed|custom|search)(?:\/|$)/.test(value)) {
    throw new Error("Cohorts require canonical editorial paths, never encoded state or utility URLs.");
  }
}

export function validateReleaseEvidence(input: unknown): asserts input is ReleaseEvidenceInput {
  object(input, ["asOf", "windows", "publishedCohorts", "observations"]);
  const asOf = day(input.asOf);
  for (const field of ["windows", "publishedCohorts", "observations"] as const) {
    if (!Array.isArray(input[field]) || input[field].length > 500) throw new Error(`${field} must be an array with at most 500 aggregate records.`);
  }
  const windowIds = new Set<string>();
  for (const window of input.windows as unknown[]) {
    object(window, ["source", "start", "end", "clicks", "impressions", "hardCollectionClicks", "completeness", "provenance"]);
    source(window.source); windowDates(window, asOf); count(window.clicks); count(window.impressions); count(window.hardCollectionClicks, true); text(window.provenance, 500);
    if (!["complete-window", "partial-export"].includes(window.completeness as string)) throw new Error("Declare export completeness.");
    const id = `${window.source}:${window.start}:${window.end}`;
    if (windowIds.has(id)) throw new Error("Duplicate source/window evidence.");
    windowIds.add(id);
  }
  const cohorts = new Map<string, PublishedCohort>();
  const allPaths = new Set<string>();
  for (const cohort of input.publishedCohorts as unknown[]) {
    object(cohort, ["id", "publishedOn", "productionCommit", "deploymentId", "paths"]);
    text(cohort.id, 80); text(cohort.deploymentId, 120);
    if (typeof cohort.productionCommit !== "string" || !/^[a-f0-9]{40}$/.test(cohort.productionCommit)) throw new Error("Published cohorts require an exact production commit SHA.");
    if (day(cohort.publishedOn) > asOf) throw new Error("Draft or future cohorts cannot be recorded as published.");
    if (!Array.isArray(cohort.paths) || !cohort.paths.length || cohort.paths.length > 100) throw new Error("Published cohorts require 1–100 canonical paths.");
    for (const candidate of cohort.paths) {
      path(candidate);
      if (allPaths.has(candidate)) throw new Error("A new URL cannot enter multiple publication cohorts.");
      allPaths.add(candidate);
    }
    if (cohorts.has(cohort.id as string)) throw new Error("Duplicate cohort ID.");
    cohorts.set(cohort.id as string, cohort as unknown as PublishedCohort);
  }
  const observationIds = new Set<string>();
  for (const observation of input.observations as unknown[]) {
    object(observation, ["cohortId", "source", "start", "end", "clicks", "impressions", "indexedUrls", "canonicalVerifiedUrls", "note"]);
    source(observation.source); windowDates(observation, asOf);
    const cohort = cohorts.get(observation.cohortId as string);
    if (!cohort) throw new Error("Observation must reference a genuinely published cohort, not a ready draft.");
    if (day(observation.start) < day(cohort.publishedOn)) throw new Error("Cohort observation predates publication.");
    for (const key of ["clicks", "impressions", "indexedUrls", "canonicalVerifiedUrls"]) count(observation[key], true);
    for (const key of ["indexedUrls", "canonicalVerifiedUrls"]) if (typeof observation[key] === "number" && observation[key] > cohort.paths.length) throw new Error("Verified/indexed count exceeds cohort URL count.");
    if (observation.note !== undefined) text(observation.note, 500);
    const id = `${observation.cohortId}:${observation.source}:${observation.start}:${observation.end}`;
    if (observationIds.has(id)) throw new Error("Duplicate cohort observation.");
    observationIds.add(id);
  }
}

export function releaseMeasurement(input: unknown) {
  validateReleaseEvidence(input);
  return {
    asOf: input.asOf,
    windows: input.windows.map((window) => ({
      ...window,
      clicksExcludingHard: window.completeness !== "complete-window" || window.hardCollectionClicks === undefined || window.hardCollectionClicks > window.clicks ? null : window.clicks - window.hardCollectionClicks,
      hardSharePercent: window.completeness !== "complete-window" || window.hardCollectionClicks === undefined || !window.clicks || window.hardCollectionClicks > window.clicks ? null : Math.round(window.hardCollectionClicks / window.clicks * 10_000) / 100,
      limitation: window.completeness !== "complete-window" ? "Partial export cannot establish a whole-site denominator."
        : window.hardCollectionClicks === undefined ? "Hard-page breakdown unavailable; do not infer zero."
        : window.hardCollectionClicks > window.clicks ? "Page and site grains do not reconcile; excluded-hard metric unavailable."
          : "Arithmetic site-minus-hard for this exact source/window; dimension totals can differ."
    })),
    cohorts: input.publishedCohorts.map((cohort) => ({
      ...cohort,
      ageDays: Math.floor((day(input.asOf) - day(cohort.publishedOn)) / dayMs),
      checkpoints: cohortCheckpointDays.map((age) => ({ ageDays: age, date: new Date(day(cohort.publishedOn) + age * dayMs).toISOString().slice(0, 10), due: day(input.asOf) >= day(cohort.publishedOn) + age * dayMs })),
      observations: input.observations.filter((row) => row.cohortId === cohort.id),
      interpretation: "Missing observations mean unverified, not zero. Compare matched source/window/season; do not infer causality or join independent query and page exports."
    })),
    limitations: [
      "Owner-supplied aggregate evidence; no live connector, indexing inspection or telemetry is installed by this report.",
      "Netlify requests/assets/bots are not sessions; no revenue, RPM, user count or conversion inference.",
      "No publication, scheduling, index submission or production deployment is performed."
    ]
  };
}
