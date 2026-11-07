# iLoveWordSearch — complete buildout and controlled release program (2026–2028)

> **Editorial calendar and finished-product policy (2026-11-06):** The [53-Friday 2027 editorial review calendar](./2026-11-06-2027-WEEKLY-EDITORIAL-CALENDAR.md) now details the entire year; the [product finalization contract](./2026-11-06-PRODUCT-FINALIZATION-AND-ACCEPTANCE.md) defines what a truly polished, accepted site means. **These newer policies supersede the provisional initial 0–3 new-URL weekly ceiling below:** initially **0–1 new unique indexable URL per Friday**, with a second only as an explicit, exceptional independently approved decision after at least eight weeks of observation. No calendar slot obligates any new indexable page. Both docs expand implementation goals, not production permission. All source-only content may be built immediately while release slots remain gated.

Prepared 2026-11-06 · Master plan v1 · Planning-only, no production authorization

## The governing decision: build NOW, publish in measured waves

There are TWO clocks, and they must never be confused:

1. **BUILD CLOCK — as fast as technically sound.** Implement the full backlog in parallel independent packages using isolated worktrees and economical workers when actually worthwhile. Content can be researched, authored, validated, QA'd, reviewed, and frozen months before its release. Push each completed work package to a review branch with a draft PR and durable evidence. If one package is blocked, advance unrelated work. Never pause development because the next content publication slot is weeks away.
2. **PUBLICATION CLOCK — deliberately paced.** Choose specific validated, genuinely distinct indexable pages/collections from the ready inventory according to seasonal timing, search evidence, audience benefit and prior cohort performance. On normal Fridays, publish the approved selection with the weekly release; fast-track only genuinely low-risk cosmetic UI. A complete build is NOT approval to publish it. Do not push/merge anything onto main without its release gate; main automatically deploys Netlify. ChatGPT performs independent PR/Netlify review and coordinates approved releases.

**Target future state:** a mostly prebuilt, continuously improving library and generator with an editorial release queue, not a continuously unfinished site; a high-utility printable puzzle destination, not a mass-generated word-search doorway farm. Preserve the site's existing successes and monetization.

This plan augments ai-issues/README.md (owner requirements), the independent audit backlog, AD-PLACEHOLDER-SAFETY.md, the W46 functional PR family, and ai-issues/2026-11-06-growth-opportunities-and-staged-publishing.md. Do not replace/erase them. The companion queue in ai-issues/2026-11-06-buildout-catalog-and-release-queue.md specifies actual build candidates. Plans are hypotheses; existing URLs/status come from source code; rankings and observed demand come from exports, not invented keyword tools.

## 1. What is already owned, and what the data actually supports

### Actual inventory from current source
- **150 published curated puzzles** across **15 published topical categories**, 60 in content/curated-topics.ts and 90 in content/curated-topics-prompt6.ts. Their code-reviewed seeds and 150 fingerprints are immutable without a separately approved migration.
- **13 published collections**: easy, medium, hard printable, with answers, classroom, animal, science, seasonal, geography, language arts, math, history and travel.
- **12 published guides**, **13 specialty-generator routes**, and **eight existing draft collections**. Some specialty routes are scaffolds or have output/accuracy caveats; route existence is not proof of full feature readiness.
- **Two category drafts**: health/wellness and faith. Category drafts and auto-generated topic drafts are NOT reviewed publishable content. No auto-promotion.
- Published canonical Christmas medium puzzle, winter puzzle, seasonal collection and holiday category already exist. Existing Christmas-for-kids draft collection is NOT a completed multi-puzzle set.
- Current owner requests include branding/icons, nonsensical UI labels, header navigation, every-page tools/search/real FAQ, relevant cross-site links, footer, author, dark mode, UX, internal linking, settings QA, sharing and a later optional account/multiplayer/paid model.
- Already implemented/reviewed or in review: fast-track footer PR #1 released; other W46 implementation PRs #2–#13 remain separately gated; PR #14 is planning only. Do not rebuild them blindly.

