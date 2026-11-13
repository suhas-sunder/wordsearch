# Visitor-copy review: published page types and shared templates

Review date: 2026-11-12. This is a source-only decision record, not permission to rewrite published pages. The [passage manifest](QUALITY-PAGE-COPY.json) records **307 significant source passages** across all 15 published categories, 13 collections, 12 guides, 14 route hubs and eight trust pages, with exact text, A–F purpose, reason, measured retained HTML paths and fresh HTTP presence where verified. The homepage, three directory indexes, generator and shared/control surfaces are assessed below. Together these cover the 67 non-puzzle URLs in the 217-entry indexed inventory; the separate published-puzzle review covers the other 150.

The starting comparison is production `471a118dd459f2181cd641ed0572ba6dd7005540` versus review `a0df44f6bdaccd1ecd72e34ff0bd32a65fa01d80` (application C4 `39c0d3564eb014741e259507c9564a4ee1699f1d`). Retained semantic HTML was read, and all 434 response hashes from the new 217-page-per-endpoint HTTP corpus were independently checked. Every one of the 307 classified passages is present in the fresh candidate body-text extraction; the five pilot before-text scopes match on both endpoints. **Source-rendered text inspection is not a hydrated browser or physical-device acceptance.** The root quality ledger owns those finite browser observations. No claim is made that every screenshot was manually viewed.

A = essential visitor help; B = useful context; C = trust/legal/safety; D = internal documentation leakage; E = low-value filler; F = unverified or misleading claim. A mixed paragraph receives the purpose of its significant defect in the manifest, with an explicit instruction to retain useful clauses. This is editorial judgment by field/section, not an AI detector, keyword ban, or mandatory word count. “Should” in a printer warning and review instructions on a public standards page are not inherently leakage.

The 307 passage classifications are 146 A, 117 B, 10 C, 26 D, one E and seven F. Counts measure reviewed fields, not pages, severity or approved edits. F includes scope claims requiring clarification as well as confirmed stale instructions. Fresh evidence is retained outside Git at `C:/Users/Suhas/.codex/visualizations/2026/11/13/01a1d313-5cce-7880-aff3-d45fd55e6b71/quality/http/capture.json` and `quality/pilot-fresh-scope.json`. The extraction excludes scripts/styles/head/SVG, decodes HTML entities and normalizes whitespace; each response hash is verified before extraction.

## Small pilot: four cases, five fields

[The typed pilot](../../content/review/pilot.ts) holds exact before/after strings, immutable source targets, internal constraints, affected routes and **pending-owner-review** decisions. None is connected to public rendering. The combined scope is **nine unique indexed URLs**, not eleven: the hard collection is already among Ancient Egypt's seven destinations, and its two fields affect the same route.

| Case | Exact original | Exact proposal | Indexed impact and rationale |
| --- | --- | --- | --- |
| Homepage Ancient Egypt card, shared context | “The page is a general historical vocabulary review and should avoid unsupported dates, sensational claims, or fictional portrayals.” | “This general historical vocabulary review includes the Nile, pyramids, hieroglyphs, scribes, and ancient Egyptian religious vocabulary.” | Seven URLs/nine text occurrences. Actual frozen bank contains NILE, PYRAMID, HIEROGLYPH, SCRIBE, OSIRIS and ANUBIS. Preserve the historical-vocabulary subject; move original factual constraints into internal notes. This also changes a card on the high-traffic hard collection, so it is owner-held. |
| Hard collection angle | “Every fully reviewed Hard puzzle is included; unfinished drafts are excluded.” | “Choose a Hard puzzle to print or play online.” | One URL/one occurrence. The existing description still supplies larger grids/twenty terms/reverse/diagonal/solution detail; no inventory, metadata or puzzle change. |
| Hard collection selection guidance, same case | “Hard puzzles use an 18 × 18 grid, twenty terms, overlap, and every straight direction. The inventory is deliberately smaller because no unfinished hard draft is included.” | “Hard puzzles use an 18 × 18 grid, twenty terms, overlap, and every straight direction.” | Same one URL/one occurrence. Keep the entire useful first sentence and remove only the internal second sentence. |
| Homophones puzzle introduction | “Search for eight sets or pairs of words that sound alike while differing in spelling or meaning.” | “Search for seven sets or pairs of words that sound alike while differing in spelling or meaning.” | One URL/one occurrence. Sixteen words form two triples and five pairs, hence seven groups. Correct only “eight”; no vocabulary/seed/migration change. |
| Answer-key guide, `Verify each placed coordinate path` body | “For every word, confirm the recorded start cell, direction, and ordered cells spell the normalized term. Excluded words must be reported rather than shown as if they have an answer.” | “Choose Show Answers and check that each highlighted line spells a listed word. If the builder reports excluded words, review them before printing; adjust the word list or grid settings if you need every original word included.” | One URL/one occurrence. Uses real Show Answers and Excluded controls. Keep the heading for this minimal pilot; retain exact-path validation as an internal quality constraint. |

