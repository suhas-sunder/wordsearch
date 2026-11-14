# Final guest product release candidate — application B

Application source: `f7849cddda2a7df5daff2425ba179b9af21f6272`. Primary review:
[draft PR97](https://github.com/suhas-sunder/wordsearch/pull/97),
`codex/final-product-acceptance`. **Feasible guest implementation and application
QA are complete; product/release acceptance remains BLOCKED.** Neither production
nor editorial publication is approved. The final operations-only review SHA,
Netlify deploy and smoke results are pinned in PR97's final GitHub handoff after
this document is committed; immutable application B remains the runtime baseline.

The [44-feature ledger](PRODUCT-ACCEPTANCE.md) records 38 TESTED, 3 MANUAL ACCEPTANCE PENDING, 2 BLOCKED, 1 OWNER-DEFERRED; zero DONE and
zero manual approvals. TESTED refers to its stated technical scope, not approval
of the whole release. [Every roadmap ID](FINAL-SCOPE-CROSSWALK.md) has an actual
source/test or explicit research/external decision crosswalk. These documents do
not substitute for implementation: the source and executed artifacts are linked.

## Try the actual website

The independently identified [B preview](https://6aeebc77f2d9525d41a905c9--ilovewordsearch.netlify.app)
is READY at exact commit B, deploy`6aeebc77f2d9525d41a905c9`. Seven hosted suites
passed against this immutable permalink, preserving14 actual PDFs / 30 pages.

- Find published puzzles through responsive More/search, keyboard controls,
  contextual FAQs and links. Filter/order the existing hard and answer collections;
  full server-rendered/no-JS listings remain available. Choose system/light/dark.
- Create an exact seeded puzzle with dimensions/directions, overlap, supported
  alphabet, filler/hidden message, clues, bank order, case and instructions.
  Invalid or empty-placement requests retain editable, actionable recovery.
- Solve with pointer/touch/keyboard workflows, including one-cell answers;
  reveal/reset, accurate elapsed time, opt-in resume and default-off local sound.
  Save/reopen up to 20 named definitions on this device without an account.
- Share encoded puzzle links deliberately, or private completion images without
  word lists. Copy/native/draft destinations have fallbacks; links are not encryption.
- Export ordinary or measured large-print PDFs, script-free offline HTML, SVG,
  PNG and tabbed grid text. The measured profile requires 16 pt grid / 18 pt bank or
  rejects actionably. Stale jobs cannot deliver an earlier puzzle after edits.
- Produce 5/10/20 deterministic classroom assignments with student/teacher/both,
  answer order, Letter/A4, Class/name/date/instructions and local presets.
  QR preparation/recovery has stable geometry. App Print is disabled while QR is
  pending/error; early native printing retains its explicit QR-not-ready warning.

## Executed validation and evidence

| Scope | Actual result and limit |
| --- | --- |
| Supported local runtime | Node 22.23.4; direct executable and child PATH verified |
| Application lint/type/unit-content-SEO | Pass,550 tests in 79 files |
| Production export/static host | Warning-free335 pages;217sitemap/35redirect/6utility shells;747 exported files / 176 source hashes |
| Frozen export SHA256 | `3b1b611fe5de81527e8327a31ae6298dd3230596246e2df9b36daa127be279d3` |
| Full visual matrix |448/448 pass,28 archetypes × 8 profiles × 2 themes,0 failures / 0 notices;16 unique images individually reviewed, not all 448 |
| Utility comparison |84/84 candidate CLS 0 plus 2 pending/no-JS pass; original limits unchanged |
| Frozen identity |176 source / 747 disk / 747 literal HTTP hashes plus canonical responses pass before/after; no build/HEAD changes during QA |
| Current functional regression |10 selected suites pass: full 4 e2e constituents, query 6, H10 14, offline 4, accessibility/search-layout/navigation; original offlineAxe failure and precise repair retained |
| Earlier functional carry |Frozen F 48 current suites remain separately scoped; unchanged source proof and actual B exceptions recorded. Historical footer comparator is not claimed passed |
| Actual QR/native printing |36 controlled + 6 normal tracesCLS0;10 PDFs / 20 pages / 1,280 glyphs and24 native-layout PDFs pass; actual72/68 px QR geometry verified |
| Hosted application |7 suites pass on exactB;14 actual PDFs / 30 pages,217sitemap,61draftpaths404, parity/query/H10/library/clues/measuredLP |
| Published preservation |Fresh150 defaults/fingerprints,217 metadata/JSON-LD and35 redirects match production baseline |
| Draft isolation/provenance |61 main + 8 owner and5 H08 seeds absent from722 text assets; pinned source evidence verified |
| PDF carry |87 actual retained files and10 source/export pins reverified. Original1,200 published-PDF execution/hash comparison is historical, not freshly rerun |
| Dependency security |Full and production-only audits0on B; unchanged lockfile. This is not a claim production contains the patches |
| Ordinary Lighthouse |FAILactualexit1:33 audits / 11 groups, Best Practices 77 throughout. Allother existing guard limits pass; hard noneditorial performance 87 / TBT 439 ms explicitly retained |
| Strict route audit |FAILactualexit1: exactly 3 known internal noindex/ad-eligibility findings, no new findings; not waived |
| Operations milestone checks |Pass: direct Node 22.23.4 lint/type and 551 tests in 79 files; ledger 44/44 valid |

[Visual/utility proof](FINAL-B-VISUAL-UTILITY-EVIDENCE.md),
[static/PDF preservation](FINAL-STATIC-PDF-PRESERVATION.md),
[performance gates](FINAL-PERFORMANCE-GATES.md),
[hosted artifacts and full PDF hashes](FINAL-HOSTED-ACCEPTANCE.md),
[offline Axe fixture](BUILDOUT-OFFLINE-REVIEW-AXE-FIXTURE.md) and
[graceful audit cleanup](BUILDOUT-GRACEFUL-AUDIT-CLEANUP.md) define exact scope.
The200%matrix profile is equivalent reflow/DPR, not native browser zoom.

UnsupportedNode25preflight/build results are preserved under
`product-final-f7849cd/node25-attempt/` and excluded. The complete supported
preflight/build was rerun before any B browser acceptance; freeze/carry guards
reject mismatched runtimes. Original a3988visual failures, A's29nonzero QR rows,
failed fixture attempts and both30sAxe diagnostics remain intact.

## Unpublished inventory and honest no-go decisions

Main catalog61 preserves the original60 plus one narrow Christian Nativity draft.
Separately16 measured utility selections and8 owner proposals remain unapproved;
these are not additive approved URLs. Real Christmas/winter/New Year/year-round,
hard/teacher/ESL/large-print and14 annual pack compositions are built source-only.
X03 is a format of unchanged X02; H08 adds five real 30-target utility sheets;
T12 reuses an exact diverse substitute packet. X05/X06 have useful source review
HTML/JSON. X06's exact X08-A action companion never supplies the missing minimum
of 2 approved/published independent children. No filler bank was invented.

The 2027 calendar has 53 review windows, 35 conditional candidate opportunities,
15 enhancements and 3 holds. It is not a publication cron or page quota. Initially
at most one distinct new indexable URL per independently approved weekly release;
zero is valid. Human facts/rights/audience/distinct-intent approval remains false.

Broad X10 worldwide-cultural claims, naive2/4-up shrinkage and unimplemented mask
shapes retain their documented research/no-go boundaries. Native-language/ASL
limitations are truthful; incomplete features are not activated. Optional accounts,
waitlist capture, co-op, paid tiers, OCR and community services require separate
provider/privacy/cost/security/moderation decisions. No speculative backend is shipped.

## Remaining external gates — no silent waivers

1. Three internal eligibility findings: `/categories/health-and-wellness-word-searches`,
   `/collections/brain-training-word-searches`, and
   `/guides/how-hidden-message-word-searches-work`. Owner placement decisions are
   required; these findings are not proved AdSense policy violations. No ad
   placement, fill detection or global first-filled-ad suppression was changed.
2. Ordinary Lighthouse BestPractices77: fresh diagnosis attributes Cookie/
   WarnThirdPartyPhaseout issues to`googleads.g.doubleclick.net`; enabled home77
   twice, ad-free controls100and blocked-loader100are attribution only. They do
   not pass the ordinary gate. Explicit owner/provider/consent risk disposition
   and genuine-network review remain required. No threshold was weakened.
3. Physical Letter/A4 at 100%, actual QR scans, real Safari/Android, assistive
   technology, native zoom and genuine ad fill/consent remain unexecuted manual
   checks. Use [the exact manual checklist](../launch-checklist.md).
4. Owner biography/legal/policy-copy accuracy, editorial factual/rights/audience
   review and independent exact-SHA product/release approval remain separate.
   No candidate has new human editorial approval.48 legacy landscape PDFs below
   9 pt (minimum 7.8208 pt) remain preserved ordinary output, not large-print certification.
5. Real aggregate analytics/cohorts require operator exports/provider access and
   actual released cohorts; no traffic, ranking, revenue or causal uplift is invented.

## Review order and rollback

Review the application in PR97, then the final operations/evidence draft linked
in its handoff. [All 100 prior PR heads/states/bases](BUILDOUT-PR-RECONCILIATION.md)
are reconciled:87 are exact application ancestors; initial 1–13 are preserved
through prior squash/reconstruction. Do not merge older graphs again. Only the
previously approved PR1 was merged to main; subsequent integrated PRs targeted
isolated review branches.

Known-good production baseline is main`471a118dd459f2181cd641ed0572ba6dd7005540`,
Netlify deploy`6aedd79021e0a4d96f61990a`, site`66aedb4c-b210-45ca-b775-d338d4077dc6`.
Final remote/published-deploy and review-head checks are recorded in the handoff.
No main push/merge, auto-merge or production deploy occurred. After a separately
authorized release, record the exact resulting SHA/deploy and public smoke tests.
A regression requires a separately authorized reviewed Git revert or fix-forward;
no force-push or unapproved provider restore. Product code does not auto-approve
any staged editorial selection.

## Recovery and session completion

The original 13-file dirty owner preparation is untouched. Its raw source SHA256
is`b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c`; lossless raw
files/patch/manifest are pushed at 749b5ab under
[recovery instructions](recovery/owner-growth-2026-11-06/README.md). Restore only
into a separate worktree at `6d72c82` if needed; never activate its publication plumbing
in this release. Historical validation mirrors, normalized snapshot markers and
superseded context preparation remain saved in their original worktrees.

Final worktree/remote/agent/process counts, source identity of the operations-only
merge, actual desktop/session safety observations and the last GitHub checkpoint
belong in the final handoff. The [shutdown runbook](OVERNIGHT-SESSION-CONTROL-2026-11-06.md)
records the prior missed shutdown's actual cause: no command was issued because
unsaved desktop state was not verified. This run must finish/push every feasible
checkpoint, stop only owned idle processes normally, refresh actual window/session
checks and issue the authorized `shutdown.exe /s /t 0` as its final operation.
It does not wait idle for routine confirmation. A rejected command must be recorded
with its actual error; no forced fallback or unverified power-off claim is allowed.
