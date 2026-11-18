# Coalesce identical pending print-fit checks

Baseline application R: `ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4`. This package starts from R independently of the specialty-copy package. It changes only print measurement scheduling; it does not change published definitions, generation, PDF renderers, geometry, fonts, QR readiness, offline sanitization, ad behavior or the fit assertions.

## Confirmed user cost

The root's three ordinary-provider 4× CPU profiles in external `product-excellence/performance-profile-R/` identify actual print-fit iframe write/layout work as a major local cost; this is an attribution profile, not a Lighthouse release pass. A separate fresh browser instrumentation run against immutable R recorded four actual measurement-frame writes. Requests 0/1 were byte-identical HTML/CSS (138,890 characters, SHA-256 `12147f01e89a08e31bd543ed146b906fb861b9b524165ee0c8be8ce08e103e60`); requests 2/3 were another byte-identical pair after QR readiness changed (158,803 characters, `cb39dccb3412b645a1332e00c443311c7be9623819efc27d71b5d25dacb9d85b`). Those later HTML bytes differ, so the new queue must not combine them with the earlier pair.

The visible student preview and hidden print portal request the same worksheet concurrently. Their actual measurements were serialized, duplicating expensive layout. This is a concrete two-pair opportunity, not a proposal to skip print validation. Full captured HTML stays outside Git at `product-excellence/fit-coalescing/baseline-raw.json`; timings and hashes are in `baseline-counts.json`. The initial instrumentation script failed before launching Chrome because a Windows absolute ESM import lacked a file URL; the corrected probe completed normally. No result from the failed launch counts as browser evidence.

## Implementation boundary

`lib/print/browser-fit.ts` keeps `measureHtml` and all actual checks unchanged. A small queue factory retains serialization but shares a pending job only when full HTML (including CSS), every captured output-option entry and offline mode match. It uses the complete serialized key, not a potentially colliding short hash. It performs no HTML normalization and does not ignore fit markers to force a match. Online/offline checks remain distinct. Successful and failed entries leave the map immediately on settlement; every later request measures again. Options are captured when queued rather than read from a caller-mutated object later.

Each consumer has its own promise and abort listener. One cancellation rejects only that caller with the exact supplied reason. The remaining callers keep their real check. The final cancellation removes the shared entry immediately and aborts the underlying queued/running job; a later equal request starts fresh. An abandoned queued job never opens an iframe. Both completion and cancellation remove consumer listeners; the existing frame finally block remains responsible for actual DOM cleanup. Failure is propagated unchanged and never converted into a fit pass.

## Verification

Nine focused unit tests cover exact sharing, fresh post-success remeasurement, HTML/CSS/options/offline separation, shared error identity and retry, independent cancellation, final-consumer active abort and fresh restart, abandoned queued work, pre-aborted callers, listener cleanup and captured-option/serial behavior. Existing fit/HTML/native print/cancellation assertions remain unchanged. Browser evidence must additionally demonstrate fewer actual iframe writes and unchanged measured inputs, valid/error behavior and no leftover frames; a mocked queue test is not proof of faster real rendering.

The new `tests/e2e/print-fit-coalescing.ts` runs three paired ordinary-provider 4× CPU samples against explicit baseline/candidate origins. It captures actual frame writes/removal, full measured HTML and CDP profiles outside Git, compares hydrated grid tokens and actual measured worksheet markup, and requires fewer expensive candidate writes. Within each build the full HTML/CSS keys remain exact. It checks actual glyphs inside cells with the original quarter-pixel rounding and content inside the worksheet with the original two-pixel rounding. It does not assert a Lighthouse score or treat network timing as field performance. Standard correctness fixtures separately test native printing, offline files and cancellation.

Executed results follow. Frozen B/R historical acceptance is not relabeled as validation for this new runtime change. Manual physical-device/printer, provider and editorial/production approvals remain separate.


## Actual measured benefit and font-control boundary

Node v22.23.4: full single-worker **560 tests / 80 files**, lint and TypeScript passed; production **335 pages** and static **217 sitemap / 35 redirects / 6 utility shells** passed. The first prebuild typecheck caught two inference errors in the new profiling fixture, corrected with explicit sample/tuple types before Next started; its failed log is retained. No application source changed after this build. The scheduling wrapper is the only runtime diff. The exact LF-normalized source prefix through `measureHtml` is byte-identical to R, SHA-256 `3f433961f56e2a4709ef453d41331a221782c2ea3340091bc29affaaadbd439d`; `measure-body-identity.json` retains the proof. PDF, puzzle/generation, offline sanitizer, PrintFitGuard, PrintablePuzzle, global CSS and font configuration also have zero source diff.

After all other builds/Chrome jobs closed, three alternating before/after pairs used retained R application export locally on 3513 and candidate export on 3512, both at 390×844 and CDP 4× CPU slowdown, with ordinary external provider loading and **no network/ad mocks**. Every baseline had four writes; every candidate had two. All final guards were ready, worksheet markup and hydrated grid were unchanged, actual glyph/content bounds passed and every frame was removed. These samples are attribution/observations, not release performance or advertising approval.

| Ordinary pair | Baseline writes / frame wall ms | Candidate writes / frame wall ms |
| --- | ---: | ---: |
| 1 | 4 / 542.4 | 2 / 397.8 |
| 2 | 4 / 791.8 | 2 / 407.4 |
| 3 | 4 / 802.2 | 2 / 364.4 |