Ancient Egypt's exact indexed path set is `/`, `/categories`, `/categories/history-word-searches`, `/collections/hard-printable-word-searches`, `/collections/history-word-search-worksheets`, `/collections/word-searches-with-answer-keys`, and `/word-searches/history/ancient-egypt-word-search`. The puzzle itself contains the sentence three times; each other page contains it once. Search-data reuse is additional nonindexable scope, not another indexed URL.

Other pilot paths are `/collections/hard-printable-word-searches`, `/word-searches/language-arts/homophones-word-search`, and `/guides/how-to-make-a-word-search-with-answer-key`. All wording is already present in both retained main and C4 bodies. No proposed edit changes H1, title, description metadata, canonical, structured data, word bank, difficulty or seed. Reading was considered but not selected for the one-puzzle pilot: its context also affects seven indexed URLs, while the Homophones count is demonstrable and isolated.

The original thirteen main-to-candidate copy holds are **different work**; see [their exact decision sheet](QUALITY-INDEXED-HOLDS.md). This pilot addresses pre-existing production defects, not approval of old candidate changes.

## All fifteen published categories

Each category's descriptions, introduction and two selection notes were read and matched against rendered HTML. All have actual published topic lists; there is no recommendation to remove useful categories or manufacture more pages. Category metadata is separate and remains protected. Shared topic-card leakage is recorded by the published-puzzle review and must not be mistaken for new category-authored paragraphs.

| Category slug under `/categories/` | Purpose and sample | Decision |
| --- | --- | --- |
| `animals-word-searches` | B: “pets, farm animals, zoo animals, birds, insects, reptiles, and ocean life.” A: group by habitat. | Keep relevant topic breadth and activity advice. |
| `food-and-drink-word-searches` | B: fruits/vegetables/meals/baking/desserts. A: custom menus and party lists. | Keep; no unsupported nutrition-outcome claim is present. |
| `nature-and-weather-word-searches` | B: flowers/trees/gardens/forests/beaches/weather. A: connect weather terms to observations. | Keep; useful subject selection, not a generic nature SEO paragraph. |
| `science-word-searches` | B: science units and matching outputs; A: word-bank previews. | Keep. “Deterministic” is technical but accurate; not sufficient reason for a separate indexed rewrite. |
| `geography-word-searches` | B: continents/oceans/capitals/states/Canada/maps. A: rectangular grid for long names. | Keep; do not inflate regional claims beyond the actual list. |
| `language-arts-word-searches` | B: nouns/verbs/adjectives/synonyms/antonyms/punctuation. C: does not replace direct instruction. | Keep the useful limitation. It explains appropriate activity use, unlike an editor's “must not promise” instruction. |
| `math-word-searches` | B: language rather than calculation drills. A: definitions for clue mode. | Keep; makes the actual product purpose clear. |
| `sports-word-searches` | B introduction lists actual sports; F card description includes “Olympics”; E note “Hard mode fits older sports fans.” | Owner-held scope correction: no Olympics puzzle exists in the published selection. Prefer vocabulary/settings over age stereotypes; do not create an Olympics page to justify the sentence. |
| `classroom-and-values-word-searches` | B: school supplies/routines/spelling/kindness/friendship. D note ends “rather than outcome claims.” | Keep discussion-starter suggestion; move the internal outcome-claim rule to notes in a separately approved correction. |
| `holiday-word-searches` | B first sentence lists seasons/Halloween/Christmas; D final clause “without copyrighted characters or commercial franchises.” | Preserve seasonal scope and useful party/answer-key notes. Rights-screening narration belongs in policy or internal notes. No urgent metadata rewrite. |
| `history-word-searches` | B: six historical periods; A: answer keys for substitute lessons. | Keep category purpose; individual puzzle/card constraints need the separate pilot. |
| `travel-word-searches` | B: airports/road trips/hotels/trains/cruises/vacations. A: print for trips. | Keep; no medical or educational outcome promised. Driver-specific safety belongs where activity could distract, not every catalog description. |
| `music-word-searches` | B introduction accurately says general instruments/theory/singing; F card description mentions “artists.” | Verify intended meaning and narrow summary if it implies artist-specific puzzles. Preserve existing useful general-music scope; no performer pages added. |
| `books-and-reading-word-searches` | B: libraries/genres/book parts/text features; D copyright clause; F card “author-themed” may overpromise named-author topics. | Keep topic list. Clarify scope and separate internal rights rule in owner review; no unsupported literacy claim should replace it. |
| `art-word-searches` | B: colors/painting/drawing/sculpture/photography/crafts. A: vocabulary before studio time. | Keep; safety caveats on individual activity pages need context-specific judgment. |