### Measured search baseline
Google Search Console Web, 2026-08-04 to 2026-11-03: 2,970 clicks / 50,794 impressions. The hard printable collection contributes 2,402 clicks (80.9% of site total), leaving **568 clicks outside that URL**. The Google 28-day Oct 7–Nov 3 period had 1,792 clicks, up from 1,022 for Sep 9–Oct 6; these are growth observations, not causality. Bing 2026-08-06 to Nov 3 has 1,019 clicks / 27,383 impressions; last 28 days 384 clicks vs previous 494 even while impressions rose 11,475 vs 10,208. Treat Bing and Google separately.

Evidence-ranked opportunities:
- **P0/P1 proven acquisition:** hard/difficult printable and PDFs. The exported top 1,000 GSC queries contain 228 rows matching hard/difficult/challenging/extreme, totaling 1,437 clicks and 12,714 impressions **within the truncated query export**. Keyword groups can overlap; NEVER sum them as additive site traffic.
- **P1 meaningful secondary interest:** large-print hub 57 clicks / 1,901 impressions / position 21.69; its related query family is visible but weakly ranked. Actual print quality, not multiplying large-print keyword variants, is the product opportunity.
- **P1/P2 adjacent category traction:** history 43 clicks / 1,108 impressions / position 10.31; geography 40 / 867 / position 10.59; medium collection 33 / 768 / position 8.51; answer-key collection 22 / 1,286 / position 11.03.
- **P2 functional growth, not short-term ranking bet:** generator 22 clicks / 7,142 impressions / average position 57.78; maker/generator queries are highly competitive. Win on useful differentiated worksheets, speed, reliability, export and sharing first.
- **P2 selective repair:** food 12 / 1,147 / position 12.58; music category 4 / 1,201 / position 37.23; nature 14 / 985 / position 9.23; don't bulk publish to “fix” ranking.
- **P1 seasonal hypothesis (Christmas):** current Christmas puzzle has 0 clicks and 44 impressions, avg position 18.93 in report ending Nov 3. No Christmas phrase appears in the exported top 1,000 queries (their 1,597 clicks are only part of 2,970 site clicks). This is NOT evidence of zero seasonal interest; competitor product examples support feature existence, not keyword-volume claims.
- **Audience:** GSC US 2,315 clicks (77.9%); desktop 2,725 (91.8%). Prioritize US Letter + A4, US school/holiday terminology and desktop printing while still testing mobile and accessibility.

Source limitations: uploaded CSV/ZIP are not committed; GSC search type Web and truncated query/page exports, Bing export daily only (no query/page); no complete year-over-year seasonality, RPM, GA4 funnel or keyword-volume dataset. Semrush API requests are blocked by insufficient units and GSC Wizard currently refuses subscription access. Connected PostHog projects do not show this site. The baseline date must be explicit in later reporting.

## 2. Full build architecture: develop in parallel NOW

Packages have distinct ownership, protected branches and proof. Finish each independently; parent-dependent features stack PRs rather than leaking into main. Each item has a test/evidence and content gate.

