# Weekly integrated candidate — November 6, 2026

Status: implemented; final combined regression validation complete with retained
baseline failures; **held at draft review**, never production-approved. Intended review/release: Thursday
November 12 / Friday November 13, 2026, America/New_York, only after gates pass.

Branch: `release/2026-W46-integrated-candidate`.
Starting/main/production SHA: `471a118dd459f2181cd641ed0572ba6dd7005540`.
Final SHA: this record's containing review branch/PR head; freeze and record that
exact head in the handoff before approval. This is a fresh main-based candidate,
not a merge of the original parent histories. Original PR branches and evidence
remain intact. No force-push, main push, merge, auto-merge or deployment occurred.

## Scope and provenance

| Issue / package | Original PR and preserved head | Integrated scope / dependency |
| --- | --- | --- |
| WS-A01 / WS-W46-01 | [#2](https://github.com/suhas-sunder/wordsearch/pull/2), `c6539992f95ea584498329bc319ac38edbbe160e` | Direction validation, accessible last-selection protection and weekly/fast-track release guidance |
| WS-A02 controls / WP-02 | [#3](https://github.com/suhas-sunder/wordsearch/pull/3), `7211ff2dda4a74321bec5f25414175b3c3569783` | Active-difficulty no-op and curated override inventory; no preset/editorial migration |
| WS-A06 / WP-03 | [#5](https://github.com/suhas-sunder/wordsearch/pull/5), `8709048d9cf560f259c37626cb497e991e210e4a` | Derive generic printable/PDF instructions from allowed directions; preserve authored custom text |
| WS-A09 / WP-04 | [#6](https://github.com/suhas-sunder/wordsearch/pull/6), `1e4c147c3db1c21325f7ea0ecf952323330ce064` | Real encoded-route/answer/PDF parity and local static-host original-URL header matching |
| WS-A03 / WP-01 | [#9](https://github.com/suhas-sunder/wordsearch/pull/9), `620c5b5df4c14c1e4340fdf2eb916f6b5004cbb9` | Shared external-input admission, invalid builder/output blocking, new measured deterministic workload bound |
| WS-A10 / WP-07 | [#11](https://github.com/suhas-sunder/wordsearch/pull/11), `2470d86e15e07e455f75d3668c399ee980d98893` | Structural publication/audit safeguards and human review checklist; no content edits or date refresh |
| Dependency patches / WP-08b | [#12](https://github.com/suhas-sunder/wordsearch/pull/12), `f638e70e45ca3ded5dcb763a7d64fcc6d0769b7d` | Compatible Next 15.5.29, matching lint config/plugin and Sharp 0.35.5 plus lockfile patches; no major migration |
| WS-A07 research / WP-06 | [#4](https://github.com/suhas-sunder/wordsearch/pull/4), `90b09bc9ba82d9432fd0438946438aa1e06649ba` | Share transport fixtures/evidence and tests, no storage/auth/shortlink service |
| Audit repair / WP-08a | [#8](https://github.com/suhas-sunder/wordsearch/pull/8), `9b8e64d2f211460a01c3143272fe70e22d14f185` | Test-only live-ad markup repair, nine existing-Vitest cases and classified retained findings |
| Historical ledger | [#13](https://github.com/suhas-sunder/wordsearch/pull/13), `db94bc8cf1ca3dcaaf07f3da20b63aa4db06c3bf` | Preserve overnight report and update current release guidance |

Read the new review comments on #7/#8/#9/#10 before working. #7/#10 UI deltas are
isolated in [draft PR #15](https://github.com/suhas-sunder/wordsearch/pull/15),
`fasttrack/2026-11-06-ui-integration` at
`fea066dcf03bb755b166fca23aee991ee541d311`, not included here; PR #1's
released footer/logo is inherited once from main. Source package records remain
historical evidence. Current combined results take precedence for this candidate.

## Deliberate conflict resolution

Applying #9 after #3/#5 conflicted in `WordSearchBuilder.tsx` and `package.json`.
All other source commits applied without textual conflicts.

- Active-difficulty selection remains a no-op and preserves curated/custom
  directions. Choosing a different difficulty marks a user edit and clears load
  error, while retaining other invalid drafts for correction. Explicit invalid
  direction recovery uses `patch`, rather than the active-difficulty no-op.
- Preserve #9's `hasUserEdits`, `loadError`, last-valid request/output handling,
  debounced identity gate, stable editing controls and blocked stale exports.
  Added desktop/mobile regression: blank Rows, active Medium click, different
  Hard click, recover Rows, and verify eight selected directions without removing
  the editable controls or generating stale output.
- Preserve every source script. Add `test:workload`, `test:parity` and
  `test:transport` aliases using existing Node/Playwright/tsx libraries.
- Review found omitted `autoSize` needed the same true default in workload
  preflight as in generation, even when old dimensions are supplied. Corrected
  this before publication; added unit and external-link browser coverage. The
  application was rebuilt and affected browser checks repeated on a fresh host.

## Resource-exhaustion review

[Measured workload evidence](WORKLOAD-2026-11-06.md) reproduces up to 3544ms
main-thread tasks on admitted 40×40/200-word/128-entry requests in builder and
PDF utilities. The new centralized size helper retains the exact old formula.
A conservative 16,000,000 token-comparison upper bound rejects excessive work
before allocation/placement. It never changes retries, direction order/repeats,
random sequence or output for admitted configurations. An explicit workload
error blocks puzzle/output rather than silently substituting a preset or grid.

Known historical nine-direction links, admitted 128-entry links, all 150 published
puzzle fingerprints and three presets remain unchanged. Some previously unchecked
extreme links now reject; this intentional admission restriction needs independent
release review. Measurements are local and do not guarantee mobile-device latency.

## Combined validation

Changed runtime paths are `components/builder/WordSearchBuilder.tsx`,
`components/puzzle/PuzzleUtilities.tsx`, `components/print/PrintablePuzzle.tsx`,
`lib/puzzle/generate.ts`, `lib/puzzle/generation-limits.ts`,
`lib/puzzle/request-validation.ts`, `lib/puzzle/printable-instructions.ts`,
`lib/share-state/state.ts` and `lib/pdf/create-puzzle-pdf.ts`. Structural editorial
checks change `lib/content/audit.ts`; no authored content data changes. Compatible
dependencies/scripts change `package.json` and `package-lock.json`.
Regression/evidence changes cover the existing unit/content/PDF/SEO suites,
encoded-route/input/direction/workload browser tests, route-ad contract and local
static-server header simulation, `AGENTS.md`, content-operation/checklist guidance
and `docs/releases/`. The PR Files view is the complete per-path inventory.

Node 22.23.4 with clean `npm ci`, production static export, existing libraries.
`BASE_URL=http://localhost:3251` for browser commands. All commands below passed
except the explicit retained failures. All final browser checks used the rebuilt,
frozen export on a fresh server; no build ran during the final broad suite.

| Command | Evidence |
| --- | --- |
| `npm run audit:content` | 344 records, 217 indexable, 127 noindex, 150 published puzzles; zero warnings |
| `npm run lint`, `npm run typecheck` | Passed including new workload helper and regressions |
| `npm test` | 23 files / 200 tests, unchanged published/preset/legacy fingerprints, real PDF tests, ad-contract tests |
| `npm run build` | 334 static pages; no dynamic server/runtime introduced |
| `npm run audit:static-host` | 217 sitemap pages, 35 permanent redirects, six utility shells |
| `npm run test:workload` | 32 builder/PDF navigations at 390/1280px; rejected pathological and admitted boundary cases |
| `npm run test:e2e` | Passed: input/recovery and direction regressions, 53 routes × nine widths, state isolation, search/navigation/print/utilities, pointer/touch/tap/keyboard solver; advertising nine eligible routes × five widths and 14 ad-free routes, including protected sticky first-fill lifecycle |
| `npm run test:instructions` | Easy/medium/hard/custom direction instructions, custom text, print media and answers |
| `npm run test:parity` | Six real encoded rewrites, grid tokens, PDF rows, answer paths, QR, invalid states, canonical/noindex |
| `npm run test:transport` | 12/20/40/100 ASCII/Unicode lists and explicit QR-capacity failure for 4416-character Unicode URL |
| `npm run test:preview` | Answer preview, independent output composition, keyboard/share, 1/2-page PDFs, cleanup, eight widths |
| `npm run audit:pdf` | Downloaded two-page A4 landscape PDF: text/title/answers/QR/filename; local artifact in temp |
| `npm run test:a11y` | 14 archetypes × mobile/desktop, no serious/critical axe violations, control/focus/skip/zoom/motion/overflow checks |
| `git diff --check` | No whitespace errors; Vitest's line-ending-only snapshot rewrite normalized to the unchanged Git blob |

The first post-build server restart failed and an early parity run saw mixed
cached/new assets. That run is not a pass. Both server and affected validation
processes were stopped, then the focused suite passed on the fresh server.
An earlier full e2e run then timed out at `browser-smoke.mjs:200` waiting for the
curated Puzzle title control while a subsequent rebuild had invalidated the
served export. That failure is retained, not classified as a baseline defect.
Fresh-host diagnostics recovered the curated title and shared-generator title
with no runtime errors; the complete final suite was restarted against a frozen
export, with no build during validation.
That complete final repeat passed, including the subsequent advertising suite.
The new benchmark harness also needed scoped-alert and fixture corrections;
details are retained in the workload record. No application test was disabled,
weakened or assigned a larger timeout. No failing check is relabeled as a pass.

## Retained failures and owner decisions

- `npm run audit:routes` **fails, exit 1, three issues**, unchanged by application
  work. The 209 former false positives were repaired, not ignored. The remaining
  category/collection/guide noindex wrappers violate the **documented repository
  ad-eligibility rule**, not a proven AdSense policy restriction. See
  [classification and source references](AD-ELIGIBILITY-2026-11-06.md). Preserve
  their assertions. Owner must confirm policy and authorize a separate placement
  fix or reviewed policy revision. No advertising behavior is changed here.
- `npm run audit:lighthouse` **fails, exit 1** on all 11 route/form-factor groups
  for Best Practices 77 (third-party cookies / DevTools inspector issues), as
  previously observed. All groups score SEO/accessibility 100; final mobile LCP
  1953–2335ms, median mobile CLS at most 0.014; desktop CLS at most 0.005. Hard-puzzle mobile
  performance 87/TBT 425ms remains an observed product risk (the existing script
  does not apply the editorial performance threshold to that builder page).
  Other validation ran concurrently, so timing is not a controlled field result.
- `npm audit --omit=dev` **fails, exit 1**: one high Zod advisory,
  GHSA-mrhx-c7xc-m3w5, proposed fix is major v4. Full install audit reports 16
  records (7 moderate, 7 high, 2 critical). No `audit fix --force`, removal or
  unreviewed major migration. Dependency adoption remains a release decision.
- Production Netlify/DNS/headers/caching, actual deployment SHA, physical QR
  scanning, real mobile Safari/Android, real ad-network fill and field SEO/CWV
  are **unverified by Codex**. Local mocks do not certify advertising compliance.
- Published medium overrides and large-print defaults retain their prior values.
  Broader difficulty semantics, duplicate/excluded export warnings and authored
  prose truth remain separate owner decisions; do not treat structural audits
  as human editorial signoff.

## Preservation, release order and rollback

No authored content, published URL, metadata, canonical/indexability, structured
data, sitemap, robots, static export or Netlify redirect/header configuration
changes. Advertising source, lifecycle, global first-fill suppression, wrappers,
placements and CSS remain unchanged. The original dirty checkout was not edited
or staged. New worktrees isolate both candidates from main and local work.

1. Independently review/release the small fast-track candidate first if its gate
   and baseline dispositions are accepted; ChatGPT monitors the automatic Netlify
   deployment and records its exact production SHA/deploy ID.
2. Refresh this weekly candidate onto the resulting main and repeat affected
   combined validation. Resolve required route/Lighthouse/security gates and
   owner decisions explicitly; do not merge this held draft merely because
   individual branches had passed tests.
3. Friday production requires the exact refreshed SHA's independent signoff,
   complete evidence, known-good provider deployment, and monitoring operator.
   Merge only that reviewed candidate; Netlify automatically deploys it. No
   duplicate manual deployment or automatic PR merging.

Known-good rollback source for this preparation is
`471a118dd459f2181cd641ed0572ba6dd7005540`. ChatGPT reports its successful production
release; its provider deployment ID must be recorded by ChatGPT before a new
release. On material regression restore the known-good provider deployment first,
verify public routes/parity/ad safety, then revert the isolated release through a
reviewed branch. Do not force-push main or change puzzles/SEO/ads as a shortcut.

Main's missing branch protection is confirmed read-only. See the
[required-PR/check proposal](BRANCH-PROTECTION-PROPOSAL.md). No administration
settings, production deployments or original PR histories were changed.
