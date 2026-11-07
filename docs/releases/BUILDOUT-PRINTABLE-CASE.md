# Optional printable Latin lowercase

Review-only display preference. Canonical puzzle definitions, seeds, grids, placement coordinates, share IDs, published inventory and advertising stay unchanged.

The print/PDF settings dialog offers Original (uppercase grid) and Lowercase Latin letters. Original preserves entered word-bank casing as before. Lowercase changes only ASCII A–Z in the Latin grid and answer labels, including the numbered answer part of clue mappings. Author-written clue prose, titles and instructions retain their original case. Other packs keep their original tokens and disable this Latin-specific control.

Preview, browser print, PDF, script-free HTML, standalone SVG/PNG and tab-separated grid text honor the selected display. Grid-text conversion takes an optional display argument; all old calls preserve canonical tokens. A PNG that finishes after its visible SVG changes is discarded rather than downloading stale case or highlights.

The preference is optional in output settings, never a puzzle request/default. The original query string is byte-identical for omitted/uppercase output; lowercase alone adds `case=lower`. Normalization supports explicit reset and preserves the existing output-settings storage. Existing solver display preferences remain independent.

PDF measurement identifies the actual displayed Latin grid and numbered clue labels. Its new optional fifth `answerKey` argument explicitly measures teacher titles/mappings; existing composed student-page calls and unflagged selected-page behavior remain unchanged.

## Evidence

- Final Node22 lint/typecheck,486tests67files and335-page production build passed after the measurement adaptation. Existing Next ESLint-plugin warning remains.
- Actual390/1280 browser pass confirmed exact lowercase tokens in preview, PDF, real offline HTML, standalone SVG and grid text; same-size PNG glyphs changed and were visually inspected. Preferences survived reload and explicit reset, play-state URLs stayed exact, and clue prose/teacher numbering stayed intact.
- Targeted actual-PDF measurements cover Letter/A4 lowercase and both clue student/teacher pages with zero missing labels or geometry findings. Measured large-print action and print-guard integrations76/77 are preserved.
- Actual1200 published PDFs passed with zero measurement findings and zero hash differences against the after68 baseline. Fresh final-export3317 browser/static repeat passed217sitemap pages,35redirects and6utility shells, including lowercase print/answer query links and the disabled non-Latin control. Actual lowercase PDF student/answer pages were rendered with Poppler and visually inspected; its installed Symbol-font fallback warning did not affect the tested ASCII pages. Evidence remains outside the repository. Physical printer acceptance remains manual.
