# Classroom batches and separate teacher packets

Review-only child of integration 02. The containing commit identifies this
package. No publication or production authorization.

The existing local pack builder supports 5, 10 and 20 reproducible assignments.
Extending a batch retains earlier assignment seeds, grids and placements. The
download can include both sections, student worksheets only, or teacher answers
only. Both sections retain answers-last and interleaved ordering. Separate files
have explicit student/teacher filenames; answer ordering is disabled when only
one section is requested. Invalid page selections fail closed.

Default pack output and legacy single-puzzle PDF rendering stay unchanged.
Existing title/word limits, seeded replay checks, measured pack profile and
noindex/unlinked/ad-free utility behavior remain enforced. Every assignment is
validated even for teacher-only export. The maximum workload is bounded at 20
puzzles, 30 words and 20×20 cells each; no remote generation or data storage.

Validation November 6 on Node25: lint, typecheck, 277 tests, production build
(335 static pages) and static-host audit pass. Unit tests extract Letter/A4 PDF
text and compare every one of 20 student grids with its matching teacher grid;
all PDF files are under 2MB for the sampled input. Existing 150 published puzzle
fingerprints and exact legacy PDF byte fingerprints pass. The browser pack test
downloads 5/10 combined packs and 20-sheet student and teacher packets, checks
all paired grids and first-five stability, filenames, disabled controls,
download errors, noindex/no-ad/local-only requests, mobile and axe. It passes
against the frozen local export on port3291. `git diff --check` passes; no
formatter script exists.

Known baseline ad-eligibility, CLS/Lighthouse and dependency findings are not
waived. No genuine network-ad or physical-printer verification is claimed.
Larger batches can still fail when any word list does not fully place or the
measured page cannot fit. Entries remain available for correction. Exclude or
revert this package to roll back; no published puzzle config or URL migrates.
