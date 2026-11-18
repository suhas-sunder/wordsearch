# iLoveWordSearch — final product quality and acceptance contract
Prepared 2026-11-06 · Applies to the complete autonomous buildout, review and production signoff.

## End state: a finished, polished website, not an endless backlog

The owner wants **a fully polished, reliable, visually coherent, feature-complete guest-first iLoveWordSearch product**. Producing dozens of PRs, technically valid draft puzzles, passing unit tests or documentation does not meet this goal.

At the end, users should be able to find, create, solve, share, print, and save/revisit supported word searches with a consistent, accessible interface. Teachers should be able to prepare usable printable sheets and answer packets. Existing successful SEO assets and monetization should remain safe. The product should be largely maintainable through a **separate editorial publication queue** in 2027–2028, without another large rebuild for each new puzzle.

Important boundaries: authenticated accounts, paid tiers, real-time collaborative solving, user-uploaded image/OCR and services requiring paid APIs or owner security/privacy decisions are separately gated potential phase-two products. Do not call those implemented, but do not let them prevent completion of the fully functional free/guest site. Their ultimate GO/NO-GO still requires an owner decision.

Companion plans: [master](./2026-11-06-MASTER-BUILDOUT-AND-CONTROLLED-RELEASES.md), [candidate catalog](./2026-11-06-buildout-catalog-and-release-queue.md), [2027 full-year Friday calendar](./2026-11-06-2027-WEEKLY-EDITORIAL-CALENDAR.md), [Christmas](./2026-11-06-growth-opportunities-and-staged-publishing.md). Owner issues: ai-issues/README.md. Advertising and git rules: AGENTS.md and the protected ad guidance.

## Four independent completion gates

1. **CODE COMPLETE:** every authorized, feasible free/guest capability implemented or explicitly justified as not worth implementing, with tests and actual artifacts. No half-wired actions, dead controls, bogus “supported” languages, silent invalid-input fallback, or prototype shells represented as finished features.
2. **PRODUCT ACCEPTANCE READY:** frozen combined candidate passes complete relevant QA, visual review, printed output, keyboard/a11y, ad/SEO/security and integrity checks. Manual-device checks not performed must be identified, not marked passed.
3. **PRODUCTION ACCEPTED:** independent owner/reviewer signs off exact SHA, risk dispositions and rollback; Netlify production SHA/deploy verified; public smoke checks pass. A preview-ready draft is not production approval. Codex cannot independently merge or deploy to main without authorization.
4. **CONTENT EDITORIAL APPROVED:** separate per-puzzle/collection status with unique purpose, originality, fact review, print and answer parity, copyright, canonical ownership and usefulness. A product release does not auto-approve its draft content. The 2027 calendar is optional release windows, not 53 mandated pages.

## Release-blocking product acceptance matrix

### F0 — PR integration, regression baselines and source integrity
- Reconcile PR #15 UI, #16 weekly, #17–#28 and newer branches without duplicate commits or missing changes. #28 includes some but not all later PRs. Include measured layout #27, print metric #25, evergreen source #26 and subsequent navigation/resume safely and rerun **combined exact-SHA** tests.
- Correct PR #15 reported CLS inconsistency (mobile search before 0.342883, after 0.377275 vs test gate after <= before+0.01). Verify repeated baseline/candidate runs without weakening acceptance.
- Maintain exactly the reviewed 150 published puzzle fingerprints, canonicals, metadata and redirects unless a separate reviewed migration is approved.

### F1 — Professional design and navigation
- Use a coherent design system with consistent iLoveWordSearch branding, Lucide action/category icons, type hierarchy, spacing, readable buttons and informative status/error states. No odd labels, misaligned blocks, clipping, overflows, excessive visual clutter or unresolved owner-flagged design issues.
- Accessible right-aligned header nav, More menu, effective search without blocking content/ad areas; search browses published puzzles/tools/categories/collections with useful keyboard, empty/no-result and no-JS handling. Preserve existing URLs before retiring an old search view.
- Useful sitewide/personalized search and All Tools discovery where appropriate, meaningful page-specific FAQ answers where useful, thoughtful related internal links and selective relevant cross-site links (not a footer link farm).
- Truthful About/author page, real social links if supported, professional legal/copyright footer; no invented qualifications or automatically falsified review dates.
- Fully implemented **system-aware light/dark theme toggle** with persistence and complete coverage for controls, search, overlays, cards, error states and solver. Printing remains light/high contrast.
- Visual QA matrix on home, search, generator, puzzle, hard hub, regular collection, category, guide, specialty, classroom pack, PDF tool, About/legal, error/404, mobile and desktop. Minimum widths 320, 390, 768, 1024, 1280, 1600 pixels, plus zoom/landscape. Keep screenshot evidence and actionable unresolved UI defects.

### F2 — Actual puzzle and solver quality
- Thoroughly test all supported settings: difficulty, direction selection, overlap, auto/manual dimensions, word lists and clues, filler mode, hidden message, multiple alphabets, seed repeatability, large print, instructions, answer keys, export choices, and editable recovery on invalid requests. Unsupported actions must visibly explain their limitation.
- All real interactions work with mouse, touch and keyboard; correct solved state, measured completion time, restart/replay and responsive feedback; do not leak private puzzle content in share images or telemetry.
- Guest saved/resume and presets are opt-in and versioned, survive reload, handle corrupt/old state and do not require an account. Avoid making unsupported cloud storage promises.
- Normal requests perform reliably and pathological external/state inputs fail safely before freezing the browser. No stale puzzle/PDF/output after error. Preserve legacy puzzle fingerprints and old share links wherever feasible.

