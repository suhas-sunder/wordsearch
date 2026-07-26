# Print, PDF, and QR Templates

The printable surface is `components/print/PrintablePuzzle.tsx`. It renders:

- site branding
- title and instructions
- optional name/date line
- SVG puzzle grid
- word bank
- QR/share footer

The same `PuzzleResult` powers preview, print, answer key, play, and PDF-ready surfaces.

## Preview and output state

The visible preview toolbar mounts exactly one sheet. `PreviewMode` switches
that location between the unsolved puzzle and its deterministic answer key.
This state is independent from `PuzzleOutputOptions.includeAnswerKey`, which
continues to compose either one puzzle page or a separate puzzle-plus-answer
pair for browser print and PDF downloads.

The always-visible toolbar deliberately omits the output answer-page checkbox.
Answer-page inclusion remains available in both the Print and PDF dialogs.
Share, Print, PDF, and Show/Hide Answers remain beside the page-format controls.

## Utility Routes

- `/print/[id]`
- `/pdf/[id]`
- `/answer-key/[id]`
- `/play/[id]`
- `/embed/[id]`
- `/custom/[id]`

All utility URLs are noindex and canonicalize back toward the generator. Netlify
rewrites their arbitrary encoded suffixes to exported static shells. The shell
decodes and validates the puzzle state in the browser; it never requests a
Function.

## PDF Behavior

`pdf-lib` and the QR encoder load on demand in the browser. The direct download,
the PDF utility shell, and the print preview use the same `PuzzleResult` and
output options. No PDF payload or puzzle state is sent to an API.

Browser print remains available independently. It renders the same puzzle and
optional answer-key sheets through print-only CSS.
