# Product candidate04 — development and review record

Draft [PR70](https://github.com/suhas-sunder/wordsearch/pull/70), branch
`codex/product-candidate-04`, based on frozen03. This is an active development
record, not a final release candidate or product acceptance claim.

## What is combined

All earlier02/03 work remains in ancestry. Subsequent normal merges preserve
annual packs49, FAQs50, search52, calendar gaps53, classroom fields54, guest
library55, calendar56, visual fixes57, catalog audit58, HTML59, contextual
links60, pack discovery61, context validation62, one-cell solving63, exact
save paths64, print flags65, guest checkpoint66, utility layout67, PDF fit68
and theme control69. The Lighthouse attribution investigation is also merged.
Exact package references and evidence are recorded in PRODUCT-ACCEPTANCE.json;
its generated Markdown is verified by four acceptance-ledger tests.

Root's original dirty eight-topic growth preparation and every preexisting
worktree remain untouched. The two preserved owner overlays retain the original
raw source SHA; source dates are not promoted into human editorial approval.
No new candidate has entered runtime content, sitemap, search or public links.

## Try after the final frozen build

- Browse and search published topics with keyboard navigation, More and theme
  selection. Follow the tested teacher worksheet-pack link.
- Open a published/shared puzzle in the maker, name/save it explicitly, reload,
  reopen the exact request and solve it with pointer, touch or keyboard.
- Generate a Letter/A4 worksheet, optional answer, SVG or offline HTML. Invalid
  custom PDF layouts should retain inputs and show actionable fit errors.
- Generate5/10/20 worksheet assignments with student-only, teacher-only or both
  packets, answers-last/interleaved, measured large type, optional Class line
  and bounded custom directions. Reopen an explicitly saved local preset.

Current work still repairs browser-print answer parity/extreme-grid pagination,
adds supported advanced settings and meaningful clue output, and checks explicit
share destinations. These paths must be tested after their final integration.

## Evidence already available, with limits

Package records include actual browser PDFs, extracted glyph bounds, rendered
visual inspection, protected advertising regression and responsive/axe checks.
PR68 preserves all1200 historical QR-enabled PDF byte hashes across150 puzzles,
both papers, orientations and print scales. Some unchanged standard-landscape
outputs have type below9pt; measured large-print output is a separate explicit
profile. Neither result certifies a physical printer or audience suitability.

At the first04 reconciliation, lint/typecheck, four acceptance-ledger tests,
source-only60-candidate audit and both dependency audit scopes pass. Combined
04 production build/browser/PDF/visual/static-host checks remain pending the
active repairs. No skipped/interrupted command counts as a pass.

Expanded preflight at source `6c9d59377b26f9216d48a67036f2ec5bce248abb`:
all448 tests across60 files pass, including the150 published fingerprints and
content audit344 records/217 indexable/zero duplicate warnings. Actual staged
PDF audit checks all60 candidates on Letter and A4 with zero geometry findings;
its export-isolation comparison explicitly uses frozen03 `out`, because04 has
not been built yet. Outside-repository report:
`C:/Users/Suhas/AppData/Local/Temp/ilws-candidate04-staged-pdf-preflight.json`.
Both `npm audit` and `npm audit --omit=dev` report zero vulnerabilities.
Vitest touched seven snapshot working-file line endings; normalized diffs are
empty and no snapshot value was accepted or changed.

Real03 hosted preview and artifacts are documented in
PROVIDER-VERIFICATION-2026-11-06.md. Its exact review SHA08ffcd2 and frozen
application1839428 are separate from04; do not reuse those results as04 proof.

## Final validation to record at the exact candidate

Use supported Node22. Serialize the production build, browser matrices and
Lighthouse audits. Record exact source SHA, clean/dirty state, actual export,
commands, exit codes and outside-repository artifacts before adding a final
evidence-only commit. If source changes, repeat affected combined checks.

Required checks include lint/typecheck/unit/content/SEO, production build,
static-host217 sitemap/35 redirects/6 shells, full functional browser matrix,
input/workload/settings/recovery, solver/completion/library, print controls,
actual PDFs/pack/HTML, parity/navigation/theme/search/utility CLS, responsive
visual/manual screenshot review, axe/keyboard/zoom/reduced motion, protected
ads, published fingerprint/metadata/canonical zero-diffs, both dependency
audits, complete source-only PDF/export audit and acceptance-ledger validation.
Retain route-audit and ordinary enabled Lighthouse failures explicitly.

After local validation, obtain04's exact-SHA Netlify deploy-preview through the
existing Git PR integration. Read deploy ID/context/commit, then run hosted parity
and `test:provider-preview` with `NETLIFY_PREVIEW_URL`, `EXPECTED_PREVIEW_COMMIT`
and an outside-repository `PREVIEW_AUDIT_OUTPUT`. No manual deployment/login or
provider setting changes. Review new surfaces on the actual hosted candidate.

## Unresolved approvals and manual checks

- Three existing noindex/ad-eligibility findings require owner placement
  decisions. They are not proved AdSense violations; protected ad code is unchanged.
- Repeated enabled-home Best Practices77 comes from Google third-party cookie
  and Inspector warnings. Ad-free controls100 and diagnostic loader blocking do
  not waive the existing gate. An explicit owner disposition is still required.
- Physical Letter/A4 printers, real Safari/Android/assistive technology/native
  zoom, actual QR scans and genuine ad fill/consent remain manual.
- All editorial/factual/rights/audience reviews remain independent. Calendar53
  windows/35 opportunities defaults to zero, initial approved URL cap1.
- Independent exact-SHA product/release approval is absent. Accounts, payment,
  realtime/OCR/community infrastructure remains explicitly owner-deferred.

## Rollback and production boundary

Known production reference is main
`471a118dd459f2181cd641ed0572ba6dd7005540`, ready deployment
`6aedd79021e0a4d96f61990a` in project
`66aedb4c-b210-45ca-b775-d338d4077dc6`. Remote main was rechecked after the04
ledger push and matches. A failed preview cannot replace that production deploy.

This authorization never merges/pushes main, auto-merges or deploys production.
After separately authorized release, a regression requires a reviewed revert or
fix-forward commit through ordinary Git delivery, with exact resulting SHA and
deploy ID recorded. Do not force-push main or restore/publish a provider deploy
without separate authorization. Preserve local source/state and independently
review editorial release selections rather than activating the inventory.
