# Cancel stale HTML and static utility PDF exports

Independent boundary review, based on candidate04 `dca313e` (including case82).
Branch `codex/cancel-stale-html-exports`. No production or editorial approval.

## Reproduced defects

On the earlier 3279 export, the actual HTML frame font-readiness promise was held
after clicking HTML worksheet. Changing Rows to invalid 3, or navigating Home with
the builder unmounted, then releasing validation still downloaded the old private
worksheet with its original title and words. The HTML helper always clicked after
its asynchronous measurement; the caller had no stale-job check.

The static `/pdf/…?qr=0` page had a second missing guard. Holding its actual PDF
renderer chunk, clicking Download this PDF, navigating Home and releasing the
chunk still downloaded the old private PDF. Its metadata confirmed the old title.
The builder's PDF job guard already worked; the static caller omitted it.

Outside-git reproductions and exact URLs are retained in the task artifact root:
`review-html-stale.mjs/.json` and `review-utility-pdf-stale.mjs/.json`. The old
HTML and PDF files were generated locally; no message or publication occurred.

A third, smaller defect was reproduced on 3280: delay/reject an old PNG raster,
change printed case to lowercase, then release the old failure. Success already
checked the SVG fingerprint, but rejection did not. The new healthy preview
received the old error; a fresh current PNG succeeded. Evidence remains in
`review-png-stale-error.mjs/.json`.

## Bounded correction

HTML captures definition, output options (including letter case), portal identity
and job identity. One pending controller disables the button and reports Checking
HTML through a persistent live status region. Editing, option changes, invalid
output or unmount aborts the controller. The helper checks currency before reading
the portal and again before creating/clicking a download. The caller checks again
before success/error status. Late rejection after unmount is harmless.

The existing serial print-measure queue accepts the HTML AbortSignal. Queued jobs
check it before creating frames; active font/image readiness also races abort,
removes its listener/timer and removes the frame immediately. This only affects
the isolated temporary measurement frame. Interactive CSS, ads and their geometry
are untouched. Download URLs are revoked even if appending/clicking fails.

Static PDF now supplies the shared wrapper's existing optional cancellation
callback, checking mounted/current-loaded/status/path/query and job identity
before delivery and status updates. Captured options and exact puzzle remain
unchanged. The zero-placement recovery worker's semantic/Edit-link changes are
separate; this package does not duplicate them.

PNG now uses the same mounted/request/current SVG identity/markup test for both
success and rejection. Prior-style errors cannot overwrite current feedback;
current-preview failures still show useful errors and allow retry.

Clue parsing/numbering, case conversion, output options, PDF body generation,
script-free HTML serialization/sanitization/CSP, published grids and URLs are
unchanged. Normal helpers retain default behavior when no callback/signal is
supplied. No new service, provider or broad hydration.

## Validation

- Lint/TypeScript pass; 493 tests in 69 files pass, including a canceled-helper test
  that verifies no DOM/browser operation is entered.
- Production build 335 pages and static-host 217 sitemap/35 redirects/six utility
  shells pass. Existing ESLint plugin-detection warning remains.
- Initial `BASE_URL=http://127.0.0.1:3280 npx tsx tests/e2e/output-cancellation.ts` passes
  six delayed HTML cases: edit, invalid, case, paper, unmount and late rejection
  after unmount. No stale file/status or leaked measurement frame. A current
  lowercase clue worksheet downloads afterward with its original clue numbering.
- Two delayed static-PDF cases complete/reject the renderer after client unmount:
  no file, stale error or unhandled page error.
- Initial normal offline HTML, eight-width preview, six-route parity and complete
  printable-case browser regressions pass.
- Corrected PNG-source rebuild passes 335 pages. Final fresh 3281 run repeats all
  six HTML/two PDF cases and passes the delayed PNG prior-style rejection test,
  successful current-style retry and visible current-preview error. Normal HTML,
  eight-width preview, six-route parity, full printable-case and static-host
  regressions all repeat PASS on this final export.

The first regression harness counted Next's legitimate route announcer as an
output alert. It now checks specifically for stale PDF errors while retaining the
page-error assertion; product assertions and thresholds are unchanged. The complete
eight-case rerun passed. Earlier source repro reports are preserved separately.
Final regression artifacts: `output-cancellation-final/` in the task artifact
root; `output-cancellation-verified/` is the earlier HTML/PDF-only run.
Physical-device and final combined-candidate acceptance remain separate.
