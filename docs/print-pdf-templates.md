# Print, PDF, and QR Templates

The printable surface is `components/print/PrintablePuzzle.tsx`. It renders:

- site branding
- title and instructions
- optional name/date line
- SVG puzzle grid
- word bank
- QR/share footer

The same `PuzzleResult` powers preview, print, answer key, play, and PDF-ready surfaces.

## Utility Routes

- `/print/[id]`
- `/pdf/[id]`
- `/answer-key/[id]`
- `/play/[id]`
- `/embed/[id]`
- `/custom/[slug]`

All utility routes are noindex and canonicalize back toward the generator.

## PDF Behavior

The current PDF route is a deterministic PDF-ready print surface. Users save it through the browser print dialog. A future direct binary PDF endpoint can reuse the same `PuzzleResult` and SVG grid data.
