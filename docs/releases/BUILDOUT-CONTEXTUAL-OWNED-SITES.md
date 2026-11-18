# Contextual activity tools and verified creator profiles

Owner issues 7 and 17, F1 cross-site suggestions/profile links. This is UI work
on the integration-03 base. It does not rewrite published puzzle/editorial text,
metadata, canonicals, seeds or advertising behavior.

## Implemented scope

Seven explicit teacher/print/activity contexts receive three server-rendered
optional activity links: teacher hub, worksheet hub, homeschool hub, printable
hub, kids hub, published classroom collection and the pack builder. Ordinary
topic pages, hard hub, search, legal pages and generated play/print outputs do
not receive a network directory. Links follow the page FAQ when present and
stay in normal document flow below the main task.

- [iLoveTimers classroom timer](https://www.ilovetimers.com/classroom-timer/)
  provides a visible activity countdown.
- [MorseWords printable worksheets](https://www.morsewords.com/morse-code-printable-worksheets)
  provide a different, editable code activity with optional answers.
- [I Love Coloring Page](https://www.ilovecoloringpage.com/)
  provides another printable paper activity.

The task for each link is visible, and the shared-creator relationship is
disclosed. The links are ordinary HTTPS anchors, without tracking parameters,
forced new tabs, embeds, scripts, remote icons, prefetch or hydration. No claim
of educational outcomes is made. iLoveSVG was not forced into contexts where
its image-conversion job would be less useful; no global four-site footer farm
was introduced.

The footer gains a compact creator-profile strip using only the portfolio and
LinkedIn URLs already listed in the existing author `sameAs` data. It describes
Suhas's professional profiles rather than inventing word-search social accounts
or promising update feeds. Existing legal links and biography stay unchanged.

## Link identity verification

Verified November 6, 2026 against sibling repository sources and live pages:

- `ilovetimers/app/routes/author.suhas-sunder.tsx` and its
  [live author page](https://www.ilovetimers.com/author/suhas-sunder/)
  identify the same [portfolio](https://www.suhassunder.com/) and
  [LinkedIn profile](https://www.linkedin.com/in/s-sunder/) as this site's About
  page. The portfolio responds with its JavaScript application shell. LinkedIn
  refuses automated retrieval with status 999; continued profile availability
  is not certified by a scraped response.
- `morsewords/app/client/components/navigation/SocialLinks.tsx` and the live
  MorseWords About page corroborate the creator profile links. Unrelated
  WordSkull, EmojiKitchen and artwork social accounts were intentionally not
  copied or relabeled as iLoveWordSearch accounts.
- The live timer/worksheet/coloring destinations were opened and their actual
  task descriptions checked. The worksheet URL was followed from MorseWords'
  navigation; a guessed `/worksheets` route was not used.

## Accessibility, theme, print and advertising

The activity block is a labeled section with a semantic three-item list. Cards
have descriptive visible text, decorative Lucide icons and existing visible
focus styling. The profile strip is a labeled navigation region with 44 px
minimum link height. Theme colors use the existing semantic tokens; no new
theme script or client component is added.

The activity module has explicit print exclusion; the profile strip is inside
the already-excluded footer. Neither uses absolute/fixed positioning, overlays,
floating controls or z-index. No ad selector, lifecycle, fill-detection,
placeholder rule or placement was modified. Browser checks cover actual layout
intersection with existing reserved ad rectangles; they do not certify genuine
AdSense fill or policy compliance.

## Verification and integration

Light checks: lint, TypeScript and all 394 tests pass, including four focused
SSR/scope/profile tests. The first test invocation used a `.test.tsx` suffix
excluded by this repository's existing Vitest configuration; it was not counted
as passing. The test now follows the established `.test.ts` convention and
uses React `createElement`; no test discovery rule was weakened.

Final combined validation used `codex/context-tools-validation` application
commit `6be2dfd91f7e1f58fd3279398e783bf48d544672`, including this package,
the separate pack-discovery package and hub FAQs. Lint, TypeScript, all 394
tests, the production build (335 pages) and static-host audit (217 sitemap
entries, 35 redirects, six shell routes) passed. Final runner refinements and
this evidence do not change the built application tree.

On the fresh static export at port 3446, `owned-site-links.mjs` passed seven
raw SSR responses and 72 layout/theme/context combinations (six widths,
light/dark, teacher/collection/pack), keyboard focus for cards and both profile
links, scoped serious/critical axe checks, print exclusion, ad geometry,
no-JavaScript usability and no outbound requests to the added destinations.
`pack-discovery.mjs` passed separately. `npm run test:ads` passed nine eligible
routes at five viewports and 14 ad-free routes. No ad thresholds were changed.

An initial browser run found a real introduced profile-caption contrast failure
(2.88 in the light theme on the always-dark footer); the caption now inherits
the existing readable footer text and a fresh build plus browser rerun passed.
An accidentally occupied preview port was rejected and its results discarded.
The pack runner initially needed an explicit Playwright browser context for
axe; that harness setup was corrected without removing its checks.

Light/dark mobile (390) and desktop (1280) activity/profile screenshots were
visually inspected, including card wrapping and keyboard rings. Artifacts are
outside the repository at `C:/Users/Suhas/.codex/tmp/ws-owned-sites-visual/`.

The separate hub-FAQ package inserts its FAQ after `SearchTools`. During
integration preserve the order `SearchTools`, FAQ, activity suggestions. The
focused browser test checks this document order whenever a page FAQ exists.
No new FAQ prose or review date is introduced here.

Physical devices/screen readers and genuine network ad rendering remain manual
acceptance gates. Owner production approval, main merge and deploy remain
unauthorized; no new indexable content is activated.
