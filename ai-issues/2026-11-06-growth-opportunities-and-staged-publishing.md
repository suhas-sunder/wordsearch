# WordSearch growth opportunity map and staged publishing plan — 2026-11-06

> **GOVERNING BUILD/RELEASE CLARIFICATION (2026-11-06):** The complete development program is now specified in [MASTER-BUILDOUT-AND-CONTROLLED-RELEASES.md](./2026-11-06-MASTER-BUILDOUT-AND-CONTROLLED-RELEASES.md) and the specific [buildout catalog and release queue](./2026-11-06-buildout-catalog-and-release-queue.md). All authorized content, packs, tools and UI can be built in parallel **now**, with bounded review-branch commits/PRs after every milestone; we are NOT waiting each Friday to develop another item. The weekly publication schedule below describes only the deliberately limited *new indexable URL rollout*, not the development throughput or a hard page quota. Feature and cosmetic releases have their respective independent gates. The master plan supersedes any narrower pacing language in this earlier opportunity memo, while retaining its dated source evidence.

**Status:** research and planning only; implementation and publication require independent work packages and the established review gates.  
**Source of truth for owner requests:** ai-issues/README.md; retain existing audit backlog and protected ad rules.  
**Prepared from:** owner-exported Google Search Console (Web, last three months ending 2026-11-03), Bing Webmaster Tools daily export (2026-08-06 through 2026-11-03), live GitHub content inventory, Netlify read-only production observations, competitor examples, and official Google Search documentation. Raw owner exports are NOT checked into the repository. Numbers below are historical observations, not forecasts.

## Decision

**YES: expand deliberately, with Christmas first; do not bulk-publish.** The existing hard-printable collection is demonstrably the strongest acquisition page. Build a small portfolio of distinct, genuinely useful printable experiences around that format and progressively diversify into large print, classroom/teacher use, other seasonal demand, and format-specific utilities. Avoid cannibalizing the successful canonical hard-collection page.

The site's original 150 published curated puzzles, search/print/PDF/share/answers functionality and ads are production assets. Preserve all working SEO, seed/fingerprint, and advertising behavior. Content and function changes belong to the weekly track; harmless presentation-only improvements can use the existing reviewed fast-track.

## Evidence ledger (do not combine different data grains as equivalent)

| Observation | Evidence | Interpretation / limitation |
|---|---|---|
| Google Web, Aug 4–Nov 3: 2,970 clicks, 50,794 impressions | GSC Chart.csv, 92 daily records | Site-level totals; daily export ends Nov 3 and is not a complete live November |
| Google hard-printable collection: 2,402 clicks and 21,450 impressions, 11.2% CTR, average position 6.89 | GSC Pages.csv | 80.9% of site-level 2,970 clicks on one canonical URL. Page totals across report dimensions may differ by rounding/aggregation |
| Google last 28 days Oct 7–Nov 3 versus preceding Sep 9–Oct 6: 1,792 vs 1,022 clicks; 25,002 vs 15,376 impressions | GSC Chart.csv | +75.3% clicks, +62.6% impressions; no causal attribution or year-over-year comparison |
| Bing last 28 days Oct 7–Nov 3 versus Sep 9–Oct 6: 384 vs 494 clicks; 11,475 vs 10,208 impressions | Bing daily CSV | -22.3% clicks with +12.4% impressions; examine ranking/query/CTR changes before prescribing a fix. Bing export has no per-page or per-query breakdown |
| Google desktop: 2,725 of 2,970 clicks; US: 2,315 of 2,970 clicks | GSC Devices.csv / Countries.csv | 91.8% desktop, 77.9% US in this GSC period; useful audience clues, not permission to neglect mobile or other countries |
| Large print page: 57 clicks, 1,901 impressions, average position 21.69 | GSC Pages.csv | Existing demand signal, but position is weak; avoid assuming that a title rewrite alone fixes this |
| History and geography category pages: 43 / 40 clicks, positions 10.31 / 10.59 | GSC Pages.csv | Potential selective subject-level diversification, after category/query mapping and content review |
| Generator landing page: 22 clicks, 7,142 impressions, avg position 57.78 | GSC Pages.csv | Broad competitive surface, low immediate SEO priority; site utility is strategically useful regardless |
| Existing Christmas puzzle URL: 0 clicks, 44 impressions, avg position 18.93 | GSC Pages.csv | Early limited visibility in period ending Nov 3, not proof of absent December demand |
| Christmas: zero rows among exported top 1,000 GSC queries | GSC Queries.csv | Truncated query export: 1,597 query-row clicks vs 2,970 site clicks. Absence of a phrase is NOT a zero-demand estimate |
| Netlify production verified ready, deployed Nov 6 | Netlify project ilovewordsearch | Operational deployment evidence. Edge request logs include three 404s in a small sampled period, one for /word-searches/holidays/; not proof of an internal broken link; inspect source/referrer first |
| PostHog projects available to this account do not include WordSearch | PostHog projects-get, Nov 6 | No WordSearch project confirmed in this connected PostHog account; does NOT establish site-wide lack of GA4 or any other analytics |
| GSC Wizard and Semrush live data unavailable | GSC Wizard subscription required; Semrush no API units | Owner CSV exports control this analysis; no keyword-volume, KD, CPC, forecast or year-over-year estimates are invented |

