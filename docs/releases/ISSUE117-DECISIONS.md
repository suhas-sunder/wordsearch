# Issue 117 · The thirteen indexed-copy decisions

Section 2 of [owner issue 117](https://github.com/suhas-sunder/wordsearch/issues/117#2-keep-the-original-13-candidate-copy-fields-subject-to-factual-truth-checks) authorizes retaining the task-oriented FAQ content and headings and applying factual corrections to the privacy and advertising disclosures. The original [hold record](QUALITY-INDEXED-HOLDS.md) and [historical hashes](QUALITY-INDEXED-HOLDS.json) preserve the earlier review state. This decision applies to the thirteen fields below and the exact observed content in [ISSUE117-DECISIONS.json](ISSUE117-DECISIONS.json).

| Decision | Indexed URL | Field | Disposition |
| --- | --- | --- | --- |
| H01 | `/free-printable-word-searches` | `body.faq` | Retain the print, answer-page and paper-settings answers. The preview and output controls support the described steps. |
| H02 | `/free-printable-word-searches` | `headings.faq` | Retain the **FAQ** heading with H01. |
| H03 | `/large-print-word-searches` | `body.faq` | Retain the grid-size and placement guidance and the recommendation to check a test copy. These statements reflect the separate puzzle and output settings. |
| H04 | `/large-print-word-searches` | `headings.faq` | Retain the **FAQ** heading with H03. |
| H05 | `/online-word-search` | `body.faq` | Retain keyboard and output guidance. Correct the tap-mode instructions to use **Accessibility and controls** and **Tap endpoints**, which match the solver. |
| H06 | `/online-word-search` | `headings.faq` | Retain the **FAQ** heading with H05. |
| H07 | `/word-search-pdf` | `body.faq` | Retain local PDF generation, matching answer-page instructions and the copyable share-link alternative when QR generation fails. |
| H08 | `/word-search-pdf` | `headings.faq` | Retain the **FAQ** heading with H07. |
| H09 | `/word-searches-for-teachers` | `body.faq` | Retain lesson vocabulary, name/date, answer-page and reproducible reprint guidance. |
| H10 | `/word-searches-for-teachers` | `headings.faq` | Retain the **FAQ** heading with H09. |
| H11 | `/privacy` | `body.editorial` | Retain the updated disclosure with factual corrections for automatic drafts, named and classroom saves, progress storage, local PDF/QR generation, encoded links, provider measurement and ad-free route families. The copy describes available consent controls conditionally. |
| H12 | `/privacy` | `headings.editorial` | Retain the dedicated **Named saved puzzles** and **Saved classroom presets** sections. They correspond to separate browser stores with different save and deletion behavior. |
| H13 | `/editorial-policy` | `body.editorial` | Retain the statement that eligible content pages may display advertising and the site's advertising separation policy. |

The [independent truth review](ISSUE117-TRUTH-REVIEW.md) traces the public claims to source and records the executed named-library, classroom-preset, and solver-progress browser suites. The [ad eligibility evidence](ISSUE117-AD-POLICY.md) records static rendering and the intercepted provider request boundaries. These resolve the thirteen indexed-copy decisions within the exact issue 117 scope. Legal review, actual consent configuration and operation, genuine ad fill, physical printing, real-device and assistive-technology acceptance, ordinary Lighthouse and release approval remain separate gates. No gate is certified or waived by this content decision.

## Ordinary Lighthouse comparison

Ran the existing `quality/bounded-lighthouse.mjs` artifact with Node 22.23.4 and one ordinary provider-enabled mobile sample of `/word-searches/history/ancient-egypt-word-search` per origin. The command was `node <artifact-root>/quality/bounded-lighthouse.mjs`, with `BASE_URL` set to the sampled origin and `QUALITY_LIGHTHOUSE_OUTPUT` set to its JSON path under `issue117/performance/`. Logs, summaries, full Lighthouse reports and exit codes are retained there. The runs used normal provider traffic and the existing thresholds. The preceding local quality baseline also retained Best Practices 77.

| Origin | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | Exit and failed guardrails |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| [Pinned a057692 preview](https://6af6976d250e46c6f9f23ee6--ilovewordsearch.netlify.app) | 83 | 100 | 77 | 69 | 2101 ms | 0 | 628 ms | 1. Best Practices below 95 and SEO below 100 due to expected provider preview noindex. |
| [Production](https://www.ilovewordsearch.com) | 59 | 100 | 58 | 100 | 8179 ms | 0.005 | 108 ms | 1. Best Practices below 95 and LCP above 2500 ms. |
| Final local production export on port 3543 | 95 | 100 | 77 | 100 | 2519 ms | 0 | 155 ms | 1. Best Practices below 95 and LCP 19 ms above the 2500 ms threshold. |

Both 77 samples failed Best Practices audits `third-party-cookies` and `inspector-issues` exclusively on Google DoubleClick cookie evidence. Production added `deprecations` from Cloudflare's injected `/cdn-cgi/challenge-platform/scripts/precursor/main.js` and recorded a provider-injected mobile anchor marked filled. Production's single observed ad is evidence for that sample only. The global application ad loader, slot policy and AdSense configuration had no differences against production source `471a118` or candidate baseline `a057692`, confirmed by `git diff --quiet <ref> -- components/layout/AdSense.tsx components/layout/AdSlot.tsx lib/monetization/adsense.ts`.

The measured Best Practices 77 remains a failing result whose identified causes are provider-side. It can be considered separately through independent release review. LCP remains a separate failing result. Single samples across different hosting origins and provider behavior do not establish an application timing regression or a provider-only cause for LCP. These runs provide no sitewide median, hosted candidate consent result, or genuine candidate ad-fill acceptance.