Category-template sentence “Difficulty and output labels come from the reviewed puzzle records” is D process explanation; a visitor needs what the labels mean, not where the data came from. It appears on all fifteen indexed categories, plus draft categories outside this indexed count. That broad template scope means it is **not** part of this pilot. The directions to inspect the word list before printing and use a custom list are A and should remain.

## All thirteen published collections

| Collection slug under `/collections/` | Classification and evidence | Decision |
| --- | --- | --- |
| `easy-printable-word-searches` | B purpose; A “12 × 12… twelve terms… forward horizontal, vertical, or diagonal paths.” | Keep factual difficulty guidance and no-fixed-age qualification. |
| `medium-word-searches` | B purpose; A “15 × 15… sixteen terms… all eight straight directions.” | Keep; clear comparison with Easy. |
| `hard-printable-word-searches` | B topical description and A actual settings; D unfinished-draft narration. | Five-field pilot includes its two narrow fields; preserve all sixteen children and useful wording. |
| `word-searches-with-answer-keys` | A printing choice; D “one canonical puzzle page… utilities rather than separate sitemap entries.” | Future owner-held replacement should explain opening/including answers; preserve stable matching-output truth. |
| `classroom-word-search-worksheets` | B lesson vocabulary/activity stations; A choose current subject then difficulty. | Keep. Subject selection and answer parity offer real value. |
| `animal-word-search-printables` | B pet/farm/habitat grouping; A easy versus medium topic choices. | Keep actual selection guidance; repeated template structure alone is not thin content. |
| `science-word-search-worksheets` | B subject list; A named Medium versus Hard groups. | Keep; factually differentiates available puzzles. |
| `seasonal-word-searches` | B year-round availability; A Easy seasons versus Medium Halloween/Christmas. | Keep. “Batch” is mildly internal wording, but no benefit justifies an isolated rewrite; no year-suffixed pages needed. |
| `geography-word-search-worksheets` | B regional/physical-geography selection; C difficulty is not grade level. | Keep; useful distinctions beyond generic geography keyword repetition. |
| `language-arts-word-search-worksheets` | B concept/reading vocabulary; A pair with instruction, matching key. | Keep context and limits; no benefit guarantee. |
| `math-word-search-worksheets` | B twelve topics and no calculation exercise; A choose current unit. | Keep; accurate scope matters more than shorter copy. |
| `history-word-search-worksheets` | B six-period list; D final “without relying on fictional franchises.” | Preserve all subject terms; only last policy clause is a possible owner-held trim. |
| `travel-word-search-printables` | B trip-stage versus map/destination choices; A combined activity-pack topics. | Keep; specific collection value. |

