# Production-to-review semantic preservation guard

Status: **implemented and tested; material copy acceptance remains pending**. This package changes only audit scripts, tests, exact difference explanations and this record. It changes no runtime content, URLs, metadata, generation, styling or advertising.

## Observed baseline

Live production was observed at `https://www.ilovewordsearch.com`, independently identified as main `471a118dd459f2181cd641ed0572ba6dd7005540`. The immutable review endpoint was `https://6aeecf5d87e1713c8c60f2f2--ilovewordsearch.netlify.app`, independently identified as R `ada6b6e89a67ca5c1c31a4cc927453994ba9d3d4`. Operator/provider source identity and response-byte identity are distinct: a response hash alone cannot attest a Git commit.

Before new excellence UI edits, all **217 actual sitemap URLs on each endpoint** were requested and their exact UTF-8 HTML bytes retained, with status, location, content type and HTTP robots header. All **35 permanent alias responses per endpoint** were observed without automatically following redirects. Each raw response is SHA256-bound. Subsequent parser refinements reused these original bytes, independently rehashed them and retained original observations; they are not relabeled as new live captures. Earlier attempts/reports remain separately preserved.

The review source registry independently enumerated **217 published indexable records, 217 sitemap records, zero indexable records outside the sitemap, and 150 published puzzles**. Both `/editorial-policy` and `/how-word-searches-are-made` are exact members of both live sitemaps and the retained export; their HTML robots are `index, follow`. An earlier contrary inference from only the support-slug whitelist was corrected after checking the explicit trust records and XML. No extra trust-route union is hidden in the 217 count.

## What is compared

The browser's inert DOM parser processes every retained SSR response without running page scripts. It compares status, canonical, HTML and HTTP robots separately, title, description, H1, partitioned H2/H3 hierarchy, substantive body text, authored vocabulary, JSON-LD, labeled internal-link sequence, no-JS recovery, full sitemap entries and redirects. A normal browser additionally observed eight representative rendered pages: the hard collection at 390/1280, the generator at 1280, and one published puzzle at 1280, on both endpoints. These eight observations do not imply fully hydrated visits to all 434 pages.

Text is partitioned into header, footer, navigation, known shared tools/standards/how-it-works, contextual activity tools, FAQ, interactive UI and editorial body. **Every non-script/style/SVG text node is compared in a partition; no whole-text ignore exists.** No-JS content and rendered vocabulary are captured separately. Exact Git-object hashes of both authored curated-topic source files additionally protect the 150 word banks when deferred editor vocabulary is absent from SSR. This is not a new grid/PDF fingerprint execution; those separate preservation checks remain necessary.

Whitespace and JSON object-key order normalize implementation noise; array order, paragraph wording, headings, link labels/destinations, metadata and schema values remain protected. DOM IDs/classes and other generated attributes are not indexed-copy changes. Relative fragments resolve against the actual page route. One narrowly identified provider artifact is separate: production Cloudflare's empty `/cdn-cgi/content` anchor with query key `id` and `rel="nofollow noopener"`. The exact path/key/empty-label/rel contract is recorded; its opaque challenge value is not treated as editorial navigation. Ordinary links receive no such exemption.

The guard also rejects incomplete/duplicate observations, empty metadata, a missing/wrong production canonical, sitemap pages without one H1 or with HTML noindex, and aliases not returning 301 to their exact declared target. JSON-LD parsing errors fail capture. Generated evidence must remain outside Git, and capture refuses to overwrite an earlier capture folder.

## Actual production-to-R findings

- **Zero differences** in all 217 titles, descriptions, H1s, canonicals, HTML robots and JSON-LD blocks; all 150 published puzzle editorial bodies and both authored bank source files remain exact.
- Sitemap membership, full locations/lastmod/change frequency/priority and 35 redirect behaviors remain exact. The existing shared “Make, Check, Print” and puzzle-standards sections are already present in production; they were not silently attributed to the buildout or removed.
- **1,784 changed route/field pairs** are pinned by 72 exact before/after hash explanations with explicit route lists, classifications, reasons and review references. No wildcard route or unrestricted field/text rule is accepted. Unmatched or stale explanations fail.
- **1,554 pairs** document known technical/UI intent: header navigation/theme/search; internal footer links; shared tools/search/pack discovery; six contextual activity sections; the incomplete hub label correction on 14 hubs (teacher/worksheet also expose the pack utility); factual specialty limitations; two collection finding/no-JS states; and provider-only differences. “Approved functional content” is the requested classification name, not an assertion of owner or editorial approval.
- **230 pairs explicitly remain owner-review-required**: the complete footer biography/profile/copyright body on all 217 routes, five FAQ bodies plus five corresponding heading additions, privacy body plus heading additions, and editorial-policy body. Footer navigation-link differences are separate from that material biography-copy hold. This is 230 fields, not 230 unique URLs. The five FAQ routes plus privacy/policy are seven non-footer routes; the shared footer already spans all 217.

