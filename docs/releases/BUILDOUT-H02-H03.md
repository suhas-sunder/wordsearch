# B06 — staged H02/H03 hard evergreen pilot

Status: two AI-authored source-only puzzle drafts for independent review. The
candidates remain `drafted`, editorially unreviewed, and not approved for
publication. They are not imported into the public registry, topics, search,
collections, routes, or sitemap. Passing a technical validator does not verify
scientific or geographic correctness, educational suitability, licensing, or
editorial approval.

## Candidate scope and frozen configuration

| ID | Draft asset | Proposed path | Frozen seed | Scope and distinction |
| --- | --- | --- | --- | --- |
| H02-01 | Selected U.S. Mountain Ranges Word Search | `/word-searches/geography/selected-us-mountain-ranges-word-search` | `staged-h02-01-us-mountain-ranges-v1-73` | Twenty named U.S. ranges with a strong Alaska set. It focuses on proper names rather than the published Mountains puzzle's landform and hiking vocabulary. This is a selected list, not an exhaustive inventory. |
| H03-01 | Observational Astronomy Word Search | `/word-searches/science/observational-astronomy-word-search` | `staged-h03-01-observational-astronomy-v1` | Twenty terms about measured light, distance, stellar remnants, and astronomical observation. It uses a different word bank from published Space/Solar System and draft Planets/Stars and Galaxies records. |

Both candidates use the existing 18×18 hard configuration, twenty entries, the
Latin alphabet pack, overlap allowed, and all eight supported directions. No
generator, preset, print/PDF renderer, public content, ad behavior, or shared
page code is changed. Seeds and proposed paths are local to these draft
candidates. Difficulty text describes configuration and makes no solve-time or
learning-outcome claim. No search-volume or niche-demand claim is made for
either proposed topic.

The source sets `evergreenPilotStatus` to publication `draft`, editorial status
`unreviewed`, runtime import disabled, and human approval required. The content
file is not registered by application code.

## Inventory, collision and ownership checks

Before authoring, `npm run inventory:content` exported the full registry source
inventory to a temporary file outside the repository. It contained 344 route
records: 217 published, 105 draft, and 22 redirect records; the `_redirects`
source contained 35 aliases/redirect paths. The source catalog includes H02 and
H03 as proposals, not existing completed assets. The published indexable puzzle
count remains 150.

I inspected existing published and draft puzzle records, including the exact
word banks for Mountains, Landforms, Space, Solar System, and draft Planets and
Stars and Galaxies. Candidate path and normalized-token overlap checks include
the complete route inventory (published and draft puzzle records), sibling
candidates, and redirect aliases. These checks detect path and answer overlap;
they do not decide whether the themes feel meaningfully distinct to a human.

The original workspace contains eight protected, uncommitted geography,
history, and science candidates: countries, state capitals, world landmarks,
national parks, American Revolution, Civil Rights, Periodic Table, and Genetics.
Those files are outside this worktree and remain untouched. This pilot does not
copy their candidate lists or claim ownership of them.

## Research and rights notes

