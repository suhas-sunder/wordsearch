# Document-ready PNG, SVG and plain-text grids

Owner18 requests useful output formats while preserving the compact builder.
The existing SVG action is extended with PNG and tab-separated grid text beside
the already implemented offline HTML worksheet. All formats use the current
grid; none regenerates a puzzle, uploads content or creates a public URL.

PNG and SVG export the visible preview, including answer highlights when shown.
TXT exports the underlying cell tokens row by row, retaining boundaries for
multi-character alphabets. These are grid assets for a teacher's own document;
HTML/PDF remain the complete worksheet/word-bank/answer-packet choices.

Standalone SVG now explicitly includes dimensions, namespace and system-font
attributes instead of depending on site CSS/web fonts. PNG rasterizes this same
SVG with a white background, up to2× intrinsic resolution and a3200-pixel edge
limit. The system typeface can differ from the website's bundled display font;
tokens, coordinates and answer geometry remain identical. This does not activate
or certify experimental language/specialty mappings.

Visible busy/error/download status and the existing valid-preview boundary keep
failures recoverable. Editing a request or unmounting during asynchronous PNG
creation cancels the stale download. Exact system-font measurement rejects
multi-character tokens that collide with cell borders; plain-text export remains
available. Source and download Blob URLs are revoked;
download filenames are bounded and sanitized. Grid files contain puzzle content
and are explicitly described as private when the original puzzle is private.

## Validation

Node22 lint/typecheck,450 tests across61 files,335-page production build and
217-sitemap/35-redirect/six-shell static-host audit pass. Published150 puzzle
fingerprints remain unchanged. Two new unit cases cover multi-token/Unicode
cell boundaries and filenames. No snapshot value was updated; Vitest's existing
line-ending-only working-file markers remain unstaged.

Actual browser downloads pass18 cases: square/very wide/very tall grids at
320/390/1280 in light and dark. TXT matches every exact cell; downloaded SVG
retains every token and visible answer lines; PNG headers/dimensions and actual
interior letter ink in every cell are checked independently of grid borders.
All requests/grids remain unchanged, with no overflow/runtime errors.
Simulated rasterization failure retains inputs/grid, and editing during delayed
PNG creation produces no stale download. The final rebuild, static-host audit
and complete18-case repeat pass with the glyph-fit guard and persistent live
status in the actual export.

Artifacts outside the repository:
`C:/Users/Suhas/AppData/Local/Temp/ilws-grid-exports-verified/` contains actual
light/dark PNGs and the browser report. A downloaded dark-theme PNG was visually
inspected: white background, complete rectangular grid and readable glyphs.

Independent review caught a concrete Binary image defect: eight-bit glyphs were
36.77px wide in34px cells. This was not accepted as a passing visual output.
The added exact font-fit guard now rejects both SVG and PNG for that request,
with actionable Grid text/Latin alternatives. It does not silently shrink the
symbols or activate the experimental feature. The original measurement/artifact
is retained by the compatibility report.

Six additional compatibility cases pass at390/1280: Morse/Braille exact TXT and
SVG tokens, independently reopened standalone SVG fonts/coordinates/cell fit,
real PNG dimensions and all96 cells with letter ink; Binary gets the expected
image error and zero downloads while exact TXT continues to work. Forced image
load failure revokes its source URL and restores the control. A real delayed
raster completes after same-document client navigation/unmount without a stale
download. Installed Chromium/system fonts only; this does not certify glyph
identity or font availability on every platform. Evidence is in
`C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/grid-export-compatibility-guarded/`.
An initial optional screenshot of an independently reopened data:SVG timed out;
the actual downloaded SVG, rendering assertions and PNG evidence were retained,
and the failing report remains separate. No product assertion was removed.

Final combined04 and physical document/printer/device acceptance remain separate.

## Scope decision and primary product examples

Current [Word Search Labs](https://wordsearchlabs.com/) exposes PNG/SVG/text grid
assets, and [Discovery Puzzlemaker](https://puzzlemaker.discoveryeducation.com/word-search)
offers image/HTML and case choices. These are functional examples, not evidence
of demand, ranking, safety or revenue. This implementation reuses this site's
existing SVG and deterministic data; no competitor puzzle text/assets/layout
were copied and no paid/privacy service was introduced.

No production merge/deploy, new editorial publication, generation migration,
advertising or dependency change. Rollback is an independently reviewed revert
of this focused package; no main or provider operation is performed here.
