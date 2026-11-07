# U05 — shared catalog search and explicit FAQ rendering

Review branch `codex/buildout-contextual-discovery`, based on navigation PR 33
at `2cc4c20885b3d956badd077a92086429470853d5`. This is a functional template
package, not publication approval or a completed sitewide editorial FAQ project.

The existing All tools blocks now share one server component and include the
existing catalog search above them. Home retains its original tool cards, with
the same search added above them. Category/collection/guide detail templates,
the curated puzzle/generator template, major browse hubs and the category/guide/
topic directories expose these controls. No entire page/layout becomes a client
component; only the existing search control hydrates. The dedicated `/search`
route and ordinary tool links remain crawlable.

Lower-page suggestions expand in document flow so they cannot float across
following tools or advertisements. Ad source, selectors, wrappers, placement,
fill detection and global placeholder suppression are unchanged.

The FAQ renderer now honors a supplied, nonempty FAQ array even when the legacy
`modules` list omits `faq`. Empty content does not cause a new generic FAQ section.
The previous three general answers remain centralized and continue to render
where an existing page explicitly requested the legacy FAQ module; the dedicated
FAQ retains them explicitly. Existing authored generator answers are preserved.
Published puzzle records currently contain **no authored FAQ arrays**; this is
latent wiring repair, not a claim that 150 missing FAQs have been restored.
Bespoke useful FAQs for major hubs are a subsequent bounded editorial/UI package.

The privacy page's obsolete server-PDF claim is corrected after inspecting
`lib/pdf/browser-download.ts`: PDF/QR generation runs locally in the browser,
without submission of a word list to a PDF endpoint. No other visible stale
server-endpoint assertion was found by the targeted source search. No puzzle
body, metadata, seed, reviewedOn, publication status, sitemap or new URL changes.

## Verification

Production build passes 335 pages; static-host audit passes 217 sitemap URLs,
35 redirects and six utility shells. Browser verification covers seven template
surfaces at 320/1440, SSR search labels, keyboard submission, Escape, visible
suggestions, scoped serious/critical axe and zero suggestion/ad rectangle
intersection, plus the authored generator and retained general FAQ.

An initial fixture assumed a native `type=search` input retained its text after
Escape. Chromium clears it; diagnostics showed an empty input and correctly
non-navigating empty form submission. The fixture now enters a fresh query and
activates the Search button by keyboard; no application behavior or assertion
threshold changed. The rerun passes.

Final full ESLint, TypeScript and all 258 tests / 33 files pass on Node 25.9.0, including the 150 published fingerprint snapshots. Protected advertising passes nine eligible routes at five widths plus fourteen ad-free routes. Final whitespace checks pass. No formatter script exists.

## Remaining gates

No new generic FAQ rollout, factual/educational claims or external-site links
are introduced. Trust/legal/raw utility placement and broader page-specific
editorial questions remain deliberate follow-up scopes. Existing route-ad,
Lighthouse and variable search-hydration CLS risks remain visible. Local mocked
ad/browser results do not certify real ad-network behavior or physical devices.
Independent review and combined integration verification remain required.
No main push, merge, auto-merge or production deployment. Rollback is a reviewed
revert; production remains `471a118dd459f2181cd641ed0572ba6dd7005540`.
