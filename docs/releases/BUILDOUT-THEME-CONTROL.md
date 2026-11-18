# F1 — truthful theme control before hydration and without JavaScript

Review branch `codex/theme-progressive-control`, stacked on visual PR 57 at
`d55e7937ae60d03a8aae536d354558a8164ba623`. The containing PR freezes the exact
candidate. No new URL, metadata, puzzle/content, dependency or ad behavior.

The theme icon previously server-rendered as enabled even without JavaScript.
It now stays natively disabled until its existing preference/device setup has
completed. The accessible label and title explain that selecting a theme requires
JavaScript and the device preference is used without it. This is a small control
state, not a sitewide banner. The 42×42 target, initial palette bootstrap, local
preference key, system behavior and print isolation are unchanged. After
hydration the same System/Light/Dark cycle is available.

Production build passes 335 pages and static-host checks retain 217 sitemap URLs,
35 redirects and six utility shells. Focused ESLint, TypeScript, 46 existing
theme/SEO/published-fingerprint tests and whitespace checks pass. No formatter
script exists.

`BASE_URL=http://127.0.0.1:3275 node tests/e2e/theme.mjs` passes 320/390/768/
1024/1280/1440/1600, seven home/builder/category/collection/search/trust/classroom
routes, theme/device/reload/blocked-storage behavior, dark axe, output dialogs,
white print paper and no-JS light print. The no-JS icon is verified disabled with
its meaningful name; CSS still follows the dark device preference. Existing
dimensions and active theme behavior remain stable. Visual artifacts are outside
the repository in the active chat's `theme-progressive` directory.

The parent must rerun the final combined acceptance candidate. Automated Chromium
is not physical Safari/Android, native browser zoom or assistive-technology signoff.
No main push/merge, automatic merge or production deployment. Rollback is a
reviewed revert of this isolated control-state change.
