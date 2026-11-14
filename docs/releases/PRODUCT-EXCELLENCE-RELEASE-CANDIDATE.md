# Product excellence release candidate

Application C4 is `39c0d3564eb014741e259507c9564a4ee1699f1d`, independently hosted
at [the immutable review preview](https://6aef630dea767b4dae5a4557--ilovewordsearch.netlify.app).
Netlify deploy `6aef630dea767b4dae5a4557` is READY for that exact commit on
`codex/product-excellence-release-candidate`, deploy-preview, with no production
publication. [Draft PR108](https://github.com/suhas-sunder/wordsearch/pull/108)
is the standalone review; [draft PR103](https://github.com/suhas-sunder/wordsearch/pull/103)
preserves the integration against frozen review R. Neither may be merged under
the current authorization. Production remains `471a118dd459f2181cd641ed0572ba6dd7005540`.

**All currently feasible implementation and combined correctness validation are complete.**
The45-feature ledger records38TESTED,3MANUAL ACCEPTANCE PENDING,3BLOCKED and
1OWNER-DEFERRED, with no automatic DONE or approval. Ordinary Lighthouse, internal
advertising eligibility and13indexed-copy fields remain unwaived release gates.
This record does not grant product, editorial, advertising, physical-device or
production approval. The final GitHub handoff pins the later documentation-only
review head, runtime-identity proof and refreshed provider/safety reconciliation.

## What changed and why

| User problem | Implemented correction | Review package |
| --- | --- | --- |
| A delayed uploaded word file could overwrite newer edits. Mobile editing lacked a nearby route back to output. | Revision/request guards preserve newer edits; contextual editing/preview controls have measured 44px touch targets. | PR103; C2 specificity correction retained in history |
| Finding included puzzles on the sensitive hard/answer collections required excess scrolling. | Native Browse links target the existing complete card list; original copy, card order and definitions remain. | PR103 |
| Specialty labels exposed internal terminology or implied handshapes. | Display-only preview/unavailable wording and explicit ASL labels; complete limitations and disabled capabilities remain. | PR102 |
| Repeated concurrent print checks created duplicate iframe setup. | Only identical pending checks coalesce, with independent cancellation and no settled-result cache. Measured frame work improved; no page-speed multiplier is claimed. | PR105 |
| Preserved ordinary landscape output includes 48 cases below 9pt. | A separate opt-in readable PDF uses measured minimum 9pt grid/9.5pt bank; ordinary bytes and measured-large-print 16pt/18pt remain. | PR106 |
| A teacher could receive an obsolete packet after changing settings. | Current-request/unmount guards suppress stale downloads and errors. Choose for me creates an explicit seed without autosaving or exporting. | PR106 |
| Header/navigation and supporting layouts failed enlarged-text reflow. | Intrinsic sizing and natural wrapping preserve meaningful content and controls. | PR107 |
| A settled invalid clue kept a huge pending reservation and busy state. | Pending-only reservation; compact, nonbusy settled error and exact-grid recovery. | PR109 |
| A five-column footer split ordinary words at 200% text despite passing overflow checks. | Intrinsic footer column wrapping, verified with actual word ranges and matched rendered font measurements. | PR110 |
| No-JavaScript search dropped the submitted query. | Native GET transport preserves the query in the URL; an honest static-browse notice explains the results limitation. | PR111 |
| No-JavaScript puzzle pages permanently displayed an inert busy shell. | Explicit interactive-tool requirement plus working Topics/Guides links on 243 existing pages, 151 indexed. Normal loading/retry behavior is preserved. | PR112 |
| Indexed content could change behind broad visual passes. | Exact field/hash semantic comparisons, narrow reviewed expectations and mutation tests distinguish tool/chrome changes from substantive editorial changes. | PR104 and bounded integration controls |

The public-copy audit records actual KEEP decisions for useful shared printing,
standards, classroom and hub guidance. No mass rewrite, new indexable URL,
specialty activation, publication, dependency change or protected-advertising
change was introduced by this excellence pass. Earlier buildout packages and
their full inventory remain covered by the [scope crosswalk](FINAL-SCOPE-CROSSWALK.md)
and [feature ledger](PRODUCT-ACCEPTANCE.md).

## Evidence and provenance

External evidence root:
`C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/`.
Generated screenshots, PDFs, logs and reports remain outside Git. The committed
record describes their exact source, execution and limits; it does not substitute
test counts for visual or physical acceptance.

| Check | Current C4 evidence |
| --- | --- |
| Supported clean install and source checks | Node22.23.4 clean npm ci; lint/type; 677 tests in 84 files; 335-page production build; static217/35/6; full and production dependency audits zero. See `clean-install/` and `source-checks/summary.json`. |
| Frozen source and served export | Clean detached QA04 at C4; selected175 source files and all747 disk/HTTP exports. Export SHA256 `2d86d2d5f132a4c5542c1ec3df4611b712d9273d46f21d4f307a988cca5fb237`. Whole HEAD/tree/clean checks also protect configuration outside the selected subset. |
| Hosted correctness | All14 fixtures passed on the independently verified exact C4 READY preview; 23 actual saved PDFs/79 pages, with fixture and provider provenance. `hosted/attempt-01/`. Advertising loader mocks in correctness tests are explicit and do not establish genuine fill/consent. |
| Semantic preservation | Fresh C3→C4 453 pairs/3 groups and R→C4 677/11 pass. Main→C4 2242/58 retains exactly13 owner-held fields, actual exit1; no unexplained/stale differences. All217 C4 bodies fetched a second time byte-exact, and243 fallback contexts examined. Immutable R/main snapshot reuse is declared, not described as fresh HTTP execution. `seo-preservation/C4-REVIEW-SUMMARY.md`. |
| Static/PDF carry | Zero C4 corpus renders. Exact source/input/installed-byte identity carries the actual C3 1200-PDF execution without relabeling it. Verified173 unchanged runtime files,38 PDF dependency/input files,12 selected installed digests,150 definitions/fingerprints,217 metadata/JSONLD,35 redirects,722 text files and87 retained PDF hashes. `static-pdf-carry/`. |
| Fresh C3 full PDF corpus, explicitly historical execution | `final-e7e00eb/pdf-corpus/attempt-01/`:1200 actual PDFs match whole bytes, two-page counts, student-page geometry and fingerprints,58.337s; raw result SHA256 `80c5c79cec367c7a50e9eea5229c6c7c12d281b860d784c1ddb03cc2cd2444d2`. This is not a fresh2400-page geometry audit. The C4 carry proves the relevant unchanged inputs; current hosted/functional PDF executions are separately identified. |
| Full visual acceptance | All448 cases passed, zero failures/notices, actual exit0 and unchanged source/fixture. `visual/summary.json` and `visual/01-product-visual-acceptance/manifest.json`. Root personally inspected10 selected current images, hash-bound in `ROOT-SELECTED-VISUAL-REVIEW.json`; independent finite reviews are separately recorded. This does not claim manual inspection of448 images. |
| Paired utility acceptance | All84 comparisons passed in explicit preserved-b mode, candidate and baseline maximum CLS0; two pending checks and true no-JS recovery passed. Exact existing request/grid/action/QR/help contracts remain enforced. `utility/summary.json` and `utility/01-utility-layout/measurements.json`. Earlier failed/incomplete attempts are preserved and are not counted as passes. |
| Full functional acceptance | All58 fixtures passed, actual exit0 each, unchanged fixture hashes and source HEAD. `functional/summary.json` covers generator/input/recovery, solver/touch/keyboard, save/resume/share, downloads/cancellation, PDFs/classroom/offline, print layout/overflow, themes/navigation/search/accessibility, enlarged text and specialty limitations. |
| Ordinary Lighthouse | Fresh33audits/11groups, actualexit1: BestPractices77 with cookie/inspector failures. Accessibility/SEO100 and all other existing limits pass; hard noneditorial performance86/TBT459ms is retained. Reported medianCLS0 includes a retained0.013513 font-shift trace. No whole-page speed gain or field CWV pass claimed. `lighthouse-ordinary/attempt-02/`; see FINAL-PERFORMANCE-GATES.md. |
| Strict advertising-eligibility audit | Fresh C4 actual exit1, exactly three retained representative mismatches in `route-audit.log`. Complete implementation scope remains12 existing noindex pages. Fresh330-HTML scan confirms exact2categories/8collections/2guides, unchanged protected source/25adCSSrules; `ad-eligibility-current-source.json`. |

The historical `footer-presentation.mjs` and `footer-acceptance.mjs` cosmetic-only
comparators assume all other historical page/footer content is unchanged. They
are explicitly not applicable to this integrated continuation and are not
reported as passes. Exact semantic partitions plus current footer/header,
visual, keyboard/accessibility and advertising geometry fixtures supply the
relevant coverage. The runner records that distinction. Failed earlier actual
attempts, harness corrections and source-specific C1–C3 results remain retained
in the chronological excellence record and external candidate namespaces.
The first final Lighthouse launcher attempt exited1 before any audit because
Windows ESM imports require a file URL. Only the external output-capture launcher
was corrected with `pathToFileURL`; the unchanged committed fixture/configuration,
provider requests and thresholds are used by separately retained attempt02.

## Remaining release decisions and manual checks

The [indexed-content guard](EXCELLENCE-SEO-PRESERVATION.md) retains13 material
changed fields across seven routes: five FAQ body/heading pairs, privacy
body/headings and editorial-policy body. These need owner/editorial approval.
The exact footer has an independent Category B review; that review does not
approve Category C fields. Existing unchanged Category C proposals, including
the teacher-hub collection mismatch, remain separately held in the
[copy audit](EXCELLENCE-PUBLIC-COPY-AUDIT.md).

The [advertising decision](EXCELLENCE-AD-ELIGIBILITY-DECISION.md) compares narrowly
enforcing the documented draft rule with an explicitly reviewed policy revision.
The strict audit samples three routes; the full static scope is two categories,
eight collections and two guides. It is an internal requirements mismatch, not
a finding of provider-policy violation. No placement or test waiver is authorized.
Ordinary Lighthouse remains a separate gate; provider-disabled diagnostics are
never a release pass.

The [owner handbook](PRODUCT-EXCELLENCE-OWNER-HANDBOOK.md) supplies seven practical
flows, important screenshots and actual PDFs. Physical printing at100%, actual
Safari/Android devices, assistive technology, genuine ad fill/consent, biography/
legal accuracy and independent product/release review remain unexecuted. Native
browser zoom is also manual: Computer Use stopped URL inspection before any
zoom input because it could not determine the browser URL confidently enough to
enforce policy. CSS200% and equivalent reflow do not replace native zoom approval.

All61 main staged candidates,8 owner proposals, measured utility selections and
the53-window/35-opportunity calendar remain unpublished. Calendar windows never
mandate releases; initially approve at most one genuinely distinct new URL per
weekly release, with zero a valid decision. Some compositions additionally need
approved independent child puzzles; their source completeness does not grant
publication approval. Paid/auth/community infrastructure remains owner-deferred.

## Recovery and authorized release procedure

Keep frozen B `f7849cd` and R `ada6b6e` in PR97. Original owner13 dirty files are
preserved in their original worktree; lossless raw recovery is committed at
`749b5ab`. Excellence WIP checkpoints `bdfe33a6` and `7e65ff09` remain locally and
on `codex/recovery-product-excellence-wip` and
`codex/recovery-product-excellence-copy-wip`; do not drop their stash objects or
overwrite owner work. The completed application is pushed on both review branches.
The otherwise uncontained merge-only checkpoint `6f0982079245b24a4ba441e76b81de4cf8033587`
is also remotely preserved on `codex/recovery-largeprint-source-inventory-6f09820`.
Its two parents are C4 ancestors and `git cherry` finds no missing patch payload;
this preserves historical graph identity, not an additional unintegrated feature.
All120 worktrees, including historical dirty states, remain on disk. Their
inventory does not imply every historical dirty mirror was independently
committed; no owner or historical worktree was reset, deleted or repurposed.

After separate owner approval, refresh main, resolve/retest any intervening
application changes, then use the authorized single main-triggered Netlify
deployment. Record exact commit/deploy and check finding, making, solving,
sharing and student/answer output. No such production operation is authorized
or performed here. To recover a bad approved release, prepare a reviewable Git
revert/fix-forward and let its authorized main deployment apply it; do not
manually publish an older Netlify deployment. Known production reference:
`471a118dd459f2181cd641ed0572ba6dd7005540`, deploy
`6aedd79021e0a4d96f61990a`.

Final remote reconciliation, task-process closure, Windows session checks and
the actual nonforced shutdown command outcome belong in the final GitHub handoff.
The earlier missed November5 shutdown issued no command; later Windows lifecycle
events corroborate a normal November7 shutdown at07:24Z and boot at13:41Z.
No power/security setting was changed. See the [session-control record](OVERNIGHT-SESSION-CONTROL-2026-11-06.md).
