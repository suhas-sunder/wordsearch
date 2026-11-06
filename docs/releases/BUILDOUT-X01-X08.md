# Christmas draft assets X01–X08

Status: source-only draft inventory for review-branch implementation. These
assets are not published, editorially approved, or eligible for site activation.
The draft source may be visible in this public repository; it is kept out of the
runtime content registry, topic and collection data, search catalog, routes, and
sitemap. A passing technical check is not human editorial approval.

## Frozen puzzle candidates

The shared staged-puzzle model stores candidates with status `drafted`, a stable
ID and seed, source references, a `PuzzleDefinition`, editorial notes, and
taxonomy. The separate `christmasSourceOnlyStatus` explicitly records
publication `draft`, editorial status `unreviewed`, runtime import disabled, and
human editorial approval required.

| ID | Candidate | Frozen configuration | Distinction and limitations |
| --- | --- | --- | --- |
| X01 | Hard Christmas Word Search | 20 words, 18×18, hard, all eight directions, seed `staged-x01-christmas-hard-v1` | New seasonal vocabulary and larger challenge, not a repackaging of the published medium Christmas puzzle. No completion-time promise. |
| X02 | Easy Christmas Word Search | 12 short words, 12×12, easy, E/S only, seed `staged-x02-christmas-easy-v1` | Short words and forward-only paths. No age or reading-level certification; human review is required before describing it for early readers. |
| X04 | Christmas Baking Word Search | 16 baking and kitchen words, 15×15, medium, E/S/SE/NE directions, seed `staged-x04-christmas-baking-v1` | Baking ingredients, tools, and cookies rather than decoration synonyms. Source references support topic vocabulary only; no recipe instructions or food-safety claims are included. |
| X11 | Winter Cozy Activities Word Search | 16 indoor hobby, textile, and household words, 15×15, medium, E/S/SE/NE directions, seed `staged-x11-winter-cozy-v1` | Optional winter candidate, not counted as a Christmas pack child. It uses a distinct answer list from the published winter puzzle, though some topic categories overlap. |
| X15 | Christmas Gift-Wrapping Word Search | 16 wrapping and mailing words, 15×15, medium, E/S/SE/NE directions, seed `staged-x15-christmas-gift-wrap-v1` | Distinct wrapping and mailing vocabulary, not decorations, baking, or music. It is an extra child candidate to make a five-puzzle draft pack with the existing published medium puzzle. |

Open compounds are shown with conventional spaces where the word bank uses
multiword terms (for example, `SNOW GLOBE`, `GIFT WRAP`, `SLEIGH BELL`,
`PAPER CHAIN`, `ROLLING PIN`, `BAKING SHEET`, and `GIFT BAG`). The generator
supports spaces in displayed labels while its answer placements use normalized
letters. Candidate-overlap checks compare normalized answer tokens, so changing
spacing cannot hide a duplicate.

The Christmas pack proposal has five puzzles total: the existing published
medium Christmas puzzle plus four new candidates (X01, X02, X04, and X15). X11
remains a separate winter asset and does not fill a Christmas-pack slot. X14
retains the catalog's New Year celebration pack intent and uses the existing
published New Year puzzle as a proposed entry point; it does not represent a new
frozen puzzle or a Christmas child.

## X03 and pack / collection proposals

These proposals are not puzzle records and do not create pages or duplicate
canonical content.

| ID | Draft asset | Current dependencies and gate |
| --- | --- | --- |
| X03 | Large-print Christmas format | Reuse a canonical candidate's puzzle. Measure both grid and word-bank legibility in the actual output, then verify Letter and A4 at 100% and matching answer output. `largePrintSuitable` is false on these unmeasured candidates. Do not invent a type size or claim accessibility certification. A separate indexable page is not justified by format alone. |
| X05 | Christmas traditions collection | Remains draft until multiple appropriate child puzzles have human review and the hub provides useful selection guidance. Do not add unsupported cultural or faith claims. |
| X06 | Existing Christmas-for-kids collection draft | Source-only proposal depends on X02. The current collection record is untouched. Do not claim age suitability from short vocabulary alone or list children until appropriate inventory is human-reviewed. |
| X07 | Christmas printable multipack | Five-puzzle draft mix: the existing published medium Christmas puzzle, plus X01, X02, X04, and X15. This reuses puzzle candidates without creating additional puzzle pages. Keep the proposal draft until all children, answers, file layout, and pack PDF behavior are reviewed. |
| X08 | Classroom Christmas worksheet pack | Draft workflow proposal depending on X07: student pages with name/date line and a separate answer-only teacher section. No grade-level or educational-outcome claims. Classroom utility, print/PDF output, and no-ad print behavior need functional review. |

