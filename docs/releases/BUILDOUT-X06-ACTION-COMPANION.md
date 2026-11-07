# X06 exact action-word companion and review gate

X06's source-only review now offers two different tasks: X02's Christmas object words and the existing X08-A making-action worksheet. X08-A is an **optional companion**, not a second independently indexable Christmas child. It reuses its exact twelve words, seed, 12×12 grid and forward E/S directions. No new word bank, puzzle candidate, URL, runtime registry import or publication is added; the main candidate catalog remains 61.

The companion uses CUT, FOLD, PASTE, DRAW, COLOR, WRITE, READ, SING, SHARE, HELP, GIVE and MAKE. There are no shared answers with X02. Its existing intent already says general verbs plus seasonal context alone do not justify a standalone indexable page. The review therefore offers it for optional card/decoration activity context, with no supplied activity instructions, tool-safety assurances, age/grade recommendation or educational-outcome claim. Audience suitability and reuse remain unapproved.

## Source identity and independent gate

`lib/content/collection-review.ts` resolves the exact allowed X01/X02/X08-A records across their actual source files, checking whole-record SHA-256 values and canonical IDs. It records source file and content commit, rejects unknown/path-mismatched records and source drift, and preserves the published Christmas puzzle unchanged. X08-A's source file is `content/staged/seasonal-classroom.ts` at `bd6f2d12098968c094cdd05eba122fe5b59b2c46`; its record hash is `9a1008f683d74ecac1f434d75d2ac8c6ea5b5557eff4feaf8719599d20b6cdc7`.

X06's HTML and JSON explicitly distinguish **two selected worksheets, one proposed independent child, one optional companion and zero approved published children**. The activation minimum remains two independently approved published children. The companion has zero-new-URL allowance, unapproved standalone intent and cannot count toward that minimum, even when tests simulate a published/reviewed source with all reuse approvals true. All real child, audience, reuse, collection and owner approvals remain false; publication/runtime activation remain false. This completes useful source selection/resolution work without pretending that the published kids hub is ready.

`scripts/export-christmas-collection-review.ts` regenerates local script-free X05/X06 HTML and JSON manifests with complete banks, source/configuration provenance, separate role counts and unresolved gates. No live links, external resources, scripts or approval actions are added. X05's existing sources and selection are preserved.

## Validation and retained actual output

- Node 22 lint, typecheck and full single-worker suite pass: **548 tests / 78 files**. Eight targeted collection-review tests include unknown IDs, drift, wrong companion role, absent zero-URL declaration, hypothetical approval bypass, escaped HTML and actual PDF parity.
- Four actual source PDFs (X02/X08-A × Letter/A4), eight pages, were generated outside Git. All intended words, complete student/teacher grids and 48 answer-vector endpoints match their seeded cells. Actual grid type is 21.6 pt Letter /20.9312 pt A4; bank 9.5 pt. These are standard-profile sheets, not measured large print or physical-printer approval. Eight Poppler page renders were visually inspected without clipping or overlap.
- The isolated production build passes 335 pages; static checks pass 217 sitemap URLs, 35 redirects and 6 utility shells. All 61-candidate export-isolation checks report zero issues. No new runtime UI is introduced; the existing four-case offline HTML browser fixture will be refreshed as part of final-B acceptance, rather than claiming it has already run on this amendment.

External evidence is in the chat visualization directory's `x06-review-companion/`: regenerated `x05-UNREVIEWED`/`x06-UNREVIEWED` HTML/JSON, four actual PDFs, `pdf-report.json`, eight page renders and a contact sheet. Original source records, published/default generation, advertising behavior and the frozen A/D/E worktrees are untouched by this isolated package.