| Build lane | Packages to execute now, independent where possible | Complete when... | Production/SEO impact |
| --- | --- | --- | --- |
| B00 Foundation, finish existing work | Independently integrate W46 PR #2 and approved children #3–#13 with current main; fix PR #9 pathological-input workload risk; classify #8's three ad/noindex findings; preserve dependency/AdSense guards; verify all 150 fingerprints | one isolated integrated candidate passes combined CI, browser/device-emulation, SEO/ad/print/PDF and owner functional acceptance | Weekly functional; do not sacrifice security for date |
| B01 Editorial inventory and lifecycle | Source-derived manifest of all 150 published, 13 collections, 12 guides, 13 specialty, existing draft topic/collection records, route aliases, redirects and proposed candidate IDs; collision/duplicate search intent checks; versioned status fields: proposal / researched / drafted / built / QA / editorial-approved / scheduled / published / monitoring / retired | no proposal accidentally resolves to an existing canonical, draft is absent from sitemap/indexed export, collision/redirect tests pass | Can build upfront; publication gated |
| B02 Content production system | Typed reviewable puzzle schema; source references; unique researched vocabulary; list-generation assistance restricted to drafting; difficulty/seed/placement/answer validation; full content-similarity fingerprints; auditable human/editorial review; source-backed factual checks for geography/history/science; bulk validation CLI, NOT bulk auto-publish | reproducible content/metadata/print preview; reviewed word list, every intended word placed, no duplicate/near duplicate or unsupported factual text | New URLs weekly only |
| B03 Printable pack engine | Multi-puzzle printable package builder using existing generator/PDF components; multiple distinct grids; stable named sets/IDs, Letter+A4, puzzles-first versus answers-last, black/white, margins, 1/2/4 per sheet only if readable; download and no-ad print; no sign-in | 5/10 puzzle packs verified end-to-end, page count correct, all grid/answer fingerprints stable, sane file size and no layout clashes | Ship utility as ready; content pages separately |
| B04 Difficulty + large print | Real measured easy/medium/hard presets, “expert” only if genuinely more difficult; measured grid and word-bank typography; printer tests Letter/A4 at 100%; high contrast, larger controls and accessibility; rerender using existing published puzzle configs without changing them | screenshot/PDF measurements and legible sample outputs; avoid false 24-pt or accessibility-certification claims | Weekly functional |
| B05 Theme library: Christmas to year-round | Author/freeze Christmas batch immediately, then New Year/winter, Valentine's Day, St Patrick's/spring/Easter, Earth Day, Mother's/Father's, summer, US Independence/Canada Day, back-to-school, Halloween, US/Canada Thanksgiving, recurring year-round | all shortlisted unique content records + multi-puzzle bundles validated on preview, marked unreleased, no accidental sitemap/links | One or a few validated indexable additions per reviewed weekly batch, not an entire content dump |
| B06 Evergreen puzzle library | Write and validate targeted NEW hard challenges, geography/history subject packs, long-word science, travel, hobbies/nature, accessible large-print, classroom vocabulary and ESL word lists using companion catalog. Preserve all existing curated puzzle URLs and words | distinct pedagogical or solving outcome, word list, seeded puzzle, answers, evidence; collision checks | Release priority based on evidence + topical diversity |
| B07 Discovery/IA | Right-aligned header/More menu, accessible search in menu and relevant section, useful per-page search & All Tools, contextual FAQ only, curated related-topic suggestions, seasonal/current collection navigation and relevant cross-site links | no sitemap/canonical regressions, useful browsing paths, screen reader and keyboard QA, no spammy global blocks | Weekly (broad nav/template change) |
| B08 Visual/design system | Finish consistent icons; coherent controls; typography and button hierarchy, responsive layout; footer, truthful author/About, excellent light/dark across printed/non-printed surfaces; follow existing design libs, no unnecessary dependency | design review on representative archetypes with baseline visual comparison and accessibility; no unwanted changes to print colors | Isolated safe cosmetics fast-track; broad dark-mode weekly |
| B09 Sharing/retention (guest-first) | Native/Web Share, copy, social metadata where valid; long-URL/QR explicit errors; share completed-result card without putting user/private puzzle text in a public URL; locally saved puzzles/history and optional replay; optional daily/weekly puzzle concept only when differentiated | cross-browser fallback, privacy, stable links, accurate stats, local persistence, accessible controls | Weekly functional |
| B10 Measurement and monitoring | Stable page/source snapshots, GSC/Bing comparison, indexability/coverage log, published cohort dashboard/report, Netlify 404/5xx, privacy-conscious usage events only if existing instrumentation/consent confirmed; no user-created words in events | can attribute new releases independently of legacy hard hub and report denominator, indexing age and seasonal comparability | Internal operations; no analytics script silently added |
| B11 Specialty routes and languages | Audit the 13 existing specialty generators for real correctness, labels, keyboard access, supported alphabet, security, print and cultural accuracy; put ASL/semantics and other weak scaffolds in truthful status until validated; use free commercially usable data only | route-by-route acceptance, no misleading “fully supported” claims or copyrighted diagrams | Ship only verified capability, preserve canonical paths |
| B12 Trust + monetization hygiene | Editorial policy and author credibility; ads lifecycle strict “first real ad globally removes placeholders,” consent/privacy review, non-intrusive placement, print never monetized, core web vitals; do not conflate SEO with ad RPM | measurable no ad coverage/UX regression, legal/consent and accessibility review | Ad placement changes NEVER fast-track |
| B13 Optional identity/co-op/business | Discovery and PRD only now for waitlist, account history, collaborative puzzle play, leaderboards, teacher collections and paid perks; free-first; explicit cost/privacy/abuse/security and pricing validation | gated evidence, cost and owner decision before server/auth/subscription implementation | Future, NOT blocking initial expansion |

