# AdSense Placeholder Layout Review

Date completed: 2026-10-08

## 1. Starting repository state

- Branch: `main`
- HEAD: `bbfb87da830cc4b980ea924c8c43ba0d36cab790`
- The worktree was already dirty before this milestone. The following 13 entries were present and were treated as user-owned work:
  - `content/collections.ts`
  - `content/discovery.ts`
  - `content/topics.ts`
  - `tests/content/curated-publication.test.ts`
  - `tests/e2e/accessibility.mjs`
  - `tests/e2e/browser-smoke.mjs`
  - `tests/e2e/route-audit-manifest.json`
  - `tests/e2e/static-export-audit.mjs`
  - `tests/seo/routes.test.ts`
  - `tests/seo/seo-architecture.test.ts`
  - `tests/unit/launch-readiness.test.ts`
  - `content/curated-topics-growth.ts` (untracked)
  - `tests/content/growth-publication.test.ts` (untracked)
- This work preserved those changes. The AdSense work intentionally overlaps only `tests/unit/launch-readiness.test.ts`, where the existing current-worktree sitemap assertion was retained and the old placeholder assertions were updated.
- No commit, push, pull request, remote-branch change, staging operation, or dependency installation was performed.

## 2. iLoveTimers reference inspected

The sibling `ilovetimers` checkout was inspected before implementation. Files actually reviewed were:

- `AGENTS.md`
- `app/clients/config/monetization.ts`
- `app/clients/components/ads/AdSense.tsx`
- `app/clients/components/ui/README.md`
- `app/app.css`
- `scripts/tests/adsense-integration.mjs`
- `scripts/audits/adsense-site-quality-audit.mjs`

The translated concepts are the six named roles, centralized template eligibility, reserved responsive dimensions, wide-only side rails, content-aware in-page placement, and explicit ad-free route classes. The React Router/Vite loader, environment handling, live unit IDs, `adsbygoogle`, and Google script behavior were deliberately not copied into this Next.js application.

## 3. Final Word Search placement architecture

`components/layout/AdSlot.tsx` is the central contract. `AD_PLACEMENTS` contains exactly:

1. `top-banner`
2. `sidebar-left`
3. `sidebar-right`
4. `below-header-banner`
5. `seo-section-square`
6. `above-footer-banner`

`MonetizedPageShell` renders the structural placements without client-side JavaScript:

- `top-banner` is the first page-shell element. Because `app/layout.tsx` renders route children after `SiteHeader`, it is immediately below and semantically outside the site header.
- The left and right sidebars are separate grid columns outside `.ad-page-content`.
- Route templates render `BelowHeaderAd` after their hero/title/introduction area. Builder-backed pages place it after the complete builder surface so it is not adjacent to puzzle controls.
- `SeoSectionAd` is inserted among substantive supporting/editorial sections and never in a builder, puzzle grid, preview toolbar, or utility control group.
- `above-footer-banner` is the shell's final element. The root layout renders `SiteFooter` afterward, so the placement is before and outside the footer.

Every placeholder is non-interactive, contains no link or control, has pointer events disabled, and shows only the visible label `Advertisements`. The complementary landmarks have placement-specific accessible names so repeated placeholders remain distinguishable to assistive technology.

The shell and policy are server components. No layout or page was converted to a client component.

## 4. Route and template eligibility policy

The explicit `adTemplatePolicy` is the single source of truth:

| Template | Eligibility | Placements |
| --- | --- | --- |
| `home` | placeholders | all six |
| `generator` | placeholders | all six |
| `curated-puzzle` | placeholders | all six |
| `major-hub` | placeholders | all six |
| `category` | placeholders | all six |
| `collection` | placeholders | all six |
| `guide` | placeholders | all six |
| `topics` | placeholders | all except `seo-section-square` |
| `draft` | ad-free | none |
| `utility` | ad-free | none |
| `trust` | ad-free | none |
| `error` | ad-free | none |

The topics directory intentionally omits the square because its body is a dense link directory rather than a safe, substantive midpoint for an in-content placement.

Draft/noindex puzzle states use the `draft` policy. Raw print, PDF, answer-key, play, embed, and custom state routes remain outside the monetized shell. Search, privacy, terms, copyright, accessibility, contact, editorial/trust pages, and not-found/error output also remain outside it. `getAdTemplatePolicy(undefined)` returns the `error` policy, so unknown or missing template values default to ad-free.

## 5. Responsive behavior

- Top banner:
  - hidden below 768px
  - 468x60 from 768px
  - 728x90 from 1024px