When analyzing click concentration, always report both **sitewide organic clicks** and **organic clicks excluding /collections/hard-printable-word-searches**. A rise in total traffic from one existing page does not validate unrelated newly published content.

## Actual content inventory / avoid duplicates

- Already published: /word-searches/holidays/christmas-word-search — a medium 16-word curated Christmas puzzle. Preserve its canonical URL, reviewed words, seed, output and answer fingerprint.
- Already published: /word-searches/holidays/winter-word-search, /categories/holiday-word-searches, /collections/seasonal-word-searches, and related seasonal pages.
- Existing draft (not indexed or approved for publishing): christmas-word-searches-for-kids in content/collections.ts. It is not a completed multi-puzzle library yet; publishing a near-empty collection must not be a shortcut.
- Existing holiday categories include Thanksgiving, New Year, Valentine's Day and other topics. Inspect each actual publication state before proposing a new page.
- Existing large-print, hard, easy/medium, printable answer-key and PDF hubs are valuable internal-link destinations.
- The owner's README calls for useful sitewide search/tools/FAQ, better controls, a credible author page, richer natural links, dark-mode QA, social sharing, eventual accounts/waitlist and more format options. Treat these as a separate product backlog, not excuses to rewrite already successful content.

## Near-term Christmas program: limited, staged, indexable releases

**Release dates are targets, not guaranteed publication.** All new indexable content needs meaningful human-benefit differentiation, unique word lists, correct directions, seeded grid/answer reproducibility, good printable/PDF output, visible contextual links, accurate metadata and a clean indexability/SEO audit. No mass-generation or immediate publishing of all possible Christmas variants.

