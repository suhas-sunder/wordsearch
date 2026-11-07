# Stable QR readiness without changing puzzle or print semantics

Frozen A (`90a0ee32bc984e583cf39d4ebb4b587a2b630c4b`) remains preserved. Its
84-pair comparison passes the original thresholds but contains 29 nonzero rows,
maximum CLS 0.04396895220006331. PR98's read-only trace confirms the transient
QR-preparing paragraph disappears, shrinking controls by 56px and moving the
worksheet. The native print-fit marker remains checking through that shift and
becomes ready later without changing geometry. QR-off diagnostic controls are
zero. The source defect is repaired rather than calling the broader guard a
zero-shift result.

## Focused change

Static print/PDF/answer utilities keep two useful intrinsic text rows while QR is
enabled: actual preparation/ready/error status and the existing no-QR recovery
link. Both rows remain normal document content; no blank spacer, arbitrary page
height, overlay or hidden content is introduced. Error text remains truthful.
The QR-unavailable marker reserves the actual image's 72×72 border box, or 68×68
in landscape print, with compact `QR code not ready` text. It retains its existing
class/status and does not pretend to be a scannable code.

Print-button disabling until QR preparation, fit validation, error recovery,
serialized output options, SVG/grid/answer content, seeds and advertising logic
are unchanged. Native Ctrl+P/PDF preserves the existing PR72 contract: an explicit
QR-not-ready warning accompanies the worksheet when QR is unavailable. This is
not described as universal native-print rejection. Fit-error native diagnostics
and button protection remain in force.

## Executed validation

- Two new meaningful SSR cases compare the complete student/answer SVG through
  pending/prepared/QR-off rendering. The targeted batch with ad/publication
  contracts passes 23 tests. Full single-worker unit/content/SEO run passes
  **546 tests in 79 files**. Lint, TypeScript and diff checks pass. Only verified
  generated line-ending/stat changes in seven unrelated snapshots were restored
  after the test process exited; no semantic snapshots were modified.
- Isolated production build passes 335 pages without warnings; static audit
  passes 217 sitemap pages, 35 redirects and six utility shells.
- `utility-qr-stability.mjs` passes **36 controlled cases**: three utility kinds,
  320/390, light/dark and delayed real QR success/error/QR-off. The real canvas URL
  is held and then resolved or rejected; QR pixels are not fabricated. Every
  screen CLS is **0**, status/control geometry remains unchanged, error text fits
  one line at 320, and the marker/image boxes match 72×72. Grid hashes remain
  identical; QR-off performs no QR generation. No overflow, runtime error or axe
  notice occurs. No observer is reset.
- Six ordinary, non-injected read-only trace cases (three kinds, QR on/off) all
  measure **CLS 0**, compared with A's 0.04396895220006331 in every QR-on case.
- Four native Letter/A4 portrait/landscape profiles plus failure/no-QR recovery
  produce **10 PDFs / 20 pages / 1,280 complete grid glyphs**, with text bounds and
  page counts checked. Computed print marker/image border boxes match 72/68px;
  screen boxes match 72px. Disabled printing, explicit native warning and real
  no-QR recovery retain the original state/paper/orientation.
- The existing **24 native layout PDFs** also pass: square/wide/tall, both papers,
  both orientations, bank positions, coordinates, student/answer pagination and
  actual glyph bounds, plus its normal/error/offline checks.

Individual visual review covered light-320 ready controls and dark-320 error
controls; Poppler-rendered Letter pending student/answer, A4 landscape ready
student/answer, A4 error student and recovered no-QR student/answer. Text is
readable and contained, warnings remain explicit, and no extra blank page or
footer collision appears. This is laboratory evidence; physical printer, Safari
and owner visual acceptance remain separate.

## Provenance and integration

The built app is A plus the four-file fingerprint
`64a350a848b2632acb8411bd71c2ad4109cd9b19bfe797f65ec1a59702673365`
(declared path:raw-file-SHA256 lines joined with LF). Evidence is outside Git at
`C:/Users/Suhas/.codex/tmp/utility-qr-stability/`: `source-provenance.json`,
`controlled/manifest.json`, ten native PDFs, `default-trace/manifest.json`,
`native-matrix/` and `rendered/` PNGs. Original A traces/results remain at
`product-final-90a0ee3/` and are not relabeled as corrected evidence.

The utility84 fixture now narrowly asserts the fourth intentional amendment:
exactly one ready QR-status/recovery row only in valid static print modes, exact
labels, same pathname, and all no-QR output parameters unchanged except QR. Only
that asserted row text is excluded from legacy text parity. Other words/order,
request/grid hashes and original +0.01 tolerance remain exact. The integrated
new freeze must rerun full84, then 448 visual cases and offline collection HTML,
then enabled-provider Lighthouse. No publication, main push, merge to main,
auto-merge or deployment is authorized by this package.