- [National Park Service: Geology and Physical Processes — Mountains](https://www.nps.gov/subjects/mountains/geology.htm) was used to check names and spelling in its U.S. mountain-range overview.
- [U.S. Geological Survey: GNIS Domestic Names Feature Classes](https://www.usgs.gov/us-board-on-geographic-names/gnis-domestic-names-feature-classes) explains the domestic `Range` feature class. It does not imply that each selected candidate entry has an individually recorded GNIS lookup.
- [USGS: Geology of South-Central Alaska](https://www.usgs.gov/publications/geology-south-central-alaska), [USGS Professional Paper 1386-K: Glaciers of Alaska](https://pubs.usgs.gov/pp/p1386k/), [USGS: Rocky Mountains](https://pubs.usgs.gov/publication/70207970), and [USGS: Streamflow-Characteristic Estimation Methods for Unregulated Streams of Tennessee](https://pubs.usgs.gov/sir/2009/5159/pdf/sir20095159.pdf) were used for selected U.S. range-name spellings and scope. The latter identifies the Unaka Range as a range of the Blue Ridge region. The word bank is a selection, not a complete or ranked list.
- [NASA Science: Universe Glossary](https://science.nasa.gov/universe/glossary/), [Hubble Glossary](https://science.nasa.gov/mission/hubble/multimedia/hubble-glossary/), and [Exoplanet Glossary](https://science.nasa.gov/exoplanets/glossary/) were checked for common astronomy-term spelling and usage. The puzzle uses vocabulary labels only; it copies no NASA definitions, prose, images, or presented list.

The range list uses named ranges, not peaks or plateaus. The NPS mountain
overview lists Basin and Range, but a separate NPS source classifies it as a
physiographic province containing alternating ranges and basins; that province
label is excluded. The references support factual vocabulary checks; they are
not endorsements or editorial signoff. No competitor lists, layouts, images,
or prose were used.
USGS/NPS source rights vary by item, and NASA site materials may have separate
copyright conditions; this work uses no source media or substantial text and
does not assume a blanket reuse license. A human reviewer must confirm factual
scope and any rights questions before the assets are considered for release.

## Validation and remaining gates

The focused test checks frozen IDs/seeds/configuration, source-only status,
uniqueness, inventory collisions, all answer placements, repeatable grid and
answer results, and two-page Letter/A4 PDF dimensions. The independent B02
candidate validator checks schema, published and draft overlap, path/category
matching, placement integrity, actual Letter/A4 grid and answer-coordinate
parity, and export exposure. These are technical checks; no rendered-page,
physical-print, assistive-technology, factual editorial, or publication approval
is implied.

| Check | Result |
| --- | --- |
| Focused evergreen test | Passed: 3 tests (source status/configuration, independent inventory validator, deterministic placements and Letter/A4 two-page PDFs). |
| TypeScript / lint | Passed on the current source batch. |
| B02 candidate audit without export | Passed for both candidates with zero issues. Letter/A4 PDFs were two pages with matching extracted grids and answer-line coordinates; each measured 9.5 pt word-bank text and 14.40 pt (Letter) / 13.95 pt (A4) grid glyphs. |
| `npm test` | Passed: 26 files, 213 tests, including the existing curated-publication/fingerprint tests and staged candidate tests. |
| `npm run audit:content` | Passed: 344 records, 217 indexable, 127 noindex, 150 published indexable puzzles, zero warnings. |
| `npm run build` | Passed: 334 static pages. Existing Next ESLint-plugin detection warning remains. |
| `npm run audit:static-host` | Passed: 217 sitemap pages, 35 permanent redirects, six browser-decoded utility shells. |
| B02 exact-export audit | Passed for the two exact candidates and fresh `out/` export: zero validation or leakage issues; no candidate path in route registry, sitemap, search index, or indexed HTML. |

The B02 validator's draft freeze hashes are:

| ID | Request SHA-256 | Grid SHA-256 | Ordered answer SHA-256 |
| --- | --- | --- | --- |
| H02-01 | `11bd809f31d96c3ebaf16bdda5319eed79165ef0c1bda3e4001016e9a50b3fb7` | `2f4450df6f3e3f6408d4516407e41bbbd8e45b776fdb4b30f32c3eba91d5424e` | `d1047ad5de7c126cafb0166602b5c0bf90673e6f9f00b7534167f22157d9abaa` |
| H03-01 | `69072912bb09ceb670175e16c0c9e4aa4f3101b43f3fef14fbe0ebad23ea6904` | `fe706d23ca6fbb70e39d0420c08a19a673fff998e9bfe97fcf41112e90306ea1` | `94b44de5d43b718b3378bccce9c0408338ad7b0d0c6bc3603b815e2b2c874476` |

The audit used B02 tooling commit
`63465be519f5caa8027116c0af70604155dea6ed`. The exact exported candidate JSON
array, stored outside the repository, had SHA-256
`c1a5ef372197274c0a62ef749e13d400177bf8fdf9cefceb0388a2c63a3d75f5`.

Before publication, a qualified reviewer must check every named mountain range,
astronomy term and intended learner/reader context; assess topical distinctness,
word-bank readability, directions and metadata; review rights; inspect printed
Letter and A4 pages and answer highlights; verify online/print/PDF parity; and
complete the independent release and discovery checks. Keep both candidates
out of runtime imports and public routes until those gates are separately met.
