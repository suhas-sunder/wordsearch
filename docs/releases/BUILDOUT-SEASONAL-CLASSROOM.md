# Seasonal activity inventory and source-only pack compositions

Development only. No candidate or pack has human editorial approval, a public
route, publication date, sitemap entry, search entry or production authorization.
This package adds useful activity vocabulary without treating every proposed
seasonal phrase as a new indexable URL. Main and all published definitions stay
unchanged. Existing dirty root growth files were read and left untouched.

## Built inventory

Sixteen authored lists are frozen in `content/staged/seasonal-classroom.ts`:

| ID | Purpose | Configuration |
| --- | --- | --- |
| X08-A | Christmas classroom craft actions | 12 entries, 12×12, E/S |
| X14-A | Calendar and countdown vocabulary | 16 entries, 18×18, E/S/SE/NE |
| X14-B | Party planning | 16 entries, 18×18, E/S/SE/NE |
| X14-C | Project planning | 16 entries, 18×18, E/S/SE/NE |
| X14-D | Celebration cleanup actions | 12 entries, 12×12, E/S |
| S27-VAL | Valentine card-making materials | 16 entries, 18×18, E/S/SE/NE |
| S27-SPR | Rainy-day indoor games | 16 entries, 18×18, E/S/SE/NE |
| S27-EGG | Optional egg-hunt actions | 12 entries, 12×12, E/S |
| S27-MOM | Optional family thank-you note words | 12 entries, 12×12, E/S |
| S27-DAD | Workshop hobby tools, without gender assumptions | 16 entries, 18×18, E/S/SE/NE |
| S27-GRAD | Classroom farewell activities | 16 entries, 18×18, E/S/SE/NE |
| S27-CAMP | Selected summer-camp activities | 16 entries, 18×18, E/S/SE/NE |
| S27-SCHOOL | First-week classroom routines | 12 entries, 12×12, E/S |
| S27-HARV | Harvest tools and storage | 16 entries, 18×18, E/S/SE/NE |
| S27-HALLOW | Costume-making materials and techniques | 16 entries, 18×18, E/S/SE/NE |
| S27-THANK | Shared-table preparation | 16 entries, 18×18, E/S/SE/NE |

These are activity companions, not substitutes for the published canonical
holiday puzzles. Internal IDs describe the planning catalog; proposed URLs
remain season-stable and are not automatically created. Country-specific
Thanksgiving dates, faith-specific Christmas, St. Patrick's and lunar-new-year
history/culture remain separate factual-review work. No cultural claims are
invented to fill those gaps.

## Five reviewable pack assets

`content/staged/seasonal-packs.ts` supplies explicit child IDs. The editorial
tool resolver reuses the published Christmas/New Year definitions verbatim.

- Christmas Variety: published Christmas plus X01/X02/X04/X15.
- Christmas Classroom: published Christmas plus X02/X04/X15/X08-A; it omits
  the hard challenge in favor of short action words. Audience fit is unreviewed.
- New Year Activities: published New Year plus X14-A through X14-D. Hosting,
  planning and cleanup are explicitly reusable all-year companions.
- Seasonal Classroom: five independent card-making, rainy-day, egg-hunt,
  farewell and first-week activities.
- Year Round Activities: ten distinct vocabulary sets rather than ten reseeded
  copies of one list.

Produce actual local review PDFs without changing runtime content:

```powershell
npx tsx scripts/export-staged-seasonal-pack.ts christmas-classroom C:/review/seasonal-packs
```

The command writes Letter/A4 puzzle-first/answers-last PDFs to the explicit
destination, with `UNREVIEWED` filenames. It cannot register a content record,
approve a child or deploy. It uses the existing deterministic generator and
pack renderer. Student-only/answer-only variants and measured large-print
remain renderer functionality in the separate print workstream; this package
does not claim those capabilities or reimplement them.

## Validation

- `npm run lint`, `npm run typecheck`, `npm test`: passed initially with 260 tests; after adopting integration-02 and measured pack layout, all 297 tests passed.
- Cross-batch audit checks all five Christmas candidates plus the sixteen new
  candidates against existing published/draft records and redirects: zero issues.
- `npm run audit:candidates -- C:/Users/Suhas/.codex/tmp/ws-seasonal-classroom-candidates.json --export-dir=../wordsearch-growth-integration/out`:
  sixteen candidates, zero schema/collision/placement/PDF/exposure issues.
  This reused the preserved integration-01 export. The next combined checkpoint
  must rerun the audit on its fresh export; no app runtime files changed here.
- Snapshot stores request, grid and ordered answer SHA-256 values for every
  new candidate. All intended entries place completely; every answer cell
  matches its word and seeded replay reproduces the grid.
- All five named packs render both Letter/A4 and answers-last/interleaved:
  twenty composed PDFs with correct 10/20-page counts, dimensions and size bounds. Every student sheet is measured with zero geometry findings, at least 9 pt grid type, at least 9.5 pt bank type and every intended word accounted for.
  Existing pack tests separately verify composition against original pages.
- Local CLI export of Christmas Classroom passed for both paper sizes.
- `git diff --check`: passed. There is no configured formatter script.

The first targeted test exposed an incorrect test resolver assumption that a
published puzzle slug omitted its category. Resolution now uses its exact
canonical path; registry and publication validation were not weakened.

## Editorial and rights limits

Lists and commentary were authored for these draft activities. They copy no
dictionary definitions, source prose, recipes, images, lyrics, branded characters
or lesson instructions. The dictionary homepage is identified honestly as an
available human spelling reference, not evidence that all sixteen lists received
independent dictionary verification. The U.S. holding-tool spelling is VISE.

Required before any public use: human spelling, audience, family/cultural fit,
topical distinctness and rights review; title/word-bank layout and physical
Letter/A4 review. Technical matching does not certify educational outcomes,
age/grade suitability, disability accessibility or safety instruction. Standard
PDF bank text remains 9.5 pt in the inherited profile; no large-print claim is
made. The CLI and all pack variants now explicitly opt into the measured pack profile from integration-02; long-title wrapping and word-bank geometry are verified for these actual children.

No advertising lifecycle, placement or placeholder behavior changed. Reverting
this package removes only source inventory, editorial export tooling and tests.
