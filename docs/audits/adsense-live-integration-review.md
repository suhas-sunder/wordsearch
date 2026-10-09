# AdSense Live Integration Review

Date completed: 2026-10-08

## 1. Starting state

- Branch: `review/adsense-placeholder-layout-20261008`
- Starting HEAD: `9a38a8a2764101bd036d2946a5709f4ec5429aed`
- `main` remained at `bbfb87da830cc4b980ea924c8c43ba0d36cab790` throughout this work.
- The pre-existing uncommitted content/SEO growth work was preserved and excluded from this integration.
- The approved six-placement geometry, template policy, and mobile-gap correction were treated as fixed inputs.

## 2. Files changed

Live integration files:

- `lib/monetization/adsense.ts` (new centralized configuration)
- `components/layout/AdSense.tsx` (new client-only loader/unit lifecycle)
- `components/layout/AdSlot.tsx`
- `app/globals.css`
- `app/privacy/page.tsx`

Tests:

- `tests/unit/monetization-placeholders.test.ts`
- `tests/e2e/monetization-placeholders.mjs`

Report:

- `docs/audits/adsense-live-integration-review.md` (this file)

Total: 8 files.

No page template, route, puzzle-generation file, SEO metadata file, sitemap implementation, redirect, or Netlify environment configuration changed.

## 3. Publisher ID

The centralized publisher ID is exactly:

`ca-pub-4810616735714570`

The centralized loader URL is exactly:

`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4810616735714570`

## 4. Placement-to-unit mapping

All names and slot IDs are declared once in `lib/monetization/adsense.ts`.

| Placement | AdSense unit name | Slot ID |
| --- | --- | --- |
| `top-banner` | `ilovewordsearch-above-header-banner` | `6498435012` |
| `below-header-banner` | `ilovewordsearch-below-header-banner` | `8471746257` |
| `sidebar-left` | `ilovewordsearch-sidebar-left` | `3872271670` |
| `sidebar-right` | `ilovewordsearch-sidebar-right` | `5709851549` |
| `seo-section-square` | `ilovewordsearch-seo-section-square` | `4396769879` |
| `above-footer-banner` | `ilovewordsearch-above-footer` | `7230906061` |

Unit tests compare the complete object against these exact values. Browser tests also compare every mounted placement's `data-ad-client` and `data-ad-slot` attributes.

## 5. Shared loader implementation

Eligible monetized shells render one `AdSenseLoader` client boundary only when the activation gate is enabled. Its effect:

1. checks existing document scripts for the exact centralized URL;
2. creates one asynchronous script with `crossorigin="anonymous"`;
3. marks it with `data-ilws-adsense-loader="true"` for deterministic tests; and
4. appends it to `document.head`.

The loader is not repeated per unit. Enabled browser tests observed exactly one loader request and one head script per eligible page. Ad-free pages installed no loader and made no loader request.

Each eligible `<ins class="adsbygoogle">` owns a separate push lifecycle. A `data-ilws-ad-requested="true"` guard is set before pushing, preventing React development effect replays from pushing the same mounted element twice.

## 6. Activation gate

The single activation mechanism is:

`NEXT_PUBLIC_ADSENSE_ENABLED=on`

Only the exact value `on` enables live mode. Unset, empty, `true`, and other values resolve to disabled.

Default/unset behavior:

- no Google loader in the document;
- no `adsbygoogle` push;
- no `data-ad-client` or `data-ad-slot` in rendered pages;
- no advertising network request; and
- approved visible placeholders remain in the reserved geometry.

Enabled build behavior:

- eligible templates install the one shared loader;
- eligible placements render their mapped units and initialize once;
- excluded viewport placements do not render an `<ins>` and do not push; and
- ad-free templates remain completely free of loader, unit, push, and advertising request behavior.

No Netlify environment value was added or changed. The checked-in/default state remains disabled.

## 7. Responsive suppression

The approved outer geometry and CSS breakpoints are unchanged. The actual live units add a second, request-level gate:

- `top-banner`: `matchMedia("(min-width: 768px)")`
- `sidebar-left`: `matchMedia("(min-width: 1600px)")`
- `sidebar-right`: `matchMedia("(min-width: 1600px)")`
- other placements: immediately eligible on approved routes

Top/rail units start in an ineligible server/hydration state. After hydration, an `<ins>` is mounted and pushed only if the media query matches. When excluded, there is no live unit and no push—not merely a hidden initialized unit.

