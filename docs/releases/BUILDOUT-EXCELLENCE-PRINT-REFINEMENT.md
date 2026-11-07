# Print and classroom refinement

Base review R: `ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4`. Branch: `codex/excellence-print-refinement`. This is a review-only functional package; production and editorial approval remain false. Technical package validation is complete as scoped below; manual acceptance remains pending. Earlier passing results retain their original source scope.

## Confirmed user problems and corrections

| Surface | Confirmed problem and impact | Correction | Preservation / SEO scope |
| --- | --- | --- | --- |
| Classroom pack download | Hold the lazy PDF module, click Download, then edit Pack title. Exact immutable R produces one outdated download; its actual 10-page PDF and failed assertion are retained. Navigation can likewise leave an old asynchronous job alive. | Check mounted/current settings before accepting the async result; the wrapper creates no URL/anchor for an outdated job. Keep controls editable and explain that changed settings need a fresh download. Close/remove/revoke safely even if a click fails. | Same pack inputs, assignment seeds, renderer, packet composition, filenames and student/teacher order. No backend, autosave or telemetry. `/pack-builder` remains noindex. |
| Dense published landscape PDFs |48 retained legacy variants from 16 subjects have7.8208–8.4835 pt grid text. True16/18 large print cannot fit the16 Letter cases. Silently replacing defaults would break historical output. | Explicit **Download readable PDF** uses the existing measured standard renderer: portrait, standard type, bank below, QR/coordinates off, minimum 9 pt grid / 9.5 pt bank. It retains the exact grid, selected Letter/A4, answers/name/date/instructions/ink/case. Fit errors refuse a file, never shrink or silently fall back. | No PDF-core/generator changes. Default legacy48 bytes remain exact. True large print remains separate16pt grid/18pt bank. No URL, title, metadata or editorial-copy changes. |
| Alternate-layout chooser | New and existing alternative help repeated the same portrait/QR/exact-puzzle/fit conditions, increasing mobile scrolling. | One visible shared constraint paragraph; distinct9/9.5 and16/18 descriptions keep the same button names and description IDs. Both buttons reference shared and specific help. | Category A dialog help only; no CSS/shared template rewrite or change to indexed prose. Initial and final screenshots retain exact source labels. |
| Multi-character specialty cells | Existing measured pack renderer rejects them using a generic grid-size error, which would misleadingly suggest shorter input fixes the new option. | New readable wrapper explicitly explains one-character-per-cell support and suggests trying ordinary PDF/browser print. | No alphabet mapping, generation, legacy or existing large-print behavior changes; no incomplete format activation. |

## Explicit teacher seed choice

A new teacher otherwise has to invent a required technical seed before producing a pack. **Choose for me** now fills a valid `classroom-` plus 16 hex-digit code using native Web Crypto, only on an explicit button click. It does not submit, autosave, alter other fields or replace a typed seed without that click. If crypto is blocked, the old seed and entries remain and the user gets manual-entry guidance. The existing Base seed label,1–64 character validation, assignment derivation and saved-preset format stay intact. The button has a scoped 44 px target; no shared stylesheet changes.

The [teacher workflow test](../../tests/e2e/classroom-seed-choice.ts) creates 5/10/20 actual distinct exact-grid student packets, repeats the5-page bytes, checks explicit preset reuse/no autosave, keyboard operation, axe and blocked-crypto recovery. Choosing a new seed during a pending download is also in the cancellation regression.

## Exact affected sources and 48-variant mapping

Every subject below has 20 targets in an 18×18 frozen grid. Each maps three historical outputs (Letter/standard/landscape; A4/standard/landscape; A4/large/landscape) to a chosen-paper portrait measured standard alternative. The shared A4 alternative is deliberately not counted twice:32 unique paper-specific outputs cover the 48 legacy variants. The new option remains opt-in; it does not make the 48 historical files pass a9pt requirement.

| Published path | Grid | Targets |
| --- | --- | --- |
| /word-searches/science/biology-word-search | 18 × 18 | 20 |
| /word-searches/science/chemistry-word-search | 18 × 18 | 20 |
| /word-searches/science/physics-word-search | 18 × 18 | 20 |
| /word-searches/geography/us-states-word-search | 18 × 18 | 20 |
| /word-searches/science/earth-science-word-search | 18 × 18 | 20 |
| /word-searches/geography/europe-word-search | 18 × 18 | 20 |
| /word-searches/geography/asia-word-search | 18 × 18 | 20 |
| /word-searches/geography/africa-word-search | 18 × 18 | 20 |
| /word-searches/geography/north-america-word-search | 18 × 18 | 20 |
| /word-searches/geography/south-america-word-search | 18 × 18 | 20 |
| /word-searches/history/ancient-egypt-word-search | 18 × 18 | 20 |
| /word-searches/history/ancient-greece-word-search | 18 × 18 | 20 |
| /word-searches/history/ancient-rome-word-search | 18 × 18 | 20 |
| /word-searches/history/industrial-revolution-word-search | 18 × 18 | 20 |
| /word-searches/music/orchestra-word-search | 18 × 18 | 20 |
| /word-searches/music/music-theory-word-search | 18 × 18 | 20 |