- Below-header and above-footer banners:
  - 320x50 on small screens, constrained to their padded container
  - 468x60 from 500px
  - 728x90 from 768px
  - 970x90 from 1200px
- SEO square: 300x250, constrained to its padded container
- Sidebars:
  - hidden below 1600px
  - 160x600 from 1600px
  - 300x600 from 1900px
- At wide breakpoints the center grid track is 1212px. The existing `.site-shell` inset then remains 1180px, so activating sidebars does not shrink the core puzzle/tool content.
- No placement is sticky, fixed, floating, or overlaid.
- All ad regions and placeholders are removed by print media rules.

Browser automation verified 390, 768, 1280, 1600, and 1920px viewports. It also verified a 1280-to-640 resize used by the repository's 200% zoom accessibility check. A transient overflow discovered during that check was fixed by constraining banners to their containing region instead of viewport units.

## 6. Files changed by this milestone

Implementation and integration (13 files):

- `components/layout/AdSlot.tsx`
- `app/globals.css`
- `components/page/IndexablePage.tsx`
- `components/page/PageSections.tsx`
- `components/page/RouteHub.tsx`
- `app/page.tsx`
- `app/categories/page.tsx`
- `app/categories/[slug]/page.tsx`
- `app/collections/[slug]/page.tsx`
- `app/guides/page.tsx`
- `app/guides/[slug]/page.tsx`
- `app/topics/page.tsx`
- `package.json`

Tests (3 files):

- `tests/unit/launch-readiness.test.ts`
- `tests/unit/monetization-placeholders.test.ts` (new)
- `tests/e2e/monetization-placeholders.mjs` (new)

Report (1 file):

- `docs/audits/adsense-placeholder-layout-review.md` (this file)

Total changed by this milestone: 17 files. This count excludes the unrelated pre-existing worktree changes listed in section 1.

## 7. Tests added or changed

`tests/unit/monetization-placeholders.test.ts` adds eight durable contract tests covering:

- exact placement vocabulary
- eligible and topics-specific policies
- ad-free and unknown defaults
- below-header and SEO placement separation from builder/preview controls
- above-footer ordering relative to the root footer boundary
- responsive and print CSS rules
- absence of live advertising strings and attributes
- representative high-risk route source files remaining unmonetized

`tests/e2e/monetization-placeholders.mjs` adds production-export browser checks for:

- placeholder counts and exact visible label
- non-interactive markup
- mobile top-banner hiding
- wide-only left and right sidebars
- header/footer ordering
- below-header semantic ordering
- absence from puzzle controls and toolbars
- print hiding
- horizontal overflow
- stable generator content width when sidebars appear
- zero placeholders on 14 ad-free routes
- zero requests to known Google advertising domains

`tests/unit/launch-readiness.test.ts` now asserts the new vocabulary, plural label, explicit placeholder marker, ad-free policies, and current responsive CSS contract. `package.json` adds `test:ads` and includes the focused monetization browser test in `test:e2e`.

## 8. Validation commands and results

All commands were run from the repository root against the current uncommitted worktree.

| Command | Result |
| --- | --- |
| `npm run typecheck` | PASS; TypeScript emitted no errors |
| `npm run lint` | PASS; ESLint emitted no errors |
| `npm test` | PASS; 18 files, 114 tests |
| `npm run build` | PASS; 336 static pages generated/exported |
| `npm run audit:static` | PASS; 225 sitemap pages, 35 permanent redirects, 6 browser-decoded utility shells |
| `npm run test:a11y` | PASS; 17 archetypes at mobile and desktop, no serious/critical axe violations, runtime errors, undersized controls, overflow, skip-link, reduced-motion, or 200% zoom failures |
| `npm run test:e2e` | PASS; existing browser smoke covered 61 routes x 9 viewports plus search/navigation/utility/print/solver checks; the focused monetization suite passed afterward |
| `npm run test:preview` | PASS; answer replacement, output composition, Share/keyboard access, 1/2-page PDFs, object URL cleanup, and 8 responsive viewports |
| `npm run test:ads` | PASS; 9 eligible routes x 5 viewports plus 14 ad-free routes at mobile and large desktop |
| `npm run audit:lighthouse` | PASS; 8 mobile routes and 3 desktop checks |

The production build reports the repository's existing informational warning that the Next.js ESLint plugin is not detected in the ESLint configuration. It did not fail lint, type checking, or the build.

Lighthouse results had 100 Accessibility, Best Practices, and SEO for every audited route. CLS was 0 for every route. Desktop Performance was 100 on Home, Generator, and Topics; mobile Performance ranged from 87 (the existing hard-puzzle workload) to 99.

