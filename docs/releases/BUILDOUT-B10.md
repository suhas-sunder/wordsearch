# B10 / U21 — offline release measurement, first milestone

Status: implemented, source-only operations tooling; review-branch validation
record. This milestone does not install analytics, collect user events, inspect
live indexing, publish content or schedule jobs. Base is weekly draft PR #16,
`74b8ff95024b60a7f299175cd153b3c4fb974835`; production remains
`471a118dd459f2181cd641ed0572ba6dd7005540`.
Branch: `release/2026-W46-growth-monitoring`. Final review SHA is the containing
commit/PR head. Revert this isolated milestone through review for rollback.

## Actual implementation

- `lib/analytics/release-measurement.ts`: strict aggregate-only input validation,
  source/window separation, site-minus-hard arithmetic only with a known complete
  denominator, immutable production-cohort references, chronological windows,
  canonical path/duplicate protection and 7/14/28/56/90-calendar-day checkpoints.
- `content/measurement-baseline.ts`: the dated aggregates already published in
  planning PR #14, not raw private GSC/Bing exports. Includes source limitations.
  No new-indexed-content cohort exists yet: PR #1 was UI; #15/#16 are drafts.
- `scripts/report-release-cohorts.ts`: offline JSON CLI, 1MB file bound, explicit
  errors/nonzero exit. `report:cohorts` is the only package script added.
- `tests/unit/release-measurement.test.ts`: nine focused cases covering mixed
  grains, missing versus zero, invalid dates/counts/status references, repeated
  URLs, utility-state privacy boundaries, duplicates, and checkpoint arithmetic.

The report never joins separate query/page exports, infers traffic from Netlify
requests, fills missing measurements with zero, combines Google and Bing clicks
into a growth claim, or labels a draft deployment as published. It validates
input structure/provenance fields, **not** the truth of a supplied deployment ID,
editorial approval or Search Console indexing status. The operator must verify
those independently against approved release evidence/provider records.

## Usage and privacy

```text
npm --silent run report:cohorts
npm --silent run report:cohorts -- <private-aggregate-evidence.json>
```

The default snapshot is explicitly as of November 6, 2026, with search windows
ending November 3. Google Aug 4–Nov 3 totals 2970 clicks, hard collection 2402;
the arithmetic remainder is 568 (80.88% hard share). Page/site totals can differ
by aggregation, so this is a named arithmetic measure, not unique visitors or a
causal result. Recent Google/Bing windows retain their separate totals and
missing hard-page breakdowns stay null. Partial exports cannot supply a whole-site
denominator. No live subscription or future data is fabricated.

Supply the documented typed `ReleaseEvidenceInput` shape. Keep source dates and
completeness explicit. A published cohort requires its real 40-character
production commit, provider deployment ID, publication date and canonical new
paths. Observations before publication or after `asOf` reject. Supply only
sanitized aggregate counts and evidence notes; never put puzzle text, student
names, encoded URLs, private query exports or credentials into notes/provenance.
The parser rejects unexpected fields, but it is not a PII detector. Keep private
inputs and report output outside the public repository. No network calls occur.

## Reconciliation and limits

See [current GitHub reconciliation](BUILDOUT-RECONCILIATION-2026-11-06.md). The
complete master/catalog plan is planning PR #14 at
`2525e8cfb6c825bb4d34be92e5c32757d138dc7b`. It authorizes build-now review branches;
publication stays independently gated. The date checkpoints are report metadata,
not a promise of unattended monitoring or an automation installation.

Source inspection found no analytics client dependency/script in the current
app; `app/privacy/page.tsx` says the application does not install analytics.
This proves only the checked-in implementation, not the absence of provider-side
or other-account analytics. The plan reports GSC Wizard subscription and Semrush
API limits and no confirmed WordSearch PostHog project. New tracking/consent,
credentials, paid data or infrastructure remain separately approved work.

The owner must provide/verify fresh settled aggregate data and indexing evidence
for real cohort assessment. No new production content means there are no new
content-cohort results to announce. No ranking, revenue, conversion, session or
year-over-year claim is inferred from this historical baseline.

## Validation

Node 22.23.4 clean install; lint/typecheck; 24 test files / 209 tests; default
offline report; production static build (334 pages); static-host audit (217
sitemap pages, 35 redirects, six utility shells); and whitespace checks passed.
All 150 published puzzle/preset/legacy fingerprints remain unchanged. Final
validation includes the canonical trailing-slash rejection and CLI failure checks.

No browser surface imports the new modules; no app route/template, ads, content
registry, public JSON/header/redirect, puzzle engine or PDF implementation changes.
Browser/ad/print suites therefore are not rerun for this offline-only package;
their combined parent evidence remains [PR #16](https://github.com/suhas-sunder/wordsearch/pull/16).
This is not a claim of new child-branch browser/device/provider verification.

Retained parent failures: route audit three documented repository ad-eligibility
mismatches (not AdSense policy determinations), Lighthouse Best Practices 77,
production Zod high advisory and 16 full-tree advisory records. `npm ci` reports
those 16 unchanged records. No test weakening, advertising change or dependency
upgrade is made here. Main remains unprotected; the existing proposal is unchanged.

## Next bounded operations work

Consume the B01 frozen publication manifest after actual releases, gather real
settled query × page/indexing evidence through authorized exports/connectors, and
record matched seasonal cohorts. Provider error-log analysis requires real
source/referrer evidence; do not add blanket redirects from sampled probes.
Continue unrelated build milestones while measurement data is unavailable.
