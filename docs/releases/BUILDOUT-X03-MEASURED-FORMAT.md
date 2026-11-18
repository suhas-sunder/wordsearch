# X03: measured Christmas format of unchanged X02

Source-only artifact branch `codex/christmas-measured-format`, based on frozen
candidate04 `a3988b546eedf44c772691dbe65a139b1a74a523`. No public route, runtime
import, new puzzle definition, indexable variant or approval is created.

The frozen corpus review found X03 was a format intent without a strict measured
asset mapping. Standard staged PDFs use the pack profile, not the measured
large-print profile. A measured probe of the four proposed dependencies found
X02/X04/X15 fit both Letter and A4, while X01 failed the 16pt grid minimum on
Letter. That limit is retained; X03 does not approve or alter X01.

The separate typed manifest selects **only X02**, the existing easy Christmas
candidate at `/word-searches/holidays/easy-christmas-word-search`. It pins the
existing source file/commit plus complete request, grid and answer hashes. The
offline helper validates that exact source before generating a real two-page
student/teacher PDF through the existing shared `large-print` renderer. Changed
source fails explicitly until the mapping is reviewed.

The unchanged 12×12 grid, all twelve words, seed, placements, title and canonical
ownership are reused. This file alone uses portrait, a below-grid bank, large
type, no QR/coordinates and an answer page. Letter/A4 are the only supported paper
choices. The renderer enforces at least 16pt grid and 18pt bank, or rejects fit.
No font, generator or PDF body is copied or changed. Source candidate
`largePrintSuitable=false` remains unchanged because its ordinary outputs and
editorial suitability are separate from this measured format.

`christmas.ts` and its pinned content references remain byte-identical. The new
asset has no proposed path, zero new-indexable-URL allowance, runtime imports
disallowed, editorial status unreviewed and publication unauthorized. It does
not expand the sixty proposed puzzle paths or automatically approve the source.

## Validation

- Node22.23.4 with parent04's fresh real dependency installation: lint/TypeScript
  pass; focused source mapping and actual Letter/A4 PDF tests pass.
- Tests check the actual pinned Git source bytes, exact X02 replay, unchanged
  canonical/catalog/published counts, strict paper rejection, two complete 144-cell
  student/answer grids, 18pt complete twelve-word bank, grid minimum and zero
  geometry findings. All twelve answer strokes match their true cell endpoints
  within the existing 0.2pt tolerance.
- Full single-worker suite: 519 tests in72 files pass. Node22 production build:
  335 pages pass. Static-host audit:217 sitemap pages/35 redirects/six utility
  shells. Sixty-candidate export-isolation audit passes; X02's source seed is
  absent from published HTML/JS/JSON. The frozen parent export is untouched.
- Actual helper PDFs and measurements are outside git under
  `christmas-x03-measured-format/` in the task artifact directory. They match the
  frozen X02 measured PDF hashes exactly. Grid minimums are26.1pt Letter and
  25.2919pt A4; all twelve bank entries are18pt. Both student/teacher pages were
  rendered with Poppler and visually reviewed: no clipping or overlap. Its
  existing missing Symbol display-font warning does not affect these Latin files.
  No browser/Chrome was launched. Next was run only after an explicit slot grant.

The initial provenance test compared canonical Git LF bytes with a Windows CRLF
checkout. It now compares the pinned and current Git blobs exactly, and separately
verifies the checkout text with only CRLF normalized. No source content, print
threshold, request hash, grid hash or answer hash changed to pass the test.

Frozen acceptance evidence remains outside git under
`product-candidate-04-a3988b5/pdf-corpus/`: all1200 historical hashes match, main60
standard staged PDFs and export isolation pass, measured L01–L16/pack and preserved
owner scopes are recorded separately. The original X01 Letter rejection and X02
measured results remain intact. Physical sheets, audience readability, originality,
fact/rights review and publication still require independent approval.