Median summed measurement-frame wall time fell from **791.8 to 397.8 ms (about 49.8%)**. Frame time includes waiting/layout and is not JavaScript self time, total page-ready time, TBT or a Lighthouse score. The deterministic reduction is two fewer expensive actual checks for exact duplicate pending inputs. Later checks, distinct answers/options, CSS and QR-state changes still receive fresh measurements.

### Preserved failed comparisons and causal control

The original new fixture attempted cross-build equality of the entire HTML/CSS string. It failed because the remote R build and new local build loaded different unrelated CSS-module sets/order. `initial-cross-build-css-failure/` and its log retain the exact captures. No runtime key normalization was added. The corrected comparison separates exact **within-build** input equality from cross-build actual worksheet rendering.

The subsequent strict geometry comparison exposed actual fallback/webfont metric differences, including local-versus-local samples. `app/layout.tsx` already uses `display: "optional"`; the measurement iframe inherits those font-face rules. A glyph could use narrower fallback metrics even when `fonts.check` returned true and the relevant face was loaded by cleanup. This is observable on the old and new application; it is not proof of a new clipping regression. HTTP font responses in both local builds were 200 and three successfully captured unique font bytes matched:

| Asset | SHA-256 |
| --- | --- |
| Atkinson `b04fe76c44ae53c6.p.woff2` | `1e4cea71d75ec427581d6259fc07148a2e60d60d16cabf4b4f5360487b3f9dc3` |
| Inter `e4af272ccee01ff0-s.p.woff2` | `c940764593d0fe5d596be327ca7558855e018039fb78509aa21921fd3644c3e4` |
| Serif `597b6a5d799c44de-s.p.woff2` | `8e38e3fbd74dea20aabe0831ffef04c9f30bf6fc5b99b7a2649be0dd8c6d859c` |

Cached duplicate response-body retrievals sometimes returned a CDP “No data found” error; these are explicitly retained, not falsely hashed. The successful responses verify the unique asset bytes; font-face/parent timing, checks and used glyph geometry are captured separately in frame/result JSON. `initial-remote-local-font-geometry-failure/`, `paired-local/` and `font-variation-diagnosis.json` (SHA-256 `fc140ed51161f6f3232e1f2178f559d2ae1ed5bfe9cdf5f79fec4805ccd13b28`) retain the strict failures. They are not relabeled as successful exact geometry tests.

The final ordinary three pairs therefore report actual font variation: cross-build exact geometry comparisons were **false/false/false**, while actual unchanged fit/glyph/content checks passed. No arbitrary geometry tolerance was introduced. The completed ordinary observations do not claim identical used fonts.

For causal isolation only, `FIT_FONT_CONTROL=block` changes `font-display: optional` to `block` **inside the isolated measurement frame** in the test interception, on both applications. It changes no parent UI, source CSS, asset, font family/weight/size or runtime code. All three controlled pairs retained byte-identical measured worksheet markup and **strictly identical glyph geometry, font/computed properties and bounds**. Writes remained 4→2. Their frame-wall pairs were 544.9→360.0, 574.8→371.6 and 745.4→357.9 ms. This is an explicit diagnostic control, not ordinary release validation or authority to change font policy.

Reproduction uses explicit `FIT_BASELINE_URL`, `BASE_URL` and outside-repository `FIT_OUTPUT` with direct Node22 plus tsx running `tests/e2e/print-fit-coalescing.ts`; run ordinary with `FIT_FONT_CONTROL` unset, then a separate diagnostic directory with `FIT_FONT_CONTROL=block`. Both summaries set `notReleasePass: true`. Final combined visual/regression acceptance remains separate. Physical print and browser/font variability remain manual gates; a future font-policy change needs its own proven user defect and reviewed validation.

## Unchanged correctness regressions and completion

All four existing browser fixtures passed **without edits to their assertions** on this built candidate:

- `browser-print-layout.mjs`: 24 actual matrix PDFs with selected paper, pagination, grid/answer parity and bounded glyphs, plus existing normal/native and offline control checks.
- `browser-print-overflow.mjs`: actual crowded-bank refusal, native-print diagnostic, no dropped screen content, recovery, maximum header and offline file refusal/recovery.
- `offline-html.mjs`: real downloads and reopened script-free files, exact grids/answer paths, XSS/no-network, accessibility and Letter/A4 printed pages. This run used its own external TEMP directory so earlier workers' evidence was not overwritten.
- `output-cancellation.ts`: six delayed HTML cases, two static-PDF unmount cases and PNG stale-rejection recovery; current lowercase clue HTML, useful current errors, no late file/status update or leaked frame.

Final scoped queue tests (9), full lint and TypeScript passed again after profiling-fixture changes. No runtime source changed after the successful 335-page build. The new profiling fixture measures only the hard-puzzle scenario; it does not certify every browser, word bank, font or route. Instrumentation can perturb scheduling, and frame-wall timing is descriptive; the exact duplicate-pass reduction is the robust observed mechanism. No production Lighthouse score or physical printing improvement is claimed. Existing ordinary Lighthouse77, internal ad-eligibility findings and external/manual release gates are unaffected.

Evidence root is `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/fit-coalescing/`: `ordinary-3pairs/`, `controlled-block-3pairs/`, failed controls, full/build/static logs, `native-layout/measurements.json` plus PDFs, `overflow/`, `offline-temp/ilws-offline-html/`, and `cancellation/`. Complete captures stay outside Git. Both own idle static hosts, 3512/session84118 and 3513/session31728, were stopped normally with Ctrl+C after completion; no browser/build/test job remains.
