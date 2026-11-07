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

Lint, TypeScript and the existing full suite run on the source package.
Production build/browser validation is serialized with the contextual-link
package to reuse one exact combined preview; the final checkpoint must record
the tested combined SHA and actual results. No main merge or deploy is allowed.
