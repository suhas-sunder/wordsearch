# Indexed-copy decisions: thirteen existing holds

Independent source/evidence review, 2026-11-12. **All thirteen fields remain held.** This document recommends decisions; it grants none. No runtime, content, advertising, publication flag, semantic allowance or release schedule was changed.

Production reference is `471a118dd459f2181cd641ed0572ba6dd7005540`; review head is `a0df44f6bdaccd1ecd72e34ff0bd32a65fa01d80`, whose application source is C4 `39c0d3564eb014741e259507c9564a4ee1699f1d`. [The exact decision manifest](QUALITY-INDEXED-HOLDS.json) includes the complete original, current and recommended field values, before/after hashes and originating PRs. This uses retained HTML semantic observations, not a fresh browser visit or live capture. Current source was read separately to verify that the quoted candidate passages remain present.

## Count and provenance

The committed semantic allowlist has nine owner-held groups: one group lists five FAQ headings and eight groups list one field each. Expanding route lists yields **13 fields on exactly seven indexed URLs**. The retained final C4 semantic report independently records the same 13, zero unexplained changes and no owner approval. Five FAQ bodies plus five FAQ headings account for ten; privacy body and headings account for two; editorial-policy body accounts for one.

The historical 230-field result is not an additional unresolved set. Its 217 identical footer-body holds were separately reviewed against the owner's express attribution request; see [the exact footer decision](EXCELLENCE-FOOTER-B-REVIEW.md). That disposition neither verifies the owner's credentials nor approves the remaining legal/FAQ copy. There is no new footer or About rewrite in this review.

| ID | Existing indexed URL | Held field | Original production | Current candidate | Recommended final and default |
| --- | --- | --- | --- | --- | --- |
| H01 | `/free-printable-word-searches` | `body.faq` | No FAQ partition | Three print/student-copy/paper questions quoted below | Retain exact candidate for owner approval: each answers a concrete output task. |
| H02 | `/free-printable-word-searches` | `headings.faq` | None | H2 `FAQ` | Retain only with H01 approval; no heading-only approval workaround. |
| H03 | `/large-print-word-searches` | `body.faq` | No FAQ partition | Three sizing/placement/test-copy questions quoted below | Retain exact candidate for owner approval: honest printer and sizing limits; separate optional measured-output discovery proposal below. |
| H04 | `/large-print-word-searches` | `headings.faq` | None | H2 `FAQ` | Retain only with H03 approval. |
| H05 | `/online-word-search` | `body.faq` | No FAQ partition | Three keyboard/tap/print questions quoted below | Retain exact candidate for owner approval: useful alternate input instructions; real-device/AT acceptance remains separate. |
| H06 | `/online-word-search` | `headings.faq` | None | H2 `FAQ` | Retain only with H05 approval. |
| H07 | `/word-search-pdf` | `body.faq` | No FAQ partition | Three local-PDF/answers/QR questions quoted below | Retain exact candidate for owner approval: accurate current browser-output architecture and actionable QR fallback. |
| H08 | `/word-search-pdf` | `headings.faq` | None | H2 `FAQ` | Retain only with H07 approval. |
| H09 | `/word-searches-for-teachers` | `body.faq` | No FAQ partition | Three vocabulary/name-date/reprint questions quoted below | Retain exact candidate for owner approval: useful classroom output and privacy guidance. |
| H10 | `/word-searches-for-teachers` | `headings.faq` | None | H2 `FAQ` | Retain only with H09 approval. |
| H11 | `/privacy` | `body.editorial` | Older storage description and server-PDF assertion | Named-library/preset/progress/theme/sound disclosures and browser-PDF correction | Prefer candidate over reverting factual disclosures, subject to owner/legal review of the complete page and actual provider behavior. |
| H12 | `/privacy` | `headings.editorial` | Browser storage; Shared puzzle links; PDF and QR behavior; Advertising and external links; Questions | Adds `Named saved puzzles` and `Saved classroom presets` after Browser storage | Retain with H11; the new sections correspond to real local stores. H1 is unchanged. |
| H13 | `/editorial-policy` | `body.editorial` | Advertising described as future-only placeholders | Eligible content pages may display advertising | Prefer candidate correction, subject to owner approval; old inactive-ad claim should not be reinstated merely to clear a diff. |

