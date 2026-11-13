# F2 settings: executable coverage and truthful fallbacks

Review-only package based on candidate04 at4e98b07, including original PR82/83/85 ancestry. Feature development is frozen after this bounded package unless validation exposes a concrete defect. New indexable content remains unpublished; no advertising, main or deployment change.

## Corrected inconsistencies

Nonblank hidden-message text containing no supported tokens previously applied nothing silently. It now adds a visible warning. Unsupported-only custom filler such as Latin `😀` previously fell back silently; it now explains the existing alphabet fallback. Both requests remain accepted and shareable, with identical grids, placements, tokenization and PRNG behavior.

Morse, binary and hexadecimal currently ignore custom filler in their existing pack implementations. Typed capability metadata now disables new custom selection/input for these formats and explains the limitation. Loaded custom settings retain their original mode/value/grid and produce an explicit fallback warning; users can choose alphabet defaults or placed-word tokens. No encoder, map, filler selection or placement algorithm changed.

An empty supported custom filler already had truthful default help and keeps that behavior. Existing hidden-message overflow still applies only its fitting row-order prefix and warns; later unused cells retain normal filler. No hidden-message decoding or generator rewrite is introduced.

## Actual guest settings coverage

| Setting / boundary | Executable evidence |
| --- | --- |
| Difficulty presets and edited direction selection | `builder-settings-matrix.ts`: all three literal presets; clicking the current difficulty retains customized directions. Existing `direction-validation.mjs` covers keyboard, repeated toggles, persistence and invalid routes. |
| Overlap | New matrix uses a seed with actual shared cells, verifies disjoint placements when disabled and exact original replay when reenabled. |
| Auto/manual dimensions; small grids | New matrix verifies auto10/12 behavior,8x14 manual dimensions, stable manual grids after visual-size changes. `settings-fallbacks.ts` exercises6x6 grids; zero-placement tests cover impossible dimensions/directions and seeded misses. |
| Word lists and real TXT/CSV/TSV files | New matrix uploads each format and verifies identical parsed answers and grids. `request-validation.mjs` covers file/text/workload bounds and editable recovery. |
| Seed and Shuffle | New matrix changes, restores, shuffles and restores actual seeds, comparing complete grids and decoded share definitions. |
| Filler modes and legacy overrides | `advanced-settings.ts` covers used/rare/custom/default controls. New fallback unit/browser tests cover empty custom mode, unsupported characters, original saved alphabet/custom override, explicit clearing and unimplemented-format limitations. |
| Hidden messages | New fallback tests inspect unused cells directly: unsupported-only warning/no applied text, short HI prefix, XYZ remainder and100-token overflow applying exactly30cells on6x6. Valid words/placements and accepted legacy definitions remain unchanged. |
| Alphabet choices | New matrix switches all eight existing maker choices and checks actual displayed tokens against replayed definitions. Specialty tests cover all13 draft routes, known mappings/collisions and explicit PDF limitations; `advanced-settings.ts` checks no-JS readiness notes/noindex. This is not approval of scaffolds as finished languages. |
| Instructions | New matrix edits the actual instruction field and verifies preview text. `printable-instructions.mjs` covers direction-aware defaults/custom copy and separate answer instructions. |
| Word-bank order and clues | Actual input/alpha/length controls and PDF extraction are covered by advanced/bank tests. `clue-worksheets.ts` covers source-ID numbering, punctuation, missing-clue recovery, teacher mappings, Letter/A4 below/beside, real PDF/HTML and keyboard solving. |
| Definition print defaults and output flags | `request-print-settings.mjs` covers manual-grid stability and independent paper/orientation/bank/answer/QR/ink choices. `preview-toolbar.mjs` covers the print/PDF dialog and output-state behavior. |
| Printed case | `printable-case.ts` verifies preview/PDF/HTML/SVG/PNG/TXT, persistence/reset, exact play links, query routes, retained clue prose and Latin-only limitation. Original/omitted serialization remains exact. |
| Measured large print and classroom output | Existing single-large-print/classroom/pack tests measure actual type, teacher/student packets and fit refusals. Ordinary larger-grid type is explicitly distinct from measured large-print PDF. Physical printing remains a manual gate. |
| Invalid or filler-only definitions | `empty-puzzle-recovery.ts` covers mobile/desktop maker and all utility kinds, exact explicit Edit links, malformed generic recovery, seed-specific miss, valid-neighbor replay and successful-only cache preservation. |
| Local data and corruption | Existing named-library/preset/progress suites cover versioned state, explicit operations, corruption/storage denial, reload and privacy. Last-builder/cache and curated/shared reachability regressions passed with PR83; new warnings never rewrite definitions. |
| Exact share/print replay | `share-route-parity.mjs`, actual PDF/HTML/grid exports and1200 published PDF hashes verify unchanged grid/placement/answer output. Raw generated states remain nonindexable. |
| Async export invalidation | Original PR85 output-cancellation tests cover request/options/invalid/unmount, bounded pending work and static PDF cancellation. This package preserves that implementation. |

## Validation record

Node22 lint/typecheck,514tests71files and335-page production build passed. Existing Next ESLint-plugin detection warning remains. Actual1200 published PDFs have zero measurement findings and zero SHA256 differences against the after68 baseline. Audit reports remain outside the repository.

Fresh exported source on3318 passed the new fallback/control matrix, existing advanced/no-JS specialty suite, request-print defaults, six shared utility rewrites/parity, clue PDF/HTML/keyboard solving, lowercase all-format exports, zero-placement/cache/recovery/Axe, library corruption/denial, local20-assignment presets, six delayed HTML/two static-PDF cancellation cases, printable instructions and the eight-viewport preview-toolbar audit. Static audit passed217sitemap pages,35redirects and6utility shells. Test harness corrections retained all assertions: role targeting handles textarea label text correctly, async file reads wait for actual loaded text, and native disabled option state is checked through `HTMLOptionElement.disabled` (Playwright's `isDisabled` did not reflect it).

This is executable coverage of the actual guest controls and known semantic boundaries, not a claim that all possible text combinations were exhaustively searched. Human clue accuracy/editorial approval, physical printers, provider inspection and the owner's final acceptance remain separate gates.
