# Browser print parity and page fitting

F3 follow-up to the real defects retained in BUILDOUT-UTILITY-LAYOUT.md.
Source branch `codex/browser-print-layout`, based on parent04 application
`43a41594b31b3a47a897f9ed96d105dc5d0a715d`. No seed, grid placement, parser,
word-bank ordering, PDF drawing, metadata, indexability or ad behavior changes.

## Implemented behavior

Shared print and PDF-ready routes now render the requested answer sheet after
the student page, with a second-level heading and identical grid tokens/answer
paths. The answer-key route remains one answer sheet even with `answers=1`.
The regular `answers=0` route remains one student sheet. Downloaded PDF behavior
is preserved; its optional answer page now has browser-print parity.

Print CSS reserves the selected paper's usable height after real margins:
Letter portrait/landscape and A4 portrait/landscape. Header, actual word-bank
height and QR footer participate in normal grid layout; the SVG uses the
remaining space with its aspect ratio preserved, rather than expanding an
intrinsically tall grid across many pages. One pixel accounts for print-unit
rounding. No text or grid is hidden to pass pagination checks. Answer sheets
use the full body column. SVG alignment is at the top within its viewBox;
screen output keeps its intrinsic aspect ratio. The offline HTML stylesheet
uses the same header/body budget strategy with its existing margins, fonts,
security restrictions and intentionally removed QR/link footer.

The ready utility Print button waits for an enabled QR code. Failure is visible
and offers a native link to the same output options with QR disabled. Native
browser printing while QR is unavailable produces explicit not-ready text,
instead of silently printing a blank QR placeholder. Other printable consumers
also receive that honest fallback text. QR generation itself is unchanged.

Very long grids must use smaller glyphs to remain on one sheet. Measured
examples: tall40×6 Letter portrait grid 6.24pt, wide6×40 A4 landscape beside-bank
grid 6.85pt, normal15×15 Letter portrait grid 17.51pt. This is page fitting,
not large-print certification or a guarantee of comfortable type at extreme
dimensions. Utilities with more than25 rows/columns now say that one-sheet fit
uses small letters and suggest fewer rows/columns for larger type. That hint is
in the print-hidden toolbar, never in the worksheet.

## Final measured browser coverage

`BASE_URL=http://127.0.0.1:3452 BROWSER_PRINT_OUTPUT=<outside-repo directory>
node tests/e2e/browser-print-layout.mjs` (set PowerShell environment variables
normally). The script uses actual Chromium `page.pdf`, then PDF.js text/glyph
measurements, rather than screen rectangles as a proxy for printed pagination.

- 24 utility PDF files /48 pages: square8×8, wide6×40 and tall40×6, both Letter
  and A4, both orientations, below/beside bank, QR and coordinates enabled,
  student plus answer pages. All selected paper dimensions, page counts, every
  grid letter in exact row-major order, every coordinate and glyph bounds pass.
  Student/answer DOM tokens match; answer paths are present and no answer bank
  leaks onto the teacher page. No extra blank page, site footer or ad appears.
- Three normal15×15 output files check one student, two PDF-ready sheets and one
  answer sheet. Actual PDF download has the same two-page count as browser output.
- A forced browser canvas failure exercises the real QR error path: Print is
  disabled, native printed text says QR is not ready, and the no-QR recovery link
  keeps both requested sheets and enables printing. No fake placeholder remains.
- Six actual downloaded offline HTML files /12 printed pages cover square15×15,
  wide6×40 and tall40×6 on Letter portrait and A4 landscape, including beside bank.
  Both pages retain every grid glyph with bounded text, no extra page and no
  network requests, links, images, scripts or QR footer.

Poppler-rendered final square/tall student and answer pages, normal15×15 student
and answer, wide beside-bank and offline tall/wide pages were visually inspected.
Headers, name/date fields, coordinate gutters, answer strokes, bank and QR footer
stay separate; normal type is clear and extreme-grid small type is explicitly
disclosed. Square/tall screenshots show no accidental footer or blank page.
Physical printer margins, real QR scanning and Safari/Android remain manual gates.

Artifacts: `C:/Users/Suhas/.codex/tmp/ws-browser-print-fit-final/` (PDFs, offline
HTML, measurement JSON and PNGs). Initial evidence remains separately at
`ws-browser-print-fit/`. The initial24-case run passed but visual review found
unnecessary vertical centering of wide grids; top-alignment was implemented,
rebuilt and the complete final matrix rerun. No test threshold was weakened.

## Source verification and integration boundary

Supported Node22.23.4: full ESLint, TypeScript, all448 tests/60 files, production
335-page build and static-host audit217 sitemap/35 redirects/6 shells pass. All
150 published fingerprints are preserved. No formatter command exists;
`git diff --check` is used. Build retains the existing Next ESLint plugin warning.

The final long-grid toolbar hint was added after the measured export, at the
parent's request to avoid another build while other healthy work used the shared
slot. It changes only print-hidden text and its rows/columns condition; lint,
TypeScript and targeted print tests pass afterward. The parent exact combined
build must verify that hint. All pagination/QR/offline application code was in
the final measured build. Do not attribute that later text to the old export.

The sibling advanced-settings package changes only PrintablePuzzle's bank
selection to its shared helper. Preserve that change when merging; this package
does not replace its ordering or clue metadata. Future long clue banks still
need actual fit checks; this matrix does not certify arbitrary dense prose.

No main merge/push, automatic approval or deployment. Existing provider,
editorial, advertising-placement and manual acceptance gates remain separate.
