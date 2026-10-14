# WordSearch — Independent Audit and Weekly Release Candidate Backlog

**Audit date:** 2026-10-14  
**Repository:** [suhas-sunder/wordsearch](https://github.com/suhas-sunder/wordsearch)  
**Read-only audit baseline:** `main` at `2474741a1629764926b3034dbd04c7dacc3f8704` (before this report commit).  
**Live site:** https://www.ilovewordsearch.com/  
**Status:** PLANNING ONLY. No application changes, page rewrites, or SEO deployments are approved by this report.  
**Maintainer issue notes:** [ai-issues/README.md](./README.md) — **source of truth for owner-requested UI/product changes**.

## 0. How to use this backlog

This file deliberately **does not duplicate** the owner's issues in `ai-issues/README.md`:

- Owner 1, 2, 5, 8, 9, 10, 11, 17: logo, Lucide icons, header, footer, author attribution, dark mode, visual hierarchy, social section.
- Owner 3: nonsensical/AI-sounding text and copyediting generally.
- Owner 6, 7, 12: search/all-tools/FAQ placement, cross-property links, richer contextual internal links.
- Owner 13: comprehensive settings functionality and builder polish **in general**. Distinct, source-supported correctness bugs below are recorded so they can be acceptance-tested individually, not to propose the same UI work again.
- Owner 14: accounts, waitlist, saved history, scoring, collaborative play and free/paid tiers.
- Owner 15: general sharing, native social sharing and completed-puzzle stat cards.
- Owner 18: export/output types and broad competitor-based customization expansion. This report does **not** re-add generic HTML, PNG, SVG, etc. requests already covered there.

**Definitions:** P0 = correctness/integrity issue needing investigation before feature work; P1 = high-value bounded fix; P2 = additive, evidence-dependent opportunity; P3 = defer/experiment. **Confidence** refers to evidence of an issue/opportunity, *not* projected SEO uplift. A source-visible defect is not equivalent to a successful runtime reproduction. Never change a previously published puzzle's grid, seed, word list, canonical URL or print answer key without approval, migration analysis and regression testing.

**Inventory from live homepage (2026-10-14):** 150 reviewed puzzles, 15 categories, 13 collections, 12 guides; generator, PDF, online play, large-print, teachers, kids, adults already exist. Do not re-propose these as missing features. The source has draft topics and collections that are **not yet finished/indexable**; do not treat a draft route as an accepted published content gap.

**Analytics limits:** GSC Wizard connection returned `payment_required` (trial/subscription inactive). No first-party click/position/impression data or AdSense RPM by page/country was available in this audit. Competitor features and search result presence are evidence of *market coverage*, not proof of ranking, search volume, revenue, keyword difficulty, or comparative performance. Validate all SEO candidates with fresh, first-party Search Console/Bing exports and geo-specific keyword data before publishing.

## 1. Distinct technical findings and tests

### WS-A01 — Empty direction selection is silently replaced with defaults
**Priority P0 | Confidence: confirmed source logic; browser reproduction pending | Risk: incorrect puzzle directions / misleading settings.**

**Evidence:** `components/builder/WordSearchBuilder.tsx` → `toggleDirection` allows the user to turn off the final remaining direction; `lib/puzzle/generate.ts` → `generatePuzzle` sets `directions: input.directions?.length ? input.directions : directionsByDifficulty[...]`, so an intentionally empty array is silently replaced by a preset. A warning about no directions is unreachable after that fallback.

**Expected:** Either prevent deselecting the last direction with an explicit accessibility explanation, or honor the empty selection and block generation/export with a validation error. Preserve the genuine distinction between “directions omitted” and “directions deliberately empty.” Add unit + browser tests for no directions, one direction, all directions, toggling repeatedly, reload, and sharing. **Do not change valid seeded puzzles**.

### WS-A02 — Published-puzzle difficulty/direction semantics diverge from the generator presets
**Priority P0 | Confidence: confirmed source discrepancy; actual user impact requires browser checks | Risk: inconsistent difficulty and misleading content.**

**Evidence:** `content/registry.ts` → `topicRecords[].puzzle.directions` assigns `directionsByDifficulty.hard` to **every published non-easy** puzzle, including medium. `lib/puzzle/generate.ts` sets medium to just E, S, SE, NE, versus hard's eight directions. `components/builder/WordSearchBuilder.tsx` → `setDifficulty("medium")` replaces that curated eight-direction set with the four-direction medium preset. `content/curated-topics-prompt6.ts` prints a blanket “Medium ... all eight straight directions” note, which matches the curated override but not a subsequently selected medium preset. Some older curated difficulty notes also mention reverse directions.

**Expected:** First document intended meaning of easy/medium/hard and curated overrides; identify all affected published topics, the current seeded grids, labels/instructions and any links. Test initial load, clicking Medium while already on Medium, print/PDF/answer key/online play, and share replay. Prefer correcting controls/explanations to changing established grids unless there is a genuine correctness defect. Any grid-changing fix requires explicit review of SEO, printable and share-state continuity.

### WS-A03 — External/share-state grid dimensions are not strongly validated or bounded
**Priority P0 | Confidence: confirmed missing boundary validation in inspected generation path; exploitability/performance untested | Risk: frozen tab, memory pressure or malformed output.**

**Evidence:** `lib/share-state/state.ts` decodes JSON objects and only verifies that `seed` and `wordsText` are nonempty for puzzle-play links; it does not structurally validate all puzzle fields. `lib/puzzle/generate.ts` → `chooseSize` uses supplied truthy `rows`/`cols` directly for non-auto-size and creates a two-dimensional grid. Builder fields display min=6/max=40, but UI `min`/`max` are not a trust boundary. Non-integers, negative numbers, zero, huge numbers, invalid directions and wrong types warrant explicit input validation.

**Expected:** Shared request decoder + generator normalize against a documented bounded schema (finite integers, upper/lower limits, token and word-list limits, valid alphabet pack and directions). Reject pathological external links without rendering a massive grid; preserve compatibility with valid old links. Add tests for malformed JSON, 0, negatives, decimals, NaN-like values, extremely large dimensions, oversized inputs, unsafe strings and out-of-range alphabet values. No production parser rewrite until old-link compatibility is checked.

### WS-A04 — Duplicate and unplaced word handling needs a teacher-facing integrity gate
**Priority P1 | Confidence: confirmed source behavior; production impact conditional on input | Risk: worksheet with fewer answers than intended.**

**Evidence:** `lib/puzzle/parse.ts` annotates duplicate normalized answers; `lib/puzzle/generate.ts` removes duplicates from placement with `words.filter(!word.duplicateOf)`, but does not issue a dedicated duplicate warning. The generator shows excluded words in `components/builder/WordSearchBuilder.tsx`. However `components/puzzle/StaticPuzzleRoute.tsx` regenerates a shared puzzle and does not display `puzzle.warnings` or `puzzle.excluded` in its ready/play/print/PDF utility layouts. `components/print/PrintablePuzzle.tsx` lists only placed words, so an incomplete input could produce a superficially finished worksheet.

**Expected:** Clarify intentional deduplication, count duplicates vs unplaced words separately, and provide a prominent pre-export integrity summary. Define teacher-safe blocking vs explicit informed override for excluded words. On shared utility pages, do not silently lose a warning that was visible at creation time. Compare original input, actual placed count, word bank, answer key and completion logic for short/long phrases, duplicates, non-Latin packs and overfull grids. Do not add missing words to the printable word bank.

### WS-A05 — Curated-topic default may enable large-print mode on every published topic
**Priority P1 | Confidence: confirmed data flow; intended design unresolved.**

**Evidence:** `content/registry.ts` sets `puzzle.largePrintSuitable: true` for each published topic. `components/page/CuratedPuzzlePage.tsx` passes `largePrint: puzzle.largePrintSuitable` as the initial builder request. Suitability appears to be treated as a **user preference**, not merely the availability of a large-print option. `lib/puzzle/generate.ts` uses `largePrint` in automatic-size choices and `lib/puzzle/output-options.ts` uses it for output scale.

**Expected:** Decide whether published standard puzzles should load normal scale and offer optional large print, while large-print-dedicated routes opt in. Reproduce default states on representative easy/medium/hard and large-print pages; preserve seeded grids/print parity and don't make an unapproved blanket change.

### WS-A06 — Puzzle description/directions should always match *actual* placed directions
**Priority P1 | Confidence: confirmed possibility of mismatch; overlaps owner copyedit theme only in wording, not correctness.**

**Evidence:** `components/page/IndexablePage.tsx` hard-codes printed instructions: “Words may run forward, backward, up, down, or diagonally.” This is not conditional on `request.directions`; easy and user-customized configurations can use a subset. Published topic `difficultyNote` strings are separately authored/generated (`content/curated-topics*.ts`). Relevant paths: `components/print/PrintablePuzzle.tsx`, `content/registry.ts`.

**Expected:** Generate instruction text from the active direction set when not expressly overridden; keep vetted custom instructions unchanged. Audit descriptions that promise directions not used by the puzzle; correct *factual inconsistencies only*. Accept when printed/student-facing instructions, UI controls, PDF, answer key and actual placements agree.

### WS-A07 — User-generated puzzle links are encoded, not private, and may grow unwieldy
**Priority P1 safety/UX investigation | Confidence: confirmed design; failure likelihood unmeasured.**

**Evidence:** `lib/share-state/state.ts` serializes title, words, directions, seed, instructions and optionally hidden message into reversible base64url state embedded in a public `/play/<state>` URL. `decodeShareState` limits encoded length to 32,000 characters, but practical browser, QR, CDN and social-app URL limits may be lower. This is not authenticated storage or encryption. `public/_redirects` rewrites encoded utility paths to static HTML.

**Expected:** Test common 12/20/40/100-word lists, non-ASCII words and custom clue inputs across iOS Safari/Chrome, copy/paste, QR scanning, social messaging, Netlify redirects and canonical/noindex behavior. Explicitly explain link accessibility and that answers can be decoded; do not market URL shares as “private.” Only evaluate short-link infrastructure as a **separate optional project** if real link failures or demand are documented. **Related to owner issue 15, but this item is about transport integrity/privacy, not social-share UI.**

### WS-A08 — Add an accidental/offensive hidden-word review for classroom-safe filler
**Priority P2 | Confidence: defensible quality risk, not a confirmed offensive example.**

**Evidence:** `lib/puzzle/generate.ts` fills unused cells with pseudo-random tokens. Discovery Education's Puzzlemaker explicitly warns that random letters can accidentally form unintended/offensive words and recommends proofreading generated puzzles: https://puzzlemaker.discoveryeducation.com/word-search .

**Expected:** Design a conservative, local review/test tool for accidental sensitive strings along straight paths (especially when exporting kid/classroom puzzles), considering false positives, geography, ordinary words embedded within others and privacy. Do not pretend an automatic blocklist can guarantee clean content; add manual review of published grids. This is separate from general typos or UI copyediting.

### WS-A09 — Preserve a static-share routing and export parity test matrix
**Priority P1 verification milestone | Confidence: architecture verified; no live break demonstrated.**

**Evidence:** `next.config.ts` uses full static export; `public/_redirects` maps `/play/*`, `/print/*`, `/pdf/*`, `/answer-key/*`, `/embed/*`, `/custom/*` to static HTML; `components/puzzle/StaticPuzzleRoute.tsx` decodes state in-browser. `tests/e2e/` already has route, PDF, static-export and browser checks.

**Expected:** Before weekly releases, run actual production-equivalent Netlify rewrite tests for a representative long saved puzzle and verify no accidental 404, wrong base path, redirect leakage, URL truncation, incorrect noindex, or mismatch in seed/grid/answer key across all surfaces. Capture browser/network evidence. This is a **release-gate recommendation**, not a claimed broken route.

### WS-A10 — Verify current automated content audit catches topical/editorial truth, not only structural duplication
**Priority P1 process | Confidence: current code coverage scope verified; no claim tests currently fail.**

**Evidence:** `lib/content/audit.ts` performs substantial duplicate, meta, canonical, indexability, near-duplicate, related-link and fingerprint checks. It does not prove the correctness of factual claims in prose or direction descriptions. `content/curated-topics.ts` and `content/curated-topics-prompt6.ts` assign the fixed review date `2026-07-25` to all records in each set.

**Expected:** Retain existing successful audits; add a reviewer checklist for claims, directions, grade suitability, geographic accuracy, spelling, accidental words, and actual puzzle solvability. Confirm review dates represent real review events before exposing/updating them; do not refresh dates merely for SEO. Prefer targeted corrections with human signoff over mass copy replacement. (Owner issue 3 remains the place for broad unnatural-copy reviews.)

## 2. Market/SEO additions that are NOT already on the site

The site already publishes Christmas, Halloween, Thanksgiving, Easter, Valentine's, St. Patrick's Day, New Year, seasonal puzzles, animals, food, science, math, geography, and many more. Do **not** schedule duplicate pages for these existing topics. The `content/topics.ts` seed list also contains unreviewed draft pages such as sight words/CVC and faith topics, so “missing on search” is not “no prior code.”

| ID | Candidate | Evidence & existing-site check | Geo/intent | Priority |
| --- | --- | --- | --- | --- |
| WS-S01 | **Grade-based classroom selection**: kindergarten; grades 1–5, possibly 6–8 later; honest grade suitability filtering with genuinely suitable vocabulary | Grade K–3 filtering is explicit at ReadingVine; WordSearchZen lists grade 1–9. Site currently organizes broadly by teachers/kids/difficulty/subjects rather than distinct reviewed grade hubs. Reuse existing puzzles first. | US/Canada grade, UK year group and AU year group only where genuinely mapped | P1 experiment |
| WS-S02 | **Foundational literacy sets**: sight words, CVC, phonics/short vowels, blends, spelling-list usage | Site `content/topics.ts` includes **draft** seed names for sight words, CVC, blends; published language-arts has prefixes/suffixes/homophones, etc. Promote only when actual reviewed word lists and age fit are independently established; avoid keyword-filler pages. | US/CA teachers, homeschool; adapt wording for UK/AU | P1 experiment |
| WS-S03 | **Occasion-specific ready-to-print packs**: baby shower / bridal shower / birthday / graduation | `content/collections.ts` already has **draft** baby-/bridal-shower collections. Competing resources publish printable party sets (101 Planners, WordSearchBattle, printable blogs). Finish genuine reviewed experiences rather than minting near-duplicate fixed theme URLs. | Primarily US/CA/UK/AU casual/home | P2 |
| WS-S04 | **US and Canadian school-calendar/holiday entrypoints** | Existing Thanksgiving/Halloween/Christmas pages; consider carefully reviewed US classroom-day and Canadian school-calendar angles only where distinct search intent and vocabulary exists. Do not duplicate a currently published holiday puzzle. Potential examples to research: Canada Day, Remembrance Day/Veterans Day with respectful treatment, National Parks Week, Earth Day classroom kits. | US/CA | P2 |
| WS-S05 | **UK and Australia/NZ terminology and print discoverability** | Existing A4/Letter print support; some audience searches use “wordsearch”, “word find” or Australian “find-a-word.” Evidence from AU-focused ClueGrid and UK Words Up. Start with natural explanatory wording and clear A4 defaults/help; **do not** generate UK/US/AU duplicate doorway pages. | UK/AU/NZ | P2 |
| WS-S06 | **Teacher application pages only for genuinely different tasks**: early finisher, substitute-teacher emergency worksheets, vocabulary assessment, ESL vocabulary by daily situation | Existing teachers/worksheets/ESL hubs and draft substitute-teacher collection; competitors distinguish practical classroom jobs. Prioritize updating discovery and printable affordances; create a page only after clear new intent, unique content and reusable curated material. | US/CA/UK/AU teaching and homeschooling | P2 |
| WS-S07 | **Better seasonal merchandising of EXISTING puzzles** rather than a content rewrite | `content/discovery.ts` hard-codes spring/summer/fall/winter/Halloween/Christmas. Home lists all seasons with Halloween near the end; test highlighting seasonal routes ahead of US Halloween/Thanksgiving/Christmas, without changing article bodies, URLs, or H1s. Don't bury steady evergreen entrypoints. | Geo/calendar sensitive | P1 bounded test |
| WS-S08 | **Answer key orientation and classroom print reuse** (only if actual demand) | Already has answer keys, A4/Letter, QR, name/date, print and PDF. Competitors distinguish student vs answer-key variants and formatted teacher handouts. Investigate actual printable workflow failures, cost of ink, and multipage edge cases before adding anything; owner issue 18 owns broad output formats. | US Letter/UK+AU A4 | P2 research |

**Competitor comparisons (observed features, NOT established SEO winners):**

1. **Word Search Labs**, https://wordsearchlabs.com/ — editing, embeds, PNG/SVG/text, passcode and privacy tiers. Existing site already supports share/print/online/SVG, and owner 14/18 cover future gated features/exports.
2. **Discovery Education Puzzlemaker**, https://puzzlemaker.discoveryeducation.com/word-search — 40×40 grids, overlap options, HTML/image, letter case, and warnings about accidental words. These motivate **correctness/filler QA**, not an urgent redesign.
3. **WordSearchFree**, https://wordsearchfree.com/create/ — live printable preview, Letter/A4 and design templates. Current app already supports substantial customization; template upgrades fall under owner issue 18.
4. **TheWordSearch**, https://thewordsearch.com/ — large online library by interest, entertainment and general topics. Avoid copying its licensed/trademark-dependent/franchise content without rights review; growth should come from distinct evergreen/education intents.
5. **ReadingVine**, https://www.readingvine.com/ws-topic/teachers-schools/ — grade-filtered resources; supports testing grade-based discovery.
6. **WordSearchZen**, https://wordsearchzen.com/printable-word-searches/ — grade 1–9 entrypoints, adults/easy/hard/large print; grade mapping must be backed by actual content quality, not just labels.
7. **101 Planners**, https://www.101planners.com/baby-shower-word-search/ — themed event printables; potential visitor-intent signal, not verified volume.
8. **ClueGrid AU**, https://cluegrid.org/find-a-word-maker — supports alternate regional term “find-a-word”; scope narrowly and avoid doorway pages.

**Do not infer competitive performance** from menu counts, claimed number of puzzles, search engine appearance, or competitor wording. A giant AI-generated archive is not the recommended strategy.

## 3. Analytics-first validation in Western higher-ad-yield markets

**Primary working geographies:** United States, Canada, United Kingdom, Australia; expand only with actual monetization/conversion/country evidence. These are test markets, not a factual claim that every Western page has high RPM. Compare **net revenue per 1,000 sessions by country/device/page**, when available, alongside Search Console clicks/impressions/CTR/position. Organic traffic and ad earning can diverge materially.

Before picking WS-S01–08, export (no subscription needed if owner manually exports) the latest **28 days and comparable prior window** from Google Search Console, preferably 3–12 months for seasonal analysis; top landing pages and queries, country and device; Bing pages/queries if available; GA4 engaged sessions and AdSense page/country RPM where available. Preserve raw exports outside public deployment. For each proposed topic, log exact current ranking page, query intent, existing coverage, cannibalization risk, estimated editorial work and source of demand. Rank by (1) technical correctness and loss prevention, then (2) proven underserved impressions and CTR opportunity, then (3) editorial fit, then (4) observed session value. No fabricated keyword volumes, CPC or RPM.

**Measurements to guard:** organic clicks/impressions/CTR by page + geo, index coverage, speed/Core Web Vitals if available, page-specific engagement, print/PDF success, excluded-word frequency, ad viewability and session RPM. Compare against control pages and seasonal shifts; don't interpret a one-week volatility spike as a permanent ranking effect.

**Google policy:** Prioritize original, reliable, people-first usefulness, not mass AI copy or thin/duplicative landing pages. Reference: https://developers.google.com/search/docs/fundamentals/creating-helpful-content and https://developers.google.com/search/docs/fundamentals/using-gen-ai-content .

## 4. Optional experiments (P3 / defer)

- **Grid/puzzle variation presets** only if users ask for a different task, e.g. picture-clue worksheet for emerging readers. This requires real content assets, licensing/accessibility QA and must not turn existing pages into image-heavy distractions.
- **Teacher print packs** combining a small set of reviewed puzzles with a cover sheet and answer section. Investigate print quality and demand before building bulk generators.
- **Content corrections feedback widget** referencing exact canonical puzzle IDs; avoid public spam/form service unless moderation and privacy can be handled. Owner 3 owns the copyediting itself.
- **Advanced authored hidden-message or classroom clue modes** require proof that the existing `answer | clue` / hidden-message pipeline has robust validation before expanding; do not duplicate owner 18.
- **Content cohort experiments**: small number of manually reviewed grade/event topics with a defined before/after observation window, not automatic publication of hundreds of drafts.

## 5. Suggested weekly release lanes (NOT commitments)

| Tentative release | Bounded scope | Required gate / acceptance |
| --- | --- | --- |
| **W1 — puzzle correctness** | WS-A01 empty directions; A02 source/runtime inventory and discrepancy **diagnosis**; A03 explicit external-input bounds (small scoped implementation after design approval) | Unit + browser + seeded/URL compatibility matrix; no published grid changes |
| **W2 — worksheet integrity** | WS-A04 duplicates/excluded warning behavior; WS-A06 instructions vs directions; review WS-A05 large-print default with owner | Print + PDF + answer key + play show same placed set; no accidental page/content changes |
| **W3 — reliability and auditing** | WS-A09 production-equivalent route tests; WS-A10 editorial/direction checks; WS-A07 link-length study | Netlify redirect checks, QR iOS/Android, CSV/TXT/Unicode inputs; existing test suites remain green |
| **W4 — owner UI issues** | Owner README: choose **one** scoped cluster (e.g. branding/icons OR header/nav), not entire design overhaul | Explicit screenshots, manual mobile/desktop acceptance; no SEO copy/URLs changed |
| **W5 — low-risk seasonal experiment** | WS-S07 seasonal existing-page promotion, conditional on recent GSC evidence; owner internal linking issue only if separately scoped | Predefined comparison window, noindex/canonical/sitemap safety, no new pages |
| **W6 — content pilot** | One to three genuinely reviewed pieces or one useful hub in WS-S01/S02, only if content + demand validation passes | Human fact-check, actual solvable puzzle, unique search intent, useful print output, no near-duplicate |
| **W7+ — selectively additive** | WS-S03 party collections and/or region vocabulary research; advance only proven pilots | Do not publish placeholder drafts; measure by Western country/device and protect incumbent pages |

**Ordering is provisional.** Owner's existing issue list can supply alternative weekly releases. W1 may itself require splitting A02 and A03; never bundle a parser migration, seeded-puzzle behavior change and large-scale content launch. Avoid pushing a risky fix purely to hit a release date.

### Required per-release guardrails

1. Compare current baseline, deployed output and GSC performance before selecting work; annotate touched templates, URLs, traffic and rollout risk.
2. Reproduce any defect and add a failing test first where feasible; source analysis alone is a finding, not proof of runtime failure.
3. Protect stable seed/grid/answer-key/QR/share equivalence. Snapshot test a representative sample of *existing* published puzzles and old encoded links.
4. Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run audit:static-host` and targeted e2e/visual tests as applicable. Audit responsive mobile, keyboard, PDFs (Letter + A4), and print preview.
5. Check no new user-created or utility route is accidentally indexable, no canonical mismatch, and no accidental sitemap/redirect regression.
6. Use before/after screenshots for design work, URL+seed snapshots for engine work, and metadata/copy diff for SEO work.
7. Do **not** mass rewrite successful landing-page titles, body text or canonical URLs; proofread only identified factual, typographic or nonsensical wording, with a focused diff.
8. Prefer small reversible commits and staged/canary deployment when practical. **No issue in this document is blanket permission to implement.**
9. After each release, mark items: `proposed` / `investigating` / `confirmed` / `approved` / `implemented` / `validated` / `deferred`, with date, evidence, commit and GSC follow-up.

## 6. Audit boundaries and unanswered questions

- Live public HTML and repository code were inspected; the site was **not** exercised in an authenticated interactive desktop/mobile browser or through local test/build execution in this pass. Issues marked “confirmed source” need runtime reproduction.
- No current Search Console, GA4 or AdSense account data was readable (GSC Wizard denied access with subscription required); keyword and audience suggestions are **hypotheses** pending actual demand/revenue verification.
- No search-ranking, impressions, clicks, CPC, CPC-by-niche, keyword difficulty, competitor traffic or RPM figure is asserted.
- The live site, search indexes and repository may be briefly out of sync after deployment; verify current published output when implementing.
- Decide explicitly with the owner: (a) published medium direction policy; (b) whether all curated topics should default to large print; (c) blocking vs warning on incomplete printable puzzles; (d) privacy expectations for state-encoded share links; (e) grade/region editorial criteria.
- Record future discovered defects in **new files** named `ai-issues/bug-<slug>.md` and opportunities as `ai-issues/opportunity-<slug>.md` if the index becomes large; keep owner README unchanged and treat this file as the separate audit/backlog.
