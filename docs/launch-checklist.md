# Launch checklist

This checklist applies to the Next.js App Router static application. The
[current release candidate](releases/PRODUCT-RELEASE-CANDIDATE-04.md) and
[feature acceptance ledger](releases/PRODUCT-ACCEPTANCE.md) contain exact source,
results and unresolved gates. A ready draft or preview is not production approval.
It does not guarantee search rankings, advertising approval or field performance.

Do not merge/push main, enable auto-merge, deploy production or publish new
editorial content without separate authorization. Main triggers production.
Follow the [protected advertising directive](../ai-issues/AD-PLACEHOLDER-SAFETY.md).

## Before the milestone commit

- Confirm the worktree contains only the intended milestone and keep it unstaged until review.
- Use the repository-supported Node version (Netlify and the static Docker build currently specify Node 22).
- Run:

  ```text
  npm ci
  npm run audit:content
  npm run lint
  npm run typecheck
  npm test
  npm run build
  npm run audit:static-host
  npm run start
  npm run test:preview
  npm run audit:routes
  npm run test:a11y
  npm run test:e2e
  npm run audit:lighthouse
  npm run audit:pdf
  git diff --check
  ```

- `npm run build` generates the browser search index and must create the
  complete `out` directory, including `search-index.json`. `npm run start`
  serves that directory through the repository's static validation server; it
  does not start Next.js.
- Run static-site audit commands against `http://localhost:3000` unless
  `BASE_URL` points at another production-like instance.
- Confirm `https://www.ilovewordsearch.com` remains the single canonical site URL in the registry, metadata base, share URLs, sitemap, robots output, and deployment configuration.
- Verify `/sitemap.xml` has exactly the expected canonical inventory and `/robots.txt` references the production sitemap.
- Open a representative browser-generated PDF download and confirm its title,
  words, dimensions, orientation, answer page, filename, and embedded QR image.
- Test the actual mobile layouts, solver, dialogs, print preview, QR code,
  clipboard recovery, and explicit invalid-state error shells.
- Confirm the preview toolbar shows exactly one puzzle or answer sheet while
  Print and PDF answer-page inclusion remains independently selectable.

## Environment and integrations

- No secret environment variable is currently required for the application itself.
- Keep `NEXT_PUBLIC_AD_PLACEHOLDERS` unset in production. Set it to exactly `on` only for restrained development placeholder review.
- Existing advertising integration is intentional. Preserve its script,
  placements and first-real-filled-ad global placeholder suppression. Do not
  restore placeholders after another slot fills or remove accepted blank spaces
  as routine polish. Placement/lifecycle changes require separate authorization
  and genuine-network verification. Keep printing and non-ad utilities ad-free.
- Before personalized advertising where applicable, select and configure a suitable consent/CMP approach for the served regions and chosen ad provider.
- Add analytics only after explicitly selecting a provider, retention rules, consent approach, and corresponding privacy-policy language. Do not use a placeholder analytics ID.
- Configure error monitoring deliberately and verify that source maps, request data, and puzzle state do not expose sensitive information.

## Dependency security

- Use the exact reviewed lockfile and supported Node22 runtime; record actual
  Node/npm versions, install command and source SHA. Do not use an incidental
  system Node version to claim supported-runtime validation.
- Run both `npm audit` and `npm audit --omit=dev`, preserve their actual output
  and classify each finding. Candidate remediation is documented in
  [runtime security](releases/BUILDOUT-ZOD-SECURITY.md) and
  [tooling security](releases/BUILDOUT-TOOLING-SECURITY.md). Historical July
  package/advisory counts are not a current audit result.
- Zero candidate findings do not mean production already contains the updates.
  Record candidate and production SHAs separately. Registry advisories can change;
  repeat the audit for the final review checkpoint.
- Resolve exploitable findings or obtain an explicit written risk disposition.
  Do not run `npm audit fix --force`, waive a failure or blindly migrate major
  versions to make a gate green.