**Strong constraint:** automate software construction, tests and document drafts; do not claim that unreviewed AI word lists are curated publication-ready. Human-scope work must stay small. If a complex capability would require major manual research, reduce scope or defer rather than fill pages with invented facts.

## 3. Implementation sequence (build clock, NOT publication dates)

**Immediately: parallel sprint group 0.** Start B01 content manifest/queue, B02 content validation/editorial tooling, B03 print pack feasibility/implementation, B05 Christmas editorial draft and B10 measurement definitions in separate worktrees. B00 existing integration runs independently with careful shared-code conflict controls. QA worker audits what is already published and marks weak/draft content not ready. Small B08 cosmetics proceed as already approved.

**Sprint group 1 (after respective dependencies, without waiting for Friday).** Finish B04 actual large print; build complete Christmas content inventory; test pack output; B06 first hard evergreen candidates; B07 IA prototype (no production nav redirect), B09 first share workflow and link validation. Every milestone committed/pushed to a review branch/draft PR.

**Sprint group 2.** Build winter/New Year/Valentine's/Easter/teacher and hard evergreen content concurrently. B06 geography/history/science themed collections, classroom pack presets, B11 specialty QA. Continue until READY INVENTORY is full; do not ask whether to build the next content batch because the date of release has not arrived.

**Sprint group 3.** Complete the longer-tail category backlog (see catalog), B09 local-state and replay, B07 per-page FAQ/internal linking, B08 dark mode and author trust, B13 PRD. Built content stays behind feature/publication flags or in source-only review branches until its individual approved release.

**Quarterly refinement 2027–28.** Reprioritize published and unreleased inventory by repeatable search/usage evidence. Don't mechanically expand everything that was originally brainstormed; kill or re-scope lanes with demonstrated low incremental user value. Preserve the full queue and reasons so work can resume without repeating research.

## 4. Publishing program: separate readiness gate, deliberate editorial rollouts

**Not “build one per week.”** Build hundreds of validated *candidates* ahead of release if economical, then publish only the subset that genuinely warrants indexable URLs. The launch throttle is an internal quality/measurement safeguard, not a Google algorithm rule. Initial operating range is **0–3 distinct new indexable URLs in a Friday weekly release**, usually 1–2. A meaningful multi-puzzle hub may count as one URL. Zero is correct when none qualifies. Increase carefully only after 28–56 days of monitored cohorts and content-review capacity, rather than assuming all unpublished material deserves publication. Separate feature releases from indexable content launches; an internal app feature may go live without exposing draft pages.

| Release window | Editorial focus (build should already be complete) | Example review-gated candidate |
| --- | --- | --- |
| Nov 13 2026 (W46) | Christmas hard printable; W46 functional fixes | distinct tested hard Christmas canonical, not an alternative URL for the existing generic medium |
| Nov 20 (W47) | Easy Christmas / genuinely useful Christmas collection if the children exist | publish only if inventory and targeting pass review |
| Nov 27 (W48) | Large-print Christmas and validated themed PDF pack | ship actual functionality before descriptive page |
| Dec 4 (W49) | Holiday pack + context links; winter transition | one useful pack hub if properly differentiated |
| Dec 11 (W50) | Winter/New Year and gap repair; stop late thin Christmas variants | strengthen existing winter/New Year URL where possible |
| Dec 18-Jan 1 | Stable maintenance / low-risk evergreen; monitor seasonal traffic | no mandatory content launches, no speculative recency edits |
| Jan–Mar 2027 | Evergreen hard/large-print, teacher/subject pilots, Valentine's/St Patrick/Easter with 4–8-week editorial lead | diversified cohorts, avoid duplicate collection hubs |
| Apr–Jun 2027 | Spring/Earth Day/Mother's/Father's and science/geography/classroom themes; pack features | focus on proved format use |
| Jul–Sep 2027 | Summer travel, US/Canada topics, back-to-school, teacher worksheet workflows | evergreen/persistent pages, not year-suffixed variants |
| Oct–Dec 2027 | Halloween, Canadian/US Thanksgiving, Christmas 2027 using existing season-stable URLs and expanded validated child inventory | compare with 2026 season once a comparable window exists |
| 2028 onward | Ongoing evergreen and holiday refreshes, feature adoption, optional identity products | prioritize marginal results, not output count |