The hard collection and `/hard-word-searches` overlap in topic but perform different tasks: full printable inventory versus selected difficulty explanation and navigation. The answer-key hub/collection has a similar workflow/inventory split. This is potential consolidation research, not proof of cannibalization; current query/landing-page data is unavailable. Do not redirect or merge successful URLs from source similarity alone.

## All twelve published guides

All guide introductions, card descriptions and **120 section bodies** were inspected in the passage manifest. Most provide real instructions and are retained. Exact controls must be checked against the current UI, especially for printing; a guide that describes an implementation correctly can still be a poor visitor tutorial.

| Guide slug under `/guides/` | Useful material retained | Confirmed concern and decision |
| --- | --- | --- |
| `how-to-make-a-word-search` | A topic/list/spelling/grid/directions/exclusion/output sequence; concrete garden vocabulary. | D end of “Test the answer key”: “derived… not rebuilt independently” describes implementation. Keep visible answer-checking steps; no full rewrite. |
| `how-to-print-a-word-search` | A Letter/A4, orientation, optional answers, preview and printer-margin steps. | Review broad standard/large-print wording against C4's distinct actions; no promise all larger-grid output enlarges the bank. Preserve practical clipping warning (C). |
| `how-to-make-a-word-search-with-answer-key` | A word review, keep settings, separate student/key, combined PDF, unsolved sharing. | Several D stored-coordinate/developer directives. Pilot corrects one body only. Section about not generating a key separately describes a choice the interface does not offer. |
| `word-search-difficulty-guide` | B/A presets, direction/length/overlap explanations, vocabulary familiarity and group selection. | Keep. No arbitrary age guarantee; real difficulty factors are explained rather than promotional “expert” claims. |
| `word-search-rules` | A straight lines, endpoints, overlap, paper marking, exact selected paths. | D “constant direction vector” and “in this batch” are unnecessary jargon/history. Preserve genuine stored-path limitation so accidental filler occurrences are not promised as accepted answers. |
| `word-search-solving-tips` | A uncommon letters, endpoints, letter pairs, scanning directions, lengths, tracking and getting unstuck. | D introduction's “without making claims about cognition or health.” Remove only through owner review; keep actual strategies. |
| `large-print-word-searches` | A compact-grid/word-bank/paper/preview checks; C printer variability. | F ambiguous claim that Large Print enlarges bank/headings without changing placements, and obsolete Print→Large Print instruction. C4's ordinary “Larger grid type” is different from “Download measured large-print PDF.” Needs precise owner-held correction, not a universal font-size claim. |
| `classroom-word-search-ideas` | A preview/review/warm-up/partner-check/spelling activities; C speed is not subject mastery, suitability review. | Keep. These constraints help teachers use the activity appropriately and are not editor-only instructions. |
| `homeschool-word-search-ideas` | A connect current materials, optional intervals, custom lists, outputs, difficulty and checks. | Keep. Optional use and alternatives are substantive guidance, not filler. |
| `esl-word-search-activities` | A concrete words, familiar themes, short lists, spelling, meanings/images, pronunciation, cultural context and answers. | D card description's “without promising learning outcomes.” Keep activity limitations inside useful guidance; no wholesale deletion of C caveats. |
| `custom-word-lists-for-word-searches` | A focused garden example, spelling, duplicates, normalization, lengths, grid and exclusions. | D “A non-copyrighted garden example…” unnecessarily asserts a rights characterization. Keep the example; a small future wording correction suffices. |
| `vocabulary-practice-with-word-searches` | A meanings, categorization, examples, sentences and related terms; C activity alone does not guarantee outcomes. | Keep. Explicit additional teaching tasks make the limitation useful. |

“Written by Suhas Sunder · Reviewed on 2026-07-25” appears on all twelve guides. Source establishes the attribution/date configuration, not that a human performed a review on that date. Treat as a C/F verification item for the owner; do not update review dates or invent reviewer credentials. The site openly describes automation, which should remain.

## Fourteen hubs, homepage and directory indexes

