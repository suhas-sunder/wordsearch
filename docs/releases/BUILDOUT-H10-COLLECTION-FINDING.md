# H10 — finding and ordering within existing collections

This adds controls only to `hard-printable-word-searches` and
`word-searches-with-answer-keys`. All existing published puzzle cards remain
server-rendered links in their original editorial order. The page, headings,
metadata, ItemList JSON-LD and ad wrappers remain server-rendered and unchanged.
No new URL, query combination, draft import, puzzle word list or seed is created.

`CollectionFinder` is a small control island receiving only published card IDs,
titles, subject names and difficulty labels. It enhances the adjacent SSR cards;
it does not hydrate another copy of the listing. Finding supports multiple title/
subject terms, case and accent folding; results can retain editorial order or use
stable title A–Z. The mixed answer-key collection offers a difficulty selector;
the hard-only collection does not repeat an unnecessary single-option filter.
Visible counts, a real empty message and a keyboard-operable reset describe the
current view. Reset returns focus to the find input. No local storage, history or
URL mutation is involved.

The initial SSR controls occupy their final normal document flow and are disabled
until enhancement is ready. JavaScript-disabled readers get every crawlable card
and an explicit explanation. Enhancement only toggles/moves those card nodes,
never ad wrappers, and restores the SSR ordering/visibility when unmounted.
Scoped CSS hides filtered cards without relying on user-agent hidden specificity;
controls are excluded from print. No fixed overlay or artificial placeholder
height is introduced.

## Validation to date

- Three targeted tests pass: combined title/subject/difficulty finding, stable
  ordering/source immutability, and actual SSR of all target published cards with
  bounded control presence, draft exclusion, no-JS guidance and JSON-LD. The SSR
  test mocks only the unrelated global search island because that component needs
  an App Router context; the new controls and card output are real. The original
  missing-router harness failure is not an application failure or waived check.
- Targeted ESLint, TypeScript and diff checks pass.
- The combined finder, advertising markup contract and curated-publication suites
  pass all 24 tests, retaining the 150 published deterministic puzzles and reviewed
  collection inventory without altering the advertising contract.
- The complete single-worker Node run passes all 531 tests in 75 files. Vitest
  touched seven unrelated snapshots with line-ending/stat-only changes;
  `git diff --ignore-space-at-eol` confirmed no semantic difference. After the
  test process exited, only those verified generated touches in this fresh owned
  worktree were restored to HEAD; they are excluded from the package.
- Initial production build generated all 335 pages but reported my introduced
  `align-items: end` Autoprefixer compatibility warning. After that healthy build
  finished, the equivalent supported `flex-end` value replaced it. The corrected
  production build passes without warnings; static audit passes 217 sitemap pages,
  35 redirects and six browser-decoded utility shells. No active job or frozen
  parent export was interrupted or replaced.

The prepared `tests/e2e/collection-finder.mjs` covers both collections at
320/390/1280 in both themes, plus two JavaScript-disabled listings. It withholds
Next scripts until SSR controls/cards/fonts settle, then checks the hydration
control rectangle and CLS delta without resetting the original observer. It also
exercises title/subject queries, mixed difficulty, empty/count/reset, stable A–Z,
keyboard traversal, unchanged URLs/JSON-LD, overflow, control/ad separation and
serious/critical axe. Runtime errors and actual initial CLS are retained.

Focused browser execution passes all 12 collection/theme/layout cases and both
no-JavaScript listings, with zero runtime errors, axe notices, overflow or ad
overlaps. Initial CLS and the separately measured hydration CLS delta are **0 in
all 12 cases**; control x/y/width/height remain unchanged within the original
0.5px tolerance. The hard collection retains 16 SSR cards; the answer collection
retains all 150. Subject finding for science selects four and twelve respectively.
The real title queries, difficulty selector, empty state, count, A–Z/reset and
keyboard traversal all pass; URLs and JSON-LD remain unchanged by interaction.

This export is honestly identified as base
`f62322423b68d6c8c7724dd34d4d77727128268a` plus application fingerprint
`f42f7197d2f29380d1a6002ad90ad8e68064837d81651ce47a32607500eb7a4f` across
the four changed/new app files (path:raw-file-SHA256 lines joined with LF in the
declared manifest order). Evidence is outside Git under
`C:/Users/Suhas/.codex/tmp/h10-collection-finding/`, including
`source-provenance.json` and `browser-first/manifest.json` plus 24 readable
control/empty-state captures. Individual review covered six representative
screenshots: hard light-320 controls, dark-390 empty, dark-1280 controls, answer
dark-320 controls, light-1280 controls and light-390 empty. They show readable
stacked/mobile and horizontal/desktop fields, visible focus, clear reset/count
and separated empty guidance. No source repair was needed after this run.

Desktop Chromium emulation and blocked-loader geometry are development evidence,
not physical mobile, field CWV, real-provider or owner acceptance. The final
integrated visual fixture adds the answer-key hub to the existing hard hub
(28 archetypes × 16 profiles = 448 cases), while preserving the older
27-archetype/432-case provenance. Exact final combined regression remains queued.