| Target / package | Proposed output | Why / go-no-go condition | Source/review dependency |
|---|---|---|---|
| Fri Nov 13 — C1 | Publish **one genuinely hard Christmas printable puzzle**, with 18x18 or equivalently justified difficult grid, distinct 20-word vocabulary, back/diagonal directions, clear answer key, Letter/A4 PDF and online play | **YES, candidate**. Matches observed hard-printable demand, unlike another generic medium page. Compare against the existing Christmas canonical before finalizing the unique topic/path; don't publish if merely a repeated word list or copied grid | Existing direction/input validation and print tests; weekly release gate. Request crawl/SEO spot-check after production |
| Fri Nov 20 — C2 | Turn existing kids Christmas collection draft into a **real curated hub only after enough distinct reviewed child puzzles exist**, e.g., one easy kid-appropriate puzzle plus existing medium + hard if those are appropriate for the stated audience; otherwise keep draft and instead improve useful holiday-category discovery links | **Conditional**. A collection must be a meaningful browseable resource, not an empty doorway. Do not change canonical medium Christmas page or publish a kids hub listing mostly inappropriate difficulty levels | C1 published and content audit; verify selection/age suitability and actual inventory |
| Fri Nov 27 — C3 | Assess and, if technically validated, publish **one large-print Christmas variant** with legible grid and word bank, truthful print-size claims, no forced age labeling, answer sheet and PDF | **Conditional YES**. Long-term large-print interest appears in GSC, and competitor formats show practical needs. Confirm real font size, paper dimensions, print-preview and large-print behavior on actual output; otherwise skip | Print/PDF regression, separate source and outputs; no fabricated 24pt claim |
| Fri Dec 4 — C4 | Add **Christmas printable pack or multi-puzzle PDF capability** only if low-risk and meaningful to classrooms/hosts: a reviewed bundle of truly different puzzles and separate answers; otherwise strengthen print instructions and discoverability of existing pages | **Investigate first**. Competitors offer usable multipacks, but current repo's multi-puzzle pack functionality is not confirmed. Do not build a large new PDF system hurriedly or duplicate thin SEO pages | Browser, PDF, matching answer keys, file size and no-ads-in-print checks |
| Fri Dec 11 — C5 | Focus on existing winter/New Year pages, repairs and contextual internal links; avoid launching new near-duplicate Christmas URLs this late unless actual data demonstrates a useful gap | **YES, maintenance/transition**; early seasonal work should already have been published | Performance data with indexing lag, query/page pairing if available |
| Fri Dec 18 and holiday weeks | Mostly validation, answer/print reliability, accessible sharing and seasonal transitions | **Maintenance-first**, no calendar-driven content inflation | No needless churn of known-working pages |

**Proposed URL/keyword ownership:** Existing medium Christmas canonical owns generic Christmas word search. New hard Christmas puzzle owns a truly distinct hard printable intent; large print (if built) owns genuinely larger output. A Christmas hub may own *browse multiple reviewed Christmas puzzles*, not a duplicate of the existing single puzzle. Do not create separate “free”, “PDF”, “with answers”, “for adults”, “printable” keyword-variant URLs with substantially identical grids. Use natural on-page labels and output functionality instead.

**Christmas feature gap evidence:** Competitive examples demonstrate practical user expectations: several distinct puzzles per pack, easy/medium/hard selection, matching separate answer pages, Letter/A4 output, large-print options, print at actual size, and no forced account. These are **features to evaluate**, not evidence of relative keyword volume or achievable rank.

Examples as of Nov 6:
- https://jigsawmake.com/christmas-word-search — multi-pack and large-print format.
- https://everyprintable.com/games/word-search/christmas/ — difficulty, paper size, print/PDF, answer keys.
- https://wordsearch.com/words/christmas/print — difficulty, grid size, shuffle, downloadable PDF.
- https://wordsatrest.com/printables/christmas — a specifically large-print Christmas experience.
- https://www.wordsearchbattle.io/collection/christmas/printable — distinct Christmas topics and a browseable collection.

No copied wording, layouts, puzzle content, or proprietary assets from competitors.

## Longer-run evergreen expansion: ranked opportunity lanes

**P1 — protect and deepen hard-printable strength.** Audit actual hard collection UX and internal paths without rewriting its successful content. Add only a few truly different hard curated puzzles with reviewed 20-word lists and trustworthy PDFs/answers; use current hard hub as a discovery path. Measure growth outside the one dominant page and topic cannibalization. Potential evergreen hard science, history, geography or adult-specific educational vocabulary must be assessed for already-published equivalents first. Don't create “hard adult printable” keyword clones.

**P1 — large-print and accessible printing.** Improve real print usability (large cells, readable word bank, Letter/A4 validation, no unwanted page breaks) and demonstrate improvements. Use existing large-print hub; only create new indexable pages for genuinely distinct audiences or puzzle content. Do not claim accessibility certification or fixed type-size without measurement.

**P1 — classroom/teacher workflows.** Validate request creation, clue support, answer sheets, name/date lines, reproducible seeds, and 1-page / 2-page printing. Evaluate useful packs and batch printing from reviewed subjects rather than hundreds of thin “subject + grade” URLs. The real user need is preparing worksheets quickly, not ranking variants.