| Route | Significant purpose/concern | Decision |
| --- | --- | --- |
| `/free-printable-word-searches` | A/B choosing a puzzle before output, printer versus online use, student/answer sheets. | Keep. Its added FAQ is separately held H01/H02. |
| `/online-word-search` | B immediate browser play versus offline handouts; A matching output. | Keep actual task distinction; FAQ H05/H06 remains held. |
| `/word-search-pdf` | A/B choose topic/output and printing guides; D “separate noindex utility view.” | Hold a small visitor-first correction; noindex is not a user reason for separate pages. FAQ H07/H08 is separate. |
| `/large-print-word-searches` | B adult topics and print factors; A preview grid and bank. | Keep useful advice; name measured PDF distinctly in a later owner-held update. FAQ H03/H04 remains held. |
| `/word-searches-for-kids` | B familiar themes; A match vocabulary before dense grids. | Keep practical audience choice; no unsupported learning outcomes. |
| `/word-searches-for-adults` | B theme/format/difficulty; D “without childish styling or unsupported wellness claims.” | Preserve theme options; remove editorial-policy narration only after owner review. |
| `/word-searches-for-teachers` | A ready-made versus lesson-list workflows; F substitute-teacher collection claim. | Owner-held exact correction to classroom/science/answer-key; do not activate draft. Added FAQ H09/H10 is separate. |
| `/word-search-worksheets` | A title/instructions/bank/name/date, separate answer page; B subject collections. | Keep; actual pack-builder link is useful. |
| `/easy-word-searches` | A 12×12/twelve terms/forward directions and no fixed age; D “This hub explains… collection…” taxonomy. | Keep settings and real links; no bulk merge or rewrite. |
| `/hard-word-searches` | A 18×18/twenty/all directions and vocabulary familiarity; D final hub-taxonomy paragraph. | Preserve navigation to full hard inventory. Avoid changes justified only by repeated subjects. |
| `/word-search-with-answer-key` | A matching grid/key and where to browse; D “This page explains the workflow…” | Keep matching-output explanation; narrowly improve taxonomy narration only after scope review. |
| `/word-searches-for-seniors` | B interests, readable output; D “No health claims” feature and “Neither page makes medical…” paragraph. | These describe internal restraint. Preserve absence of therapeutic claims internally and visible preview instruction; no claim of low-vision certification. |
| `/homeschool-word-searches` | B prepared versus custom list; C no prescribed curriculum. | Keep real audience limitation and useful alternatives. |
| `/esl-word-searches` | B concrete topic choices; C meanings/pronunciation/feedback need separate activities. | Keep. D final no-outcomes narration is a minor owner-held trim, not reason to erase limits. |
| `/` | A distinguish browse/print/play/create; B featured choices; A seeded-output and student/key consistency. | Keep structure and workflows. Shared Ancient Egypt/Reading/Swimming cards contain D copy; pilot covers only Ancient Egypt. “150 reviewed puzzles” requires owner review-provenance confirmation (C/F), not a test-based assurance. |
| `/categories` | A broad subject then specific topic; D “real curated puzzle rather than an empty filter page.” | Keep actual browse hierarchy; negative implementation comparison can be staged later. |
| `/topics` | A alphabetical index; B difficulty/word counts; D “Each canonical page…” phrasing. | Keep useful complete index; canonical terminology adds little but does not justify index consolidation. |
| `/guides` | A choose creation/printing/help; E “Practical answers without filler”; D “does not lead to empty search combinations.” | Keep specific guide purpose and links. Self-description about avoiding filler is not visitor help; only small owner-held wording proposals. |
| `/word-search-generator` | A words/settings/seed/exclusions/output; B supported experimental directory with limitations. | Keep accurate task help, especially seed plus full configuration. Unavailable specialty grouping is an owner product decision, not an automatic feature deletion. |

All fourteen hub body paragraphs were matched to retained actual HTML rather than inferred from unused `content/routes.ts.intro` strings. `RouteHub` renders `page.description` and its own configuration; many page-model introductions are not visible on these routes. A source search alone would wrongly count those as published passages.

## Trust pages, FAQ, search and shared UI

