# Native search fallback

Base: C2 `d9947d7434d17e5f08dadbdbe907b95bdde3fd46`. This package adds native GET semantics to the shared search form and a dedicated JavaScript-disabled notice on `/search`. It does not implement server-side matching results. Without JavaScript, the query remains in the address bar, the static input stays blank, and existing Topics, Categories and Guides links provide useful browsing.

## Confirmed defect and retained navigation

The C2 lower-hub review observed four true JavaScript-disabled submissions (two hubs at 390/1280): entering `animals` reloaded the same hub without a query because the form had no action or named input. The existing next-step panel was independently retained: its Search puzzles link and generator link are readable, keyboard reachable and useful without JavaScript. No indexed hub panel or editorial copy is removed.

`PuzzleSearch.tsx` now supplies `action="/search"`, `method="get"` and `name="q"`. The existing hydrated submit handler, query bounding, suggestion selection and client navigation remain in place. `app/search/page.tsx` adds only the task-specific noscript notice. Its original intro is retained here; the integration owner has a separately reviewed shortening to preserve when combining changes.

## Validation

- Node 22.23.4: full 677 tests in 84 files passed with one worker; targeted SEO/search checks (39 tests in seven files), type checking and scoped ESLint passed.
- Warning-free production build generated 335 routes; static audit passed 217 sitemap paths, 35 redirects and six utility shells.
- `tests/e2e/native-search-fallback.mjs`: nine real JavaScript-disabled cases passed. Eight cover inline/header forms on printable/teacher hubs at 390/1280, retained query URL, canonical/noindex, truthful blank input, notice, overflow and keyboard browsing. One covers replacing an existing query with Unicode, spaces and ampersand, with exactly one `q` parameter.
- Two hydrated cases passed: inline submission retained the same-document marker and rendered matching results; header ArrowDown/Enter activated the selected suggestion using the existing client router. No page errors.
- Existing bounded-query browser regression passed six cases, including oversized paste, Unicode boundaries, recovery and both collection filters.
- Independently viewed the final no-JavaScript result screenshots at 390 and 1280. Notice and browse links were readable and contained. This is a two-image review, not a claim to have manually reviewed every browser state.

Reproduction, after building and serving the static export:

```powershell
$env:BASE_URL='http://127.0.0.1:3520'
$env:NATIVE_SEARCH_OUTPUT='<outside-repository evidence directory>'
node tests/e2e/native-search-fallback.mjs
```

Evidence root: `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/native-search-fallback/`. `browser-final/result.json` records nine native and two hydrated cases; `bounded-queries/browser.json` records the existing query regression. Baseline observations remain under `product-excellence/final-d9947d7/seo-dual-baseline/rendered/hub-lower-review/manifest.json`.

## Preserved attempts and limits

The initial fixture used a descendant locator on an anchor rather than selecting the anchor itself and timed out after the query/metadata checks. Its screenshot is retained in `browser/`; the corrected fixture passed in `browser-final/`. An initial bounded-query invocation omitted required `SEARCH_QUERY_OUTPUT` and failed before opening a browser; it was rerun with the required evidence path. An initial build wrapper referenced a nonexistent local npm CLI; direct supported Node 22 search-index/build/static-audit commands then passed. These harness invocations are excluded from passing evidence.

The hydrated correctness cases use the existing bounded ad-loader mock. They do not establish genuine ad fill, provider acceptance, whole-product approval or the result of a later combined candidate. No-JavaScript native GET preserves the query URL; it cannot render matching results from a static export. A fresh combined build and candidate-level audit remain the integration owner's responsibility.