X05 and X06 remain non-active collection proposals even though child puzzle
source exists. X07 and X08 are pack/workflow proposals; the current repository
does not gain a new pack runtime, page, or indexable URL in this milestone.
The New Year X14 proposal remains separate, depends on the existing published
New Year puzzle, and has no new authored candidate or pack functionality here.

## Research and rights notes

- [King Arthur Baking's Christmas Baking Guide](https://www.kingarthurbaking.com/learn/guides/christmas-baking-guide) and [Gingerbread Cookies recipe](https://www.kingarthurbaking.com/recipes/gingerbread-cookies-recipe) were consulted for the general baking-topic vocabulary and spelling checks. No prose, recipe, image, or proprietary word list was copied. The puzzle is not cooking guidance.
- [Collins: snow globe](https://www.collinsdictionary.com/us/dictionary/english/snow-globe), [Cambridge: gift wrap](https://dictionary.cambridge.org/us/dictionary/english/gift-wrap), [Collins: paper chain](https://www.collinsdictionary.com/dictionary/english/paper-chain), and [Government of Canada TERMIUM Plus: sleigh bell](https://www.btb.termiumplus.gc.ca/tpv2alpha/alpha-eng.html?i=&index=ent&lang=eng&srchtxt=SLEIGH-BELL) support spelling of open compounds in X01.
- [Cambridge: rolling pin](https://dictionary.cambridge.org/us/dictionary/english/rolling-pin) and [baking sheet](https://dictionary.cambridge.org/dictionary/english/baking-sheet?topic=pots-and-pans) support spelling of open compounds in X04. Source references are vocabulary checks, not endorsements or editorial signoff.
- Merriam-Webster dictionary pages are listed in the source for ordinary spelling checks; they do not establish audience suitability or editorial approval.
- All puzzle grids are generated from this repository's existing deterministic generator. No competitor text, lists, images, or layouts are used.
- X09 Advent/Nativity and X10 Christmas Around the World are not authored here. They remain research/editorial-gated so no faith-specific or cultural assertions are made without qualified review and suitable sources.

## Technical validation scope and release gates

`tests/content/staged-christmas.test.ts` checks frozen IDs and seeds, word-list
uniqueness, distinctness from the published Christmas list, absence of candidate
paths in `routeInventory`, stable complete word placements and grids, valid
answer paths, and PDF input validation. It generates ten candidate PDFs (each
candidate at US Letter and A4 portrait), then verifies the PDF signature, two
pages, and requested page dimensions. The existing curated publication test
continues to cover the 150 published puzzle records. These are software checks,
not editorial signoff or a rendered print approval.

Validation on the source branch (Node 22.23.4 for the checks):

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed. |
| `npm run lint` | Passed. |
| `npm test` | Passed: 26 files, 215 tests, including five Christmas staged-content checks and six staged-validator checks. |
| `npm run audit:content` | Passed: 344 records, 217 indexable, 127 noindex, 150 published puzzles, zero warnings. |
| `npm run build` | Passed: 334 static pages. Existing Next ESLint-plugin detection warning remains. |
| `npm run audit:static-host` | Passed: 217 sitemap pages, 35 redirects, six browser-decoded utility shells. |
| `npm run audit:pdf` | Passed for the existing generator route: two A4 landscape pages, answer page and embedded QR images. Candidate Letter/A4 PDF generation is separately covered by the staged test and independent staged validator. |
| `npm run audit:candidates -- <frozen-candidates.json> --export-dir=out` | Passed for five candidates with zero issues; no candidate URL was found in generated route, sitemap, search index, or indexed HTML. |

The independent staged validator froze the exact final candidate inputs and
outputs using SHA-256. It reported two-page Letter and A4 PDFs for each
candidate, with extracted grids and answer line endpoints matching placements.
The smallest extracted word-bank text was 9.5 pt; the smallest grid glyph was
13.95 pt (X01 on A4). Those are measurements from generated PDFs, not a claim
of physical-print legibility or accessibility. Freeze hashes:

| ID | Request SHA-256 | Grid SHA-256 | Ordered answer SHA-256 |
| --- | --- | --- | --- |
| X01 | `212d0d8c94b5992e53b56be47e48d1b8d6ad31cdb0e0d192e4b2f3a251fc57e6` | `65357f296838a3dd1e07aa2d6b4ed0868fa31d42cc7a0baf64ab7d996e042cfe` | `1adb8a5de956139cc7589b88e4802b091e1f213cfaee5a13471d05b31dabb7f2` |
| X02 | `08238a47e6b3849bfbe13f3a17dbf5bd9aef14a7e4bb2a7b5400854b2c24337c` | `4c462fa3f24955d8daa78503adb0ee5db81b6e0b3d1107e2abbd2bb5ed3e3fcb` | `e3e6002c4391edbe5059731ee017eefabc19b1eb356c9c1b7632b0ecdfbd0ba9` |
| X04 | `de774b377442938bab312d915a997152bbe9af075135f04406126112620c15a3` | `e76f91efdfaf25374ae70f0599e5a85a65103501bb999bdd66242be97b183a58` | `fe89c68330ccf5e5c45a110d762cd0b966b086d8a73ee16d558d7881fbbdfcbd` |
| X11 | `e9594a530240a972db18c66b2fc0d4e4f156432cbf888820b0c4170f8ed469ce` | `45c3f560e8522139039a6b895f815723636785ce1ef7fe8528ddf68eea7ad4e5` | `d0b3a6bc9b6a8d3923967b1bb3d3fa0b8aef559e6b3a8f633151543db1943f47` |
| X15 | `01afae23785e72e2d70593bd93b7a8307a01a4dbbd98082ccad2284f89cf84ce` | `fff9a2bc101a08671b7beeb20f79338669d067180d00e3e99ed62e5e7ace74dd` | `7f4f81923979042843ad47490918a971b6b1213e090c4a5c4d013cd049219b7` |

The prior release evidence retains three route-audit ad-eligibility findings
(health-and-wellness category, brain-training collection, and hidden-message
guide), a Lighthouse baseline of 77, production Zod high-severity findings, and
16 full dependency advisories from the validated base. This source-content
package changes none of those systems and does not resolve or reclassify those
release gates. The baseline route/Lighthouse/security findings were not
re-audited during this content-only batch.

Following the first staged-source commit, labels were revised to use conventional
open-compound spacing and X04, X11, and X15 were regenerated with the existing
medium preset directions E/S/SE/NE. X01 and X02 retain their hard all-direction
and easy E/S configurations. Seeds and URLs did not change. The generator's
stable eight-hex fingerprints (request, grid, placements, complete) changed as
follows where inputs changed; X02 remained unchanged:

| ID | Request | Grid | Placements | Complete |
| --- | --- | --- | --- | --- |
| X01 | `a2f1cfe8` → `837a8f01` | `8aaf980a` → `4b4e4cff` | `04e3fc06` → `6af6e679` | `79f20930` → `360fbd3b` |
| X02 | unchanged (`8c0bf0c0`) | unchanged (`c6e88635`) | unchanged (`31cf5930`) | unchanged (`64334109`) |
| X04 | `785e7aa3` → `4eff1129` | `e3808f77` → `2f4029ac` | `923fcfb3` → `5f05e06c` | `3fd0e150` → `b4b5fb64` |
| X11 | `a7ad41bc` → `c24cec14` | `f455a51f` → `41305113` | `88eb77a4` → `dd4c5d83` | `aa0ae873` → `f3d6d65f` |
| X15 | `d0b769b5` → `da6148cd` | `65849eb5` → `4327839a` | `4da93c21` → `c4cf83e7` | `447ee061` → `75425970` |

These short values are repository stable fingerprints, not cryptographic hashes.
The earlier draft commit remains in history; this correction does not rewrite it.

The candidate PDFs have page-size and answer-page existence checks, but no
Letter/A4 visual or physical-printer approval is claimed by this source batch.
Before any publication or feature activation, review actual candidate print
layouts on Letter and A4, verify answer-key placement highlights visually, check
output legibility and page breaks, online-play parity, accessibility, and stable
fingerprints. Human editorial review must separately confirm vocabulary,
intent, age suitability where stated, metadata, usefulness, and rights. Then run
the repository's indexability, route, sitemap, internal-link, and ad-free print
checks on the exact proposed release. Keep all new assets out of runtime imports
until that review and the independent release gate are complete.

No advertising source, placement, placeholder, or lifecycle code is changed.
The existing 150 puzzle definitions, seeds, URLs, grids, and answer keys are not
edited by this package.
