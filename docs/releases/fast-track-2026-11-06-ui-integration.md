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
All eight comparisons passed; measured CLS was exactly equal on each pair:

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
claim of good field CWV. No new shift was observed from these icons.

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
