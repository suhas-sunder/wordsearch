# WS-FT-01 — Footer branding, icons, and legal presentation

- Track: A, fast-track visual improvements; no Friday hold required.
- Owner issues: [1, 2, 8](../../ai-issues/README.md). These issues are partially addressed in the bounded footer surface; sitewide icon work remains queued.
- Status: validated; awaiting independent review and approval; no deployment authorized before that gate.
- Intended delivery: as soon as the independent review gate approves the small visual package; no Friday hold or functional weekly changes included.
- Baseline: `1337c56f332e610d242cadd455730c2e0bad5542` (`origin/main`).
- Branch: `fasttrack/2026-11-05-brand-footer`.
- Commit: the implementation commit containing this record; exact SHA is in the PR and handoff.
- Review: [branch](https://github.com/suhas-sunder/wordsearch/tree/fasttrack/2026-11-05-brand-footer), [PR lookup](https://github.com/suhas-sunder/wordsearch/pulls?q=is%3Apr+head%3Afasttrack%2F2026-11-05-brand-footer).

## Classification and scope

The footer now reuses the existing header's exact logo artwork through a shared
`BrandIdentity` component. The header's visible appearance and home link remain
unchanged. Existing Lucide icons label the five footer Tools links decoratively;
text remains the accessible link name. Existing Privacy, Terms, and Copyright
links move into a separate bottom row without changing their text or destinations.
All presentation rules are scoped to the footer. No new client surface, dependency,
site navigation destination, editorial text, puzzle behavior, URL, SEO data, or
advertising rule is introduced. This qualifies as Track A under the owner's
November 5 instructions. WS-A01 stays on its independent weekly review branch.

Changed application files:

- `components/layout/BrandIdentity.tsx`: shared existing logo markup.
- `components/layout/SiteHeader.tsx`: reuse existing artwork without a visual change.
- `components/layout/SiteFooter.tsx`: logo, decorative Tools icons, legal row.
- `app/globals.css`: scoped footer alignment and row presentation.

Evidence: `tests/e2e/footer-presentation.mjs` compares a pristine main export built with the same Node 22/dependencies
to the target export at 320, 390, 768, and 1280 CSS-pixel widths on home,
About, and a published puzzle. It checks identical main content, editorial
headings, SEO metadata, structured data, footer link text/destinations and ad
placement DOM; consistent branding, icon hiding, no horizontal overflow, footer
axe results, print exclusion, and browser-measured CLS at or below 0.1. `meta[name=next-size-adjust]` is excluded because
it is a framework-generated build marker that differs across build environments;
all authored and SEO metadata remains compared. Screenshots are written outside
the repository under `%TEMP%/wordsearch-fast-track-footer` by default.

## Validation evidence

Run on Node 22.23.4 using the existing lockfile and libraries:

| Command | Result |
| --- | --- |
| `npm ci` | Passed; reported 20 dependency advisories (7 moderate, 10 high, 3 critical) from unchanged dependencies; no automatic fixes |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed: 17 files, 113 tests including puzzle, solver, share, PDF, SEO, content and advertising unit safeguards |
| `npm run build` | Passed: full static export, 334 generated pages; existing Next ESLint-plugin detection warning remains |
| `npm run audit:static-host` | Passed: 217 sitemap pages, 35 permanent redirects, six decoded utility shells; only `out`, no runtime plugin/Functions/Edge Functions |
| `npm run audit:content` | Passed: 344 records, 217 indexable, zero audit warnings |
| `BASE_URL=http://localhost:3102 npm run test:a11y` | Passed: 14 archetypes, mobile/desktop, skip link, reduced motion, 200% zoom, no serious/critical axe issues, surrounding undersized controls, runtime errors or document overflow |
| `BASE_URL=http://localhost:3102 npm run test:ads` | Passed: enabled-mode mock regression on nine eligible routes at five viewports and 14 ad-free routes; does not certify real ad-network compliance |
| `BASE_URL=http://localhost:3102 npm run test:preview` | Passed: answer replacement, print composition, keyboard sharing, one/two-page PDF, object URL cleanup, eight widths |
| `BASE_URL=http://localhost:3102 npm run audit:pdf` | Passed: real two-page A4 landscape PDF, title/words, answer page, safe filename, embedded QR |
| `BASE_URL=http://localhost:3102 BASELINE_URL=http://localhost:3117 node tests/e2e/footer-presentation.mjs` | Passed: four widths × three archetypes; baseline content/SEO/link/ad parity; CLS <= 0.1, footer axe and print checks; before/after footer screenshots inspected; sticky navigation is hidden only in full-height footer screenshot captures |
| `git diff --check` | Passed |
| `BASE_URL=https://6ad02ce00c0ae8cfa3ced751--ilovewordsearch.netlify.app npm run audit:routes` | FAILED on unchanged frozen production baseline: 212 issues; 209 disabled-placeholder assertions plus three noindex routes with ad slots |

PowerShell runs set `$env:BASE_URL` before the corresponding command. Local
export was served with `PORT=3102 npm run start` (PowerShell environment syntax).

The existing route-audit failure is reproduced independently on the unchanged
published deploy, so it is not caused by this visual package. No existing tests,
ad components, placeholder policy, or SEO behavior were weakened to silence it.
The three flagged noindex routes are `/categories/health-and-wellness-word-searches`,
`/collections/brain-training-word-searches`, and
`/guides/how-hidden-message-word-searches-work`. Resolution requires a separately
scoped investigation respecting the protected advertising directive.

Initial new-test attempts caught harness problems: the metadata comparison
included the framework-only marker, and Axe required an explicit browser context.
Both were corrected in the new harness; application checks were not relaxed.
An experimental absolute footer-start comparison found font-timing differences
between otherwise identical local main/candidate builds: `next/font` uses
`display:optional`, so a resource-loaded font may still have missed its first-paint
window. Compiled CSS/font faces were identical outside the four intended footer
rules. Absolute document height is not cumulative layout shift. The final harness
therefore measures actual unexpected shifts with `PerformanceObserver` and retains
a CLS <= 0.1 assertion, alongside the content/style-scope/visual checks. It does
not change font behavior in application code. A pristine main worktree is served
at port 3117 and the candidate at 3102. An initial attempt to use port 3103 failed
with `EADDRINUSE`; its existing server was left untouched. Targeted
metadata/content/link/ad comparison also passed against the frozen live production
reference before the local baseline comparison. Full-height footer screenshots
hide sticky navigation only during screenshot capture; normal application and
accessibility checks use the unmodified page.

## Deployment and rollback references

Production site: https://www.ilovewordsearch.com

Netlify project ID: `66aedb4c-b210-45ca-b775-d338d4077dc6`.
Existing publish workflow builds static `out` from main with Node 22. No production
branch, merge setting, deployment configuration or automatic publishing rule was
changed for this package.

Previous/current production deployment:
[6ad02ce00c0ae8cfa3ced751](https://app.netlify.com/projects/ilovewordsearch/deploys/6ad02ce00c0ae8cfa3ced751),
source SHA `1337c56f332e610d242cadd455730c2e0bad5542`,
[frozen reference](https://6ad02ce00c0ae8cfa3ced751--ilovewordsearch.netlify.app).
This is the known-good visual rollback/source reference. No rollback was performed.
If a published regression occurs, revert the isolated UI commit on a reviewed
branch and redeploy the known-good static source through the authorized workflow.
Do not change puzzle, SEO or advertising behavior as an emergency cosmetic fix.

The owner clarified the permanent workflow after initial inspection: finish review
branches only. The connected ChatGPT integration independently reviews and
coordinates approved releases. Never push or merge to main before that gate, and
never enable automatic merging. Every main push automatically triggers the
production deployment. After an approved, validated change is merged, observe
that automatic deployment; do not make a duplicate CLI/manual deployment.

An earlier non-production CLI attempt failed before creating any deploy with
`Unauthorized: could not retrieve project`. A browser fallback was stopped by
Computer Use because it could not determine the Windows browser URL confidently
enough to enforce policy; no browser action occurred. These are historical failed
attempts, not current blockers: no CLI authentication or manual deployment is
needed under the clarified workflow. No further auth retries were attempted.

Follow the permanent release rules in `AGENTS.md` and the two-track plan in `docs/releases/README.md` once the companion release-management PR is reviewed. Main and production stay at the exact existing SHA until independent approval.
Record the approved merge SHA, automatic deployment ID/URL, production route smoke
and footer visual results in a linked follow-up record once the connected review
workflow completes. Never report a preview or local export as production.

## Limitations and next package

- Production delivery and post-deployment checks remain unexecuted pending independent review/approval and the resulting automatic main deployment; this is the required gate, not an authentication blocker.
- Real-device checks and real ad-network rendering were not exercised; protected lifecycle, placement and source were left unchanged.
- Main content and metadata match the production baseline in the three targeted browser archetypes; full content/SEO/static inventory tests also pass.
- Existing dependency advisories and baseline route-audit issues remain separate work; no new dependencies or lockfile changes.
- Subsequent Track A work should address another bounded existing icon surface; broad header/navigation, dark mode, SEO, exports and puzzle changes belong to Track B.