The exact 48 original byte hashes and font measurements are regression input in [the frozen fixture](../../tests/fixtures/legacy-small-landscape.json). It pins the complete historical manifest's SHA256; this is a deliberate byte-preservation test fixture, not generated production output. All 16 full source requests/metadata/fingerprints and the 48 old-to-new mappings are separately recorded outsideGit in `excellence-print-refinement/published-fingerprints-and-48-mapping.json`.

## Source and tests

- [Browser PDF wrapper](../../lib/pdf/browser-download.ts) maps `readable` to the already-existing `pack` profile; [renderer](../../lib/pdf/create-puzzle-pdf.ts) is untouched.
- [Dialog](../../components/puzzle/PuzzleUtilities.tsx) exposes the explicit action without changing saved ordinary choices.
- [Classroom form](../../components/pack-builder/ClassroomPackBuilder.tsx) and [download wrapper](../../lib/pdf/browser-pack-download.ts) reject outdated asynchronous results and avoid updates after unmount.
- [Readable PDF tests](../../tests/unit/readable-pdf.test.ts) render 32 student/answer alternatives, re-render and compare 48 legacy byte hashes, preserve flags, and reject oversized grids/clues/unsupported cells.
- [Cancellation unit tests](../../tests/unit/classroom-download-cancellation.test.ts) exercise delayed results, normal filenames and URL/anchor cleanup on browser failure.
- [Readable browser checks](../../tests/e2e/readable-pdf.ts) cover both papers, light/dark, mobile/desktop, words/clues, actual PDFs/geometry/axe, preserved controls, failure and explicit ordinary retry.
- [Classroom browser checks](../../tests/e2e/classroom-download-cancellation.mjs) delay the actual lazy renderer, mutate title/page selection or navigate/unmount, and verify no stale files plus actual current retry packets.

## Evidence and current validation scope

Raw evidence stays outsideGit under the task visualization root, `excellence-print-refinement/`.

1. `classroom-baseline-R/`: exact immutable R deploy `6aeecf5d87e1713c8c60f2f2`, actual failed stale-anchor assertion/exit1, report and real old-title PDF. No baseline failure is waived.
2. `existing-profile-fit-probe.json`:32 real current-profile alternatives, student+answer geometry0findings, exact requests/grids/placements; minimum actual affected grid13.9541 pt, bank9.5pt. Existing large-print profile rejects16 Letter cases and accepts16 A4 cases. Initial `.ts` probe needed `.mts` outside the repository to support top-level await; no application issue was concealed.
3. `published-fingerprints-and-48-mapping.json`: all 150 published generation/input/grid/answer fingerprints freshly match the historical baseline,0 differences. This is not a new 1200-PDF execution.
4. Initial source: lint/typecheck,638 tests / 81 files,335-page production build and static217/35/6 audit passed. Six browser suites passed: new cancellation/readable plus existing5/10/20 classroom packet, Class/Name/Date/instructions, large-print and async export cancellation regressions. The final concise-help and unsupported-cell refinement follows this source; final validation is recorded below when complete.
5. Actual Biology Letter student/teacher PDFs were rendered with Poppler and individually inspected: centered18×18 grid, legible complete bank and clear answer paths, no clipping/overlap. Poppler reported a Symbol display-font warning; the Latin pages rendered correctly. Physical printer/photocopier approval is not claimed.

The existing ordinary Lighthouse 77 and three internal ad/noindex eligibility findings remain separate, open and unwaived. No protected advertising lifecycle/placement/style changed. No new content was published, no main/production action occurred, and no manual device/AT/printer acceptance is implied.

## Final verification and honest source boundaries

