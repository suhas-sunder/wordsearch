# Buildout integration03 — development checkpoint

Draft PR51, `codex/buildout-integration-03`; parent integration02 PR37.
The frozen application/export tree is `1839428c6557dcb3aa663af882cade593618fc6a`.
Later commits add the current planning documents, offline whole-inventory audit
and acceptance ledger; these do not alter the frozen application. The final
containing commit is the exact review head. This is not final product acceptance.

Included source milestones: PR35 seasonal/classroom; PR36 truthful specialty
disclosures and parent30 audit; PR38 twenty/student/teacher worksheets; PR39
Zod4; PR40 hard evergreen; PR41 teacher subjects; PR42 system themes; PR43
measured large-print; PR44 local classroom presets; PR45 security/tooling;
PR46 large-print utility library and coalesced-label measurement; PR47 solver
navigation timing; PR48 shared discovery. Normal merges retain their exact
ancestry. Source references and individual evidence are in PRODUCT-ACCEPTANCE.json.

Integration-specific fixes preserve both theme and solver privacy disclosures,
add backward-compatible large-print preference storage, use the theme surface
for preset buttons, retain PDF.js loading tasks for cleanup, and replace the
duplicated test-only measurement implementation with a central re-export.

## Validation

Supported Node22.23.4; static export served at3394.

- Clean isolated `npm ci` passes; full and production dependency audits report
  zero advisories. Initial lint/typecheck/test probes were started before that
  install completed and failed because local executables were not yet present;
  these were setup failures, not passes. They were rerun after install completion.
- Full lint/typecheck,386tests and production335-page build/static-host217URLs,
  35redirects and6utilityshell checks pass. Additional offline acceptance tests
  and exact final suite totals are recorded below before the checkpoint closes.
- Full `test:e2e` passes input/direction regression,53routes×9viewports,
  search/navigation/utilities/print and pointer/touch/tap/keyboard solver, plus
  protected advertising9eligible×5widths/14ad-free routes.
- Combined theme persistence/system override/blocked storage/no-JS/dark axe and
  light paper pass; shared discovery7templates mobile/desktop/no ad overlap pass.
- Actual Letter/A4 large-print downloads,5/10/20 student/teacher pack downloads,
  answer-grid parity, preset save/reload/corruption/blocked storage, mobile and
  pack axe pass against the exact frozen export.
- Offline whole-catalog audit checks45 staged candidates across all families,
  plus16 utility-only large-print selections. `--pdf --export` reports zero
  issues, all staged canonical paths absent from public output. Human approval
  remains false. Source-only proposals and utility formats are not new pages.
- Frozen F1 visual matrix:224 automated cases (14archetypes,6required widths,
  light/dark, landscape/reflow) pass axe/runtime/overflow/header-ad checks.
  Manual inspection still found footer inline-cascade and search/404 heading
  defects. Their fixes and other later packages are separate, not passed here.

## Retained gates and exclusions

Three internal noindex/ad-eligibility findings still require owner placement
decisions; no protected ad lifecycle, fill detection or placement was altered.
Lighthouse Best Practices77 and known layout shifts are not waived. PR52's
search-layout fix is later work, not included. The full final product still
needs the feature-by-feature acceptance matrix, manual device/screen-reader and
physical Letter/A4 printer checks and independent exact-SHA approval.

PR49 annual composition/normalization, PR50 hub FAQs, PR52 search layout,
PR54 classroom Class/instructions and later named-library/HTML/fit work remain
separate. Do not represent their individual passes as this checkpoint's code.
No new content is editorial approved or activated. Main remains
`471a118dd459f2181cd641ed0572ba6dd7005540`; provider production deploy
`6aedd79021e0a4d96f61990a` was read back as ready with that exact SHA. No main
push/merge, production deploy or auto-merge. Rollback reference is that known-good
commit/deploy; any approved production correction uses a reviewed revert and
normal Git-triggered build, never force-push or unapproved restore/publish calls.

Final offline-ledger additions: lint/typecheck and all390tests/51files PASS;
whole-tree `npm audit --json` again reports zero vulnerabilities. The acceptance
audit covers39features, all seven F0–F6 areas and every16numbered owner issue.
It rejects dropped features, unsupported bulk approval, missing SHA references
and false manual completion; its generated human view is checked for drift.
This software evidence does not approve production, content or unfinished work.
