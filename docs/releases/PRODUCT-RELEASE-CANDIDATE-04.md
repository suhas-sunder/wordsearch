# Product release candidate04 — acceptance reconciliation

Verified runtime baseline: `26fa36d1113ecbef7721ed158aa9441cd16c57d2` in
[draft PR70](https://github.com/suhas-sunder/wordsearch/pull/70).
**Final acceptance is in progress.** This record must be completed from actual
results; it does not authorize production or any editorial publication.

The definitive 44-feature matrix is [PRODUCT-ACCEPTANCE.md](PRODUCT-ACCEPTANCE.md),
generated from validated JSON. TESTED records technical evidence; DONE requires
named independent approval. No production or new-content approval is recorded.

## Product available for review

The frozen [Netlify preview](https://6aee9d8754f1183fd8251956--ilovewordsearch.netlify.app)
is ready at the exact application SHA, deploy `6aee9d8754f1183fd8251956`.
Read-only noindex/canonical/sitemap checks pass. Hosted browser acceptance remains
pending for the new combined review. This permalink cannot replace production.

- Find published puzzles through responsive navigation, More, keyboard search,
  useful topic links, authored FAQs and the published catalog. Select system,
  light or dark appearance, including narrow layouts and overlays.
- Create a seeded puzzle with explicit dimensions/directions, presets, overlap,
  supported alphabet, hidden message or custom filler, bank order, instructions
  and numbered clues. Invalid input remains editable with actionable recovery.
- Play with pointer, touch or keyboard, including one-cell answers; reveal/reset,
  pause/revisit, optional local progress and default-off local sound. Name and
  save an exact puzzle on this device without an account.
- Share an encoded puzzle deliberately, or share a private completion image that
  excludes puzzle text. Copy/native sharing and WhatsApp/email drafts are tested
  separately; encoded links are not encryption.
- Preview and print Letter/A4 student/answer sheets; download ordinary or measured
  large-print PDFs, offline script-free HTML, standalone SVG, PNG or tabbed grid
  text. Unsupported fonts/crowded layouts fail visibly. Stale jobs cannot deliver
  an earlier puzzle after editing, invalidation or navigation.
- Build 5/10/20 reproducible classroom assignments, choose student/teacher/both,
  answer order, measured large type, Class/name/date and custom instructions;
  explicitly save/reopen bounded device-only presets.

## Master backlog reconciliation

| Lane / catalog scope | Implemented and bounded result | Evidence |
| --- | --- | --- |
| B00 / U01 | Prior packages integrated without resetting original work; input/workload bounds, direction semantics, security fixes and legacy parity | Integration01/02/03 records; PR70; F0 ledger |
| B01/B02 / U23 | Typed source inventory, lifecycle/approval separation, collision checks, frozen request/grid/answer hashes, real-PDF and export-isolation tools, pinned Git provenance | PR17/20/56/58/79/80; F4 ledger |
| B03 / U11/U27 | Guest batch builder, stable assignment IDs, 5/10/20 sheets, student/teacher packets, deterministic keys and local presets | PR19/23/27/38/44/54; F3 ledger |
| B04 | Measured large-print utility/pack/single output, complete-bank fitting, real browser/offline geometry preflight and fail-closed recovery | PR25/27/43/46/68/72/76/77/89 |
| B05 | Christmas, winter, New Year and year-round compositions authored source-only; X03 uses unchanged X02; X05/X06 have actual gated collection review; X09 is narrow Christian vocabulary | PR22/29/35/49/53/89/90/92 |
| B06 | Hard evergreen, teacher/ESL/subject and larger-type inventory; owner8 proposals preserved; T12 exact-bank substitute folder and H08 actual30-target packet now built | PR26/40/41/46/53/58/79/80/93/94 |
| B07 / U04–U07 / H10 | Navigation, menu/lower-page search, All Tools, authored FAQs, contextual links and owned-site suggestions; real hard/answer collection filtering/ordering with full SSR/no-JS listings | PR33/48/50/60/61/62/95 |
| B08 / U02/U03/U08/U09 | Icons, meaningful headings, truthful author/footer/legal links, persisted system-aware themes and responsive visual repairs | PR15/31/32/42/57/69/87/88 |
| B09 / U12–U15 | Privacy-conscious result sharing, elapsed time, one-cell solving, guest resume/library, optional sound and tested cancellation | PR21/34/47/55/63/64/65/66/73/81/85 |
| B10 / U21 | Offline cohort reporting, source/indexability snapshots and honest denominators; no invented traffic or silently installed tracking | PR18; BUILDOUT-B10.md |
| B11 / U16 | All 13 existing specialty routes audited; actual selected pack and known linguistic/font/scaffold limits exposed; incomplete capabilities remain unactivated | PR30/36/74/86 |
| B12 / U22 | Ad lifecycle/placements preserved; dependency audits zero; actionable print/CLS fixes and Lighthouse attribution; exact preview/release records | PR39/45/52/67/71/84; F5 ledger |
| B13 / U17–U20/U24/U26/U28 | Bounded discovery/specification only; auth/cloud/realtime/payment/OCR/community remain separately gated, with missing provider/privacy/rights/cost/engagement evidence explicit | PR24; optional-identity-and-business.md |
| U10/U25 | Seed/filler/order/settings, hidden message, real clues, rectangular advanced layouts and useful document exports implemented; shape/image-input research remains explicitly unimplemented, as scoped below | PR74/75/78/82/83/86 |

These rows do not turn research contracts into delivered features. U25 shape
templates remain RESEARCH in the catalog, with no mask configuration, placement,
pointer geometry or cross-renderer mask contract implemented or advertised. No
speculative shape control is activated for this guest release. Image INPUT/OCR is
separately gated by rights, representative-corpus accuracy and provider choices;
image OUTPUTS are implemented. Recurring challenge/community/backend ideas retain
their explicit research/defer scope rather than becoming false completed features.

Naively shrinking current complete pages into two/four-up output is NO-GO under
existing legibility standards. Even optimistic zero-gutter scaling reduces a9pt
grid to5.82/6.36pt on Letter/A4 two-up, and a9.5pt bank to6.15/6.72pt; four-up yields
4.5/4.75pt. These are geometric bounds, not rendered/physical approval. Current
one-puzzle-per-page packets remain the delivered format; a purpose-built compact
profile would be a different future design, not a secretly enabled n-up option.

## Editorial inventory remains unpublished

The main catalog contains 61 candidates (the original60 plus one X09 draft).
Separately, 16 measured utility selections
and 8 preserved owner proposals remain unreviewed; six owner proposals target
existing draft canonicals and two propose new paths. The X03 format creates no
additional indexable variant. X05/X06 authored collection review, T12 curation and
H08 five30-target sheets likewise create no new indexable variants. Pack
compositions reuse their component puzzles;
counts are not summed into a claim of distinct approved URLs.

The 2027 calendar provides 53 review windows and 35 conditional new-content
opportunities. It is not a release cron or a page quota. Initially at most one
genuinely distinct new indexable URL may enter an independently approved weekly
release; zero remains valid. Christmas Baking/electric-circuit overlap and all
other distinct-intent/factual/rights/audience gates remain visible. The original
eight-topic owner file and its unverified review claims remain preserved.

## Validation record

| Check | Result at this record's current stage |
| --- | --- |
| Independent candidate-owned Node22 clean install and full/production audit | Pass, zero vulnerabilities; unchanged lockfile |
| FrozenF lint / TypeScript / unit-content-SEO tests | Pass,519 tests in72 files; later source packages separately pass537 and H10 passes531; new combined suite pending |
| FrozenF production export | Pass,335 pages;746 exported files; manifest SHA256 `d3a45492e9250a0d36da8d9601b0876f9f2eb74bb2c9fab07dab3f2413ab5450`; replacement export pending |
| Static hosting | Pass,217 sitemap paths/35 redirects/6 decoded utility shells |
| Published preservation | Fresh final export:150 rendered defaults,217 metadata/JSON-LD and35 redirects match; source carry-forward is proven against unchanged a3988 inputs |
| Published real PDFs | Frozen a3988:1200 exact baseline byte hashes, zero differences; final115 tracked dependencies/source/config/output files identical, fresh150 published/60 staged generation fingerprints match; not a fresh1200-file claim |
| Separate draft PDF corpora | Original60 ->120 files;16 measured utilities/packets;8 owner proposals ->16 files; X03, newX09, T12 and H08 real Letter/A4 student/teacher outputs pass |
| Original visual defects | Full432 completed: eight dark start-card contrast failures plus manually found helper overlap; original evidence retained |
| Focused visual repairs |28 cases pass with rendered text bounds, axe, computed colors and reviewed screenshots |
| FrozenF48 current functional suites | Pass:47 originals plus stronger current-footer acceptance; historical comparator not applicable, not claimed passed; every attempt/provenance retained |
| H10 focused functional/visual |14 cases pass, full SSR/no-JS cards, both palettes, keyboard/filter/order/reset, initial/hydrationCLS0 |
| Final448 full visual /84 utility CLS pairs | Pending new combined export; visual scope expanded to28archetypes |
| Ordinary Lighthouse | Pending final run; prior provider BP77 remains an unresolved gate |
| Exact hosted browser/PDF acceptance | Pending; HTTP preflight only passes so far |

Fresh final export isolation scans722 HTML/RSC TXT/JS/JSON/XML files with no
main60/owner8 leaks. The PDF carry-forward checks71 retained artifact hashes,
records current dependency digests without inventing historical installed-file
hashes, and regenerates two actual X03 files matching the frozen probe exactly.

All final command exit codes, artifacts, source SHA and actual manual review scope
must be recorded before describing the candidate as technically complete.

## Unresolved external and manual acceptance

- Existing internal ad/noindex findings remain at
  `/categories/health-and-wellness-word-searches`,
  `/collections/brain-training-word-searches`, and
  `/guides/how-hidden-message-word-searches-work`. They require an owner placement
  decision and are not proved AdSense violations. No waiver is recorded.
- Prior ordinary enabled-home Lighthouse Best Practices77 comes from Google
  third-party-cookie/Inspector warnings. Ad-free controls and diagnostic loader
  blocking do not pass or waive the ordinary release gate. Final results and any
  independent written disposition remain required.
- Physical Letter/A4 printing at 100%, real Safari/Android, assistive technology,
  native zoom, actual QR scans and genuine ad fill/consent are unexecuted manual
  checks. Chromium emulation and PDF geometry do not certify those experiences.
- 48 legacy landscape PDFs contain grid text below 9pt (minimum 7.8208pt). They are
  preserved legacy output, not measured large-print certification. Measured
  output instead enforces16pt grid and18pt bank or rejects actionably.
- Independent product/release approval, truthful owner biography/factual review,
  editorial rights/audience suitability and the precise advertising-policy copy
  correction require their respective reviewers. No agent self-approval applies.
- Live aggregate analytics require operator-supplied real exports/provider access;
  no metrics are fabricated. Optional backend products require explicit GO/NO-GO.

## Production boundary and rollback

Known production main is `471a118dd459f2181cd641ed0572ba6dd7005540`, ready Netlify
deployment `6aedd79021e0a4d96f61990a` in project
`66aedb4c-b210-45ca-b775-d338d4077dc6`. Final reconciliation must recheck it.
No main push/merge, auto-merge or production deployment occurred in this buildout.

An independent operator must approve the exact code/review SHA and outstanding
risks before ordinary Git delivery. After an authorized release, record the
resulting production commit/deploy ID and smoke results. A regression requires
a reviewed revert or fix-forward through Git; do not force-push main or restore
a provider deployment without separate authorization. Editorial selections have
their own reversible manifest/review and do not auto-publish with product code.

## Preserved work and source reconciliation

The frozen-stage audit records 96 worktrees, 47 with reported local changes.
Of those, 39 contain only snapshot line-ending/working-copy markers: Git-normalized
content diffs are empty, verified without modifying those worktrees. The other
eight are the original 13-change root preparation, four historical validation
mirrors, superseded contextual-resource preparation, the current CLS fixture and
this acceptance-document worktree. They remain intact; dirty mirrors are not
newly activated features or instructions to repeat completed work.

The original owner source retains SHA256
`b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c`.
Its promotion plumbing stays unmerged. Current implementation is carried
by the individual tested branches and the combined candidate, including the
later progress/theme/specialty/context repairs; preserved older mirrors are not
silently substituted for those implementations.

Of 69 exact source references in the acceptance ledger, 68 are ancestors of the
frozen candidate. The sole exception is historical PR8's reconstructed audit
repair: its four contract/doc files are byte-identical and its Vitest package
command is unchanged. Its historical branch remains preserved; merging its older
parent graph again would duplicate work. This exception and all worktree heads,
branches and statuses are captured in the outside-repository reconciliation.

Final branch/PR/head and active/blocked reconciliation is still pending the
remaining acceptance jobs; this file does not prematurely close them.