**Seasonal timing:** editorial candidate inventory at least 6–10 weeks before event where practical; last 4–6 weeks is rollout/observation, not rushed authoring. 2026 Christmas is the accelerated exception: build right now and release the first approved set as soon as existing W46 gates allow. Distinguish Canadian from US Thanksgiving and school calendars rather than falsely treating them as the same date.

**Content types and canonical ownership:** (a) one evergreen puzzle URL per unique, curated puzzle; (b) collection URL only when it provides genuinely useful browsing, multiple child puzzles and distinct selection guidance; (c) tool landing only if functionality differs; (d) format variants (PDF, answer key, printer settings, share URLs) generally belong to the existing canonical and NOINDEX utilities, not duplicate indexable pages. A new “hard Christmas” URL should not repeat the already published Christmas grid and text. Large print can be delivered from the same canonical where user intent can be served without a separate page.

**No fake scheduling freshness:** stable seed, season-stable URL, visible true review date. Content is published on its own merits; not every scheduled slot must be filled. Google says its systems target helpful content and classify scaled unoriginal/doorway pages as spam, not that one page per week has special ranking value.

## 5. Exact gates before classifying a proposed URL as release-ready

A URL must pass: unique-intent/overlap review against all existing pages and planned siblings; objective purpose/audience; curated differentiated words (not synonym swap); accurate difficulty and all direction instructions; deterministic seed + stable grid; no unplaced intended words; paper-size and PDF/answer parity and printable contrast; no false age/health/education claims; proper image/license rights; useful original supporting information without filler; accessible mobile/desktop; useful contextual links from active pages; indexable/canonical/robots/sitemap audits; no accidental draft sitemap/landing links; no unexpected ad placeholders or ad in print; regression evidence including published 150 unchanged. For a hub, prove the children exist, are published and are materially distinct. A page aimed primarily at search variations rather than user needs stays in DRAFT or is folded into a canonical.

**Freeze/build barrier:** Ready-for-release assets are immutable versioned content manifests; publication selection points to reviewed commit IDs. Do not silently regenerate word lists or change seeds when publishing a built candidate. Diff against approved snapshot and preserve old release on rollback.

**Feature release barrier:** no user accounts or paid capture introduced by a content release; no new paid backend/analytics provider without cost/governance approval. Changes to ad runtime/placeholder lifecycle require separate explicit authorization even when an audit is failing.

## 6. Analytics strategy and stop / scale decisions

Keep distinct time series: Google organic Web clicks; Google clicks excluding the hard-printable URL; Bing organic clicks; indexability of newly published URL cohorts; known landing-page CTR/position; puzzle actions (generator start/success, printed, PDF, completed, shared) only if privacy-safe tracking is actually configured; performance, 404s, and ad/monetization guardrails. Netlify raw edge request counts include assets, bots and previews and are **not sessions**.

At 7, 14, 28, 56 and 90 days after each published cohort: check indexed status, correct canonical, sitemap inclusion, impressions, clicks and whether adjacent canonical pages lost impressions/clicks (possible cannibalization). Search Console query/page data is required to judge true overlap; exported aggregate queries + pages cannot be joined reliably. Respect indexation lag and compare matched windows/seasonal contexts, never read “no clicks after one week” as a failed page. 2026 has no prior same-season data.

**Release outcome rules:**
- CONTINUE/EXPAND: actual user-use benefit and incremental non-hard traffic or otherwise demonstrated value, no cannibalization, no regressions. Ramp only if QA can keep up.
- MAINTAIN: indexation immature, low impressions but high-value evergreen utility, or unclear evidence; no artificial new variants to chase clicks.
- REPAIR: evidence of broken output/metadata/internal link/indexing/ad/print or an obvious content gap. Fix existing URL before making another.
- STOP/RETIRE: duplicates, low-value synonyms, factual errors, unsustainable editorial effort, risky ad changes, or features not used sufficiently to justify recurring infrastructure spend.
- High-RPM opportunity is NOT automatically a priority without reliable country/device/revenue attribution; optimize for user utility and safe monetization.

