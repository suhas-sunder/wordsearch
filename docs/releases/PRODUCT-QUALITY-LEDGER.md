# Product quality and editorial decision ledger

**Current implementation:** [Issue117 release handoff](ISSUE117-RELEASE.md) and
[draft PR118](https://github.com/suhas-sunder/wordsearch/pull/118) implement the
subsequent owner decisions. They resolve the exact copy holds and draft-ad
conflicts described here; remaining performance/manual/release gates are explicit.
This earlier audit and its staged-content recommendations remain historical evidence.

Review date: 2026-11-12 (America/New_York). This ledger supersedes the earlier
claim that all feasible editorial work was complete. It does not supersede
historical test evidence, approve publication, or change issue #113's schedule.

## Reconciled source and authorization

GitHub and Netlify independently confirm production main
`471a118dd459f2181cd641ed0572ba6dd7005540`, published deploy
`6aedd79021e0a4d96f61990a`. Drafts #108 and #103 still point to
`a0df44f6bdaccd1ecd72e34ff0bd32a65fa01d80`; application C4 is
`39c0d3564eb014741e259507c9564a4ee1699f1d`. The exact documentation-head preview
`6aef6f95e2f91d352b6f3d50` is READY and unpublished. Recent PRs and issue #113
were read; no newer application head was found. Original owner worktree's
thirteen dirty files and all historical worktrees/recovery branches remain intact.
This pass uses `codex/product-quality-editorial-review` in a separate worktree.
After severe filesystem delays on E:, the final authoritative review clone is
`C:/Users/Suhas/.codex/tmp/wordsearch-product-quality-git-20261113`, on the same
new branch and exact base. The E: review worktree is preserved as a checkpoint.

Current GSC/Bing prioritization could not be refreshed: GSC Wizard refuses
access with `payment_required/subscription_required`. The 80.9% hard-hub share
is the historical Aug 4–Nov 3, 2026 sample, not current traffic. No ranking
benefit, safety guarantee or new search-volume evidence is claimed.

Evidence root (outside Git):
`C:/Users/Suhas/.codex/visualizations/2026/11/13/01a1d313-5cce-7880-aff3-d45fd55e6b71/quality/`.
Fresh `http/capture.json` binds 217 production and 217 preview responses to
URL, time and SHA256; all returned 200. These are actual fetched HTML, not
434 individually inspected browser screenshots. Additional rendered and
application test results are recorded in the final handoff, with failures and
unexecuted checks kept separate.

## 1. User-visible functionality defects

| Issue | Evidence and impact | Decision / actual status | SEO / approval |
| --- | --- | --- | --- |
| Q01 PDF action name mismatch | Fresh preview PDF dialog says “Choose Download large-print PDF below”; the button says “Download measured large-print PDF.” Users searching for the named control must infer the match. | Implemented one sentence correction in `PuzzleUtilities.tsx`; existing large-print browser fixture asserts help names its actual button. Independent source review supports the scope. Final test evidence below. | Hydrated dialog only; no indexed prose, output logic or minimum-size promise changes. Authorized safe UI fix. |
| Q02 Transient print-fit warning | IAB Ancient Egypt view displayed “Print styles could not be measured” while showing the valid grid; subsequent play preview loaded. | Independent fresh C4 browser review did not reproduce a nonempty warning; Print opened normally. Eight final-build measured downloads also passed. Observation retained; no unsupported fix or weakened fit check. | No implementation; no general browser/printer guarantee inferred. |
| Prior repaired flows | C4 already fixes stale upload/packet output, settled-error busy state, native search transport, no-JS fallback, enlarged text and print measurement coalescing. | Preserve; do not rebuild. Historical 58-fixture results are not new execution. | Existing exact-SHA approvals and manual gates remain. |

## 2. UI/UX and visual quality

Fresh browser sampling followed homepage → Ancient Egypt → PDF choices → Play.
The loaded editor exposes words, directions, grid size, print, PDF, answers and
play. Internal editorial copy is visually prominent under the H1 and repeats
below the editor. This is a content defect, not a reason to redesign the builder.
The dialog truthfully distinguishes ordinary larger grid type, readable PDF and
measured large print; preserve its sizing, fit and privacy limitations.

No unsupported visual redesign, ad-reservation change or source-wide text pruning
was made. Responsive/dark/keyboard/output evidence and finite image inspection
must be read with the exact runtime and sample limits in the final handoff.

## 3. Public-copy and editorial issues

| Issue | Specific problem / source | Decision / status | Scope and risk |
| --- | --- | --- | --- |
| Q03 Internal instructions published | `topics.ts` projects `context` into descriptions and notes; registry/templates repeat it. Ancient Egypt, Reading, Swimming and others expose writer constraints. | All 150 records individually reviewed in [published review](QUALITY-PUBLISHED-PUZZLES.md). Exact pilot proposals retain constraints in source-only notes. No indexed copy changed. | Broad shared reuse: Ancient Egypt alone affects seven indexed URLs. Owner-held. |
| Q04 Hard-hub draft narration | Angle and final selection sentence discuss unfinished inventory instead of helping choose a puzzle. | Propose one angle sentence and removal of only the final guidance sentence. Preserve title/H1/meta/canonical, first guidance sentence, all 16 children and grids. | One historically dominant indexed URL; additional independent review performed. Owner-held. |
| Q05 Incorrect Homophones count | “eight sets or pairs”; the actual bank has two triples and five pairs. | Propose only eight → seven. | Exactly one indexed page; no bank/seed migration. Owner-held pilot. |
| Q06 Guide implementation instructions | Answer-key guide asks visitors to verify stored coordinates rather than naming the visible answer control. | Propose Show Answers plus checking highlighted words and exclusions. Other guide issues are inventoried separately. | One indexed guide; preserve heading and metadata. Owner-held. |
| Q07 Publication boundary | Public and internal editorial concerns currently share loosely named text fields. | Implemented typed source-only review model plus dependency-graph regression guard. Public runtime cannot import `content/review`, directly or through a library/barrel. Existing public models/records stay unchanged. | Zero new routes. Guard protects provenance separation; it does not magically sanitize old public prose or certify future authored facts. |
| Q08 Repeated context | Fresh production and preview HTML both repeat the same context three times on every one of the 150 published puzzle pages. The hero, puzzle note and word-list context share one source value. | Recommend a separate exact-scope template deduplication proposal after pilot review. No removal applied. | 150 indexed routes; owner-held, separate from the five-field pilot. |

The four-case pilot has five proposed fields and nine unique indexed URLs;
overlapping scope is not added twice. See the source-only pilot review package
for exact before/after strings, constraints and route arrays. No blanket rewrite
is approved. Legitimate safety, privacy, reproduction and fit limitations remain.
The nonpuzzle inventory and recommendations are in
[page-copy review](QUALITY-PAGE-COPY.md).

## 4. Existing indexed-content change holds

[Exact decision sheet](QUALITY-INDEXED-HOLDS.md) and its authored JSON manifest
retain **13 fields across seven URLs**: five FAQ bodies and headings, privacy
body/headings, editorial-policy body. They are prior candidate changes, not the
preexisting defects in Q03–Q06 and not approvals granted by this pass. Suggested
defaults generally retain useful candidate help and accurate disclosures for
explicit approval; never restore an inaccurate claim merely to clear a diff.
All ownerApprovalRecorded values remain false.

## 5. Staged 2027 inventory quality

[Individual inventory review](QUALITY-STAGED-INVENTORY.md) covers all 61 main
candidates, 16 utility selections and eight owner proposals without counting
packet/calendaring references as new content. Main recommendations: 38 strong
candidates for review, 10 need substantive improvement, 11 better merged into
existing pages, two duplicate/insufficient-value, zero banks requiring deletion.
Strong means worth a human decision, not approved. Descriptions still need
publication-specific editing and factual/audience/output acceptance. All remain
unpublished; no calendar slot was filled or moved.

## 6. Technical SEO and indexing

Q09: the committed semantic allowlist had stopped at an earlier candidate,
although the final C4 review had 58 exact groups. Fresh execution against that
old fixture reported 677 unexplained differences and 219 stale entries. The
independently reviewed C4 file is now committed unchanged (SHA256
`a180535e5ae4c074b8607c75073c12d8003bd00f52ef8375c17d8094767cc6ee`). It yields
2,242 exact differences, zero unexplained, zero stale, and the original 13
owner-held fields. The command still exits 1 for those holds. No wildcard or
metadata allowance was added. A regression compares all thirteen route/field/hash
tuples against the independent decision manifest and forbids metadata, H1,
schema, vocabulary or sitemap allowances. This repairs reproducibility; it is
not editorial approval or a relaxed acceptance threshold.

Preservation targets remain 150 puzzle fingerprints, 217 sitemap/canonical
records and 35 redirects. No H1, title, description metadata, canonical, word
bank, seed, publication flag, lastmod or structured-data definition is edited.
Search/utility variants remain noindex. Shared product templates are useful when
their puzzle/selection/task differs; repetition alone does not justify removal.
Story Elements versus Storytelling merits an intent review, not automatic
merging or redirecting. Proposed seasonal keyword variants should use existing
collections when they offer no distinct task.

Quality criteria follow Google's [people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
and [spam policies](https://developers.google.com/search/docs/essentials/spam-policies),
read during this pass. Evaluate usefulness, accurate claims and distinct purpose;
no mandatory word count, AI-detector score or ranking formula is used.

## 7. Performance and accessibility

No application performance optimization is justified by this copy pass. A fresh
bounded hard-puzzle mobile Lighthouse sample on the final local build, with the
provider enabled and the repository's original options/thresholds, reports
performance87/accessibility100/Best Practices77/SEO100, LCP2103ms, CLS0 and
TBT467ms. Actual exit1: third-party cookies and DevTools inspector issues keep
Best Practices below95. This single sample is not a sitewide or repeat-run
median, and its87 versus historical86 is not evidence of improvement. No provider
or assertion was disabled. Provider-enabled performance cannot be replaced
with ad-mocked correctness tests. Automated layout/axe/keyboard results never
stand in for physical devices, real assistive technology or printer approval.

## 8. Advertising and security blockers

The existing 12 noindex/draft ad-wrapper conflicts remain owner-held: two
categories, eight collections, two guides. Use the existing
[exact ad decision](EXCELLENCE-AD-ELIGIBILITY-DECISION.md); no protected ad logic,
placement, lifecycle or assertion was changed. Dependency/security checks are
fresh only where explicitly recorded in final evidence. No packages were added
to the project.

## 9. Manual acceptance

Remaining owner checks: actual Letter/A4 print readability and margins;
Safari/Android/physical touch and native zoom; assistive technology; genuine ad
fill/consent; legal/biography truth; final independent product/editorial acceptance.
Agent source review and selected rendered samples are useful evidence, not human
acceptance. Unrelated active browser/editor and other project tasks were observed;
shutdown must not interrupt those sessions or unverified unsaved work.

## 10. Release readiness and next work

**Draft review only.** The safest implementation is the inherited C4 application
plus the verified local dialog-help correction; editorial proposals remain
separate, inactive source-only material. Final handoff must pin the new PR/SHA,
preview, executed checks and unresolved gates. #113 must fail closed until
specific owner editorial/ad/manual/performance decisions and exact-artifact
release approval exist. No merge/push to main, production deployment, content
publication or schedule change is authorized here.

Owner inspection: open the PDF dialog and match its help to the measured-print
button; read the four pilot cases and their route scopes; solve one existing
puzzle; download Letter/A4 student and answer pages; review the thirteen prior
holds separately. Approve or reject precise fields rather than the entire
inventory. Preserve all current recovery checkpoints.

## Fresh validation and scope

All application checks below use Node 22.23.4 and lockfile dependencies unless
explicitly labeled supplementary. No dependency version or protected advertising
code changed. Clean dependency installation was performed in a task-owned C:
directory and linked into the isolated C: Git clone. Historical-source tests
use its full fetched ancestry, not an archive without a repository.

| Check | Result / evidence / limit |
| --- | --- |
| Clean install | Exact Node22 `npm-cli.js ci --prefix C:/Users/Suhas/.codex/tmp/wordsearch-quality-deps-20261113 --no-fund --no-audit --prefer-offline`: 490 packages, exit0, 45s. Same package/lock bytes. |
| Full unit/content/SEO suite | Final `node node_modules/vitest/vitest.mjs run --maxWorkers=1`: 689 tests / 85 files, exit0,139.62s (`unit-integrated-final.log`), including the final hold-manifest regression, published fingerprints, output and staged isolation. Earlier688-test run and affected26/16-test runs are retained. No snapshot values changed; test-generated line-ending rewrites were restored. |
| Lint and TypeScript | Full ESLint and `tsc --noEmit` exit0; changed final semantic test separately linted and full typecheck repeated successfully. No formatting script exists; `git diff --check` is the applicable whitespace check. |
| Production build | Search index208; Next15.5.29 builds335 pages, exit0 (`build-final.log`). C: parent has another lockfile, producing an inferred-workspace-root warning; no owner file was removed or config changed to suppress it. |
| Static host | `node tests/e2e/static-export-audit.mjs`:217 sitemap pages,35 redirects,6 utility shells, exit0. |
| Broad browser acceptance | `node tests/e2e/browser-smoke.mjs`:53 routes×9viewports, plus search, navigation, utility, print and pointer/touch/tap/keyboard solver checks; exit0. `browser-smoke-result.txt` records the observed exec result. Synthetic touch is not physical-device acceptance. |
| Rendered reading inventory | `node tests/e2e/public-copy-capture.mjs`:253 actual no-JS browser visits, including217 indexed routes and36 extra templates, exit0 (`rendered-final/rendered-copy.json`). All307 classified nonpuzzle passages match visible text after ignoring whitespace/CSS uppercase only; initial strict contiguous matching of eight whole trust-page partitions is retained separately. No claim of personally viewing253 screenshots. |
| Exact existing SEO diff | Fresh production/preview217+217 and35redirects each, with exact HTTP hashes. Committed C4 fixture gives0unexplained/0stale/13owner holds; actual exit1. See `main-to-c4-reviewed-allowlist.json`. |
| Measured output / changed dialog | `tsx tests/e2e/single-large-print.ts`:8actual PDFs across320/390/844/1280, Letter/A4 and light/dark; exact student/answer grids,16pt/18pt minima, geometry and visible crowding refusal passed. New assertion matches helper to actual button. Root viewed390dark dialog and final1280A4 student/answer renders. Poppler emitted a Symbol-font warning; Latin glyphs were intact in inspected renders. |
| Accessibility | `node tests/e2e/accessibility.mjs`:14archetypes×mobile/desktop, no serious/critical axe findings, runtime errors, control-size or overflow failures. Skip-link/reduced-motion/equivalent viewport checks pass. Its “zoom” log means CSS viewport equivalence, not native browser zoom or AT acceptance. |
| Advertising regression | `node tests/e2e/monetization-placeholders.mjs`:9eligible×5viewports plus14ad-free routes pass. Provider-fill mocks are correctness evidence only. |
| Strict eligibility | `node tests/e2e/route-audit.mjs`:exit1 on the same three representative internal-policy mismatches; complete protected scope remains12. `route-audit-final.log`. No waiver. |
| Security | Fresh full `npm audit --json`:0vulnerabilities in production and development tree (`npm-audit-full.json`). |
| Bounded performance | Exact Node22 runs external `quality/bounded-lighthouse.mjs`, derived from the repository Lighthouse runner with one hard-mobile sample and unchanged options/thresholds. Actual exit1 for Best Practices77; performance87, accessibility100,SEO100. `lighthouse-hard-mobile-final.json` and full `.lhr.json` retain results. Full11-group repeat-run suite was not rerun. No performance improvement claimed. |
| Independent selected tasks | Fresh immutable C4 discovery/keyboard/ASL/print review plus2PDFs/4personally inspected pages; explicitly supplementary bundled Playwright1.62.1 and not labeled new-source acceptance. [Exact evidence and limitations](QUALITY-FLOW-REVIEW.md). |

The final exact-SHA semantic comparison and immutable new preview acceptance
are pinned in the final GitHub handoff. Older448visual/84utility/58functional matrices are historical, not
relabeled fresh runs for this one-line dialog change.

Failed/interrupted environment attempts are not passes: initial plain `npm ci`
used the system Node25 shim and was stopped; the explicit Node22 E: installation
stalled; an archive-based Vitest run failed the historical Git-source check and
was replaced by the full C: clone without changing the test. The local old-E:
reading capture timed out; remote no-JS reading stopped at HTTP403 after more
than125pages, with partial evidence retained. Final C:253-route capture passed.
No security challenge, test threshold or failed application assertion was bypassed.

The source-only editorial pilot is a separate draft package. Its five exact
before/after fields retain internal constraints, affect nine unique existing
URLs, and remain `pending-owner-review`. The implementation draft does not apply
those proposals to public content. Final publication still requires the original
holds, new pilot decisions if selected, protected-ad decision, provider gate and
real-world/manual approval. Zero new pages are published by either package.
