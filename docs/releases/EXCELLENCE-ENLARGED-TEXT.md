# Enlarged text reflow and reachable navigation

Base: `5cc542d390f25889ed014e3c59af600e5b1e0f7a` on the independent excellence integration branch. The final built runtime patch and four source-file hashes are retained in external `product-excellence/enlarged-text-fix/source-freeze.json`. This package preserves published copy, metadata, word lists, puzzle definitions, generation and advertising behavior. No new indexable route is introduced.

## Confirmed defects and attribution

The root's exact-R baseline at `ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4` failed **40 of 48** actual text-resize cases. The method sets the root text size to 200% and verifies computed 32px rather than assuming device-pixel-ratio emulation is text resizing. It is not native browser zoom, physical-device testing or SVG glyph magnification. Main buttons were not internally clipped in those 48 samples; the principal failures were header controls outside the viewport, footer grid min-content expansion and decorative letters overflowing their illustration.

Four additional read-only live production samples help distinguish pre-existing failures from R pressure. The source SHA `471a118dd459f2181cd641ed0572ba6dd7005540` is the expected production checkpoint supplied by the operator, not an automatic source attestation from browser layout. Actual responses, computed font sizes, screenshots and exit 1 remain in `live-production-main-four/` and its log/exit record. No production action or deployment occurred.

| 200% light case | Live production overflow | R overflow | Final source overflow |
| --- | --- | --- | --- |
| Home, 390px | Yes | Yes | No |
| Hard printable collection, 390px | No | Yes | No |
| Home, 1024px | Yes | Yes | No |
| Hard printable collection, 1024px | Yes | Yes | No |

Thus these failures are not all attributed to R. The extra R navigation actions increased pressure in a previously fitting sensitive-page case. The final fix preserves the actions and makes them reflow.

An initial header/footer/decorative correction passed 46/48 common cases but retained guide step overflow. A separate 320px diagnostic exposed further intrinsic grid minima and long words in six of twelve routes; the ASL page's long heading also overflowed. The failed builds' actual reports/screenshots and temporary CSS diagnosis remain external. Prototype CSS injection was **diagnosis only**, never counted as final acceptance. The final accepted tests use built application CSS and only the deliberate user-text-size stress override.

## Changes and preservation

| Surface | Correction | Preservation boundary |
| --- | --- | --- |
| Header | Search, theme and menu reservation stay together in a nonwrapping action group; the overall row may wrap. The actual menu remains native details with its panel in document flow. Its summary is positioned relative to the end of the row, so enlarged branding cannot push controls offscreen or put the menu over another control. | Same destinations, control order, menu/search behavior, theme state and brand text. Default row height remains 64px desktop / 58px mobile (plus the existing border). The real desktop summary measures 44px, so 10px row padding preserves the 64px default. |
| Menu reservation | An inert, `aria-hidden`, noninteractive intrinsic-size mirror of the existing More icon/label reserves the exact current font-dependent box. It shares the actual trigger's styles; only this layout spacer is invisible. | This is an explicit shared-chrome semantic-diff allowance: raw header text gains one hidden “More” in an inert spacer, not visitor/editorial content or SEO text. The actual summary stays visible and reachable; no page text or control is clipped to force a fit. No new link or focus target is added. |
| Menu accessible name | “Open navigation menu” becomes **“More: open navigation menu”** so the accessible name includes the visible desktop label. | Mobile icon still has meaningful menu context. Four existing browser fixtures update only this finite selector; their assertions remain intact. |
| Footer | Zero-minimum grid tracks, wrapping children/wordmark and wrapping creator/copyright rows prevent min-content columns from widening the page. | All copy and links remain. Normal desktop five-column proportions and the existing small-screen single column are preserved. |
| Decorative mini-sheets | Bound the two existing aria-hidden illustrations to their containers; seven zero-minimum columns and ordinary glyph line-height prevent decorative letters from widening the page. | Only decorative art is clipped. No real puzzle grid, meaningful text, main content, body or root overflow is hidden. |
| Heroes, sections, guides and trust pages | Confirmed long headings can wrap; collapsed hero/builder grids use zero-minimum tracks. Guide steps and trust sections can shrink and wrap instead of creating wider implicit columns. | Exact H1/H2 text, body prose, metadata and font sizes are unchanged. No headings are removed or rewritten. |
| Builder | Controls/fieldsets shrink within their actual column; difficulty buttons wrap as whole readable controls when text grows, with the same presets and pressed state. Four direction columns use zero-minimum tracks. | Normal controls retain their order and defaults. No setting, stored puzzle or word list changes. No font cap or shortened “Medium” label. |
| Screen preview title | Only `@media screen` under `.builder-preview .print-header > div` permits the real title and brand line to wrap. | The print portal and isolated measurement clone lack that ancestor, and real print media/PDF are excluded. SVG tokens, puzzle scale, PDF renderer and print layout rules are untouched. |

