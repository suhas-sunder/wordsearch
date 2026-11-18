# U09 — system-aware light and dark appearance

Review branch `codex/buildout-dark-mode`, stacked on navigation PR 33 at
`2cc4c20885b3d956badd077a92086429470853d5`. The containing PR identifies the
exact candidate. No main push, merge, auto-merge or production deployment.

The header button cycles System → Light → Dark → System. Its accessible name
announces the active choice and next action. Explicit choices use the local
`ilws-theme` key; System follows device changes and removes that saved override.
Restricted storage still permits a choice for the current page. Other tabs
receive storage changes. A small inline bootstrap resolves the palette before
page paint; only the HTML theme attribute suppresses hydration mismatch.
No-JavaScript visitors receive their device palette through CSS.

Site surfaces, menu, controls, cards, search, dialogs and the pack-builder CSS
module use the shared palette. Primary actions retain contrasting green/white
colors. Focus indicators are opaque and visible in both themes. At 320–380px,
the brand artwork and gaps shrink to fit all three header controls. No page or
layout became a client component; the toggle is a separate small client control.

Puzzle paper and the online solving grid intentionally retain the familiar
light palette, with a dark surrounding interface. Print resets the root palette
to light even without JavaScript; SVG/PDF drawing, answers and seeds are unchanged.
Advertising selectors, fallback colors, lifecycle, fill detection, placement and
global suppression are unchanged. Blank protected ad areas remain intentional.

## Verification

Node 25.9.0, unchanged lockfile. Full ESLint, TypeScript, 261 Vitest tests in
33 files (including all 150 published puzzle fingerprints), production build
(335 pages), static-host audit (217 sitemap URLs, 35 redirects, six utility
shells) and whitespace checks pass. No formatter script exists.

`BASE_URL=http://127.0.0.1:3265 node tests/e2e/theme.mjs` passes four widths
(320/390/768/1440), seven representative home/builder/category/collection/search/
trust/pack routes, serious/critical axe checks including the open menu, overflow,
system changes, persisted override/reload, blocked storage, no-JS dark and
no-JS light printing. All puzzle paper remains white. Seven unit cases verify
the prepaint script against saved, invalid, system and unavailable storage.
Additional dark Share, Print and PDF-dialog axe checks pass at 390/1440 and are
included in the durable theme harness. An exploratory selector used an explicit
ARIA role attribute on a native dialog and found no elements; corrected to
`dialog[open]`, without any application workaround or relaxed accessibility rule.

Against that fresh final export: the protected advertising suite passes nine
eligible routes × five widths plus fourteen ad-free routes; preview-toolbar
checks pass eight responsive widths and real 1/2-page downloads; PDF audit
passes two A4-landscape pages, title/word text, answers and embedded QR images.
Mobile generator and full-page home/generator screenshots were inspected;
artifacts remain outside the repository under the active chat visualization
directory, `theme` and `theme-final`.

An initial build failed because an existing cross-drive dependency junction made
Webpack resolve `./C:/Users/.../next/dist/client/next.js` from the E: worktree.
Replacing only this worktree's dependency junction with the parent's unchanged
same-drive install resolved it. No dependency or source workaround was added.
The first passing browser matrix preceded a print-specificity correction found
by inspection; the final build and complete matrix include that fix and the new
no-JS print assertion. No failing assertion or threshold was relaxed.

## Review limits

Local browser/mocked-ad results do not establish physical printer/device or
real ad-network compliance. Existing route-ad eligibility findings, Lighthouse
best-practices and PR 15's variable search-hydration CLS remain release risks.
New indexable content is not published. Full subsequent integration validation
remains required before any release. Rollback is a reviewed revert of this
isolated package; production remains `471a118dd459f2181cd641ed0572ba6dd7005540`.