The classified comparison intentionally returns **exit 1 / passed:false**, with **zero unexplained**, **zero stale explanations**, and **230 pending owner-review fields**. Pinning intent does not accept Category C copy changes. No owner approval is recorded. These holds remain actionable review work rather than being converted into a green release report.

The R preview has `X-Robots-Tag: noindex` on all 217 responses while production has no such header. This expected review-host protection is explained independently of identical indexable HTML robots/canonical/sitemap. It is not ignored, a production header acceptance, or a waiver allowing a release to remain noindex. All 217 preview responses therefore retain that HTTP-level indexing restriction.

## Validation and manual scope

Supported Node **22.23.4** was used directly. Fifteen comparator mutation tests pass, detecting each protected semantic field, source banks, page/sitemap membership, redirects, status/HTTP robots, shared/footer/editorial text, exact allowlist scope, stale rules and pending approval. All **35 SEO tests in six files**, targeted ESLint, TypeScript and whitespace checks pass. The real browser DOM contract passes: editorial/shared/footer/recovery rewrites, link/vocabulary/schema changes and route-relative fragments are detected; only the specified provider challenge noise separates. The complete application unit/PDF suite and a new Next build were not executed for these audit-only files; the coordinator will run the complete combined checks on the next application candidate. No previous application-build pass is relabeled as a new build for this package.

Initial diagnostic attempts remain distinct: the route-audit manifest enumerated only 22 aliases, so capture was extended to all 35 committed permanent aliases before acceptance; one new mutation test exposed missing evidence when a sitemap path lacked both page observations, and the guard was corrected to fail explicitly; targeted lint's two unused-destructure findings were fixed without disabling its rule. Original captures/reports remain retained, and none is called the completed final 35-alias proof.

Individually inspected **four** full-page hard-collection images: production and R, each 390 and 1280. Original title/introduction, 16 cards/order/descriptions, selection guidance and related destinations are retained; R adds finding controls, shared search and the already reported footer. Protected ad regions remain separate. The images include ordinary live network conditions, not certification of genuine fill/consent or ad policy. These four reviews do not claim a fresh all-page aesthetic, keyboard, physical-device or production acceptance.

## Reproduce and extend to a new frozen candidate

Use the direct Node22 executable and its actual `node/bin` directory on PATH. All artifact destinations below must be outside the repository.

```powershell
$node22 = 'C:/Users/Suhas/AppData/Local/npm-cache/_npx/361c55be1121897e/node_modules/node/bin/node.exe'
$env:SEO_CAPTURE_OUTPUT = '<new-outside-repository-folder>'
& $node22 tests/e2e/seo-preservation-capture.mjs
& $node22 tests/e2e/seo-preservation-diff.mjs "$env:SEO_CAPTURE_OUTPUT/capture.json" tests/seo/semantic-preservation-allowlist.json '<outside-report.json>'
& $node22 node_modules/vitest/vitest.mjs run tests/seo/semantic-preservation.test.ts --maxWorkers=1
& $node22 tests/e2e/seo-semantic-dom-contract.mjs
& $node22 node_modules/tsx/dist/cli.mjs scripts/capture-seo-source-inventory.ts '<outside-source-inventory.json>'
```

The capture defaults to the exact main/R endpoints above. For a new frozen application, set `SEO_BASELINE_URL`, `SEO_BASELINE_SHA`, `SEO_CANDIDATE_URL` and `SEO_CANDIDATE_SHA` to independently verified immutable endpoints/full SHAs. Run **both main→new-candidate and R→new-candidate**. Do not reuse a main→R allowlist as automatic permission for R→new changes: exact pairs must match, and unused entries fail as stale. A dedicated explanation file can start empty for that comparison. New expected functional differences need exact route/field/hash explanations; substantive indexed copy remains a pending review, not an automatic acceptance.

For an offline parser replay, set `SEO_CAPTURE_REPARSE_FROM` to a preserved capture directory, `SEO_CAPTURE_REUSE_HTTP=1`, and choose a new output folder. The result explicitly records reused observations. This mode must never claim fresh HTTP or rendered behavior. For representative normal rendered observations, set `SEO_CAPTURE_FILE`, `SEO_RENDERED_OUTPUT`, and execute `tests/e2e/seo-preservation-rendered.mjs` in the serialized browser slot. No ad source, eligibility, lifecycle, threshold or provider setting is changed.

## Durable evidence

The complete response corpus, classified report, source inventory, exact explanation file, file hashes, rendered manifest and selected screenshots are under:

`C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/excellence-seo-main471-rada6/`

Initial captures and diagnostic versions also remain at `C:/Users/Suhas/.codex/tmp/excellence-seo-main471-rada6-initial/`, `...-complete/`, `...-final/` and `...-final-v2/`. Exact source and artifact hashes in the durable manifest distinguish them. None is a final future excellence-candidate result. All new editorial content remains unpublished; production/main and protected advertising are unchanged.
