# Measured browser print refusal and recovery

Follow-up to PR72; source branch `codex/browser-print-layout`. A passing small
bank matrix did not establish support for every accepted200-word request.
Original PR72 evidence and physical-print limitations remain intact.

## Concrete failures and behavior

Independent stress reproduction used200 unique `WORD AA`…`WORD HR` labels,
40×40, E-only placements and a beside bank. All200 words placed successfully;
the accepted request is within the existing generation workload envelope.
Frozen72 browser output grew to four pages (DOM scroll2201px versus969px sheet).
Every grid letter and bank label remained extractable, so this was unexpected
fragmentation, not proof of dropped characters. A below-bank version nominally
printed one page, but its tiny cells produced measurable glyph overlap.

The app now measures the actual worksheet in a temporary sandboxed same-origin
frame using the selected page width/margins, existing CSS, explicit print rules,
loaded fonts and QR images. It checks physical page bounds, overflow, every
header/bank/footer/coordinate/grid label and each token against its own cell.
Own-cell bounds allow0.25CSSpx numerical rounding; there is no arbitrary font
floor or word-count cap. Wide Binary labels are refused even when their overlap
stays within the outer page. Latin, Morse and Braille examples still pass.

The small client guard lives inside already-hydrated printable utilities; it
does not convert editorial pages to client rendering. Checking/ready markers
do not occupy screen layout. A failed sheet keeps the entire screen grid and
bank visible with an actionable explanation. Utilities offer native recovery
to a below-grid bank and an editor link preserving the full puzzle request.
The Print action refuses unresolved/unfit output. Native Ctrl+P produces one
clear diagnostic instead of malformed or partially valid student/answer output.
No hidden overflow, truncation, substituted puzzle or automatic word removal is
used to obtain a fit.

Measurements are serialized and stale component work is cancelled. Every frame
is removed in `finally`; font/image readiness has a bounded5-second timeout.
Unavailable styles/fonts fail visibly rather than assuming fit. The isolated
frame never changes styles, ad geometry or print media on the main document.
Its worksheet markup comes from already-rendered React DOM; scripts are disabled.

Offline HTML validates its own serialized stylesheet/layout before offering a
download. The asynchronous failure reaches the existing visible export status.
Unsupported data creates no file; users can edit settings/words and retry.
Guard messages/editor links are stripped from valid files together with the
existing private URL/QR footer. Content sanitization/CSP/no-network behavior is
preserved.

## Actual checks

The final `browser-print-overflow.mjs` exercises:

- 200-word beside-bank rejection, full1600-token/200-label screen retention,
  blocked Print action and an actual one-page native-print diagnostic without
  a partial answer sheet or trailing blank page.
- Native below-bank recovery preserves all200 words and still refuses actual
  tiny-cell overlap. The editor link preserves every word; an explicit user
  edit to40 words yields two real printed pages with all1600 grid glyphs and
  all40 chosen bank labels, bounded on the page.
- Maximum-length256 title/500 subtitle/2000 instructions remain unmodified;
  the measured unfit header receives an actionable shorter-header message.
- Real Latin/Morse/Braille fit, and Binary12×6 fails own-cell overlap with a
  specific shorter-token/edit explanation. No incomplete specialty is activated.
- 200-word offline beside-bank export creates no download; explicit word/setting
  edits recover a real HTML file. Temporary measurement frames are cleaned up.

The complete supported `browser-print-layout.mjs` matrix is rerun on the same
final build:24 utility PDFs/48 pages (square/wide/tall, Letter/A4, orientations,
bank positions, QR/coordinates) plus six offline files/12 printed pages, normal
outputs, downloaded-PDF parity and forced QR error recovery. All actual grid
glyphs and coordinates, paper sizes and page bounds remain checked.

Evidence directories outside the repository:
`C:/Users/Suhas/.codex/tmp/ws-browser-print-guard-overflow-final/` and
`C:/Users/Suhas/.codex/tmp/ws-browser-print-guard-final/`. Original reproduction
remains in `ws-browser-print-overflow/`; intermediate failures remain separate.

The first diagnostic regression found a real trailing blank page from the old
forced page break after an error article. The unresolved diagnostic now uses
automatic break-after; the unchanged one-page assertion passes. A test initially
assumed200 below-bank words would fit; own-cell evidence disproved that, so the
recovery now requires an explicit user edit rather than weakening glyph checks.
A separate harness wait incorrectly expected a deliberately hidden ready marker
to be visible; it now checks attachment/state. No threshold was relaxed.

Supported Node22: full lint/typecheck,448 tests/60 files and production335-page
build/static-host217 sitemap/35 redirects/6 shells pass. The Next ESLint-plugin
warning is inherited. Both final browser scripts pass against the same fresh
export at3452. Poppler-rendered final diagnostic and recovered student page were
visually inspected: one clear diagnostic page, and a complete user-edited grid
with its chosen word bank. The supported output remains small at40×40; the
existing long-grid hint and physical-print/readability limits still apply.

Final combined utility CLS still requires the parent's repeated84-pair run;
hidden checking/ready markers and fixed offscreen frames are a design choice,
not measured proof of no regression. Physical printers, QR scans, real devices,
font/rendering differences and independent production acceptance remain manual.
No advertising source/lifecycle/placement, puzzle generation or approval state
changes. No main push/merge, auto-merge or production deployment.
