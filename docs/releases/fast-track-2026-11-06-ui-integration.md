# Remaining fast-track UI candidate — November 6, 2026

Status: implemented, combined regression validation complete with retained baseline
failures; **draft review only**, no merge/deploy authorization.
Branch: `fasttrack/2026-11-06-ui-integration`, based on production/main
`471a118dd459f2181cd641ed0572ba6dd7005540` (released PR #1).
The final review SHA is this record's containing branch head/PR head.

## Provenance and isolation

Read the [PR #7 review](https://github.com/suhas-sunder/wordsearch/pull/7#issuecomment-6686157023)
and [PR #10 review](https://github.com/suhas-sunder/wordsearch/pull/10#issuecomment-6686157786)
before implementation. Reconstructed **only their own deltas** on current main
in a new review branch. Original PRs #7/#10, their heads, parent branch and evidence
are preserved without force-pushing or retargeting their historical diffs. This
new main-based draft is their combined replacement release candidate. Do not merge
the old child branches or replay PR #1's already-released footer changes.

| Owner issue / package | Original source | Reconstructed implementation | Reversal |
| --- | --- | --- | --- |
| Owner 2 / WP-05a static Print/PDF icons | PR #7, `2d87f3b56db2f5ec8af2eeadfd82c74ee5fb1873` | `627fd36` (original `3313b20`) plus copied historical evidence commits | Revert `627fd36` through a reviewed branch |
| Owner 2 / WP-05b semantic category icons | PR #10, `48c9fa17d11ec126562ba1ea05746a5d0d3e259c` | `6a01eff` (original `9a8afbb`) plus original whitespace correction | Revert `6a01eff` through a reviewed branch |

Original evidence: [WP-05a](WP-05a.md), [WP-05b](WP-05b.md). These remain historical
individual-package results; the combined results below supersede them for this
candidate. Each implementation remains independently reversible.

Changed application files: `app/globals.css` (scoped icon styles),
`components/page/CategoryIcon.tsx` (typed existing Lucide map),
`components/page/DiscoveryCards.tsx`, `components/page/PageSections.tsx`,
`components/search/PuzzleSearch.tsx`, `components/search/SearchPageClient.tsx`,
`content/discovery.ts` (category-slug presentation metadata only), and
`components/puzzle/StaticPuzzleRoute.tsx` (decorative Print/PDF icons).
Tests: category SSR tests, targeted category/action browser checks and new
`tests/e2e/ui-integration-visual.mjs`. Documentation: two original evidence files
plus this combined record. No footer/logo implementation diff, new dependencies,
functional weekly code, ad code/selectors/wrappers or deployment configuration.

## Combined validation

Node 22.23.4, clean `npm ci`, default production flags. Frozen application source
is `5f92615`; subsequent changes add only visual-test/evidence files. Static host
on 3250 serves this candidate; baseline on 3252 serves the PR #1 tree (verified
byte-identical tracked source tree to main `471a118`). All commands below passed
unless explicitly marked failed:

- `npm run lint`, `npm run typecheck`, `npm test`: 18 files / 115 tests.
- `npm run build`: 334 static pages; `npm run audit:static-host`: 217 sitemap
  pages, 35 permanent redirects, six utility shells; no runtime handlers.
- `BASE_URL=http://localhost:3250 node tests/e2e/static-utility-icons.mjs` and
  `node tests/e2e/category-icons.mjs`: desktop/mobile actions, semantic categories
  and live search suggestions/results.
- `BASE_URL=http://localhost:3250 npm run test:e2e`: full 53 routes × nine widths,
  search/navigation/utility/print and pointer/touch/tap/keyboard solver workflows;
  advertising suite: nine eligible routes × five widths and 14 ad-free routes.
  Protected sticky first-fill suppression/lifecycle mocks pass unchanged.
- `npm run test:a11y`: 14 archetypes, mobile/desktop, axe, controls, focus/skip,
  reduced motion, overflow and zoom.
- `npm run test:preview` and `npm run audit:pdf`: preview, answer composition,
  actual downloaded two-page A4 landscape PDF, text, answers, QR and filename.
- Final `git diff --check`, lint and typecheck include the new visual harness.
- **Failed, retained:** `npm run audit:routes`: 212 baseline issues (209 live-ad
  wrapper false positives plus three documented repository ad-eligibility
  mismatches). Repair/classification belongs to weekly PR #8, excluded here.
  `npm ci` reports 20 pre-existing dependency advisories. No lockfile changes.
- **Failed, retained:** `BASE_URL=http://localhost:3250 npm run audit:lighthouse`
  exits 1 for Best Practices 77 on all 11 route/form-factor groups (third-party
  cookies / DevTools inspector issues). SEO/accessibility 100 throughout; mobile
  LCP 2103–2332ms, median CLS 0 in all groups. Hard-puzzle mobile performance
  87/TBT 434ms is an additional observed risk. No threshold was changed. Other
  validation was active, so timings are local observations, not field guarantees.

## Visual comparison and limitations

Run `BASELINE_URL=http://localhost:3252 BASE_URL=http://localhost:3250
VISUAL_OUTPUT=<outside-repo-directory> node tests/e2e/ui-integration-visual.mjs`
(PowerShell: set the corresponding `$env:` variables). Four surfaces (home,
categories, food search and encoded PDF utility) × 390/1440px × before/after.
Asserted identical visible main text, links, canonical/robots/description/JSON-LD
and top-ad bounding box, no document overflow, and no added CLS beyond 0.01.
The original record claimed all eight comparisons passed, with equal CLS within each viewport pair. Those historical run logs were not persisted, so that pass claim is unverified and is superseded by the repeated results below. The original table used viewport columns (390px and 1440px), rather than before/after columns; 0.342883 and 0.377275 described different viewports. This does not explain away fresh failures:

| Surface | 390px before = after | 1440px before = after |
| --- | --- | --- |
| Home | 0 | 0 |
| Categories | 0 | 0 |
| Search hydration | 0.342883 | 0.377275 |
| Utility hydration | 0.641249 | 0.296609 |

The first new harness version incorrectly imposed absolute CLS ≤0.1 on the
baseline and stopped at mobile search. It was changed to the intended
before/after regression comparison; no existing test was weakened. High existing
search/utility hydration shifts remain a separate weekly investigation, not a
claim of good field CWV. The historical observation is not sufficient evidence of a stable passing CLS guard.

Sixteen screenshots are outside the repository at
`C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1aec8-a64d-7790-8f8e-f0c913f746e9\integration`
(`before|after-home|categories|search|utility-390|1440.png`). Representative mobile
category and desktop PDF screenshots were visually inspected. Real-device/ad
network/Netlify production checks remain the release operator's gates; local
mock results do not certify AdSense compliance.

## Review and production gate

ChatGPT independently reviews this candidate, resolves baseline gate dispositions,
and coordinates any approved merge/Netlify monitoring. Codex did not merge, push
main, enable auto-merge, deploy or request credentials. Known-good production and
rollback source is `471a118dd459f2181cd641ed0572ba6dd7005540`; ChatGPT must record
its actual Netlify deployment ID before release. After a main change, revalidate
the exact combined merge candidate. Record the resulting production SHA, deploy
ID, URL and smoke checks; no deployment is claimed by this review record.

## November 6 continuation: repeatable visual evidence

Frozen baseline: PR 1 tree `3f1b2b3db8ad3ed90e65228855b54c3910251a3e`,
byte-identical tracked tree to main `471a118`; candidate application tree unchanged
from `fea066d`. Existing static exports served on 3252/3250. Node 25.9.0,
Chromium via unchanged Playwright dependency; no application rebuild or change.
Only the harness now writes the run ID and every before/after pair to an
outside-repository `measurements.json` **before** enforcing the unchanged
`after <= before + 0.01` assertion. Screenshots and JSON are retained under
`C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1b33a-7733-7163-8af2-24bcc8caa97a\pr15-1|2|3`.

Each run used `BASELINE_URL=http://127.0.0.1:3252`,
`BASE_URL=http://127.0.0.1:3250`, a distinct `VISUAL_OUTPUT` folder and
`VISUAL_RUN_ID=pr15-reconcile-20261106-N`, then
`node tests/e2e/ui-integration-visual.mjs`.

| Run ID suffix | Mobile search before | Mobile search after | Desktop search before | Desktop search after | Outcome |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.3428832562 | 0.3428832562 | 0.3772752821 | 0.4401888624 | FAIL: +0.0629135802 > +0.01 |
| 2 | 0.4575563079 | 0.4575563079 | 0.4401888624 | 0.3772752821 | PASS: all eight pairs |
| 3 | 0.3428832562 | 0.3428832562 | 0.3772752821 | 0.4401888624 | FAIL: +0.0629135802 > +0.01 |

Home/categories had CLS zero in all pairs. Mobile utility was 0.6412491319
in both members of every pair; desktop utility was 0.2966089410 in run 2.
Runs 1/3 correctly stopped at the failed desktop-search assertion, before the
last utility pair. All text, links, SEO and ad geometry comparisons executed
before each stop passed. The opposite desktop-search delta in run 2 establishes
variance; it does not prove the icon change is harmless or justify choosing only
the passing trial. There is **no stable final passing run**. The PR remains a
draft with an unresolved search-hydration/layout-shift release gate. Diagnose
that behavior separately; do not weaken this threshold or alter ad protections.
Focused ESLint and final whitespace check pass for the harness/evidence change.