## Deployment and discovery

- Netlify must publish only `out`. Do not enable the Next.js runtime plugin,
  Functions, or Edge Functions.
- `_redirects` supplies the reviewed permanent redirects and static rewrites for
  arbitrary encoded utility URLs. `_headers` supplies security and noindex
  response headers.
- After separate release authorization, deliver the approved exact SHA through
  the reviewed Git workflow without changing the canonical host.
- At the provider/DNS layer, confirm HTTP to HTTPS and non-`www` to `www` normalize in one hop, without adding a chain before application redirects.
- Confirm Netlify applies the committed 301 redirects, static utility rewrites,
  cache behavior, and `_headers` rules.
- Submit the canonical sitemap to Google Search Console and Bing Webmaster Tools after the production host is reachable and ownership is verified.
- Do not submit search, print, PDF, answer, play, embed, custom state, draft, redirect, or invalid URLs for indexing.

## Post-deployment smoke test

- Re-run `BASE_URL=https://www.ilovewordsearch.com npm run audit:routes` after DNS and deployment settle.
- Check homepage, generator, Easy and Hard puzzles, a category, collection, guide, `/topics`, search, About, 404, and an invalid state on real mobile and desktop devices.
- Confirm canonical tags, Open Graph URLs, sitemap and robots output contain no localhost URLs.
- Confirm PDF generation and downloads work locally in the browser without a
  request to an API or Function.
- Confirm the preferred-host and HTTPS redirects are one hop and do not chain with consolidation aliases.
- Verify eligible-page ads never obstruct interaction and no placeholder covers
  a real creative. First real fill must suppress all placeholders for that page
  session; accepted blank slots are not a failed polish check. Check genuine
  fill/consent separately from mocked regression tests. Keep print ad-free.
- Recheck the three classified internal noindex/ad-eligibility findings and their
  explicit owner disposition; they are not proved AdSense policy violations.
  See [classification](releases/AD-ELIGIBILITY-2026-11-06.md).
- Watch browser errors, broken-link reports, and Netlify function metrics during
  the first deployment window. Normal application use should produce zero
  Function and Edge Function invocations.
- Review Search Console indexing and Core Web Vitals after real field data exists; local Lighthouse results are risk indicators, not 75th-percentile field evidence.

## Rollback

- Keep the last known-good deployment/version available in the hosting provider.
- Record the known-good main SHA and provider deployment ID before release.
  If an authorized release regresses, prepare a reviewed revert or fix-forward
  through Git, preserving the known-good reference and checking the resulting
  production SHA/deploy. Do not force-push main or perform a provider rollback
  without separate authorization. An emergency operator action needs its own
  approval, exact target, reason and post-action smoke evidence.
- Do not repair a production regression by deleting content, weakening validation, or changing canonical URLs without a reviewed migration.

## Manual acceptance record

Record tester, date, exact SHA/deploy, device/browser and result for each check;
leave unexecuted checks pending. A Chromium/PDF simulation is not physical signoff.

- Print representative student/answer and measured-large-print sheets on actual
  Letter and A4 at100% scale. Check full banks, page edges, title/instructions,
  answer alignment and the measured profile without printer fit-to-page shrink.
- Scan a printed QR on a real phone and compare the exact seed/grid/answers.
  Exercise no-QR recovery and crowded-layout rejection separately.
- On real Safari and Android, create/edit/solve, save/reload, share/cancel and
  download/print. Check clipboard and unsupported-feature fallback messages.
- With a screen reader and keyboard, test More/search, dialogs/focus return,
  settings errors, solver selection/completion and local-library recovery.
  Check native browser zoom and reduced-motion behavior; width/DPR emulation
  alone does not certify native zoom or assistive technology.
- Independently review owner biography/policy accuracy, editorial rights/facts/
  audience and genuine ad/consent behavior. Product approval does not approve
  any source-only draft or future calendar release.