### F3 — Printable product and classroom workflow
- Single puzzles and 5/10 pack PDFs are deterministic, match actual placed words and answers, work on Letter and A4, and display professional grid/word-bank/title/name/date/instructions/answers layouts without clipping or overlap.
- Robust fit/measurement for long titles and crowded banks; actionable errors rather than silent truncation; acceptable file sizes and download state. Verify real generated PDFs with tests and visual inspection.
- True large print must enlarge readable grid and **word bank**, not just page labels; measure actual font/cell size, printable paper margins and high contrast at 100% scale. No unsupported "24-pt" or low-vision certification.
- Teacher and student packet options, answers-last/appropriate ordering, repeatability, local-only input, word/excluded/duplicate validation. No ads or site chrome in print.
- Evaluate owner-requested HTML/other export formats for clear actual user value. Implement if viable and useful; otherwise document a reasoned no-go. No dummy export buttons.
- Physical Letter/A4 printer checks are manual acceptance gates. Simulation and PDF.js geometry cannot be described as real printer approval.

### F4 — Content and SEO editorial governance
- Every new potential URL must pass distinct-intent, duplicate/near-duplicate and review of all existing 150 plus unpublished sibling candidates. No keyword-variant URL sprawl, year-suffixed holiday near-duplicates, fake “large print,” thin collection or AI filler.
- Technical stage and actual human approval separate; source-only drafts remain absent from public content registry, static export, sitemap and crawlable links until selected. Never silently auto-activate all staged inventory.
- Preserve published page content unless owner approves specific correction; make the 2027 release calendar a configurable release inventory, not a cron job that publishes every Friday.
- Real Google/Bing cohort data evaluated separately; no fabricated traffic, sessions, search volume, RPM or implied causal lift. Report indexed page state and clicks excluding dominant hard hub as accurately as available.

### F5 — Accessibility, performance, security, advertising and operations
- Keyboard-only navigation, focus, labeling, screen reader critical paths, reduced motion, zoom, contrast, mobile interactions; automated axe is necessary but not sufficient. Record physical Safari/Android/browser/device test coverage honestly.
- Complete sitewide combined lint/typecheck/unit/content/static-host/browser/real PDF/preview/accessibility/ad/SEO/security checks, frozen build and real netlify preview. A skipped or interrupted check is NOT a pass.
- Resolve or specifically risk-disposition high/critical exploitable production dependency findings, including existing high Zod advisory, without blindly forcing major upgrades.
- The three existing repo ad-eligibility draft/noindex findings require authorized fix or documented owner acceptance. They are not proved AdSense violations. Keep the first-filled-ad-removes-placeholder lifecycle, other ad geometry and print ad-free protections unchanged without independent permission.
- Diagnose/prevent new Lighthouse/CLS/CWV regressions; baseline Lighthouse Best Practices 77 and observed high hydration CLS require honest measured resolution or explicitly approved written disposition, not threshold weakening. Maintain page performance and no giant client-side bundle for every static puzzle.
- Independently approve production merge, Netlify SHA and deploy ID; smoke-test actual public routes and known-good rollback. No auto-merge/production deployment merely from agent authority.

### F6 — Optional product roadmap (must not impersonate delivered features)
- Waitlist, accounts, hosted history, live co-solving, classrooms, leaderboards, subscriptions, OCR recognition and community publishing require provider/cost/privacy/moderation and security decisions before implementation.
- Produce bounded research/specification, cost and a specific GO/NO-GO. Keep the guest-first flagship finished and polished; don't add speculative infrastructure in order to mark this lane “complete.” A user-approved phase-two project can begin separately.

## Acceptance tracking contract

Codex shall maintain a human-readable and machine-verifiable matrix across F0–F6 and every individual user issue. Each feature reports status **NOT STARTED / IN PROGRESS / TESTED / MANUAL ACCEPTANCE PENDING / BLOCKED / DONE / OWNER-DEFERRED**, plus PR/SHA, validation evidence, visual and PDF references, owner decision if needed, and any remaining defect. A green test doesn't imply manual approval; a written spec is not a built feature.

**Stop rules:** Do not stop while there is further authorized feasible F1–F5 development, test repair, usability or UX polish to execute. When one lane is blocked, use another. Do not repeatedly prompt the owner during unattended work for ordinary engineering choices; document bounded, safe defaults and decisions. Do not use the absence of human content approval as an excuse to stop source-only development.

**A completion report must identify:** exactly what was implemented, what the owner can try, screenshots/real PDF outputs, what changed from the baseline (including public URL zero-diffs), open defects, unexecuted manual checks, release blocker/owner approvals, the full set of durable branches/PRs and rollback instructions. Only the owner and independent release operator can elevate PRODUCT ACCEPTANCE READY to PRODUCTION ACCEPTED.

## Execution sequence

1. Finish current active workers, consolidate the new PRs and update the readiness ledger. Do not interrupt healthy work.
2. Create and maintain the F0–F6 acceptance matrix and a prioritized exact owner issue checklist. Continue with F0 integration and its existing three route/security/CLS issues.
3. Work through F1 design/navigation/dark-mode/template polish with source-backed visual review on every archetype; don't rewrite successful indexed articles.
4. Complete F2 generator/solver, safe saved state, real sharing and F3 classroom/large-print/PDF outputs and tests.
5. Complete F5 operational/security and production-ready release handbook. Preserve advertising policy and defer only genuinely externally gated decisions.
6. In parallel, keep building and QA'ing F4 source-only 2027 content inventory. Publishing waits for separate editorial approval; no forced URL output.
7. Continue until the feasible free/guest backlog is actually completed and independently reviewable. Do not merely declare a broad plan “done.”

## Outside standards

Google Search Central [people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies), [indexing FAQ](https://developers.google.com/search/help/crawling-index-faq). A slow cadence by itself is not an anti-spam guarantee; real originality and useful product value are the governing criteria.
