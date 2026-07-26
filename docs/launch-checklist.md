# Launch checklist

This checklist is specific to the current Next.js App Router deployment of I Love Word Search. It does not guarantee search rankings, advertising approval, or field performance.

## Before the milestone commit

- Confirm the worktree contains only the intended milestone and keep it unstaged until review.
- Use the repository-supported Node version (Netlify currently specifies Node 22; the Docker image currently uses Node 20).
- Run:

  ```text
  npm ci
  npm run audit:content
  npm run lint
  npm run typecheck
  npm test
  npm run build
  npm run start
  npm run audit:routes
  npm run test:a11y
  npm run test:e2e
  npm run audit:lighthouse
  npm run audit:pdf
  git diff --check
  ```

- Run production-server commands against `http://localhost:3000` unless `BASE_URL` points at another production-like instance.
- Confirm `https://www.ilovewordsearch.com` remains the single canonical site URL in the registry, metadata base, share URLs, sitemap, robots output, and deployment configuration.
- Verify `/sitemap.xml` has exactly the expected canonical inventory and `/robots.txt` references the production sitemap.
- Open a representative PDF download and confirm its title, words, dimensions, orientation, answer page, filename, and response headers.
- Test the actual mobile layouts, solver, dialogs, print preview, QR code, clipboard recovery, and invalid-state 404s.

## Environment and integrations

- No secret environment variable is currently required for the application itself.
- Keep `NEXT_PUBLIC_AD_PLACEHOLDERS` unset in production. Set it to exactly `on` only for restrained development placeholder review.
- Do not add an AdSense publisher ID, ad script, or live placement until the site and account are ready. Apply only after the production content, navigation, policies, and traffic experience are stable.
- Before personalized advertising where applicable, select and configure a suitable consent/CMP approach for the served regions and chosen ad provider.
- Add analytics only after explicitly selecting a provider, retention rules, consent approach, and corresponding privacy-policy language. Do not use a placeholder analytics ID.
- Configure error monitoring deliberately and verify that source maps, request data, and puzzle state do not expose sensitive information.

## Dependency security

Reviewed on 2026-07-26 with local Node 25.9.0 and npm 10.9.0.

- Verified runtime packages: Next.js 15.5.22 (`backport` registry tag), React 19.1.1, React DOM 19.1.1, PostCSS 8.5.23, and Sharp 0.35.3.
- Verified lint packages: ESLint 9.39.4, `eslint-config-next` 15.5.22, and `@next/eslint-plugin-next` 15.5.22.
- `npm audit --omit=dev` reports zero vulnerabilities after the reviewed PostCSS and Sharp overrides.
- The full audit reports nine high-severity development-only records. They fan out from `GHSA-mh99-v99m-4gvg` in `brace-expansion` through `minimatch` in ESLint 9, its config packages, and the lint plugins included by `eslint-config-next`.
- These development packages are absent from the production audit and production bundle. npm proposes ESLint 10.8.0 and `eslint-config-next` 16.2.12 as semver-major remediations; that forced migration was rejected for this milestone.
- Revisit the residual lint advisory during a tested Next.js 16/ESLint 10 migration, or sooner if compatible ESLint 9 ecosystem patches become available. Do not run `npm audit fix --force`.

## Deployment and discovery

- Deploy the validated build without changing the canonical host.
- At the provider/DNS layer, confirm HTTP to HTTPS and non-`www` to `www` normalize in one hop, without adding a chain before application redirects.
- Confirm the provider preserves application 308 redirects, cache headers, PDF headers, 404 status codes, and the safe headers configured in `next.config.ts`.
- Submit the canonical sitemap to Google Search Console and Bing Webmaster Tools after the production host is reachable and ownership is verified.
- Do not submit search, print, PDF, answer, play, embed, custom state, draft, redirect, or invalid URLs for indexing.

## Post-deployment smoke test

- Re-run `BASE_URL=https://www.ilovewordsearch.com npm run audit:routes` after DNS and deployment settle.
- Check homepage, generator, Easy and Hard puzzles, a category, collection, guide, `/topics`, search, About, 404, and an invalid state on real mobile and desktop devices.
- Confirm canonical tags, Open Graph URLs, sitemap and robots output contain no localhost URLs.
- Confirm PDF generation and downloads work from the deployed server.
- Confirm the preferred-host and HTTPS redirects are one hop and do not chain with consolidation aliases.
- Confirm ads remain absent and leave no empty layout gaps.
- Watch server errors and broken-link reports during the first deployment window.
- Review Search Console indexing and Core Web Vitals after real field data exists; local Lighthouse results are risk indicators, not 75th-percentile field evidence.

## Rollback

- Keep the last known-good deployment/version available in the hosting provider.
- If the smoke test finds a material regression, restore that known-good deployment first, then reproduce and fix the issue on the uncommitted or follow-up branch.
- Do not repair a production regression by deleting content, weakening validation, or changing canonical URLs without a reviewed migration.
