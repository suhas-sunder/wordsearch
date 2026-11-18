# Bound search queries before ranking or collection filtering

A confirmed oversized-input defect made the actual 208-record search index spend about 2.4 seconds ranking a pasted 200,000-unit query. H10 collection finding also processed the entire unbounded input. The full results page already capped URL queries at 160, while popup inputs, ranking entrypoints and collection finding did not.

`lib/search/query.ts` now shares the existing 160 UTF-16-unit convention across ranking, popup initial state/input/submission, URL search and H10 input/filtering. Native `maxLength` and programmatic entrypoints both enforce it. A pair cut at the boundary is dropped as a whole; malformed programmatic UTF-16 is made safe for `encodeURIComponent`. Valid text within the bound keeps its existing value and matching/ranking rules. The cap is applied before repeated catalog scoring or collection normalization.

## Before/after evidence

Three sequential Node 22 samples on the same actual F search index (208 records) and current hard-collection source (16 items), using identical query bytes:

| Probe | Before median | After median |
| --- | ---: | ---: |
| Ranking, normal `animals` | 2.465 ms | 2.347 ms |
| Ranking, 200,000-unit query | 2426.417 ms | 4.377 ms |
| Collection finder, normal `animals` | 0.038 ms | 0.035 ms |
| Collection finder, 200,000-unit query | 22.862 ms | 0.077 ms |

The oversized probe is `a ` repeated 100,000 times; SHA-256 `32141747928eef5fa7711f00374445e36d42e182c735e2ed239255a4517855ae`. These timings are descriptive measurements on this machine, not a stable benchmark threshold. Matching normal results and limit/tie behavior are pinned separately against the prior implementation for nine real-catalog queries. Oversized helper calls are checked against their explicit bounded prefixes; no flaky timing assertion replaces correctness tests.

## Validation

- Node 22 lint/typecheck and full single-worker suite: **544 tests / 78 files pass**. Targeted search/query/H10 subset: ten tests pass, including whole/split astral characters and malformed surrogate safety.
- One isolated production build: 335 pages. Static export audit: 217 sitemap URLs, 35 redirects, 6 utility shells. The parent branch's later 44-feature acceptance ledger is deliberately not copied or reverted by this branch's historical base.
- New focused browser fixture: six cases across 390 px dark and 1280 px light. Native oversized paste, popup and full-page submission at both Unicode boundaries, direct URL query, normal search recovery and both collection reset paths pass with no page errors.
- Existing H10 fixture: twelve light/dark cases at 320/390/1280 px plus two no-JavaScript listings pass, including keyboard/filter/order/reset, SSR cards, axe and unchanged hydration-shift guard.
- Eight exact source/test SHA-256 values were frozen before the build and rechecked unchanged after both browser runs. Build ID `HwE308-A8N6rBvZrS6JAk`; generated search index SHA-256 `31b642096611416d41d8aafb0d031c27ccd967a0535c2af8bf4dbfc61334ddc6`.

External evidence is retained in the chat visualization directory's `bounded-search-queries/`: unchanged probe script and before/after JSON, source manifest and post-browser verification, focused browser report/screenshots and existing H10 regression manifest/screenshots. Browser testing used desktop Chromium emulation and a substituted advertising loader; it does not imply physical-device, genuine-provider, final Lighthouse/CLS benchmark or independent product approval.

The isolated 3282 host was stopped with Ctrl+C through its original session after browser completion. Baseline 3394 and frozen application 3495 stayed untouched. No metadata, puzzle generation/defaults, published content, dependencies or advertising lifecycle/geometry changed. No main merge/push or deployment.
