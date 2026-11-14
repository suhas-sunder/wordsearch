# X12 / X13 — staged winter sports and wildlife drafts

Status: two source-only puzzle candidates for human review. Both are `drafted`,
editorially unreviewed, absent from the public registry and not approved for
publication. Technical validation does not establish factual accuracy,
educational suitability, rights clearance, audience fit, or editorial approval.

## Candidate scope and frozen configuration

| ID | Candidate | Proposed path | Frozen seed | Scope |
| --- | --- | --- | --- | --- |
| X12-01 | Snow and Ice Sports Word Search | `/word-searches/sports/snow-and-ice-sports-word-search` | `staged-x12-01-snow-and-ice-sports-v1-1` | Selected discipline and event vocabulary, distinct from published Hockey and Swimming word banks and the existing broad Winter Sports draft. It is not an exhaustive inventory. |
| X13-01 | Winter Animal Adaptations Word Search | `/word-searches/animals/winter-animal-adaptations-word-search` | `staged-x13-01-winter-animal-adaptations-v1-1` | Selected behavior, body-feature, and habitat terms associated with some animals in winter. This vocabulary focus differs from the published Arctic Animals species list. No strategy is presented as universal. |

Both use the existing 18×18 hard configuration, twenty entries, Latin letters,
overlap allowed, and all eight directions available. The description reports
grid configuration only; no solve-time or learning outcome is claimed. No
generator, preset, renderer, public route, search index, sitemap, ad behavior,
or shared page code is changed. Candidate status remains `drafted` and
editorially `unreviewed` regardless of test results.

## Inventory and ownership checks

The full B02 base inventory was reviewed before drafting: 344 route records
(217 published, 105 draft, 22 redirect), 35 redirect/alias paths, and 150
published indexable puzzles. The source catalog identifies X12 Winter Sports
as a proposal with an existing broad draft seed and X13 Winter Wildlife / Animal
Adaptations as a new scope to differentiate from Arctic Animals and natural
science content.

The published Hockey, Swimming, Winter, and Arctic Animals word banks were
checked directly. X12 uses selected snow/ice discipline and event labels; it
does not reuse Hockey or Swimming entries. Its path is intentionally distinct
from the existing `/word-searches/sports/winter-sports-word-search` draft.
X13 uses selected adaptation vocabulary instead of the Arctic Animals species
list. Candidate path and token overlap checks also cover published and draft
records and redirect paths; these checks do not determine whether the themes
are meaningful or suitable to readers.

I compared the scoped topics with the separate staged Christmas PR #22
(X01/X02/X04/X11/X15); they are winter sports and animal adaptation topics,
not Christmas children. The staged evergreen PR #26 candidates (U.S. mountain
ranges and observational astronomy) have different intents and word banks.
The original workspace's eight uncommitted geography/history/science topics
(countries, state capitals, landmarks, national parks, American Revolution,
Civil Rights, Periodic Table, and Genetics) remain untouched; no topic lists or
prose were copied.

## Research and rights notes

