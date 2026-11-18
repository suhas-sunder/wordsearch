# Final readiness performance evidence

## Final comparison on the replacement runtime

The ordinary mobile Lighthouse gate remains **FAIL** for runtime `676faafc06fc3f63deaf561375122a4b1feccdd6`. Median LCP exceeds 2,500 ms on home, hard collection and generator. Home and hard collection both score 69 against the editorial performance minimum of 90. Egypt passes the median LCP threshold at 2,330 ms, with two of five samples above the threshold and sample p75 of 6,356 ms. Candidate LCP failed in 11 of 20 samples. Editorial performance failed in six of ten. [Exact immutable candidate preview](https://6af9219f10ca250d880fc55a--ilovewordsearch.netlify.app)

The replacement runtime and live production `471a118dd459f2181cd641ed0572ba6dd7005540` each contributed five valid samples for each route. All 40 planned navigations completed with no invalid attempts, retries or Lighthouse run warnings. All 40 isolated Chrome profiles closed gracefully and were cleaned up. The runner retained the earlier plan, interleaving, mobile viewport, Chrome 157.0.8103.52, Lighthouse 13.4.1, Node 22.23.4, Chrome flags and simulated `mobileSlow4G` settings. It used ordinary provider traffic. Concurrent browser/build validation finished before collection. Host-wide CPU busy time still ranged from 6.6% to 67.0%. The Lighthouse host benchmark index ranged from 1654 to 3661.

Performance, LCP and TBT cells show median / sample p75 / min–max. LCP and TBT are rounded to milliseconds. Each row contains five samples.

| Route | Origin | Performance | LCP ms | TBT ms | BP | SEO |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `/` | Candidate | 69 / 98 / 68–98 | 6368 / 6435 / 2305–6504 | 30 / 40 / 18–51 | 77 | 66 |
| `/` | Production | 64 / 89 / 61–94 | 7292 / 7404 / 2755–8297 | 56 / 121 / 46–152 | 58 | 100 |
| `/collections/hard-printable-word-searches` | Candidate | 69 / 98 / 67–98 | 6374 / 6460 / 2334–6966 | 23 / 31 / 20–45 | 77 | 66 |
| `/collections/hard-printable-word-searches` | Production | 95 / 95 / 58–95 | 2676 / 2747 / 2670–10335 | 71 / 74 / 21–84 | 58 | 100 |
| `/word-searches/history/ancient-egypt-word-search` | Candidate | 96 / 96 / 66–96 | 2330 / 6356 / 2306–6436 | 168 / 181 / 112–207 | 77 | 69 |
| `/word-searches/history/ancient-egypt-word-search` | Production | 60 / 60 / 47–94 | 7969 / 9152 / 2716–10302 | 102 / 148 / 49–425 | 58 | 100 |
| `/word-search-generator` | Candidate | 67 / 98 / 41–98 | 6364 / 6644 / 2310–7126 | 104 / 106 / 54–1044 | 77 | 69 |
| `/word-search-generator` | Production | 90 / 90 / 58–94 | 3193 / 7774 / 2681–8939 | 81 / 117 / 61–124 | 58 | 100 |

Accessibility scored 100 on all 40 samples. Maximum CLS was 0.0135133 on the candidate and 0.0066496 on production. Raw preview SEO scored 66 or 69. All 20 candidate main-document responses had the Netlify preview `X-Robots-Tag: noindex` header, which the `is-crawlable` audit records. The affected crawlability finding is specific to the preview and the reported scores remain unadjusted.

**Best Practices disposition: GO WITH DOCUMENTED EXCEPTION for the two observed candidate provider audit IDs.** The raw candidate score is 77 in 20 of 20 samples and remains below 95. Every candidate failure is `third-party-cookies` or `inspector-issues`, both traced exclusively to `googleads.g.doubleclick.net/pagead/ads`. This technical exception applies only to those two audit IDs on the exact tested candidate. Production scored 58 in 20 of 20 samples. Its additional `deprecations` audit cites Cloudflare `/cdn-cgi/challenge-platform/scripts/precursor/main.js` on all 20 and Google `lidar.js` on two. The exception excludes those production findings, the absolute speed failures, live ad or consent acceptance and production approval.

Candidate simulated LCP medians were lower on home and Egypt and higher on hard collection and generator. Observed median LCP was 1281 / 1331 ms on home, 1314 / 269 ms on collection, 280 / 1325 ms on Egypt and 1315 / 366 ms on generator, in candidate / production order. Production used Cloudflare YYZ and a mix of HTTP/2 and HTTP/3, while the candidate used Netlify HTTP/2. Production had Funding Choices requests in all 20 samples and the candidate had none. Google ads request counts were 9–50 on production and 8–12 on the candidate. This design measures each origin with its own normal provider and hosting configuration. It cannot isolate a causal application LCP change. No application timing correction has been validated. The supplemental traces below remain evidence from the earlier runtime.

The local `C:/Users/Suhas/.codex/visualizations/2026/11/13/01a1d313-5cce-7880-aff3-d45fd55e6b71/readiness-20261114/performance-final` directory contains the complete forty-report set, raw run diagnostics, `comparison.md`, `summary.json`, exact plan and execution log. Collection exit 0 means all required samples were collected. The gate outcome is **FAIL**.

## Decision on the earlier candidate

The ordinary mobile Lighthouse gate **fails** on immutable candidate `008ab2ac2484aa6003a37b2ce8708133aeb3ed3d`. Candidate median LCP exceeds 2,500 ms on all four routes, and median performance falls below 90 on both editorial routes. Best Practices is 77 throughout. Raw preview SEO is 66 or 69, with the failed `is-crawlable` audit identifying the HTTP `X-Robots-Tag: noindex` directive on every preview sample. Accessibility is 100 on every sample and all CLS measurements meet the 0.1 limit. These are independent results. A Best Practices exception for the observed provider audit IDs would leave the LCP and editorial performance gates open.

The candidate had lower median **simulated LCP** on all four routes than live production in this experiment. The different origins, CDN paths and provider payloads limit the relative comparison. Observed LCP moved in both directions across routes. The data establish neither a general speedup nor a candidate source regression causing the absolute LCP failure.

- [Immutable candidate deployment](https://6af7ddc20d5bcdd410cc4075--ilovewordsearch.netlify.app) · `008ab2ac2484aa6003a37b2ce8708133aeb3ed3d`
- [Production baseline](https://www.ilovewordsearch.com) · `471a118dd459f2181cd641ed0572ba6dd7005540`

## Ordinary provider-enabled comparison

Forty successful browser navigations completed on November 14, 2026 (America/New_York). Five valid samples per origin per route. There were zero runtime errors, invalid samples, retries or Lighthouse run warnings. All 40 owned browsers closed gracefully and their isolated profiles were cleaned up. One serial run used a new browser profile for each sample. Route order rotated over five rounds, and the two origins alternated lead order within adjacent route pairs. Browser caching and storage started cold for each navigation. OS DNS and provider edge caches followed their ordinary behavior.

The runner used Node 22.23.4, Lighthouse 13.4.1 and installed Chrome 157.0.8103.52 on Windows. Its mobile viewport, emulated user agent and simulated `mobileSlow4G` settings match `tests/e2e/lighthouse-audit.mjs`. The browser arguments were `--headless=new`, `--no-sandbox` and `--disable-gpu` on both origins. Network providers operated normally. The runner performed no request blocking, consent or geolocation actions. Host-wide CPU busy time measured 27.9–74.0% across the runs and Lighthouse's host benchmark index ranged from 1554 to 3312. Other host activity continued. The browser configuration and concurrent load are limits of the experiment.

The unchanged gate requires LCP ≤2,500 ms, CLS ≤0.1, editorial performance ≥90, Best Practices ≥95, accessibility 100 and SEO 100. Each table cell for LCP shows median / sample p75 / observed range of the simulated metric. With five valid samples per cell, the sample p75 is the fourth ordered value. These are lab measurements.

| Route | Candidate LCP ms | Production LCP ms | Candidate / production median performance | Candidate / production median TBT ms |
| --- | ---: | ---: | ---: | ---: |
| `/` | 6708 / 6872 / 2106–7467 | 10618 / 11036 / 3002–11501 | 65 / 57 | 157 / 292 |
| `/collections/hard-printable-word-searches` | 6979 / 7031 / 6520–7212 | 9152 / 9883 / 3285–10639 | 64 / 58 | 68 / 88 |
| `/word-searches/history/ancient-egypt-word-search` | 6643 / 6703 / 6411–7087 | 9575 / 10363 / 3298–10759 | 61 / 56 | 324 / 219 |
| `/word-search-generator` | 6521 / 7014 / 1715–7384 | 8141 / 8731 / 2695–10968 | 61 / 59 | 326 / 159 |

Candidate LCP failed in 18 of 20 samples and editorial performance failed in nine of ten. Production LCP failed in 20 of 20 samples and editorial performance failed in ten of ten. Candidate max CLS was 0.0135133. The observed LCP element was the H1 on home, collection and generator. The candidate Egypt route used the hero vocabulary paragraph, whereas production used its H1.

## Best Practices attribution and scope of a possible exception

| Origin | Audit evidence |
| --- | --- |
| Candidate · 77 in 20/20 | `third-party-cookies` and `inspector-issues` in 20/20. Both cite the Google-owned `googleads.g.doubleclick.net/pagead/ads` response. No weighted failing Best Practices audit identified a first-party script URL. |
| Production · 58 in 20/20 | The same two IDs in 20/20, with Google ad and Casale media request evidence. `deprecations` failed in 20/20. Cloudflare's same-origin `/cdn-cgi/challenge-platform/scripts/precursor/main.js` was cited in all 20. Google `pagead2.googlesyndication.com/pagead/js/lidar.js` unload deprecation was additionally cited in two. |

The exact-commit diff was empty for `components/layout/AdSense.tsx`, `components/layout/AdSlot.tsx` and `lib/monetization/adsense.ts`. This establishes the source of the observed Best Practices failures and bounds a potential candidate-specific external-provider exception to the two named audit IDs, exact candidate deployment and observations. Independent approval would still be required. The provider diagnosis does not certify actual consent operation, live ad placement or ad policy.

## Timing attribution

- **Hosting and delivery.** Production served all 20 documents through Cloudflare from the YYZ edge with `CF-Cache-Status: DYNAMIC`, zstd encoding and a mix of HTTP/3 (12) and HTTP/2 (8). The candidate served all 20 directly from Netlify over HTTP/2 with Brotli and the preview noindex header. Route-level median document response-header times were 187–205 ms on production and 128–243 ms on candidate. Origin timing alone cannot explain the seconds of within-route LCP variation.
- **Provider traffic.** Production loaded four Cloudflare `/cdn-cgi/` requests per sample and recorded requests to `fundingchoicesmessages.google.com` in 20/20. Neither was recorded on the candidate. Median Google ads requests ranged from 27 to 33 per production route and 9 to 11 per candidate route. Median observed Google ads transfer ranged from 563 to 581 kB on production and 261 to 264 kB on candidate. These totals include requests after paint. They help explain why the two origins differ and do not isolate the effect of the ads or CMP on LCP.
- **Application work.** Median application-origin transfer rose about 7 kB on home, 23 kB on Egypt and 25 kB on generator, and fell about 5 kB on collection. The H1 routes had median observed LCP of 2,297 / 2,387 ms (home), 2,309 / 1,357 ms (collection) and 1,446 / 1,379 ms (generator), candidate / production. Egypt's observed medians were 1,305 / 2,321 ms. Candidate generator and Egypt have a higher modeled TBT median. An independently identified React DOM bundle accounts for part of the generator scripting, while its hashed bundle is also loaded by the home and collection routes. That evidence cannot localize the extra blocking to a specific builder component or establish an application bottleneck causing LCP. Candidate changes include theme initialization, shared navigation/styles, the deferred builder and puzzle controls. Existing font stacks use optional loading, and the ad loader appends its script asynchronously. No source/trace finding establishes a safe app change that addresses the measured LCP failures.

## Supplemental raw traces

Four additional navigations on the exact candidate homepage preserved compressed DevTools logs and raw Chrome traces. They used the same normal provider traffic and browser settings, with a bounded stopping condition for collecting both fast and slow observed presentation. All four are retained outside the acceptance sample.

| Capture | Initial renderer Paint | Observed FCP and LCP | Simulated LCP | Main layer dropped frames before FCP |
| --- | ---: | ---: | ---: | ---: |
| 01 | 439 ms | 1350 ms | 6891 ms | 0 |
| 02 | 945 ms | 966 ms | 1896 ms | 0 |
| 03 | 285 ms | 1266 ms | 6497 ms | 0 |
| 04 | 1265 ms | 2292 ms | 7032 ms | 60 |

Trace 04 finished document transfer at 136 ms, its two early CSS transfers by 202 ms and three early font transfers by 238 ms. DOMContentLoaded was 221 ms and load was 404 ms. The main renderer Paint started at 1265 ms and its compositor produced a `DrawFrame` at 1277 ms. The main layer tree then reported 60 consecutive `DroppedFrame` entries from 1278 to 2261 ms without a partial update. The next `DrawFrame` was 2280 ms, and FCP and the H1 LCP were 2292 ms. The longest renderer main-thread task starting between initial Paint and FCP took 7.1 ms. A later small stylesheet request ran from 1339 to 1386 ms.

Trace 02 finished the early CSS and fonts later, by 846 ms. Its initial renderer Paint to FCP interval was 21 ms, with zero main-layer drops. In traces 01 and 03 there was about 1 second between initial Paint and FCP without a comparable dropped-frame sequence. Chrome's renderer and compositor timing therefore contributes to these observations. The captured traces do not explain why the compositor skipped those frames or what role Chrome launch configuration, host contention or providers played. They do not support changing a graphics flag, asset, hydration path or the ad implementation as a release fix.

## Evidence location and remaining gate

The local evidence directory is `C:/Users/Suhas/.codex/visualizations/2026/11/13/01a1d313-5cce-7880-aff3-d45fd55e6b71/readiness-20261114/performance`. It contains the runner and environment, execution plan, log and exit code, 40 complete Lighthouse reports, per-run diagnostics, structured all-sample statistics and the rendered comparison. Report details include observed LCP selectors and breakdown, request metrics and host headers, source audit URLs, browser ownership and cleanup, and per-run host load. The separate `candidate-home-traces` directory contains all four trace capture reports, raw trace and DevTools files, exact timeline extraction and trace notes. The collection ran from the exact candidate worktree with `node <evidence>/readiness-performance.mjs`. The Node executable path is recorded in the plan. The collection command exited 0 for completeness. The recorded Lighthouse gate result remains **FAIL**.

Any follow-up to isolate application timing should compare the same-origin or equivalent host/browser conditions while preserving ordinary provider-enabled acceptance results. Candidate versus production timings, an isolated fast report or an attribution of Best Practices to an external provider do not satisfy the absolute LCP or editorial performance thresholds.
