# Single custom puzzle: measured large-print PDF

Isolated branch `codex/single-measured-large-print`, based on candidate04
`7d9e707`. Owner 13 / F3. No production, editorial or audience acceptance implied.

The existing `largePrint` request and `printScale=large` option enlarge grid type
inside the historical layout. They do not guarantee an enlarged word bank.
Their visible controls now say **Larger grid type**, with explanatory help.
Saved state, query values, ordinary preview, browser print and default PDF output
retain their original semantics. Two browser fixtures use the corrected control
name; their functional assertions are unchanged.

The Download PDF dialog has a separate **Download measured large-print PDF**
action. It reuses the existing shared `layoutProfile=large-print` renderer from
the measured worksheet work; there is no copied PDF body or new grid generator.
It preserves the exact puzzle grid, placements and seed, selected Letter/A4,
answer page, name/date, instructions and ink-saving choices. For this file only,
it selects portrait, below-grid bank, large type, no QR and no coordinates. The
ordinary output preferences remain selected. The rendered profile enforces at
least 16pt grid letters and 18pt word-bank labels or rejects the file with an
actionable fit error. Unsupported token/font output also fails explicitly.
Instructions, field labels and branding are not claimed to meet those sizes.

The wrapper's optional profile defaults to legacy. Default filename and bytes
remain unchanged; only the explicit measured file gets a `-large-print.pdf`
suffix. `create-puzzle-pdf.ts`, the generator, output-option model, published
content and ad code are untouched. The existing 1200 historical PDF byte-equality
audit is recorded in BUILDOUT-PDF-FIT-ERRORS.md; this package does not relabel it
as a fresh 1200-file audit. A focused wrapper test compares legacy bytes directly.

Async download jobs check the current definition/options, blocked-output state,
dialog/job identity and mounted dialog before clicking a download. Canceling,
editing, invalidating or leaving the dialog prevents stale delivery or errors.
The download Blob URL is revoked even if anchor insertion/click fails. A measured
failure labels the measured action; the ordinary button does not misleadingly
become a retry of another profile.

## Validation

- Lint and TypeScript pass.
- Full unit suite: 455 tests in 62 files pass. Focused 24 PDF tests pass, including
  real Letter/A4 minimum type geometry, same grid, 18pt complete bank, no geometry
  findings, two-page output, unchanged options, default legacy byte equality,
  crowded rejection and canceled-job download suppression.
- `npm run build`: 335 pages pass; existing ESLint plugin-detection warning.
  `npm run audit:static-host`: 217 sitemap pages, 35 redirects, six utility shells.
- `BASE_URL=http://127.0.0.1:3278 npx tsx tests/e2e/single-large-print.ts`: eight
  actual PDFs pass across Letter/A4 and 320/390/1280/short landscape. Exact
  student/answer grid parity, minimum type, complete bank, no measured geometry
  findings, selected name/instructions on/off, zero dialog axe violations,
  no horizontal overflow, ordinary preference preservation. Crowded 40x40 rejects
  with a visible fit error and no download; the grid is retained.
- Existing `request-print-settings.mjs`, `preview-toolbar.mjs` and
  `offline-html.mjs` pass, including legacy PDF retry, one/two pages, object-URL
  cleanup, eight preview widths, actual offline HTML and print pages.
- Actual PDFs, dialog screenshots and `measurements.json` are outside git under
  `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/single-measured-large-print/`.
  Poppler rendered Letter and A4 student/answer pages; all four PNGs were manually
  inspected with no clipping or overlap. It reported a missing Symbol display
  font, but the rendered Helvetica letters, bank, labels and answer lines are
  intact; no Symbol content is used in these Latin fixtures.

The first new browser harness used an exact label-text selector instead of the
existing combobox role, and passed a Node Buffer to the PDF.js6 measurement helper.
Those harness errors were corrected (role selector and explicit Uint8Array); no
product assertion or threshold was removed. The complete eight-file rerun passed.

Physical printing, installed fonts on other devices, audience readability and
independent product acceptance remain manual. These measurements are not an
accessibility certification. New content remains unpublished.
