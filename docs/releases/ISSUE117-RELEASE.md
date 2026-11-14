# Issue 117 implementation and release handoff

[Draft PR 118](https://github.com/suhas-sunder/wordsearch/pull/118) is the combined candidate for [owner issue 117](https://github.com/suhas-sunder/wordsearch/issues/117). It builds on exact PR116 head `a057692afaadf4d530d1dfe60b0fcd351e473a7e`. The larger diff against main includes the preceding tested integration; issue117's work is isolated in the commits after that head.

Application changes end at `bc852290ac49cde0e7ce94a614b33edcbda7cdfc`. The first successful hosted verification uses `64f1cc79b56b67e70c3b762e42e992c5b6c45ffb`, [immutable deploy 6af7dbfb9569e3f022c4a747](https://6af7dbfb9569e3f022c4a747--ilovewordsearch.netlify.app). Subsequent changes contain tests, exact allowances and release evidence. The PR description and issue117/113 handoff record the final exact head and its independently verified READY, unpublished immutable deploy, avoiding a self-referential commit identifier here.

## Implemented decisions and files

- `content/collections.ts`, `content/curated-topics-prompt6.ts`, `content/guides.ts`: all five exact pilot replacements, fifteen further confirmed instruction-like contexts and fourteen collection/guide body corrections. Source-only `content/review/pilot.ts` and `issue117.ts` preserve constraints and exact before/after reuse evidence. The large-print guide distinguishes ordinary grid sizing from the measured PDF and limits the font minima to grid and word bank.
- `components/page/CuratedPuzzlePage.tsx`: narrowly suppress identical context paragraphs on exactly150 puzzle pages. Distinct notes, introductions, difficulty guidance and banks remain. Commit `e22394e` isolates this change.
- Three category/collection/guide route templates and `lib/monetization/editorial-template.ts`: registry-driven eligibility sends exactly12 unpublished/noindex outputs to the existing draft policy. All40 published outputs retain placements. Global provider/loader/slot IDs/geometry/first-fill/consent code is unchanged. Collection browsing guidance replaces the generic process sentence on13 indexed collections; draft outputs with cards use the same shared template.
- `content/categories.ts` and `components/page/RouteHub.tsx`: fifteen reviewed fields across14 indexed routes remove process narration and inaccurate availability claims. The source-only visitor-help manifest records24 prior occurrences.
- About, Privacy, `content/routes.ts` and specialty presentation: narrow factual biography correction, automatic-draft/storage/share/provider disclosures, actual solver control names and three explicit unavailable-format labels. Specialty routes remain noindex and inactive formats are not activated.
- Guide template, registry and Article helper: remove an unsubstantiated review date from twelve visible bylines, twelve Article objects and twelve sitemap lastmod entries. Stored dates and authors remain; no replacement date is invented.

The [individual H01–H13 decisions](ISSUE117-DECISIONS.md), [truth verification](ISSUE117-TRUTH-REVIEW.md), [editorial scope](ISSUE117-EDITORIAL.md), [visitor-help scope](ISSUE117-VISITOR-HELP.md), [ad policy](ISSUE117-AD-POLICY.md) and [deduplication](ISSUE117-CONTEXT-DEDUP.md) give the supporting detail. Original historical audit/hold fixtures remain unchanged.

## Exact SEO acceptance

Fresh production and immutable-preview HTTP captures contain217 pages and35 redirect observations per origin. Every retained raw HTML hash was checked. The independently verified local capture additionally matches each served body against the exported file. Hosted page semantics match the local export; provider noindex headers are expected. Whole authored-file raw hashes differ between Windows CRLF checkout and Git LF blobs; both complete sources were independently compared after only CRLF normalization.

The [243-field delta fixture](../../tests/seo/issue117-delta-allowlist.json) names every changed URL and field:199 editorial bodies,29 link-label partitions, one FAQ body, twelve guide schema objects, one sitemap-entry array and one authored-source hash array. No title, description, H1, canonical, HTML robots, vocabulary, link destination/order/rel, redirect or sitemap membership change is allowed. Complete exact reconstruction verified all199 bodies, including every non-puzzle paragraph. All150 source banks, fingerprint/direction snapshots and answer paths remain protected. The seventeen allowed puzzle-copy edits reverse to both complete original authored-source hashes.

The [composed main fixture](../../tests/seo/issue117-semantic-allowlist.json) preserves existing technical decisions and applies the exact issue117 decisions through checked before/after hash chains. It accounts for2468 fields in288 explicit path groups, with zero unexplained differences, zero stale allowances and zero remaining copy-approval holds. The historical fixture still retains its thirteen holds. Two focused fixture tests prevent widening this scope or turning copy approval into release approval. Neither comparison grants production permission.

## Fresh validation

All commands ran with Node22.23.4 and a clean lockfile install. Full logs and generated artifacts remain outside Git under the issue117 evidence directory; the [SHA-256 manifest](ISSUE117-EVIDENCE.json) binds the principal reports.

| Check | Result |
| --- | --- |
| `npm ci` in a clean dependency directory | PASS;490 packages, existing lockfile unchanged. Worktree dependency junction points to that clean install. |
| `node node_modules/eslint/bin/eslint.js .` and `node node_modules/typescript/bin/tsc --noEmit --incremental false` | PASS after the final audit-script type correction. |
| `node node_modules/vitest/vitest.mjs run --maxWorkers=2` | PASS;748 tests/90 files with original timeouts. Subsequent composed semantic fixture tests and legacy preservation suite:19 passed. |
| `node node_modules/tsx/dist/cli.mjs scripts/generate-search-index.ts`; `node node_modules/next/dist/bin/next build` | PASS;208 search records and335 generated pages. Successful Netlify build independently validates the pushed source. |
| `npm audit --json`; `git diff --check` | PASS;zero vulnerabilities, no whitespace findings. No formatter command is configured. |
| `node tests/e2e/browser-smoke.mjs` | PASS;53 routes ×9 widths plus search/navigation/print/solver interactions on the integrated3539 export. Later changes were editorial/schema-only; affected final3543 HTML and paths were checked again below. |
| `node node_modules/tsx/dist/cli.mjs tests/e2e/issue117-copy-scope.ts` | PASS;217 SEO pages,49 exact authored-copy proposals,150 context triples→one, bank payloads, all other puzzle body text, internal links and twelve precise date exceptions. Independent complete non-puzzle-body reconstruction also passed. |
| `node tests/e2e/route-audit.mjs`; static-export audit | PASS;217 sitemap URLs,35 redirects, expected noindex routes/utility shells. The original three strict ad assertions remain unchanged. |
| `node node_modules/tsx/dist/cli.mjs tests/e2e/editorial-ad-eligibility.ts` | PASS;52 outputs,12 drafts ×2 widths with no provider attempts, six published browser positive controls. Interception tests are not genuine ad-fill evidence. |
| `node tests/e2e/monetization-placeholders.mjs` | PASS;9 eligible routes ×5 widths,14 ad-free routes, pending/error/unfilled/late-fill/sticky behavior. |
| Named puzzle library, classroom preset and solver-progress browser suites | PASS;explicit save/reload/delete, corruption/quota/storage-denial behavior and tested local-data boundaries. |
| `node node_modules/tsx/dist/cli.mjs tests/e2e/single-large-print.ts` | PASS;eight actual Letter/A4 PDFs, exact grids/answer paths, minimum16pt grid/18pt bank, fit/error/ordinary-option checks. Four rendered student/answer pages inspected: readable and unclipped. Poppler emitted a Symbol-font lookup notice; the inspected Latin pages rendered correctly. |
| `node tests/e2e/share-route-parity.mjs` | PASS;all six utility rewrites, grid tokens, PDF rows, answer paths, QR images, invalid states and indexability. |
| `node tests/e2e/accessibility.mjs` | PASS;14 archetypes ×2 widths, no serious/critical axe findings, overflow or runtime errors; skip-link/reduced-motion and automated200% checks. This is not native zoom or assistive-technology acceptance. |
| `node node_modules/tsx/dist/cli.mjs tests/e2e/provider-preview-smoke.ts` | PASS on immutable64f1cc7 preview;61 staged URLs absent from HTTP/search/sitemap, preview noindex and production canonicals, actual hosted search/theme, five-page student PDF, mobile pack and no-JS guide checks. |
| `node tests/e2e/seo-preservation-diff.mjs <capture> <issue117 allowance> <report>` | PASS;fresh main→preview2468 exact fields and retained a057→preview243 fields. |

Initial full-unit execution while build/lint ran had two existing PDF cases exceed their unchanged5000ms timeout. That failed log remains; the complete two-worker rerun passed. A late link-scope verifier addition initially caused TypeScript error TS2345 and the first preview build failed. Commit64f1cc7 fixes the structural array type; complete type/lint checks and the replacement provider build passed. Preliminary3537 connection errors and3538 interrupted/stale-export runs are not acceptance evidence. No failed checks were hidden or weakened.

## Remaining release gates

Ordinary Lighthouse remains **FAIL**. Final local provider-enabled sample:95 performance/100 accessibility/**77 Best Practices**/100 SEO, LCP**2519ms**, CLS0, TBT155ms. Independent reports attribute the two Best Practices failures to DoubleClick cookies/inspector issues. Production sampling also failed (BP58, LCP8179ms), adding Cloudflare-injected deprecations. Provider source is unchanged; these results do not establish the cause of LCP or waive either failing threshold. See the exact [three-origin disposition](ISSUE117-DECISIONS.md#ordinary-lighthouse-comparison).

Physical100% printing; real Safari/Android/touch/native zoom; assistive technology; genuine candidate ad-fill/stacking; regional consent/CMP configuration and operation; legal certification; and independent exact-artifact release acceptance remain **UNEXECUTED**. One production Auto Ads anchor was observed filled; it does not establish candidate consent or ad acceptance. Existing first-party biography pages support owner self-description, not independent credential certification.

Performance disposition, relevant manual acceptance and final artifact approval materially block the production-release gate. Physical print/font usability must be accepted before claiming physical-output readiness; real-device/AT checks before claiming those workflows accepted; consent/legal checks before accepting affected advertising use. After any separately authorized rollout, monitor crawl/indexing, LCP/CLS, provider errors/fill and puzzle/PDF/share parity. Monitoring does not replace the unresolved gates.

## Scheduled handoff and recovery

Main remains `471a118dd459f2181cd641ed0572ba6dd7005540`, production deploy `6aedd79021e0a4d96f61990a`. No main merge, production deployment, schedule alteration, draft publication or new indexed URL occurred. The original owner worktree retains its thirteen unrelated dirty files; other projects and applications were left running.

The next appropriate Friday opportunity is **2026-11-20**, only if issue113's acceptance gates have been satisfied. Zero new URLs is appropriate for this correction release. The38/10/11/2 staged-content quality recommendations and at-most-one independently reviewed URL rule remain unchanged.

If rejected before release, leave main/production as they are and revise the draft. If a later authorized release regresses, prepare reviewed Git revert/fix-forward changes from the recorded main baseline and re-run affected gates through the existing scheduler. Do not invoke a provider restore/publish action. The correction commits above isolate the principal rollback boundaries. Recommended next work is the genuine unresolved acceptance/performance disposition, not another generic editorial audit.
