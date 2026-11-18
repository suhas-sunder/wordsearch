# Security — direct Zod 4 migration

Review child of integration01 PR #28 at10d6379. Direct dependency upgraded from3.25.76 to4.6.7 to address [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), whose published patched range starts4.6.6. The [official migration guide](https://zod.dev/v4/changelog) was reviewed.

Only `content/schema.ts` imports Zod; consumers are structured-content tests. Its three schemas use object/string/array/min/enum/optional APIs without internal types, error customization, transforms, coercion or Zod3-only features. Schema source stays unchanged. Added regression coverage for missing/wrong-type fields, min-length boundaries, invalid words, difficulty enum, unknown-key stripping, optional values and source immutability. Existing complete content acceptance and published puzzle fingerprint tests remain intact.

Changed package.json/lockfile and tests/unit/content-schema.test.ts. No application/generator/content/ad source changed.

Validation November6,2026 Node25.9.0, isolated real node_modules (not shared junction): `npm ci` PASS; `npm run lint`, `npm run typecheck`, `npm test` PASS255tests including all structured content,150 published puzzle fingerprints, packs/PDF/answers and staged content. `npm run build` PASS335pages; `npm run audit:static-host` PASS217sitemap/35redirects/6shells; `git diff --check` PASS. No check disabled or advisory ignored.

`npm audit --omit=dev` now PASS zero vulnerabilities, down from direct Zod high. Full `npm audit` still FAILS16records: seven moderate/seven high/two critical in development tooling. Lighthouse->Puppeteer->chromium-bidi retains a dev Zod3 copy. Vitest/tinypool need a major update; PDFjs needs a major update; other compatible dependency patches are available. Those remain separate follow-up milestones, not waived or represented as production-audit findings. Source-defined schema use is not proof the vulnerable path cannot matter elsewhere.

Major-version risk is limited by the small observed API surface and explicit contract checks; future external callers are not evaluated. Existing route-ad/Lighthouse/provider/device gates remain. Rollback exclude/revert this package, which restores the vulnerable direct dependency, so prefer a forward fix if needed. No main push/merge, auto-merge or production deployment.