The header/footer are shared across the existing 217 sitemap URLs and nonindexable tools. This is a technical reflow/accessible-label change, not permission for material indexed-copy edits. Parent combined semantic comparison must explicitly allow the inert More mirror and the accessible-name correction; it must not ignore arbitrary header/body text differences. No substantive published copy change is hidden in this package.

## Executed validation

Supported Node v22.23.4: **588 tests / 82 files**, full lint, TypeScript, production **335 pages**, and static **217 sitemap / 35 redirects / 6 utility shells** pass on the final source. Previous successful builds before the accessible-name and intrinsic-grid batch remain separately labeled, not substituted for final validation. Source changed only before the final cached build; later fixture repair below does not change runtime.

- **84/84 actual enlarged-text cases:** 14 routes × 320/390/1024px × light/dark. The original 48-case fixture/report is preserved; adding 320px and ASL/invalid utility extends coverage rather than relabeling an old pass. Every final case computed 32px, had no horizontal overflow, no clipped main controls and no page error.
- **24/24 default/enlarged header/footer views:** 320/390/768/1024/1280/1600px × light/dark × 16/32px. Actual header controls remain onscreen without overlap, footer content stays within the viewport, visible More occurs in its accessible name, keyboard menu/escape focus and theme control work.
- **2 true no-JavaScript cases:** native menu keyboard interaction, computed 32px, no overflow and an honestly disabled theme control at 390/1024px.
- **72/72 default visual cases:** home, generator, sensitive hard collection, category, guide and About at all six widths and both themes; zero failures/notices. This is a focused default matrix, not the final combined full matrix.
- Existing header navigation regression passes menu/search/keyboard/focus/outside/no-JavaScript behavior, crawlable destinations, header axe and ad-region separation.
- Full existing accessibility audit passes 14 archetypes at mobile/desktop with no serious/critical axe findings, undersized surrounding controls, runtime errors or document overflow; skip-link/reduced-motion and its separately scoped zoom checks pass.
- Existing enabled-advertising regression passes 9 eligible routes at 5 viewports plus 14 ad-free routes, preserving mocked lifecycle/placeholder and geometry assertions. This is not genuine-network creative or policy approval.

### Retained no-JavaScript fixture interruption

The first custom header run completed its 24 JavaScript-enabled views/screenshots, then hung in `page.addStyleTag` on a no-JavaScript page. A separate staged diagnostic reproduced exactly “created / loaded” before that call. This helper waits for an in-page load callback that cannot complete in the disabled-script context. Those no-JavaScript cases were not passed. Both confirmed task-owned harness sessions were stopped with normal Ctrl+C; actual exits were 1 and every recorded Node/Chrome child PID was absent afterward. No unknown process or force-termination command was used.

The corrected fixture keeps application JavaScript disabled and uses a synchronous inspector DOM style property to simulate the user's enlarged text. It verifies computed 32px and all native capability assertions with bounded navigation/locator timeouts. It enables no application script, adds no assertion fallback and does not change runtime source. The fresh full 24+2 run passes; interrupted screenshots/process records remain separately retained.

## Evidence and remaining gates

External root: `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/enlarged-text-fix/`. Relevant sets: `final-text84/`, `final-header-theme-asserted/`, `default-visual72/`, source freeze, full/build/static logs, failed initial/320/prototype records, live production four-case attribution and navigation log. Root R historical evidence remains separately under `enlarged-text-before-R/`.

This package does not certify native browser zoom, a physical tablet/printer, assistive-technology behavior or genuine filled advertising. It changes no ad slot, loader, fill detection, placement CSS or global first-real-fill placeholder suppression. Ordinary Lighthouse/provider-cookie and internal draft-eligibility findings remain unwaived. Final integration receives fresh combined acceptance; historical B/R reports do not validate changed runtime by themselves.

Screenshot review also caught a test-only theme-attribution error: the first custom header fixture carried the preference from its keyboard toggle into the next font-size step, and captured after the next toggle. Its old screenshot filenames described the context preference rather than rendered color. Those artifacts remain separate. The corrected fixture asserts actual `data-theme`, captures before toggling and completes/restores the entire three-choice keyboard cycle. The fresh **24+2** result at `final-header-theme-asserted/` is the definitive header proof; the independent 84 and 72 matrices already tested both actual themes correctly. This correction changes no runtime code or existing assertions.

Two final enlarged-header screenshots (390px light and 1024px dark) were individually viewed to check the reflow and readable controls. That limited visual inspection is not a claim that all 72 screenshots received manual review. The final owned 3514 host/session7535 was stopped normally with Ctrl+C after QA; no browser/build/test job remains.
