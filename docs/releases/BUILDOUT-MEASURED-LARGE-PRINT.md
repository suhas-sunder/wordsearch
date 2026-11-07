# Measured large-print classroom output

Review-only child of classroom export PR38 (`37b4e52`). Adds an explicit
`layoutProfile: "large-print"` to the shared PDF renderer and pack composer.
Default `legacy` and existing `pack` output remain byte-compatible. Published
requests, grids, placements, difficulty presets and share state are unchanged.

The opt-in profile uses 18-point word-bank type and rejects grid letters below
16 points at 100% output size. It reserves measured word-bank rows and wraps
titles, uses portrait Letter/A4 with the bank below and no QR/coordinates, and
fails closed for unsupported tokens or dense layouts. It never silently makes a
published puzzle easier or shrinks its type to fit. Header/instruction/footer
text stays smaller; this is no certification or medical/accessibility claim.
The existing ink-saving style includes tinted gray/dark text rather than a
strict monochrome-only contract.

The local classroom utility exposes the profile in a labeled print-type
selector. A 15×15 short-list assignment fits; a dense 20×20 case correctly
rejects with entries retained. Student-only, teacher-only and both-section
downloads reuse the original assignment seeds.

Validation November 6, Node25: lint/typecheck, 280 tests, production build335
pages, static-host audit217/35/6 and whitespace checks pass. Unit tests extract
every student page of Letter/A4 five-assignment packs, assert zero measured
findings, all six bank labels at18pt and all grid letters at least16pt. The
initial A4 test caught bank/grid contact; added8pt clearance and reserved height,
then both paper tests passed without changing assertions. Legacy PDF byte
fingerprints and150 published puzzle fingerprints pass.

Browser `large-print-pack.mjs` passes on the frozen export at3392: actual Letter
and A4 downloads, all ten student/teacher grids, type sizes and retained invalid
entries. Existing classroom pack workflow also passes5/10/20 downloads, exact
paired answers, failure recovery, mobile and axe. First attempt on3292 hit an
already-owned server and timed out; that was not a pass. Retried with our own
3392 server; unrelated server preserved.

Rendered student and answer samples on both papers with Poppler and visually
inspected all four PNGs. Grid, labels, answer lines, header and footer are clear
without clipping/overlap. Poppler emitted its system Symbol-font warning; these
Latin samples rendered correctly. Temporary samples remain outside the repo.
Actual paper printers, other lists and real ad-network behavior remain external
checks. Existing release/security/CLS/ad-eligibility gates are not waived.
Rollback by excluding/reverting this opt-in package; old PDF calls stay legacy.
