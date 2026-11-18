# U04 / B07 — navigation and integrated search

Track B review candidate, branch `release/2026-W46-navigation`, based on PR 28
`10d6379bc29f2c46589c32d29b4dfae6c3805f19`. The containing commit/PR records
the exact checkpoint. Main remains `471a118dd459f2181cd641ed0572ba6dd7005540`.

The desktop links now align right. A native More disclosure groups all twelve
original destinations, published help links and Topics. The search icon opens
the existing search control inside it; its ordinary link remains `/search` for
no-JavaScript and modified-click use. The dedicated search route is preserved.
No new draft FAQ or staged content is promoted. Escape returns focus; route
changes, search submission, panel links and outside clicks close the menu.

The expanded menu and suggestions stay in document flow. **The header becomes
nonsticky**, deliberately: an expanded sticky header could obscure puzzle or ad
content. Closed header heights remain unchanged; opening the menu is a user
action which pushes following content below it. This tradeoff requires product
review. No advertising source, placement, wrapper, lifecycle, overlay or
placeholder styles changed. Native links remain in server HTML; no entire page
or layout became a client component.

## Validation

Node 22.23.4; same dependency lock. `lint`, TypeScript `--noEmit`, full Vitest
suite passed: 254 tests / 32 files. Worker concurrency was capped at two after
host pressure, with identical assertions. Production build passed (335 pages),
static-host checks passed (217 sitemap URLs, 35 redirects, six utility shells).

`test:navigation` passed at 320/390/768/1100/1280/1600 widths: keyboard disclosure,
Escape/focus restoration, search focus/suggestions/submission, outside click,
no-JS links/disclosure, preserved destinations, no horizontal overflow, scoped
serious/critical axe violations absent, no intersection of open-header and ad
wrapper rectangles. Desktop/mobile screenshots were inspected. Actual ad-network
fill, policy compliance and real-device behavior are not established by mocks.

The first new test run used the wrong Playwright page/context construction for
axe, then asserted focus before the scheduled animation frame. The harness now
uses an explicit context and waits for the actual focused input ID. A subsequent
attempt used the label text as an aria-label and timed out; corrected to the
real input ID. No production workaround or relaxed assertion was added.

An initial broad input run failed while printing failure diagnostics with no
body under severe host pressure; its original cause was obscured by that catch.
A fresh isolated `request-validation.mjs` run passed. The remainder of the
standard chain passed directions and the full 53-route × nine-width browser,
solver/print/search matrix. Advertising and remaining results are recorded below
before final push. Existing route/Lighthouse/security baseline risks remain
unchanged; no tests were weakened to hide them.

Several lint/typecheck attempts were interrupted during abnormally slow module
reads, not counted as passes. Identical-lock C-drive dependency reuse allowed
completed lint/typecheck/tests. The frozen production export was built before
that dependency relocation. No dependency versions or runtime source changed
during browser validation.

No production release, merge, auto-merge or repository-administration change.
Rollback: reviewed revert of this isolated checkpoint; before approved release,
capture the known-good Netlify deployment for the production SHA above.

## Continuation verification

Node 25.9.0: full ESLint, TypeScript --noEmit and all 254 tests / 32 files passed. The preserved production export passed test:navigation at all six widths, and the complete protected advertising suite passed nine eligible routes at five widths plus fourteen ad-free routes. No formatter script exists; final git diff --check passes. Combined integration build/browser verification remains required for subsequent packages. No snapshot changes are included.