The eight indexed trust pages (`/about`, `/accessibility`, `/contact`, `/copyright`, `/editorial-policy`, `/how-word-searches-are-made`, `/privacy`, `/terms`) have **C** as their primary purpose. Their entire substantive bodies are captured in the passage manifest. Policy instructions intentionally explain publishing standards; the same language in an Ancient Egypt card serves a different purpose and can be D. About's degrees, profile identity and human-review provenance require owner verification. Accessibility accurately disclaims formal WCAG certification; retain it and do not infer real AT acceptance from feature existence. Terms' accidental-filler limitation and copyright's rights responsibilities are legitimate C, not removable noise. Privacy/editorial-policy differences are the separate H11–H13 holds.

`/faq` and `/search` are outside the indexed 217 corpus and require separate noindex/output validation. Source review finds actual FAQ answers about printing, answer keys and sharing, and honest search text: “Search results need JavaScript.” Keep A instructions and working catalog fallback. Do not count unread source-only fallback strings as fresh rendered evidence.

| Shared/control surface | Classification and decision |
| --- | --- |
| Header, More menu, footer tool/navigation labels | A. Real task destinations. Preserve familiar labels and focus/keyboard behavior. Repetition across routes is normal product navigation. |
| Footer maintainer strip | C. Exact requested attribution was independently reconciled already; no extra biography claim introduced here. Owner identity/legal acceptance remains distinct. |
| “Make, Check, Print” on generator and 150 puzzles | A. Actual input, checking and output steps. Keep despite technical “placements” terminology; no demonstrated need for a 151-page rewrite. |
| Puzzle standards links on the same 151 pages | C. Clear access to methodology/corrections; keep. |
| “Find a real puzzle…” hub search guidance | A/B. Offers an actual fallback when no topic fits; keep. No need to remove the full block because “real” is mildly promotional. |
| Collection filters, result counts and no-result recovery | A. Functional finding help; keep. Fresh interactive behavior belongs to browser acceptance. |
| Save/share/local-storage warnings | A/C. Names/words in browser storage and complete definitions in links are consequential disclosures; keep them before sharing. |
| Ordinary/readable/measured PDF choices | A/C. Distinguish actual 9/9.5pt readable and 16/18pt measured actions from ordinary larger-grid type; preserve fit refusal and output restrictions. |
| PDF-dialog helper correction | A. Original “Choose Download large-print PDF below…” now says “Choose Download measured large-print PDF below…” to match its button exactly. Independent source review supports this bounded root implementation. Print-dialog help, actual action, dimensions, minima, restrictions, metadata and puzzle generation remain unchanged; browser/regression evidence still required. |
| Specialty format warnings | A/C. Visual Braille is not tactile transcription; ASL labels are not handshapes; ñ normalization loses a distinction; Greek/kana are mappings; unsupported glyph PDFs are refused. Keep exact limitations. Separate unavailable primary choices is owner-held. |
| Contextual external activity links | B/C. Clearly disclosed tools from the same creator for relevant tasks. Keep scoped links, not an indiscriminate footer network. |

## Priorities and unresolved acceptance

1. Review the five-field pilot before any broader indexed edit. It fixes clear instruction leakage and one objectively incorrect count while preserving useful intent. There is no ranking guarantee.
2. Stage a separate precise large-print guide correction: distinguish ordinary larger-grid controls, measured PDF, fixed-grid output and physical scaling. This is a real instruction/capability mismatch, not cosmetic style editing.
3. Resolve the thirteen existing candidate holds and separate teacher-collection mismatch. Do not let either set disappear behind the new pilot.
4. Verify human attribution/review-date and legal/provider statements with the owner. Tests verify source behavior, not biographies or editorial history.
5. Keep useful categories, collections, teacher suggestions, safety limitations and real FAQs. Repeated product controls are not doorway content. Similar page purpose warrants query/landing-page research before consolidation; unavailable GSC is a material limitation.

No new indexable pages, puzzle definitions, publication dates, advertising behavior, metadata or production deployment are authorized by this record. Remaining inventory proposals are held individually. Fresh HTTP exact-text evidence and source reviews establish copy presence and measured scope; actual visual, assistive-technology, physical printing, legal and final owner acceptance remain separate.
