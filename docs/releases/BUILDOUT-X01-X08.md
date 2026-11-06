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
| X04 | Christmas Baking Word Search | 16 baking and kitchen words, 15×15, medium, all directions, seed `staged-x04-christmas-baking-v1` | Baking ingredients, tools, and cookies rather than decoration synonyms. Source references support topic vocabulary only; no recipe instructions or food-safety claims are included. |
| X11 | Winter Cozy Activities Word Search | 16 indoor hobby and household words, 15×15, medium, all directions, seed `staged-x11-winter-cozy-v1` | Optional winter candidate, not counted as a Christmas pack child. It avoids the published winter puzzle's listed clothing, snow, fireplace, cocoa, and blanket terms. No wellbeing or cognitive claims. |
| X15 | Christmas Gift-Wrapping Word Search | 16 wrapping and mailing words, 15×15, medium, all directions, seed `staged-x15-christmas-gift-wrap-v1` | Distinct wrapping and mailing vocabulary, not decorations, baking, or music. It is an extra child candidate to make a five-puzzle draft pack with the existing published medium puzzle. |

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
| `npm test` | Passed: 25 files, 209 tests, including five staged-content checks. |
| `npm run audit:content` | Passed: 344 records, 217 indexable, 127 noindex, 150 published puzzles, zero warnings. |
| `npm run build` | Passed: 334 static pages. Existing Next ESLint-plugin detection warning remains. |
| `npm run audit:static-host` | Passed: 217 sitemap pages, 35 redirects, six browser-decoded utility shells. |
| `npm run audit:pdf` | Passed for the existing generator route: two A4 landscape pages, answer page and embedded QR images. Candidate Letter/A4 PDF generation is separately covered by the staged test. |

The prior release evidence retains three route-audit ad-eligibility findings
(health-and-wellness category, brain-training collection, and hidden-message
guide), a Lighthouse baseline of 77, production Zod high-severity findings, and
16 full dependency advisories from the validated base. This source-content
package changes none of those systems and does not resolve or reclassify those
release gates. The baseline route/Lighthouse/security findings were not
re-audited during this content-only batch.

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