All recommendations above are **unchanged candidate text**, not a blanket rewrite. A source-specific owner decision must name the fields and final SHA. Rejecting optional FAQs permits a separately validated removal proposal, not silent removal in this audit. Legal/factual mismatches should be resolved accurately before a release rather than hidden by reverting truthful disclosure.

## Exact FAQ additions

Production has no corresponding FAQ partition on these five routes; the complete following passage is the current and recommended addition. H1, title, description, canonical and JSON-LD are separate protected fields; these holds do not authorize changes to them.

### H01 — free printable

**How do I print the puzzle without the surrounding website?** Open a puzzle and choose Print this puzzle. Its print view excludes navigation, editing controls and advertisements. Check the preview before printing student copies.

**How do I keep the answer key off a student copy?** In the print or PDF dialog, clear Answer key page for a puzzle-only copy. Keep a separate download with that option selected for checking answers.

**Which paper setting should I choose?** Match US Letter or A4 and the orientation to the paper in your printer. Check the printer preview at actual size; browser or printer scaling can otherwise change the size of the grid and word bank.

### H03 — large print

**Why can a large grid still have small letters on paper?** A sheet has a fixed printable width. More columns leave less room for each cell, even when a larger display option is selected. Check the downloaded file at actual size and consider a smaller grid with fewer, shorter words.

**Does choosing larger print move the words?** Output sizing alone keeps the current puzzle’s placements. Editing the word list, grid dimensions, seed or directions can create a different puzzle, so keep those settings when you need a matching reprint.

**What should I check before making several copies?** Check both the grid letters and word-bank text, the page margins and the answer page. Make one test copy using the intended paper and printer settings. A large-print label does not guarantee a particular physical text size on every printer.

### H05 — online play

**How can I select words with a keyboard?** Start a puzzle and focus a grid cell. Arrow keys move between cells. Enter or Space sets the start and submits the end of a straight path; Escape cancels an unfinished selection.

**Can I tap the first and last letter instead of dragging?** Open the solver Settings and choose tap selection. Tap the first cell, then the last cell of a straight word. The word bank marks words that have been found.

**Can I print the same puzzle after playing online?** Yes. Use that puzzle’s print or PDF controls. Its existing seed and configuration determine the grid and answers; switching between play and output does not require generating a different puzzle.

### H07 — PDF

**Where is my puzzle PDF created?** The browser creates the download from the current puzzle definition. A PDF download does not submit your word list to a PDF-generation server.

**Can I download a puzzle and its answers together?** Select Answer key page in the Download PDF dialog to include the matching solution. Clear it for a puzzle-only file. Preview the selected paper size and orientation before downloading.

**Why might a share link not fit in a QR code?** A custom share link contains the word list and settings. A long list can exceed QR capacity. Use the full copyable share link when the interface reports that a QR code cannot be created; a missing QR is not a different puzzle.

### H09 — teachers

**Can I make a worksheet from my own lesson vocabulary?** Use the generator and enter the words you have chosen for the lesson. Check any excluded words before printing, and keep the word list and difficulty appropriate for your group.

**How do I add student name and date lines?** Select Name/date in the puzzle’s output controls, then check the printable preview. Keep Answer key page selected for your checking copy and clear it for a student-only download.

**What should I keep for an exact classroom reprint?** Keep the downloaded PDF or the full puzzle definition, including the seed, word list, grid dimensions and directions. A share link also encodes the word list, so do not include private student information in a link you distribute.

## Exact legal/trust changes

### H11 — privacy body

Original storage passage: “The site uses local browser storage for builder state and puzzle display or output preferences. That information remains in the browser unless you clear it.”

