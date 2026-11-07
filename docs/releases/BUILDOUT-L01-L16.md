# L01–L16 larger-type utility inventory

Built on the measured large-print renderer from PR 43. Sixteen original short
lists now produce actual larger-type Letter/A4 worksheets and matching answer
keys. They are source-only utility selections, not sixteen proposed indexable
pages and not altered versions of the published puzzle seeds.

| ID | Utility selection |
| --- | --- |
| L01 | Garden Flowers |
| L02 | Baking Shelf |
| L03 | Birdwatching Kit |
| L04 | Travel Keepsakes |
| L05 | Music at Home |
| L06 | Hobby Table |
| L07 | Cozy Winter |
| L08 | Christmas Objects |
| L09 | Spring Garden |
| L10 | Beach Bag |
| L11 | Harvest Basket |
| L12 | Farmyard |
| L13 | Around the Home |
| L14 | Community Places |
| L15 | Family Picnic |
| L16 | Craft Challenge |

All have twelve selected short entries and frozen 12×12 grids. L01–L15 allow
forward horizontal/vertical placements; L16 allows eight directions and is
described as a small-grid challenge without an expert, medical or age claim.
These are output inventories rather than factual lessons, taxonomy inventories
or activity/safety instructions. Human spelling, usage, audience, distinctness
and rights review remains required. No source prose, dictionary definitions,
images, branded characters or copyrighted lesson material was copied.

Three five-puzzle packs cover L01–L15; a mixed ten-puzzle pack includes L16.
The editorial CLI creates separate student and teacher-answer files:

```powershell
npx tsx scripts/export-staged-large-print.ts mixed-larger-type-10 C:/review/larger-type
```

It writes four local `UNREVIEWED` PDFs (Letter/A4 × students/answers), with the
explicit `large-print` profile. Generation fails if all words cannot place;
the renderer fails if measured minimum type cannot fit. It never shrinks the
grid, removes words, silently substitutes a standard profile, approves a
candidate or registers public content. `largePrintSuitable` remains false in
the source definitions pending human/physical review, even after technical QA.

## Measurement-tool repair discovered by real output

The first L01 test reported missing words even though all words were present:
PDF.js merged adjacent bank labels into one item, `LILY PANSY PEONY`. L07 also
exposed the difference between cursor-advance widths and emitted glyph extents
in `QUILT RUG`. No renderer or assertion threshold was weakened.

`splitCoalescedWordBank` only reconstructs a sequence when it consists entirely
of known labels, segmentation is unambiguous, and the observed aggregate width
agrees within 0.05 pt with the renderer's known Helvetica-Bold widths and 12 pt
inter-label gap. Cursor positions use pdf-lib's kerned layout widths; label
bounds use the emitted glyph advances. Both end bounds must match the extracted
item. Unknown text, alternate spacing or ambiguous compound labels remain
unmeasured and produce the existing diagnostic. This is specific to the
committed below-grid renderer, not a general PDF reconstruction claim.

Regression tests cover the observed three-label and kerning examples, unknown
labels, ambiguous segmentation, width mismatch and ordinary single labels.
Existing clipped/crowded word-bank and legacy PDF byte-fingerprint tests pass.
The measurement module remains Node/editorial tooling; no public page imports
it, and no ad lifecycle or placement code changes.

## Validation

- Every L01–L16 candidate repeats its exact grid, places all twelve words and
  has matching answer cells. Committed request/grid/answer fingerprints freeze
  the utility output definitions.
- All sixteen actual Letter/A4 student PDFs measure with zero findings, all
  twelve labels present, at least **16 pt grid letters** and **18 pt word-bank
  text** at 100% scale. This is a measured type-size statement, not a visual
  disability certification or a universal printer guarantee.
- Four named packs × Letter/A4 × separate students/answers export sixteen
  composed PDFs with correct five/ten-page counts.
- Targeted layout/measurement/utility regression suite passed, 23 tests.
- Full lint and TypeScript checks pass; all 289 tests pass.
  Production export is covered by parent renderer/integration validation;
  no public runtime module was changed by this source-only utility package.

Physical printers and photocopiers, actual-size print settings, paper handling,
and human reading/audience/editorial review remain external gates. Publication
of any new content still requires separate owner authorization. Existing
published definitions, canonicals and 150 puzzle fingerprints remain unchanged.