- Full functional checkpoint: lint/typecheck, **639 tests / 81 files**, warning-free335-page supported Node 22 build and static 217 sitemap / 35 redirect / 6 shell audit. After the final spacing-only correction, **93 focused PDF/download tests** reran, including all 32 real alternatives and 48 exact legacy hashes. Final name-only correction reran lint/typecheck/build/static and the two affected seed/cancellation browser suites.
- Nine browser suites pass across preserved final attempts: new cancellation 5 cases; seed choice 5/10/20 plus exact 5-page replay, presets/no-autosave/blocked crypto / 44 px/keyboard/axe; readable words/clues/Letter/A4/light/dark/actions/geometry/unsupported/ordinary retry; existing classroom5/10/20pack; classroom fields; presets; large-print pack; single measured large print; async output cancellation. All assertions remain. The final application differs from the nine-suite checkpoint **only in one seed-button aria-label**, recorded by exact source comparison. The two affected suites ran fresh after that change; unaffected evidence is carried explicitly, not relabeled as a fresh nine-suite execution. Combined integration must run its own affected checks.
- Label-in-name self-review found that visible `Choose for me` did not occur as one full string inside `Choose a Base seed for me`, despite default axe passing. Final accessible name is `Choose for me: Base seed`; an explicit browser assertion verifies the full visible-label prefix. This follows [W3C G208](https://www.w3.org/WAI/WCAG22/Techniques/general/G208.html), while real speech/AT acceptance remains manual.
- The compact-help attempt actually produced **-8px overlaps at 390 and 1280 pixels** by reusing the global negative-margin help style. Failed geometry/PNGs are preserved. Only the three new paragraphs lost that class; no global style was changed. Final live dialog geometry reports **zero overlaps** at both widths. Before/after dialog and mobile seed screenshots were individually reviewed.
- A blocked-crypto test initially used a nested TSX-transformed arrow in `page.evaluate`, causing a page-realm `__name` reference error. That test-only injection now uses a fixed page-realm function string. Another preserved strict-mode failure came from partial `getByLabel("Base seed")` matching the new button too; ten existing calls across five fixtures now use `exact:true`, retaining every workflow assertion. Syntax/lint/type checks and affected local regressions pass. The hosted-provider fixture's exact-selector change is prepared/typechecked; new combined hosted acceptance remains the integration owner's task.
- Fresh final source audit again matches **all 150 published fingerprints**, with full16source records and 48variant mapping. The actual re-materialized Biology A4 legacy file equals its historical byte hash and measures7.8208 pt; actual readable A4 output measures13.9541 pt grid/9.5pt bank. Poppler before/student-after/teacher-after pages were individually inspected: larger clear grid, complete bank, clear answer lines, no clipped/overlapping content. This remains output simulation, not physical-printer certification.

Final raw records: `final-preflight/`, `final-spacing-preflight/`, `final-label-preflight/`, `final-browser/`, `final-browser-attempt-02/`, `final-browser-attempt-03/`, `final-label-browser/`, `dialog-compact-before-spacing/`, `dialog-final-spacing/`, `biology-before-legacy.json` and `published-fingerprints-and-48-mapping.json`. All paths are under the external package evidence directory, not Git build artifacts. The one-attribute proof and application-file hash pins distinguish each source checkpoint. Original failures were not overwritten or waived.

## Interface-copy change ledger

| URL / state | Old text or state | Final copy / reason | SEO and verification |
| --- | --- | --- | --- |
| `/pack-builder`, seed help | At five assignments: "Use 1–64 letters, numbers, underscores or hyphens. Save this seed and the exact title and word list to recreate the assignments. Assignment numbers 01–05 use fixed derived seeds." | "Choose a code, or let us choose one. Use 1–64 letters, numbers, underscores or hyphens. Keep it with the same title and word list to recreate this set." Removes derived-seed narration while retaining valid-input/replay guidance and the unchanged Base seed label. | Category A/noindex tool; actual typed/selected/replayed/preset/blocked-crypto flows tested. |
| `/pack-builder`, pending result after edits | Old job could say "Your5-puzzle PDF download has started" and actually download the previous entries. | "Your settings changed. Review them and download the pack again." No file is created for that old job. | Category A/status only; exact old immutable failure and new controlled-delay tests retained. Current successful-download copy is preserved. |
| PDF dialog, new readable action | No standard measured alternative; only ordinary or16/18 large-print output. | Shared visible forced-layout/retained-choice/fit constraints, then explicit9/9.5or16/18type sizes. Existing action names remain; new action is opt-in. | Category A/interactive dialog only; no published H1/title/intro/meta or generic indexed copy changes. Actual PDFs, retained flags, point sizes and geometry tested. |
| PDF dialog, existing large-print help | Long paragraph repeated portrait/QR/exact-grid/fit conditions. | Shared constraint paragraph plus "Large print: at least16-point grid letters and an18-point word bank. Headers and footers stay smaller." Same profile and limitations; no new certification. | Category A; LPregressions and description references remain tested. |
| Readable error, unsupported cells | Generic measured9-point fit failure suggested reducing text even when every cell has multiple characters. | "Readable PDF needs one character per grid cell. Try the ordinary PDF or browser print for this alphabet." | Category A/new action only; Morse refusal produces no file; no generator/scaffold activation. |

## Owner checks and release boundaries

On the integrated preview, open Biology, open Download PDF and select landscape/QR/coordinates. Download the readable option: expect the same puzzle in portrait without QR/coordinates; reopen and confirm ordinary selections remain. Compare the actual before/after A4 PDFs at 100% scale, including student bank and teacher answers. Try an oversized grid: expect a visible fit error and no silent fallback.

For a teacher, enter a title and three words, choose a seed explicitly and create 5/10/20student assignments. Repeat with the same code/title/list to reproduce the file; save/load only deliberately. During a slow download, edit title/pages/seed or navigate away: no outdated file should appear. Blocked crypto should retain typed entries and offer manual seed entry.

Physical Letter/A4 printer/photocopier, native mobile/browser/voice/AT, owner visual/copy and independent editorial/release checks remain pending. This package does not alter the ordinary Lighthouse 77 or three internal eligibility blockers, protected advertising, staged publication status or main. Rollback is the single package commit on its review branch; do not reset production or discard historical evidence.
