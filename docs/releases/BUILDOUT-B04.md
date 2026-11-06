# BUILDOUT-B04 / L-A / T05: PDF print measurement

Status: branch-only measurement and evidence; not a print redesign or production approval. Base weekly integrated candidate `74b8ff95024b60a7f299175cd153b3c4fb974835`. Source puzzles, all 150 published fingerprints, PDF rendering, advertising and routing are unchanged. The containing commit/PR identifies the measurement tooling. Run `npm run audit:print-measure` to generate the four representative published examples below; pass up to ten published puzzle IDs after `--` to select others. The command emits JSON to stdout and does not write to the repository. It builds each existing request with its existing title, words, seed, dimensions, directions and settings.

The generic `measurePdfBytes` helper inspects a selected page of an already generated or composed PDF; `measurePuzzlePdf` generates then measures a single puzzle PDF. Measurements use PDF.js text geometry in points at 100% (72 points = one inch): page size, title and individual title lines, cell width/height inferred from actual grid glyph centers, grid font, and individual word-bank boxes/font. It records potential title/name-date, word-bank/grid/footer, word-bank/word-bank, clipped or out-of-page text, plus text it could not identify. Wrapped bank entries are reconstructed from extracted segments. The helper currently requires a Latin single-character grid and a puzzle page with the supplied exact grid; it is an offline diagnostic, not a public endpoint. PDF.js text boxes approximate glyph extents, and missing extraction or an empty findings list cannot prove absence of every visual collision. Cell geometry is inferred from glyph positions rather than measuring ink boundaries. No fixed font threshold is a certification; actual physical print and assistive-technology review remain necessary. QR images, browser print, landscape, different printer margins and duplex handling are outside this sample.

## Measured representative PDFs

Actual generated, two-page, portrait PDFs, word bank below, name/date enabled, QR disabled. Results are points at 100%; each cell shows cell width / grid font. Word-bank font was 9.5 pt standard and 11.5 pt large in all 16 PDFs. Large print changes font and layout but is not a fixed-size or accessibility claim.

| Published puzzle | Letter standard | Letter large | A4 standard | A4 large |
| --- | --- | --- | --- | --- |
| Christmas | 36.00 / 17.28 | 35.33 / 20.49 | 34.89 / 16.74 | 34.89 / 20.23 |
| Biology | 30.00 / 14.40 | 28.44 / 16.50 | 29.07 / 13.95 | 29.07 / 16.86 |
| World Capitals | 36.00 / 17.28 | 35.33 / 20.49 | 34.89 / 16.74 | 34.89 / 20.23 |
| Nonfiction Text Features | 36.00 / 17.28 | 35.33 / 20.49 | 34.89 / 16.74 | 34.89 / 20.23 |

The tool reported no listed overlap or missing-label finding for these four sampled puzzles on those settings. This is a small sample, not a site-wide clearance. The full machine-readable report includes source IDs, paths, current request/grid/placement fingerprints, page dimensions and boxes; regenerate it from the stated base rather than committing transient output.

The focused tests also exercise actual PDFs with a deliberately long title, where the existing renderer clips the title and overlaps the Name control; and a deliberately crowded 40-word, 40×40 test puzzle, where all 40 words are placed but entries `VOCABULARY36` and `VOCABULARY37` overlap the footer in Letter portrait. These are test-case findings, not observations about the four published examples. The separate opt-in pack-layout work can use these measurements to evaluate a fix; this milestone deliberately does not modify the renderer or conceal the issue. The remaining risks include untested output options and fonts, physical printer clipping, label reconstruction ambiguities, unsupported alphabets and baseline ad/route eligibility findings.

## Validation

Node 22.23.4 `npm ci` completed with 16 pre-existing advisories (7 moderate, 7 high, 2 critical). `npm run audit:content`, `npm run lint`, `npm run typecheck`, `npm test` (24 files, 207 tests), focused PDF measurement tests, `npm run build`, and `npm run audit:static-host` passed. The static audit covered 217 sitemap pages, 35 permanent redirects and six utility shells. The Next build emitted its existing ESLint plugin-detection warning. No formatter command exists; `git diff --check` is used. Browser/Lighthouse were not repeated for offline-only tooling; prior parent runtime evidence and known three route/ad eligibility failures remain unchanged. No real printer, live provider, independent approval, production deployment or release review was performed.