The `<ins>` uses inline `display`, width, and height declarations tied to the already approved fixed-size parent. It deliberately omits `data-ad-format="auto"` and `data-full-width-responsive="true"`, consistent with Google's modified responsive-code guidance. The implementation was checked against Google's official [responsive code modification guidance](https://support.google.com/adsense/answer/9183363) and [ad-code modification policy](https://support.google.com/adsense/answer/1354736).

## 8. Viewport request suppression evidence

The enabled browser suite intercepts the exact Google loader URL and returns a harmless local JavaScript response, so the application lifecycle is exercised without fetching creative resources.

For each route and viewport, the suite checks live `<ins>` elements, placement identities, `data-ilws-ad-requested`, and `window.adsbygoogle` queue length. Queue length must exactly equal the expected mounted-unit count, proving no duplicate or excluded-unit initialization.

- At 390px, `top-banner`, `sidebar-left`, and `sidebar-right` have no `<ins>` and no push.
- At 768px and 1280px, `top-banner` has one `<ins>` and one push; sidebars have neither.
- At 1600px and 1920px, top and both sidebars are eligible and initialize once.
- The only advertising-domain request observed on eligible pages was the single intercepted loader request.
- No advertising-domain request occurred on any tested ad-free route.

This verifies the application's request eligibility. Actual Google creative/fill behavior remains a production concern because the test intentionally does not execute Google's third-party loader.

## 9. Route eligibility policy

The reviewed `adTemplatePolicy` was not broadened.

Eligible for all six placements:

- home
- generator
- curated puzzle
- major hub
- category
- collection
- guide

Topics remains eligible for top, left rail, right rail, below-header, and above-footer only. It still omits the SEO square.

Ad-free:

- draft/noindex content
- search
- raw print
- PDF
- answer key
- play
- embed
- custom utility states
- privacy, terms, copyright, accessibility, contact, editorial/trust pages
- not-found/error and unknown/fallback routes

Because the loader is inside `MonetizedPageShell`, not the root layout, ad-free routes do not receive it even in an enabled build.

## 10. Fill, unfilled, and placeholder behavior

> Correction note (2026-10-08): The per-unit fallback behavior documented in this original review section was found to be release-blocking and has been superseded by the page-wide coordinator documented in section 19. The text below is retained as review history, not as a description of the final implementation.

Disabled mode retains the approved labelled placeholder exactly.

Enabled mode retains the fixed outer dimensions in every status:

- pending: reserved geometry with the live unit present and no fallback overlay;
- filled: creative remains visible and fallback remains hidden;
- `unfilled` or `unfill-optimized`: the empty unit remains in the reserved box and the labelled `Advertisements` fallback is shown;
- excluded viewport: no live unit is mounted and the already approved outer region is hidden for top/rails.

A per-unit `MutationObserver` watches Google's documented `data-ad-status` attribute. The fallback is never visible during pending or filled states, avoiding a labelled placeholder stacked over a creative. The outer dimensions never collapse, protecting CLS. Browser automation explicitly changes a unit from unfilled to filled and verifies fallback-visible then fallback-hidden behavior.

Live wrappers restore pointer interaction; disabled placeholders remain non-interactive.

Google documents filled/unfilled states and the `data-ad-status` attribute in its official [unfilled ad-unit guidance](https://support.google.com/adsense/answer/10762946).

## 11. Privacy and CMP findings

The repository has no existing consent-management implementation. This task did not invent one.

The Privacy Policy received the minimum factual update necessary to describe:

- default-disabled placeholders;
- the review-gated AdSense capability;
- the route classes that stay ad-free;
- Google's potential cookie/data processing when enabled; and
- the need for a Google-certified CMP before personalized ads are enabled where required.

Google states that publishers serving personalized ads in the EEA, UK, and Switzerland must use a Google-certified CMP integrated with the IAB TCF. Relevant official sources are Google's [publisher CMP requirements](https://support.google.com/adsense/answer/13554116) and [Google CMP overview](https://support.google.com/adsense/answer/16918505).

Therefore, Suhas must select/configure a Google-certified CMP (Google Privacy & messaging or a suitable certified third party) and review regional privacy behavior before setting the activation flag in production. This repository integration does not claim legal compliance by itself.

## 12. Validation commands and results

| Command | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS: 18 files, 117 tests |
| `npm run build` (flag unset) | PASS: 336 static pages |
| `npm run build` with `NEXT_PUBLIC_ADSENSE_ENABLED=on` | PASS: 336 static pages |
| `npm run audit:static` | PASS: 225 sitemap pages, 35 permanent redirects, 6 browser-decoded utility shells |
| `npm run test:a11y` | PASS: 17 archetypes, mobile/desktop, 200% zoom |
| `npm run test:e2e` | PASS: 61 routes x 9 viewports plus focused disabled-mode monetization checks |
| `npm run test:preview` | PASS: preview/PDF/keyboard and 8 responsive viewports |
| `npm run test:ads` (flag unset/default) | PASS: 9 eligible routes x 5 viewports and 14 ad-free routes |
| `EXPECT_ADSENSE_ENABLED=on npm run test:ads` against enabled build | PASS: same matrix with loader intercepted |
| `npm run audit:lighthouse` | PASS: 8 mobile routes and 3 desktop spot checks |

The build continues to emit the repository's informational warning that the Next.js ESLint plugin is not detected; standalone lint and build both pass. Lighthouse completed successfully but Windows briefly reported `EPERM` while removing its temporary audit profile after Chrome exited; this did not affect audit results or repository files.

## 13. Browser routes and widths

Both disabled and enabled focused tests covered:

- widths: 390, 768, 1280, 1600, 1920
- `/`
- `/word-search-generator`
- `/free-printable-word-searches`
- `/collections/hard-printable-word-searches`
- `/word-searches/animals/dog-word-search`
- `/categories/animals-word-searches`
- `/collections/easy-printable-word-searches`
- `/guides/how-to-print-a-word-search`
- `/topics`

Ad-free checks at 390 and 1600 covered:

- privacy, terms, copyright, accessibility, contact, editorial policy
- search
- print, PDF, answer key, play, embed, custom
- unknown/not-found fallback

The focused suite also checked runtime/page errors, loader placement in `head`, exact unit mapping, content-width stability, no horizontal overflow, header/footer ordering, control/grid exclusion, and print hiding. The existing e2e suite additionally passed its 61-route/9-viewport matrix and solver interactions.

## 14. Lighthouse and CLS

The final default-disabled production export passed all Lighthouse guardrails:

- Accessibility, Best Practices, and SEO: 100 on every audited route
- CLS: 0 on every audited route
- desktop Performance: 100 for Home, Generator, and Topics
- mobile Performance: 88–98 across the audited routes

Enabled-mode geometry uses the same fixed outer dimensions. The enabled five-viewport browser matrix found no horizontal overflow or content-width change. Actual third-party creative performance and fill behavior were not measured because external Google code was deliberately intercepted during tests.

## 15. Print, PDF, play, and utility behavior

Raw print, PDF, play, answer-key, embed, and custom routes remain outside the monetized shell. Enabled browser tests confirmed these routes have no loader, unit, push, or advertising-domain request. Print media continues to compute every `.ad-slot` as `display: none`.

No puzzle-generation, seed, solution, print composition, PDF generation, share state, QR, canonical, or sitemap logic changed. Existing unit, preview, static-export, accessibility, and browser-smoke suites passed.

## 16. Remaining production risks

- A Google-certified CMP/regional privacy configuration is still required before production activation where applicable.
- The site must be ready/approved in AdSense and each supplied unit must be active.
- Actual Google fill, creative sizing, policy enforcement, and third-party performance cannot be deterministically validated with the loader intercepted.
- Production Content Security Policy or hosting controls, if later added, must permit the official Google resources required by AdSense and the chosen CMP.
- After activation, real browser network checks must reconfirm that top and rail units do not request below their breakpoints.
- Ad blockers and browser privacy controls may prevent loader execution; the fixed geometry remains safe, but production monitoring should distinguish blocking from unfilled inventory.

## 17. Steps required before enabling the flag

1. Select and configure a Google-certified CMP appropriate to the site's traffic and regions, or configure Google's Privacy & messaging solution.
2. Review the final consent message, regional settings, and Privacy Policy with the site owner's legal/privacy requirements.
3. Confirm `www.ilovewordsearch.com` is ready in AdSense and the six named units/IDs are active.
4. Review this branch and report; merge only after approval through the owner's normal process.
5. Set `NEXT_PUBLIC_ADSENSE_ENABLED=on` in the intended deploy environment and rebuild/redeploy. Do not set a different truthy value.
6. On the deploy preview or production candidate, repeat network checks at 390, 768, 1280, 1600, and 1920px, including excluded top/rail viewports.
7. Confirm consent behavior, real fill/unfilled rendering, CLS, clickability, print suppression, and absence of loader/unit requests on ad-free routes.
8. Monitor AdSense policy/regulatory status and performance after the controlled rollout.

## 18. Final verdict

READY FOR FINAL EXTERNAL CMP / PRODUCTION CHECK

## 19. ChatGPT-review correction: page-wide fallback coordination

### Review findings corrected

The implementation at review HEAD `bbabd52150737569cd90ce6f51164cc1aa38e8b9` made fallback visibility independently for each unit. That allowed one unfilled position to show an `Advertisements` fallback while another position on the same page contained a filled creative. Its shared loader also had no `error` lifecycle, so a blocked or failed loader could leave every unit pending indefinitely. Both behaviors were release-blocking and are corrected in this follow-up without changing the accepted slot mapping, responsive geometry, route policy, content placement, or activation gate.

### Final shared state model

`AdSensePageCoordinator` is one small client provider around the already established monetized shell. Page templates remain server components/static output. Eligible live units register and unregister with the coordinator as their media-query eligibility changes, then report `pending`, `filled`, or normalized empty status. Both Google's `unfilled` and `unfill-optimized` values normalize to the coordinator's unfilled state; observation remains restricted to the documented `data-ad-status` attribute and does not use `data-adsbygoogle-status`.

The coordinator derives exactly three page modes:

- `PENDING`: at least one currently requested unit is unresolved, with no prior fill and no definitive loader error. No fallback is visible.
- `EMPTY`: every currently requested unit is unfilled, or the loader has definitively emitted `error`, and no unit has ever filled. Every currently eligible position shows its fallback.
- `FILLED`: any requested unit has reported filled. Every fallback is hidden page-wide.

`hasEverFilled` is a sticky latch. Once any unit fills, subsequent unfilled reports, loader errors, unit removal, new unit registration, or viewport changes cannot return the page to `EMPTY`. Unfilled positions intentionally remain blank on a filled page, which prevents creative/fallback overlap anywhere on that page.

### Loader failure behavior

The one shared loader now listens to its actual `load` and `error` events and records the result on the script element for safe reuse. An `error` before any fill reports a page-wide loader failure and exposes all currently eligible fallbacks. An error after a fill leaves the sticky `FILLED` mode unchanged. A synchronous `adsbygoogle.push` failure follows the same safe failure path. No arbitrary timeout was added.

### Responsive registration behavior

Viewport-suppressed units never register and therefore do not participate in the all-unfilled calculation:

- 390px normal page: below-header, SEO square, and above-footer participate (three units).
- 1280px normal page: top plus those three positions participate (four units).
- 1600px normal page: all six positions participate.
- Topics at 1600px: five positions participate because the SEO square remains excluded by policy.

Registration uses a layout effect so a newly mounted responsive unit becomes pending before paint. When the viewport crosses 768px or 1600px, the newly eligible unit joins as pending; when it becomes ineligible it unregisters. Neither operation clears a prior filled latch.

### Deterministic browser scenarios A-J

The enabled browser test now mutates real unit DOM attributes so the production `MutationObserver` path is exercised. All scenarios passed:

| Scenario | Result |
| --- | --- |
| A. All requested units pending | PASS: zero visible fallbacks |
| B. All requested units unfilled / unfill-optimized | PASS: every eligible fallback visible |
| C. One filled, all others unfilled | PASS: zero fallbacks page-wide |
| D. Some unfilled, others pending | PASS: zero fallbacks |
| E. All unfilled, then one late fill | PASS: all fallbacks appear, then all disappear |
| F. One filled, later changed to unfilled | PASS: zero fallbacks; `FILLED` remains latched |
| G. Loader error before any fill | PASS: every eligible fallback visible |
| H. Loader error after fill | PASS: zero fallbacks; `FILLED` remains latched |
| I. Responsive registration and resize | PASS: top/rails excluded below breakpoints, new units join correctly, filled latch survives growth and shrink |
| J. Topics | PASS: exactly five participating units, no SEO square, five fallbacks when all are empty |

### Correction validation

| Command | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS: 18 files, 117 tests |
| `npm run build` (flag unset) | PASS: 336 static pages |
| `npm run build` with `NEXT_PUBLIC_ADSENSE_ENABLED=on` | PASS: 336 static pages |
| `npm run audit:static` | PASS: 225 sitemap pages, 35 permanent redirects, 6 browser-decoded utility shells |
| `npm run test:a11y` | PASS: 17 archetypes at mobile/desktop plus 200% zoom |
| `npm run test:e2e` | PASS: 61 routes x 9 viewports plus default-disabled monetization checks |
| `npm run test:preview` | PASS: preview/PDF/keyboard and 8 responsive viewports |
| `npm run test:ads` (flag unset/default) | PASS: 9 eligible routes x 5 viewports and 14 ad-free routes |
| Enabled `npm run test:ads` | PASS: same route/viewport matrix plus deterministic page-wide scenarios A-J |
| `npm run audit:lighthouse` | PASS: 8 mobile routes and 3 desktop spot checks; all CLS 0 and Accessibility/Best Practices/SEO 100 |
| `git diff --check` | PASS |

The same informational Next.js ESLint-plugin warning and non-failing Windows Lighthouse temporary-profile cleanup warning described earlier were observed. Neither changed repository output or validation results.

### Scope and remaining gate

This correction changes only the shared AdSense client coordinator, its shell wiring, monetization tests, and this retained-history report. The publisher ID, six slot IDs, 768px/1600px request breakpoints, fixed dimensions, route eligibility, print suppression, content width, placement order, one-loader policy, duplicate-push guard, and `NEXT_PUBLIC_ADSENSE_ENABLED=on` activation contract remain unchanged.

`main` remains at `bbfb87da830cc4b980ea924c8c43ba0d36cab790` and was not modified. Production activation remains blocked on Suhas confirming the account-side Google-certified CMP / Privacy & messaging configuration and completing the final production checks. The repository does not claim to prove that external account configuration.


## 20. Production follow-up: iLoveTimers parity and default activation

After the first production deployment, Suhas verified that the placeholder layout was present but found two production mismatches:

1. the top-under-navigation banner was hidden on mobile, unlike the established iLoveTimers implementation; and
2. real AdSense remained disabled because production still required an unset `NEXT_PUBLIC_ADSENSE_ENABLED=on` environment variable.

The follow-up keeps the approved six-slot mapping, page-wide `PENDING / EMPTY / FILLED` coordinator, sticky filled latch, route exclusions, side-rail breakpoint, print suppression, and fallback behavior unchanged.

### Top banner parity

The top banner now follows the iLoveTimers responsive contract and participates at every eligible viewport:

- below 500px: 320x50
- 500px through 799px: 468x60
- 800px and wider: 728x90

The top region is present below the navigation on mobile rather than being suppressed. Sidebars remain request-suppressed below 1600px because that breakpoint was chosen for Word Search's existing center-column geometry.

### Production activation contract

AdSense now follows the same production-default principle as iLoveTimers:

- production with no activation variable: live AdSense enabled
- `NEXT_PUBLIC_ADSENSE_ENABLED=on`: explicitly enabled
- `NEXT_PUBLIC_ADSENSE_ENABLED=off`: emergency disable
- non-production with no variable: disabled

This removes the deployment mismatch where reviewed live code shipped but Netlify served only placeholders because no environment variable existed.

Disabled-mode validation should now use an explicit `NEXT_PUBLIC_ADSENSE_ENABLED=off` build and `EXPECT_ADSENSE_ENABLED=off` browser expectation. Production/default browser validation expects live mode.

### Fallback invariant retained

No fallback semantics changed:

- pending real units show no placeholders;
- if every requested unit resolves empty, every eligible fallback appears;
- if any unit fills, all fallbacks disappear page-wide and remain suppressed for that page lifecycle;
- loader failure before any fill exposes fallbacks;
- loader failure after a fill cannot undo the sticky filled state.

The mobile top unit now participates in the page-wide requested-unit count. At 390px a normal page has four requested units: top, below-header, SEO square, and above-footer. Only the two side rails remain excluded below their 1600px breakpoint.

### Privacy and production review

The privacy page was updated so its factual description matches production-default AdSense and the emergency-disable/fallback behavior. The existing account-side Google-certified CMP requirement remains an external configuration responsibility; no homemade consent system was introduced.

