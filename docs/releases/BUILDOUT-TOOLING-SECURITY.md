# Security — development tooling remediation

Review-only child of direct Zod migration PR #39 (`67ae6e2`). No production release authorization.

The post-Zod full audit reported16 development findings (seven moderate,seven high,two critical). Compatible lockfile patches remove the vulnerable yaml/brace and Puppeteer/BiDi chains. Vitest4.1.12 replaces3.2.7, removes vulnerable Tinypool and updates mocker/Vite; PDFjs6.5.438 replaces5.7.284. A narrowly scoped override pins typescript-estree's minimatch dependency to11.0.5: upstream's latest parser still requests10.x while [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) is fixed beginning11.0.1. Other minimatch3 users stay unchanged. This installs patched code, not an audit suppression. Remove/re-evaluate the override once upstream adopts the patched major.

The [official Vitest migration guide](https://v4.vitest.dev/guide/migration.html) and [PDFjs releases](https://github.com/mozilla/pdf.js/releases/tag/v6.5.438) were checked. Actual migrations were required: Vite8 ignores esbuild JSX configuration in favor of Oxc, so Vitest now sets automatic JSX runtime under oxc. PDFjs6 removes destroy from the document proxy; offline PDF inspection and PDF tests/browser helpers retain the loading task and call its destroy method. PDF extraction and all existing assertions stay intact. A parser-specific glob regression resolves the exact overridden dependency and checks default-project allowlist dotfiles/directory boundaries.

Changed: package/lock, vitest config, offline staged PDF inspector, two PDF unit helpers, two browser PDF helpers, glob regression and this evidence. Next15.5.29,React19.1.1,ReactDOM19.1.1,pdf-lib1.17.1 and application/generator/ad sources stay unchanged. Transitive tooling/native optional dependencies legitimately change in the lockfile.

Validation November6,2026:
- Isolated `npm ci` PASS, no shared dependency directory mutation. First pre-migration run FAILS5suites/10tests and TypeScript on document.destroy plus JSX parsing; these were fixed with the actual APIs/configuration, without assertion changes.
- Node22.23.4 (matches Netlify22, PDFjs requires>=22.13): lint/typecheck PASS, Vitest256tests/33files PASS including complete structured content,150 published fingerprint snapshots, seeded grids/answers and pack/staged PDF extraction. Existing snapshot file was rewritten with line endings only, then restored.
- Full `npm audit` PASS zero vulnerabilities; `npm audit --omit=dev` PASS zero. No exceptions, ignored advisories, disabled assertions or legacy-peer install flags.
- Existing security-parent static export (same application versions) at3294: real PDF visual/extraction audit, preview toolbar (eight responsive widths, answer separation, object-URL cleanup), six share-route PDF/grid/answer/QR parity and classroom5/10 pack browser workflow PASS on Node22. Classroom stable assignment and answer grids, errors/mobile and noindex remain checked.
- Lighthouse compatibility smoke against that export with installed Google Chrome: performance98/accessibility100/best-practices77/SEO100. Existing cookie/inspector best-practices failure remains a release gate. First bundled Playwright Chrome attempt returned ERR_ABORTED; installed Chrome uses the same fallback as the existing full audit. This one-page smoke is not a full Lighthouse pass.

Risks: major tooling migration needs combined validation of newer sibling measurement consumers. Search for PDFDocumentProxy.destroy in later integrated code and retain loading-task cleanup. Supported build environment stays Node22. Full device/provider/editorial gates and existing protected-ad eligibility decisions remain unchanged. Exclude/revert this child to roll back tooling, which restores development advisories. No main push/merge, auto-merge or production deployment.

Exact updated Node22 production build: PASS335pages. Static-host audit of that export PASS217sitemap/35redirects/6shells. Existing Next ESLint-plugin warning remains. No build check was skipped.

Exact updated export3296: 14-archetype mobile/desktop accessibility PASS (skip link, reduced motion,200percent zoom,no serious/critical axe findings or overflow), plus preview/PDF toolbar eight-width regression PASS. This verifies compiled CSS after transitive tooling/native updates.
