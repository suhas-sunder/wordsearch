# Fail-closed single-PDF fit and compatibility evidence

Review-only child of classroom-fields PR54. Reuses the renderer's measured
widths and actual Helvetica descenders to reject oversized titles/subtitles,
truncated instructions, banks crossing the footer rule, unbreakable beside-bank
labels, invalid grid areas and overlapping multi-character cell text. Errors
explain practical corrections and preserve the input/grid for retry. Existing
valid legacy drawing operations and positions remain unchanged.

The old measurement tests deliberately produced bad custom PDFs. They now
assert actionable errors; an independently constructed malformed PDF still
tests actual title/name and bank/footer collision detection. Initial full
testing also caught a previously unmeasured evergreen pilot bank crossing its
footer rule: source-only candidate QA now explicitly uses the existing measured
pack profile and asserts real geometry, rather than accepting a parseable but
crowded legacy output. No candidate words, seed, grid or placements changed.

Binary's wide8-character PDF cells used to overlap neighboring cells. This
unpublished experimental route now truthfully states downloadable PDF is
unsupported, and its exact regression requires a PdfLayoutError. Unicode-font
rejections remain separately tested. No specialty route was activated.

Measured unpublished worksheet profiles replace their truncated encoded footer
URL with a useful recreation note; legacy PDF footers remain byte-identical.

## Validation and migration boundary

Node22.23.4 lint/typecheck394tests, production335-page build and static-host
217sitemap/35redirect/6utilityshell checks PASS. Unit coverage includes exact
old PDF hashes, actual bounds, instruction truncation, independent malformed
fixtures, unsupported binary, and same-definition recovery by removing the
name/date field. Browser390/1280 error/retry checks, real PDF audit, six-route
share/answer/QR parity and5/10/20 student/teacher packet workflow PASS on3490.

`audit:published-pdf-fit -- --all-layouts` generates1200 actual two-page PDFs:
all150 published puzzles ×Letter/A4 ×portrait/landscape ×standard/large, QR on.
Final report has zero geometry errors and **all1200 SHA256 byte hashes match
the pre-change reports exactly**. Reports remain outside the repository in the
task temp directory. All150 grid/placement/share fingerprints also pass.
Defaults and published PDFs therefore need no migration. Only formerly broken
custom output becomes an explicit fit error; settings/word lists remain intact.

Measurements are not a print certification. The unchanged standard landscape
samples include48 outputs below9pt grid type (minimum7.82pt); every portrait
sample was at least12.75pt. Physical printer/audience review remains pending.
Measured large-print worksheet profiles separately enforce16pt grid/18pt bank.
No threshold was weakened to hide an output problem.

Three preexisting internal ad-eligibility findings and independent manual
product/release gates remain. No ad code, published content, generator behavior,
main push/merge, auto-merge or production deploy changed. Rollback by excluding
this isolated branch; doing so restores the documented custom fit defects.
