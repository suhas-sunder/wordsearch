# F1 — expanded visual evidence and two presentation repairs

This is TESTED development evidence with manual acceptance still pending, not a
claim of PRODUCT ACCEPTANCE READY or production approval. The exact application
baseline is integration 03 `1839428c6557dcb3aa663af882cade593618fc6a`, served
at `http://127.0.0.1:3394`. It excludes subsequent FAQ PR 50, search-layout PR 52
and the later local-library milestone. No running work or baseline was replaced.

## Frozen integration 03 matrix

`tests/e2e/product-visual-acceptance.mjs` records 14 archetypes: home, search,
generator, curated puzzle, hard hub, regular collection, category, guide,
supported Morse specialty, classroom pack, encoded PDF utility, About, privacy
and 404. Both light/dark palettes run at 320/390/768/1024/1280/1600, plus 844×390
landscape and a 200% equivalent reflow/pixel-density simulation (640×450 CSS at
deviceScaleFactor 2 for a 1280×900 physical viewport).

Result: **224 cases, zero automated failures and zero lower axe notices**.
Checks include serious/critical axe, runtime errors, document overflow, effective
theme, closed-header/ad rectangle separation, keyboard More/Escape, and light
printer paper/chrome exclusion. There are 296 viewport/full-page/menu captures
plus a per-case JSON manifest. Blocking the advertising loader keeps these
layout/a11y observations separate from real-network ad lifecycle acceptance.

Artifacts are outside the repository under the active chat visualization root,
`f1-integration03/manifest.json` and the sibling PNGs. Manual review covered all
14 archetypes at 390 in both palettes and at 1280 dark, using readable contact
sheets and individual images. Other widths/landscape/reflow have captured
screenshots and automatic evidence; full owner visual signoff remains pending.
Some initial viewport captures begin below the header, while their full-page
captures preserve it. The durable helper now explicitly scrolls to the top
before future viewport captures, and records the prior scroll position.

## Actual repairs found by visual review

1. The footer maintainer link computed `display:block; margin:8px 0` despite its
   module's intended inline rule. The global `.site-footer a` won on equal
   specificity/source order. A scoped `.site-footer .maintainer a` rule restores
   the natural sentence flow and removes link margins. Branding, author facts,
   legal destinations and ad code are unchanged.
2. Search/404 H1s inherited 16px after the reset, visually smaller than the search
   results H2. Scoped serif/clamp typography restores their title hierarchy;
   the error paragraph gets a readable line length/leading. No page copy changes.

The corrected export on 3269 uses the frozen application above plus only these
three application files: `SiteFooter.module.css`, `app/globals.css` and
`app/not-found.tsx`. Its manifest records the baseline SHA and application-patch
SHA-256 `97949956f550dfd0c678262d7448484b8c1880d20bc0fba4dc88ab1375719a67`.
This identifies the precommit source accurately rather than relabeling it as the
unchanged baseline. The containing PR's commit freezes those same application
changes for subsequent integration.

Targeted corrected matrix: search/About/404 × the same eight viewports × two
palettes = **48 cases, zero failures/notices**. Every recorded maintainer link
computes inline; title size is 32–56px according to viewport. Corrected mobile
404/search and desktop About images were inspected. Artifacts:
`f1-corrected-titles-footer/manifest.json` and sibling captures. Baseline and
corrected views are never combined into one claimed exact-SHA pass.

## Commands and validation

Set `BASE_URL`, `F1_SOURCE_SHA` and outside-repo `F1_VISUAL_OUTPUT`, then run
`node tests/e2e/product-visual-acceptance.mjs`. Optional `F1_CASE_NAMES` selects
explicit changed archetypes; an invalid case name fails. For a precommit patch,
record `F1_SOURCE_PATCH_SHA256` as above. The JSON manifest is saved per case,
keeps all failures/notices and returns a failing process status for any failure.

Focused ESLint, TypeScript, 39 existing SEO/published-fingerprint tests, production
build (335 pages), static-host (217 sitemap URLs/35 redirects/six utility shells)
and whitespace checks pass. No formatter script exists. No thresholds were
weakened. Exploratory axe diagnostics initially used an implicit page context;
the diagnostic was rerun with an explicit context, without app changes.

## Remaining acceptance

Native browser zoom, real Safari/Android, assistive technology, physical printing
and genuine ad-network behavior remain manual gates. Existing route-ad findings,
Lighthouse best-practices and utility hydration CLS are not waived. PR 52 fixes
search CLS separately; it is not in this matrix's frozen source. Later combined
integration must rerun changed paths and its relevant exact-SHA release checks.
The parent owns the F0–F6/user-issue matrix; this evidence does not mark F1 DONE.
No main push/merge, automatic merge or production deployment. Rollback is a
reviewed revert of these isolated presentation changes.