Candidate/recommended replacement: “The site uses local browser storage for builder state, puzzle display, sound or output preferences, and your light or dark theme choice. System theme follows your device preference. If you choose to remember solver progress, the browser stores an opaque puzzle fingerprint, found-placement indexes and elapsed time on that device; you can clear that saved progress. This information remains in the browser unless you clear it.”

New named-library passage: “The main puzzle builder can explicitly save up to twenty named puzzle definitions on this device. Saved names, titles, words and seeds are unencrypted and readable by other people using the same browser. This library is not uploaded or synchronized and is separate from solver progress and classroom presets. Delete individual puzzles or clear the named library in the builder; clearing it does not delete solver progress or classroom presets.”

New classroom-preset passage: “The classroom pack builder saves a preset only when you choose Save preset on this device. It stores the exact title, words, seed and output choices in this browser, up to five saved titles. People using the same browser can read these unencrypted entries. Presets are not uploaded or synchronized. Delete saved presets in the pack builder, or clear the site's browser storage, to remove them.”

Original PDF sentence: “PDF files are created by the site’s server endpoint from the submitted puzzle definition.”

Candidate/recommended replacement: “PDF files are created locally in your browser from the current puzzle definition. Downloading a PDF does not require submitting your word list to a site PDF endpoint.”

Unchanged QR, contact, advertising and shared-link paragraphs remain in the full JSON field. These are not newly approved. Source support: `lib/puzzle/library.ts`, `lib/pack/presets.ts`, `lib/puzzle/progress.ts`, the theme/sound controls, and browser PDF exports. Wording about the application not installing analytics must not be read as a guarantee that third-party advertising performs no measurement. Consent/legal review remains necessary.

### H13 — advertising separation

Original: “If advertising is enabled later, it must remain separate from puzzle controls, never imitate download or navigation buttons, stay out of print and PDF output, avoid obstructing play, and never determine editorial topic selection. The current ad-labelled areas are layout placeholders, not active advertising.”

Candidate/recommended: “Eligible content pages may display advertising. Ads must remain separate from puzzle controls, never imitate download or navigation buttons, stay out of print and PDF output, avoid obstructing play, and never determine editorial topic selection.”

This describes actual eligibility without claiming that a creative always fills. It neither changes protected advertising code nor resolves the twelve noindex-wrapper conflicts. Other policy paragraphs intentionally explain standards to visitors; their procedural wording has a legitimate trust purpose and should not be removed by an instruction-keyword filter.

## Separate existing-copy findings: not part of H01–H13

These issues predate the review candidate. They need their own owner-review proposals and measured rendered scope, not reclassification as one of the thirteen introduced holds.

| Finding | Exact current text or source | Visitor impact and conservative decision |
| --- | --- | --- |
| Hard collection process leakage | `content/collections.ts`: “Every fully reviewed Hard puzzle is included; unfinished drafts are excluded.” | A chooser needs the puzzle selection, not draft-workflow narration. Owner-held one-route angle proposal: “Choose a Hard puzzle to print or play online.” Retain title/H1/meta/description, all sixteen children, vocabulary and grid definitions. This is a proposal, not an applied edit or ranking-safety guarantee. |
| Hard collection selection guidance | “Hard puzzles use an 18 × 18 grid, twenty terms, overlap, and every straight direction. The inventory is deliberately smaller because no unfinished hard draft is included.” | Preserve the useful first sentence; propose deleting only the second. `selectionGuidance` renders on the collection's own page. Verify fresh actual production/candidate route scope before implementation. |
| Teacher collection availability | `components/page/RouteHub.tsx` references substitute-teacher collections although that collection is draft | Existing proposal remains: “Use existing classroom, science and answer-key collections when you need a quick handout.” Do not activate the substitute draft to make the claim true. This is separate from the new teacher FAQ. |
| Answer-key collection implementation detail | “Every listing opens one canonical puzzle page. Answer views are utilities rather than separate sitemap entries, so the unsolved grid and its solution remain one reproducible puzzle.” | Actual utility architecture is not necessary selection help. Propose a later focused visitor instruction after measuring reuse; retain reproducibility and matching-answer truth. No automatic replacement. |
| Ancient Egypt/Reading/Swimming and other contexts | `content/curated-topics*.ts` context used in puzzle/card descriptions | Pre-existing instruction leakage and legitimate safety limitations must be separated case by case. Shared context can affect many indexed cards and the puzzle page. The thirteen holds do not include or approve these changes. |