**P2 — selectively strengthen currently visible categories.** Prioritize history and geography clusters where the GSC report shows modest impressions and positions around 10; inspect query/page pairs before selecting subtopics. Preserve published records and improve only gaps with real, verifiable educational value; no AI-generated fabricated facts.

**P2 — seasonal calendar with lead time.** After December, use a ~4–6 week editorial lead for Valentine's Day, spring/Easter, summer, back-to-school, Halloween, Thanksgiving and Christmas. Include relevant cultural events only with accurate, culturally respectful reviewed material. Reuse evergreen URL year to year; do not change dates just to simulate freshness. No arbitrary year-suffixed duplicates.

**P2 — discovery, search and internal linking.** Deliver the owner's sitewide search/all-tools/unique FAQ/nav requests through deliberate UX work. Add only contextually relevant links (holiday categories to real holiday puzzles, topic to hard/large-print/answer workflows) and avoid bloated templates. Preserve /search until a reviewed redirect/canonical migration is authorized. Cross-site links to other owned sites should genuinely assist the user, not become network-wide SEO link schemes.

**P2 — measurement and product activation.** Check whether GA4 or another current measurement pipeline actually tracks the site. This PostHog connection has no WordSearch project; any new setup requires normal privacy/consent analysis and user approval. Suggested privacy-conscious aggregate events: generator started, puzzle generated, zero/unplaced words, printable view, PDF export, answer opened, play started/completed, share clicked, QR export; event properties must not include user-supplied puzzle text or encoded shared URLs. Track useful completions per qualified page landing and device. Netlify request counts are requests/assets/crawlers, not human sessions.

**P3 — social sharing, collections and retention.** Design tasteful native share sheet, printable saved-URL convenience, completed puzzle time/stats and optional local history. Start with guest/no-login UX; do not impose login or create a paid tier until evidenced usage and a coherent product/business proposal.

**P3 — accounts, collaboration and subscriptions.** Separate long-term feasibility work for waitlist, auth, stored progress, real-time collaborative puzzle solving, privacy/safety, costs and paid differentiation. Do not pull this infrastructure into seasonal publishing.

## Publishing cadence and gates (trickle, not dump)

- **Weekly content/feature train:** Friday release after Thursday review; target **one distinct new indexed puzzle or one substantive collection/format per week** initially. A second page requires independently verified distinct intent, review, and no cannibalization. Release nothing rather than ship a thin page simply to meet a quota. The upper bound is a deliberate throttle, not a target to fill.
- **Fast-track UX train:** ship validated cosmetic, accessibility and minor layout improvements individually without Friday hold. Do not treat new indexable content, template-wide meaningful text, navigation redirects, generator logic or ad code as fast-track.
- **Prepublication checklist:** distinct utility vs existing canonical, no keyword-stuffed variants, reviewed factual vocabulary, no brand/franchise copying, reproducible stable grid and answers, no missing/duplicate/unplaced intended words, correct difficulty/print instructions, responsive/accessible, no ad in print, exact canonical/meta/sitemap/robots, reviewed contextual links and ownership of one search intent.
- **Rollback/observability:** commit and draft PR per bounded work package; integration candidate combines approved changes; no direct main pushes. After approved merge, Netlify auto-deploys. Verify production deploy SHA, relevant 200 URLs, correct redirects, on-page metadata, printable/answer parity, and no 5xx spikes. Maintain known-good deploy and no production tokens in Codex.
- **Data checkpoints:** snapshot Google and Bing independently on 7/14/28/56 days after each published page (indexing delays noted); monitor impressions, clicks, CTR, average position and whether page is indexed. Page-level query analysis needed to interpret intent. Comparing seasonal clicks to nonseasonal months is not a clean causal experiment. First full year-over-year holiday comparison becomes possible in 2027.
- **Guardrails:** monitor hard hub clicks, total organic clicks minus hard hub, other published pages' visibility, new URLs' indexability, 404s, site health, errors, user experience, revenue per session if reliable analytics exists, and advertising placeholder protection. If new pages cannibalize or reduce site quality, pause the train and investigate. No arbitrary “SEO-safe” guarantee.

