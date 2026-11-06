# WP-08b — Compatible dependency patch candidate

Status: compatibility plan before implementation. Based on PR #2 `c6539992f95ea584498329bc319ac38edbbe160e`; independent review required, no production deployment or merge.

Candidate: Next and matching eslint-config-next 15.5.29, sharp override 0.35.5, and lockfile resolution of nanoid 3.3.20 and source-map-js 1.2.2. npm registry reports Next requires Node >=20 among supported versions, sharp >=20.9, and these versions support the project's Node 22. Keep the existing postcss override. Zod 3 remains an unresolved high advisory: its fixed 4.x version is a major migration needing separate review. No force audit fix or dependency removal.

Validate clean Node 22 install and compare full/production audit counts and dependency trees; lint, typecheck, all tests and 150 published fingerprints, content audit, production build, static host, browser/print/PDF/a11y and route regressions. Any changed grids, static export, routes or metadata block the patch. Local tests do not establish provider behavior. Record advisory conditions and baseline/new audit counts after testing.

## Candidate and audit comparison

`package.json` and lockfile update Next 15.5.22 -> 15.5.29, matching eslint-config-next and its plugin, and explicit sharp override 0.35.3 -> 0.35.5. The lockfile updates nanoid 3.3.16 -> 3.3.20 and source-map-js 1.2.1 -> 1.2.2. Native Next/sharp platform packages follow their parent versions. Existing PostCSS 8.5.23 override is unchanged. Registry inspection confirmed the Node 22 compatibility described above; the lockfile retains unrelated fastq at its existing version.

Clean Node 22 `npm ci` succeeded. `npm audit --json` changed from 20 findings (7 moderate, 10 high, 3 critical) to 16 (7 moderate, 7 high, 2 critical). `npm audit --omit=dev --json` changed from five (4 high, 1 critical) to one high, Zod 3.25.76. Counts are time-sensitive package-graph findings, not a guarantee of safety. The full graph retains high/critical tooling findings including pdfjs-dist, Vite, Vitest, tinypool and others. No dependency scanner finding was suppressed; `npm audit fix --force` was not run.

Relevant maintainer advisories include [Next SVG image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [Next server actions](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r), [sharp librsvg](https://github.com/lovell/sharp/security/advisories/GHSA-wq5f-xc86-pv6w), and [sharp libheif](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c). The Zod advisory requires a [4.6.6 or newer fix](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), a major upgrade. Application-source search found no direct Zod import, but removal or migration requires a separate reviewed compatibility investigation.

The static export and no-functions checks do not show a live Next image-optimization or server-action endpoint. That limits the evidence of those network attack paths in this deployment; it does not establish safety of build-time dependencies, untrusted inputs, other hosting, or a future runtime configuration. Verify the actual provider configuration independently. Keep Zod and the remaining development findings open.

## Validation

- Node 22 `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` (131 passed including the existing 150 published fingerprints), `npm run audit:content`, `npm run build`, and `npm run audit:static-host` passed; 217 sitemap pages and 35 redirects were checked. Next emitted the pre-existing ESLint plugin warning. No snapshot was regenerated.
- On the static export at port 3242, `npm run test:preview`, `npm run test:a11y` and `npm run audit:pdf` passed, including responsive preview, 14 mobile/desktop archetypes and a two-page A4 landscape PDF with embedded QR.
- `BASE_URL=http://127.0.0.1:3242 npm run audit:routes` failed with 212 issues, matching the untouched baseline: 209 indexed live ad wrappers reported by the old placeholder check plus three noindex routes rendering ad slots. WP-08a separately investigates the audit and preserves the three noindex findings. This unresolved failure blocks production approval; no advertising implementation or audit was weakened here.
- No formatter script exists; `git diff --check` is the whitespace check. The local host is a simulation, not a Netlify or physical device validation. Production preview, full release review, and the remaining security findings are outstanding.

`BASE_URL=http://127.0.0.1:3242 npm run audit:lighthouse` failed its best-practices guardrail: 77 for each of eight mobile and three desktop cases, with third-party-cookie and inspector-issue diagnostics, matching the earlier baseline class. This remains a release gate; this candidate does not change the ad lifecycle. Local Lighthouse is not field or provider evidence.

First `npm run test:e2e` attempt passed direction checks but failed in `browser-smoke.mjs:492` after a 30-second wait for the touch solver's Begin puzzle button. The cause was not established and it is not classified as a baseline failure. Ten independent fresh mobile/touch contexts using the same horizontal fixture returned 200 and showed Begin without page errors; `SOLVER_ONLY=1 node tests/e2e/browser-smoke.mjs` also passed solver interactions, including touch (its generic output mentions the route matrix, which this mode skips). A full unmodified retry was started to cover the complete matrix and advertising checks; results follow separately.

The full unmodified `npm run test:e2e` retry passed: direction checks; browser smoke across 53 routes and nine viewports, including utility, print and pointer/touch/tap/keyboard solver workflows; and enabled monetization checks across nine eligible routes at five viewports plus 14 ad-free routes. The earlier timeout remains unexplained despite the passing retry and focused diagnostics.