Weekly report must show (a) global Google clicks, (b) Google clicks excluding hard collection, (c) Bing trend, (d) new-cohort impressions/clicks, (e) existing-top-page guardrails, (f) release/QA status and next approved candidates. Never claim causality for a raw before/after ranking change.

## 7. Operating model, Git, audit and stop rules

- Plan in ai-issues; preserve owner README and 2026 audits. Use exact source manifests, docs/release records, and linked draft PRs for traceability.
- Every work package gets own branch, commit, tests and draft PR; no mixing independent giant batches, no saving only uncommitted. Push after milestone, then continue constructing other packages.
- Content and feature builds can occur in parallel isolated worktrees. Only the managing agent resolves shared files/dependencies. Re-run integrated tests after sibling merges.
- Codex may not push to main, merge, deploy production or auto-merge under generic build authorization; those actions belong to explicit independent release approval. Fast-track icon changes already have their own independent release path.
- In particular, **no production content accidentally exposed while prebuilt**: automated CI should fail if a draft slug enters sitemap, canonical index, published category listings, public internal links, or an indexable route. Secret unpublished source content should be kept in review branches if it must not be public; note this GitHub repository itself is public.
- Preserve first-ad-render placeholder suppression and protected ad placement; don't weaken audits to make red go green; classify baseline errors honestly.
- Safety/cost: discover actual model tiers and capacity; delegate only when effective cost is materially lower, use existing libraries, avoid subscriptions and infrastructure before justification; skip unauthorized provider credentials. The computer shutdown request was set aside because unsaved desktop state cannot be verified, not because this buildout is finished.
- Build work is not a background process ChatGPT runs by itself; a Codex/manager run must be started with the prompt below and can advance only while the manager actually runs. ChatGPT reviews connected GitHub/Netlify when requested; no unsolicited scheduling.

## 8. Immediate management prompt for Codex

"Read ai-issues/2026-11-06-MASTER-BUILDOUT-AND-CONTROLLED-RELEASES.md and ai-issues/2026-11-06-buildout-catalog-and-release-queue.md plus existing AGENTS.md, owner ai-issues README and ad safety rules. Treat the build queue as fully authorized for *review-branch implementation only*. Build ASAP across isolated worktrees with efficient available workers. Work sequentially per dependency but parallelize safe content and test packages. Publish a commit, draft PR and honest evidence for each finished package. Prepare a frozen Christmas content batch and durable backlog now, WITHOUT waiting for publication week. Keep every new content record draft/nonindexable/unlinked until its independent editorial and release approval; never push/merge main or deploy. Integrate W46 functionality separately; do not reimplement existing PRs. Continue other work if one package blocks. Produce one inventory of ready-to-publish assets, next release candidates, new failures, cost/license barriers and complete branch/PR refs. Never claim all buildout is finished if anything remains incomplete." 

## 9. Primary sources and competitive reference

- Uploaded 2026-11-06 GSC ZIP (Chart, Pages, Queries, Countries, Devices, Search appearance and Filters), with Web/last-three-month export; Bing daily CSV ending 2026-11-03. Not published on GitHub; the aggregate values above are traceable to filenames and date windows.
- Source inventory: content/curated-topics.ts, content/curated-topics-prompt6.ts, content/topics.ts, content/collections.ts, content/categories.ts, content/guides.ts, content/specialty.ts; existing /ai-issues instructions.
- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google scaled-content/doorway policy: https://developers.google.com/search/docs/essentials/spam-policies
- Google indexing and sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Competitor format/function examples (not independent traffic or keyword-demand proofs): https://jigsawmake.com/christmas-word-search ; https://everyprintable.com/games/word-search/christmas/ ; https://wordsatrest.com/printables/christmas ; https://wordsearch.com/words/christmas/print ; https://peabody.kids/blog/best-free-word-search-makers ; https://puzzone.com/puzzle-maker-for-teachers ; https://everyprintable.com/games/word-search/large-print/

No unsupported SEO volumes, rank guarantees, proprietary datasets, or AI-fabricated topic facts. This document authorizes planning; owner/manager's already-authorized branch-build workflow applies, with independent release gates retained.