## Investigation / measurement backlog (not automatic content approval)

1. Get a true **GSC query × page** export for Christmas, hard, large-print, history, geography and generator; current exported Queries.csv and Pages.csv cannot attribute queries to individual pages. Preserve the source periods. Repeat at settled dates in November/December.
2. Get Bing **page/query** reports: supplied Bing export contains only day-level totals. Diagnose recent click deterioration before claiming causality.
3. Verify Google indexing status and mobile performance of the existing Christmas canonical and published winter/seasonal hub, plus internal link paths. A small crawl and sitemap membership are useful; submission never guarantees indexing.
4. Evaluate existing generated PDF packs, whether reproducible multi-puzzle print packs exist, how they behave on US Letter and A4, and true accessibility of large print.
5. Investigate Netlify sampled 404 /word-searches/holidays/ against actual internal site links; /feed and /ipfs/... could be external probes. No blanket redirects without verified intended destinations.
6. Verify any preexisting analytics/consent implementation and whether privacy-safe feature funnels can be measured; connected PostHog project list does not currently show this website.
7. Leave the three currently confirmed baseline route-audit noindex/ad-slot findings to their separate protected-ad review; **no automatic ad code changes**.
8. Monitor existing dependencies, Lighthouse and field CWV separately; do not claim a local Lighthouse best-practices score predicts Google ranking.

## Practical milestones and owners

| Milestone | Who acts | Completion evidence |
|---|---|---|
| C0: inventory and Christmas/SEO technical specification | Codex on review branch, owner/editor approves content | Existing pages/drafts identified; uniqueness and word-list plan; stable fingerprints; page/keyword ownership map |
| C1 hard Christmas canonical | Codex implements, independent ChatGPT PR review, owner release approval as required | Tested published puzzle/answers, Netlify ready, valid canonical/indexability, unchanged previous 150 fingerprints |
| C2 hub/children | Codex/editor | Every linked puzzle published, distinct and reviewed; no empty or keyword-clone hub |
| C3 large-print or pack | Codex | Actual print/PDF acceptance and useful differentiated outputs, not only metadata |
| Sitewide monitoring | ChatGPT via available connectors when asked, Codex via tests | Google/Bing 28-day and sitewide-minus-hard-page trend; no unexplained degradation |
| 2027 quarterly review | Owner + Codex/ChatGPT | Retire weak speculative ideas, continue proven clusters, retain seasonal calendar without content dumps |

## Sources, policy and data-access qualifications

- Owner-provided GSC archive: ilovewordsearch.com-Performance-on-Search-2026-11-06.zip, files Chart.csv / Pages.csv / Queries.csv / Countries.csv / Devices.csv, filters Web / Last 3 months. This is not committed to a public GitHub repo.
- Owner-provided Bing CSV: ilovewordsearch.com_SearchPerformanceOverview_All_11_6_2026 (1).csv; 90 day-level rows. Not committed.
- Code inventory: content/topics.ts, content/collections.ts, content/curated-topics.ts, content/curated-topics-prompt6.ts, ai-issues/README.md. Live reference: https://www.ilovewordsearch.com/categories/holiday-word-searches
- Google people-first guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google spam policies (scaled content, doorway pages): https://developers.google.com/search/docs/essentials/spam-policies
- Google sitemap discovery, not indexing guarantee: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google crawling/recrawl limitations: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Netlify project ilovewordsearch: production-ready on 2026-11-06 (connected account). The 404 analysis is a small request-log sample only.
- PostHog: account project list excludes WordSearch; no linked project data used here.
- Semrush API: active subscription but insufficient API units; https://www.semrush.com/mcp-access
- GSC Wizard: trial/subscription access declined; no live data used, https://tool.gscwizard.com/settings/subscription

**Do not construe competitor products, estimated keyword demand, forecasts, launch dates, indexing times, or revenue lifts as facts without source-backed measurements. This document plans only; it does not authorize production deployment or supersede existing PR gates.**
