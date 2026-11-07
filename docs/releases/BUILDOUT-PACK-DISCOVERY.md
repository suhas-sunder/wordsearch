# Make the tested guest worksheet-pack utility discoverable

The initial pack prototype was intentionally unlinked. Its 5/10/20 worksheet,
student/teacher PDF, measured larger-type and local-preset functionality now has
real review evidence. A finished guest workflow should not require visitors to
guess `/pack-builder`.

This focused UI package adds an ordinary server-rendered "Create a worksheet
pack" action to the teacher and worksheet hub hero actions, keeping both
existing actions. Shared All Tools receives a "Worksheet pack builder" link.
The homepage's separate tool grid is unchanged; teacher/worksheet and shared
discovery provide actual paths into the utility.

No metadata, page promotion, sitemap entry, specialty generator activation,
published editorial text or puzzle definition changes. The target remains
noindex and ad-free; source-only holiday/teacher inventories stay hidden.
Navigation works without JavaScript; creating/downloading a pack continues to
use the existing browser application and its local-only behavior.

`tests/e2e/pack-discovery.mjs` checks four raw SSR routes, teacher and worksheet
hero links, six required widths, visible keyboard focus, actual navigation,
noindex/sitemap exclusion, no ad slots, axe and no-JavaScript navigation.
It verifies the real tool rather than adding a nonfunctional button.

Source checks passed lint, TypeScript and all 390 tests. Final combined
validation used `codex/context-tools-validation` application commit
`6be2dfd91f7e1f58fd3279398e783bf48d544672`, including contextual activity
links/profiles and hub FAQs: lint, TypeScript, 394 tests, production build
(335 pages) and static-host audit (217 sitemap entries, 35 redirects and six
shell routes) all passed. Subsequent test-runner and evidence changes do not
change the built application tree.

On the fresh static export at port 3446, the discovery browser test passed all
six widths, four SSR routes, keyboard Enter at 390/1280, pointer navigation at
other widths, visible focus, actual builder heading, noindex, sitemap exclusion,
ad-free destination, serious/critical axe and JavaScript-disabled navigation.
The contextual-links browser suite also passed. Protected advertising tests
passed nine eligible routes at five viewports plus 14 ad-free routes.

The initial runner guessed a builder heading and used a Playwright convenience
page incompatible with axe's context requirements. It now asserts the real
`Word Search Pack Builder` heading and creates explicit contexts; application
copy and accessibility thresholds were not changed to satisfy the harness.
An occupied-port preview attempt was discarded; only the fresh 3446 export
counts. A separately introduced footer contrast failure was repaired in the
contextual-links package, rebuilt and passed before final combined acceptance.

Creating actual packs still requires JavaScript, as before; native links work
without it. Physical-device, screen-reader and genuine filled-network-ad checks
remain manual acceptance gates. No main merge, production deploy or indexable
content activation was performed.