The final post-refinement checks reran `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:a11y`, and `npm run test:ads` successfully.

## 9. Browser routes and widths checked

Focused monetization checks used every width below for every listed eligible route:

- Widths: 390x844, 768x900, 1280x960, 1600x1000, 1920x1080
- `/`
- `/word-search-generator`
- `/free-printable-word-searches`
- `/collections/hard-printable-word-searches`
- `/word-searches/animals/dog-word-search`
- `/categories/animals-word-searches`
- `/collections/easy-printable-word-searches`
- `/guides/how-to-print-a-word-search`
- `/topics`

The following ad-free routes were checked at 390x844 and 1600x1000 and rendered zero placeholders:

- `/privacy`
- `/terms`
- `/copyright`
- `/accessibility`
- `/contact`
- `/editorial-policy`
- `/search?q=animals`
- `/print`
- `/pdf`
- `/answer-key`
- `/play`
- `/embed`
- `/custom`
- `/definitely-not-a-real-page`

The existing browser-smoke suite additionally passed 61 routes at 9 configured viewports. The accessibility suite checked 17 archetypes at 390px and 1440px, plus the 640px zoom-equivalent resize.

## 10. Screenshots and observations

No screenshot files were saved to the repository, avoiding temporary audit output. Automated browser measurements confirmed:

- top banner hidden at 390px and visible from 768px
- both sidebars hidden through 1280px and visible at 1600/1920px
- generator content width unchanged at 1280, 1600, and 1920px
- no document overflow at any focused viewport
- every above-footer banner ends before the footer begins
- no placeholder is nested in the footer, preview toolbar, builder controls, or puzzle grid
- every print placeholder computes to `display: none`
- no placeholder contains a link, button, input, select, or textarea

## 11. Placeholder-only confirmation

Confirmed by source tests, repository searches, and browser request observation:

- no live Google ad script exists
- no `adsbygoogle` exists in application source
- no `googlesyndication`, `pagead`, Google ad-services, or DoubleClick script/request was added
- no `data-ad-slot`, `data-ad-client`, copied iLoveTimers unit ID, or new publisher ID was added
- no external advertising request occurred during the browser matrix
- only reserved, visibly labelled placeholders are present
- the existing `public/ads.txt` declaration was not changed

## 12. Print, PDF, and answer-key behavior

`/print`, `/pdf`, and `/answer-key` remain outside the monetized shell and render zero placeholders. Raw play, embed, and custom utility states are also ad-free. Print media hides the placeholder element and all structural ad regions. No PDF generation code, printable composition, answer-key logic, puzzle seed, placement, share state, or QR behavior was changed. Existing PDF/unit, preview, static-export, and browser-smoke coverage passed.

## 13. SEO, canonical, sitemap, and content impact

This milestone changed no titles, H1 copy, descriptions, canonicals, URLs, redirect rules, sitemap generation, structured data, internal-link destinations, or SEO content. The current worktree already contained separate content/SEO changes before this task; those were preserved. Against that current state, all SEO tests, the content audit, static export audit, production build, and Lighthouse SEO checks passed. `/collections/hard-printable-word-searches` was explicitly included in focused browser validation.

## 14. Regressions found and fixed

- The pre-existing `AdSlot` scaffold did not match the requested vocabulary, was environment-gated, lacked a real side-rail shell, used the singular label, and scattered structural placement across page bodies. It was replaced with the typed policy and shared shell described above.
- The first responsive banner implementation used a viewport-unit maximum. The accessibility audit's immediate desktop-to-zoom resize exposed a temporary Chromium calculation that retained the old viewport width and caused overflow. Container-relative maximums fixed the issue; the audit then passed.
- Repeated generic landmark names initially produced non-material axe notices. Placement-specific accessible names removed the notices while leaving the only visible label as `Advertisements`.

No puzzle, print, PDF, SEO, route, canonical, sitemap, or navigation regression was found after the final implementation.

## 15. Remaining risks and later live-ad work

- Real AdSense scripts, unit IDs, fill/unfilled behavior, consent handling, CSP changes, and production request behavior remain deliberately unimplemented and must be separately reviewed when actual codes are supplied.
- Real creative rendering can have behavior that static placeholders cannot simulate. The later integration must preserve these exact reserved dimensions and route policies rather than replacing the shell.
- The site currently has unrelated uncommitted content/SEO growth work in the same worktree. A future milestone commit should review the combined diff carefully and keep workstream ownership clear.
- Lighthouse uses one run per configured route, so performance numbers are guardrails rather than statistically stable benchmarks.

## 16. Final verdict

READY FOR CHATGPT REVIEW
