# Advanced controls and specialty readiness

Review-only implementation. No publication, production deployment, main change, specialty activation or advertising change.

## Implemented

- Editable bounded puzzle seed, explicit filler modes and input/alphabetical/token-length word-bank ordering. Existing `custom` and omitted ordering retain the original placement order. New `input` order is a separate validated, shareable setting; ordering never mutates placements or the grid.
- Preview/print, offline HTML and PDF use one placed-word bank helper. It carries source clue metadata by word ID for the subsequent clue-mode work; this package does not implement clue worksheets.
- Saved alphabet-plus-custom-filler definitions retain their previous behavior, disclose that override and offer an explicit clear action. Latin rare-letter filler is unavailable for new non-Latin choices; existing non-Latin rare definitions retain their fallback behavior with a warning.
- Blank seeds block guest output actions and cannot replace the automatic last-builder cache. Hidden-message help explains actual row-order prefix and overflow behavior without changing generation.
- Specialty discovery cards, page heroes and maker pack descriptions disclose scaffold, experimental, lossy mapping and PDF limitations before use. Every specialty route remains draft/noindex, with the same route, canonical, title-derived seed and encoder. ASL text labels, semaphore and Roman-numeral scaffolds remain unimplemented and explicitly labeled.

## Validation

- Node22 lint/typecheck, final full433-test suite58files and335-page production build passed. Existing Next ESLint-plugin detection warning is retained.
- New advanced browser acceptance passed390/1280: real input/length/alphabetical preview order; seed edit/replay/blank blocking; used/rare/custom filler; legacy override and explicit reset; hidden-message applied tokens. All13 specialty readiness notes and noindex metadata were available with JavaScript disabled.
- Ten bank tests, including four real PDF extraction cases, passed. New input-order shares replay exactly; legacy/omitted order, placement labels, duplicates/exclusions and source clue alignment remain covered.
- Three advanced compatibility tests cover legacy filler, hidden-message capacity/overflow and explicit scaffold classification. Existing published content fingerprint checks pass.
- Actual1200 published PDFs (150puzzles x Letter/A4 x portrait/landscape x standard/large, including answer pages and QR) passed measurement with zero failures; every PDF SHA256 is identical to the approved implementation baseline after PR68. Audit reports remain outside the repository.

## Remaining acceptance

T02 clue/definition worksheets and answer alignment require a subsequent opt-in implementation. Case display controls and the complete F2 settings matrix remain separate acceptance items. This package makes no claim that experimental symbol mappings are accurate supported languages or accessible substitutes for Braille/ASL.
