# Issue 117 editorial advertising eligibility

Owner-approved application of [the existing draft eligibility rule](EXCELLENCE-AD-ELIGIBILITY-DECISION.md) to the category, collection and guide URL families. Starting commit `a057692afaadf4d530d1dfe60b0fcd351e473a7e`. The worktree is under local review.

The three templates now use their canonical registry record to select the ad layout. A record must be published and indexable to receive the family template. The shell, below-header placement and supporting-content placement use the same selection. The [affected route fixture](../../tests/fixtures/editorial-ad-routes.ts) enumerates two categories, eight collections and two guides.

The shared collection heading has a separate wording edit. “Check the difficulty on each card to find a puzzle that suits you” replaces the record-count sentence when there are puzzle cards. Empty collections omit that tip.

## Verification

- `npx vitest run tests/unit/editorial-ad-eligibility.test.ts` passed 18 tests on Node 22 with `NEXT_PUBLIC_ADSENSE_ENABLED=on` and again with `off`. The [unit suite](../../tests/unit/editorial-ad-eligibility.test.ts) matches the static route parameters against the exact 12 drafts and renders them, plus one published control per family. It also exercises missing, unpublished and unindexable records.
- Against the final reviewed production export at `BASE_URL=http://127.0.0.1:3543`, `npx tsx tests/e2e/editorial-ad-eligibility.ts` passed all 52 static output checks. The 12 draft pages retain their canonical URLs, `noindex, follow`, and sitemap exclusion. Each of the 40 published pages renders six placements and four eager live units. In Chromium at 390 and 1600 pixels, the 24 draft cases had zero AdSense loader nodes, units or provider attempts. The six published controls each attempted one intercepted loader request and initialized the expected responsive units. The external `issue117/ads/reviewed-editorial-ad-eligibility-live.json` contains the route inventory, HTML SHA-256 values, and browser results.
- `npm run audit:routes` passed its original assertions across 217 canonical sitemap URLs, 35 redirects and aliases, and 11 representative noindex states. `npm run test:ads` passed in enabled mode across nine eligible routes at five viewport sizes and fourteen ad-free routes. It covers simulated pending, blocked, unfilled, first-fill and later-fill behavior, responsive sidebars and suppression latching.
- `npx tsc --noEmit --incremental false`, targeted ESLint and `git diff --check` passed.

The protected [advertising directive](../../ai-issues/AD-PLACEHOLDER-SAFETY.md) remains the release acceptance standard. Production-equivalent checks with genuine creatives and DOM stacking evidence are pending.

Review the rollout against the tagged known-good deployment and source SHA. Rollback restores that deployment, then reverts the three route template selections and the editorial template helper in a reviewed branch. The separate collection wording edit can be reviewed independently.
