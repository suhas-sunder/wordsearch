# Fourteen annual review packets using existing canonicals

These are real source-only five-puzzle compositions, not new public collection
pages, new holiday histories or authorization to expose draft children.
Published definitions are resolved by exact canonical path and reused unchanged;
staged children retain their source IDs and frozen seeds.

| Review pack | Selection purpose |
| --- | --- |
| Winter Family | Published winter/Arctic Animals plus indoor, sports and wildlife companions |
| Valentine Crafts | Published Valentine/friendship/kindness plus cards and note words |
| March Classroom | Existing St. Patrick's Day with spring and rainy-day companions; not an Irish-culture lesson |
| Spring Easter | Existing Easter and spring/garden words plus optional egg-hunt actions |
| Earth and Nature | Existing Earth Day, forest, wetland, plant and river puzzles |
| Family Appreciation | Existing Mother's Day/flowers/garden/friendship plus optional thank-you words |
| Shared Hobbies | Workshop, camping, road-trip, teamwork and gratitude; no gendered-hobby assumption |
| Classroom Farewell | Farewell, study skills, goals, teamwork and gratitude |
| Summer Camp | Camp activities with camping, beach, summer and road-trip companions |
| Travel Day | Existing airport/train/road-trip/hotel with public-transit words |
| Back to School | Existing supplies/classroom/back-to-school with routines and worksheet instructions |
| Halloween Activities | Existing Halloween/fall/crafts with costume making and harvest equipment |
| Autumn Table | Existing Thanksgiving/fall/gratitude with harvest and table preparation |
| North American Map Skills | Existing Canada/U.S. States/North America/map vocabulary/landforms |

Christmas and New Year compositions already exist in the seasonal-classroom
package and are deliberately not recreated. Canada/U.S. geography companions
do not assert national-holiday traditions or dates. Autumn selection does not
conflate Canadian and U.S. Thanksgiving histories. Faith-specific Christmas,
cross-cultural customs and a literal Father's Day canonical remain separate
editorial decisions; Shared Hobbies is an optional reusable utility selection.

```powershell
npx tsx scripts/export-annual-review-pack.ts march-classroom-review C:/review/annual
```

The command creates actual Letter/A4 student-only and teacher-answer-only
`UNREVIEWED` PDFs using the measured pack layout. It accepts only named
compositions and rejects missing/unpublished public references, unknown staged
IDs, excluded words and generation warnings. Each pack contains five distinct
grids and preserves deterministic matching keys. There is no runtime registry,
search, sitemap or public link change and no publication operation.

## Output findings resolved without changing puzzles

Real QA found a measurement false alarm on existing Valentine, St. Patrick's
and Mother's Day titles: the renderer has always normalized curly apostrophes
to ASCII, while the measurement helper compared the raw source title. The
existing pure substitutions are now exported as `normalizePdfText` and shared
by the renderer and measurement. Word content, substitutions and output bytes
are unchanged; legacy PDF byte-fingerprint tests pass. Title clipping and
word-bank geometry failures remain checked. No title or assertion was shortened
to make a failing output appear valid.

Initial full validation also caught the inherited PDF.js 6 cleanup migration
in the test-only measurement helper and layout test. Parent checkpoint
`48468bf` supplies the actual loading-task migration and consolidates the
duplicate helper into the central implementation. Those initial failures were
not counted as passing; validation was repeated after the dependency merge.

## Validation and limits

- All fourteen compositions produce Letter/A4 students and separate answers:
  **56 actual PDFs**, with five pages each.
- Every actual student page is measured: **140 page measurements**, zero
  findings, complete word banks, at least 9 pt grid and 9.5 pt word-bank type.
- All selected public references resolve to published indexable puzzle records;
  all staged references resolve to the existing source-only definitions.
- Composition uniqueness and five distinct grids per pack pass. Existing pack
  renderer tests preserve seed replay, matching answers and original-page parity.
- Lint and TypeScript pass; all 388 tests pass after the migration merge; production
  validation is serialized through the next parent integration checkpoint.
- `git diff --check` passes. No formatter script is configured.

Human review must assess each packet's actual usefulness, audience, holiday and
family suitability, spelling/semantics, rights and physical-sheet layout.
Published children do not automatically approve a new composition, and staged
children do not become published because a local PDF exists. No curriculum,
medical, developmental or accessibility certification is made. No advertising
logic, eligibility gate, production branch or deployment is changed.