- [Team USA winter sports](https://www.teamusa.com/milano-cortina-2026) was checked for conventional U.S. names of selected winter disciplines.
- [U.S. Ski & Snowboard's 2026 Alpine Competition Guide](https://www.usskiandsnowboard.org/files/2026-alpine-competition-guide) and [2025–26 Freestyle and Freeski Competition Guide](https://www.usskiandsnowboard.org/sites/default/files/files-resources/files/2025/2026_Freestyle-Freeski_Guide.pdf) support spelling and use of selected alpine and freestyle event terms.
- [Team USA's snowboarding preview](https://www.teamusa.com/news/2026/february/03/olympic-winter-games-milano-cortina-2026-preview-snowboarding) supports selected snowboard event labels; [Team USA Speedskating](https://www.teamusa.com/sports/speedskating) was checked for short track; and [U.S. Figure Skating's discipline page](https://usfigureskating.org/sports/2025/9/18/disciplines.aspx) for the figure-skating name. The list is a selected vocabulary set, not a copied official event list; no source prose, rules, or graphics are included.
- [NPS Prepare for Cold Air — SnowSchool](https://www.nps.gov/teachers/classrooms/prepare-for-cold-air-snowschool-pre-visit-activity.htm), [Wildlife in Winter: Survival Strategies](https://home.nps.gov/articles/000/winter-survival-strategies.htm), [Hibernation: Nature's Nap Time](https://www.nps.gov/articles/the-science-of-hibernation.htm), and [Winter Survival Adaptations: Caching Food](https://www.nps.gov/teachers/classrooms/winter-survival-adaptations-caching-food.htm) were checked for winter behavior, body-feature, dormancy, food-cache, and habitat vocabulary. These sources discuss selected species and locations; the word list does not generalize their examples to all animals.

These sources were consulted for individual terms and factual distinctions;
their explanatory text, lesson plans, rules, images, and layouts were not
copied. Rights vary by source and item. The citations do not imply endorsement
or blanket reuse permission. A human reviewer must confirm spelling, term
meaning, factual framing, audience fit, topic distinctness, and rights before
any release decision.

## Validation and remaining gates

The focused test checks stable IDs/seeds, draft status, paths, word uniqueness,
candidate inventory validation, complete repeatable placements, and two-page
Letter/A4 PDFs. The B02 candidate audit checks schema, normalized overlap,
path/category matching, placements, PDF grid and answer-coordinate parity, and
exposure in the exact export.

| Check | Result |
| --- | --- |
| Focused seasonal test | Passed: focused three tests; all 213 tests, lint and typecheck passed on November 6. |
| TypeScript / lint / full tests | Passed: focused three tests; all 213 tests, lint and typecheck passed on November 6. |
| Production build and static-host audit | No runtime modules changed. Production rebuild is covered by the next combined integration checkpoint; this source-only package reuses the preserved integration-01 export for exposure checks. |
| B02 candidate audit, without export | Passed for both candidates with zero schema, collision, path, placement, or PDF issues. All four candidate PDFs are two pages; each has 9.5 pt word-bank text and minimum grid glyphs of 14.40 pt (Letter) / 13.95 pt (A4). |
| B02 exact candidate/export audit | Passed against preserved integration-01 `out`: zero exposure, schema, collision, placement or PDF parity issues. Repeat on the next fresh combined export. |

The independent B02 candidate audit recorded these freeze hashes:

| ID | Request SHA-256 | Grid SHA-256 | Ordered answer SHA-256 |
| --- | --- | --- | --- |
| X12-01 | `b26e578a357520d0d9ce0af4ec72df51c174950c3865c1c28f26e87cbdf18742` | `a8d0f6890d1268a3f34018362e25694dba4370f93fa48fe3e95e7559ffb58e8f` | `11aa1935860f6dbd152034c72a1476a2f35d48dd3e751b10bd4253d8a8830b33` |
| X13-01 | `6e95dc27dd55f722b57bff4dac4ef40aad506f745c1837bc0c686a4cac8a6a47` | `04894aafc1bb333f580c6267f54d52ebb9b3e948bb672c5632ec956a48da7194` | `05f61bcfba812177175aa8947448936b630c3df18c5e9a8ea98e849d1ef172f5` |

The exact candidate JSON array was generated outside the repository and had
SHA-256 `49c8fc8217402e0f401b81d7d4d03f77bf3e0d63bfc33718591fb6bd842dec1f` at
the time of this audit. The audit tooling comes from B02 commit
`63465be519f5caa8027116c0af70604155dea6ed`; export exposure remains to be
checked against the final fresh build.

Before publication, a qualified reviewer must check the sport/event labels and
the biological/ecological terms in context; review topical distinctness,
word-bank readability, difficulty language, audience, metadata and rights; and
inspect printed Letter/A4 pages, answer highlights, and online/print/PDF parity.
Do not import these candidates into runtime data until the independent editorial
and release gates are complete.