The hard collection's **historical** 2,402/2,970 Google clicks (80.9%, 2026-08-04–2026-11-03) are reported in the master plan. They are not current traffic or a ranking forecast. GSC Wizard refuses the current session for subscription reasons. Preserve this page's intent and useful search terminology; request separate explicit approval for each proposed sentence, with the actual fresh route/metadata/body comparison. The existing collection offers sixteen distinct hard puzzles and functional selection value; its template is not evidence of a doorway page.

## Functionality and technical SEO recommendations

1. **Specialty directory: owner decision remains open.** C4's directory explicitly labels three formats unavailable and preserves format-specific limitations. ASL renders text labels rather than handshapes; semaphore is a geometric fallback; Roman conversion does not exist. Their titles/hero descriptions still say “Generator,” and Roman's description refers to “the specialty pack architecture” (`content/specialty.ts`). Recommended product default: keep URLs and explanations, but place the three unavailable entries in a separate clearly marked forthcoming/preview section outside the primary working-format choices. This is a scope/navigation decision for the owner, not permission to delete routes or activate features. All thirteen routes are noindex, but the directory also appears on the indexed generator; measure that shared scope before implementing.
2. **Do not generalize specialty capability claims.** Existing explicit limits for visual non-tactile Braille, Spanish ñ normalization, French ligature loss, Greek/kana mappings and unsupported PDF glyphs are essential visitor information. Retain them. A table saying “supported languages” would be false. The current experimental label is more accurate than a completed-product claim.
3. **Large-print discovery needs a separate focused decision.** The held FAQ correctly cautions about physical printer scaling. The existing hub's guidance still refers generally to the generator's large-print setting while C4 now offers a separately measured PDF action. Consider a small approved addition naming `Download measured large-print PDF` and its fit refusal; do not promise every existing “larger grid type” option meets a minimum font size. Do not bury this new proposal inside H03 approval.
4. **Retain technical SEO gates.** The retained C4 evidence reports 217 canonical/sitemap entries, 35 redirects and 150 preserved puzzle definitions with unchanged titles/descriptions/H1/JSON-LD. These are historical checks, not fresh passes from this review. Candidate preview HTTP noindex is expected; a production deployment must not inherit that header. Draft publication flags, noindex, search exclusions and sitemap membership must remain independently checked.
5. **Advertising conflict stays blocked.** Twelve existing noindex outputs reserve ads despite the internal draft rule. Recommended exact correction remains wrapper selection for two categories, eight collections and two guides using the existing draft template for all local/shell slots; approval is required. No provider shutdown, assertion weakening or draft publication is a valid substitute. See [the complete twelve-route decision](EXCELLENCE-AD-ELIGIBILITY-DECISION.md).

## Validation and limits

Read the master plan, finalization contract, acceptance matrix, source components, original preservation report, footer disposition and final C4 semantic report. Confirmed the committed nine hold groups expand to thirteen route/field pairs across seven URLs and match the retained report. The JSON manifest preserves exact values and artifact provenance. Main-to-review Git diffs for `content/routes.ts`, `app/privacy/page.tsx` and `app/editorial-policy/page.tsx` completed successfully and corroborate the changes. A PowerShell validation confirmed thirteen unique route/field pairs, seven URLs and no approval. No new browser, PDF, physical-device, ranking or legal acceptance is claimed. Source-only documents do not alter public HTML and require no new application build by themselves; the parent integration owns fresh combined validation.

Next owner action: review H01–H13 individually, then separately decide the small editorial pilot and unavailable-specialty presentation. Approval of one category must not silently approve another. Until exact decisions and remaining provider/manual gates are resolved, the scheduler must continue to fail closed.
