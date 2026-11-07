# U05 / F0 / F5 — stable search loading and useful fallback

Review branch `codex/buildout-search-layout`, based on navigation PR 33 at
`2cc4c20885b3d956badd077a92086429470853d5`. This functional fix does not rewrite
or erase PR 15's failing repeated evidence (`5730c2c`). The containing PR pins
the exact candidate; this is not an authorization to release PR 15.

## Cause and change

Layout-shift source inspection attributed desktop search CLS to the footer:
its visible rectangle moved from y=477.25 to 594.86, then left the viewport,
contributing 0.038386 + 0.338889 in the observed run. The whole search control
was inside query Suspense; its fallback omitted the control. The initial idle
results state also displayed No results before the catalog had loaded.

The actual search control now renders in the initial server HTML outside the
inner query/results boundary. The query synchronizes its value after hydration
without moving the control. Loading uses three ordinary result-card skeletons
with the existing 108px card footprint. Initial/no-JS, empty and error states
offer three useful canonical browse cards (topics/categories/guides). There is
no viewport spacer or arbitrary giant min-height. Empty states have real useful
content, and pending catalogs never claim there are no results. A result/query
tag prevents stale results from being labeled with a newly submitted query.

Existing successful query text, links, canonical/robots/description/JSON-LD and
top-ad geometry are unchanged in the comparison below. No global layout,
advertising, puzzle data, URL inventory, metadata or dependency changes.

## Repeated frozen comparison

Baseline navigation source `2cc4c20` served its preserved export on 3262; the
candidate served its fresh export on 3268. Node 25.9.0 and unchanged Chromium/
Playwright dependencies. The existing visual harness retains the original
`after <= before + 0.01` guard, writes run IDs and before/after JSON before the
assertion, and compares home/categories/search/encoded PDF at 390/1440px.

| Run ID (`search-layout-20261106-`) | 390px search before → after | 1440px search before → after | All 8 pairs |
| --- | --- | --- | --- |
| 1 | 0.4575563079 → 0 | 0.4401888624 → 0 | PASS |
| 2 | 0.3428832562 → 0 | 0.3772752821 → 0 | PASS |
| 3 | 0.4575563079 → 0 | 0.4401888624 → 0 | PASS |

All 24 comparisons preserve final visible text, links, SEO and top-ad geometry.
Home/categories remain zero. Utility CLS remains unchanged at 0.6412491319
(390px) and 0.2966089410 (1440px): this is an unresolved separate hydration
issue, not a passing field-vitals claim. The original PR 15 failures remain
historical evidence; only this candidate's search behavior is improved.

Screenshots and `measurements.json` are outside the repository under
`C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1b33a-7733-7163-8af2-24bcc8caa97a\search-layout-1|2|3`.
Command: `BASELINE_URL=http://127.0.0.1:3262 BASE_URL=http://127.0.0.1:3268
VISUAL_RUN_ID=search-layout-20261106-N VISUAL_OUTPUT=<run folder>
node tests/e2e/ui-integration-visual.mjs` (set variables normally in PowerShell).

## Other verification and gates

Full lint, TypeScript, 254 tests / 32 files including all 150 published puzzle
fingerprints, production build (335 pages), static-host (217 sitemap URLs,
35 redirects, six utility shells) and whitespace checks pass. No formatter
script exists. `BASE_URL=http://127.0.0.1:3268 node tests/e2e/search-layout.mjs`
passes delayed catalog truth, stable control geometry, query replacement,
real empty/error browsing, no-JS search HTML and mobile/desktop serious/critical
axe checks. Original thresholds and assertions are not relaxed.

The later combined candidate must integrate this package and repeat its relevant
F1/F5 matrix. Existing route-ad eligibility, Lighthouse best-practices, utility
hydration and manual device/provider gates remain visible. No main push, merge,
auto-merge or production deployment. Rollback is a reviewed revert; production
remains `471a118dd459f2181cd641ed0572ba6dd7005540`.
