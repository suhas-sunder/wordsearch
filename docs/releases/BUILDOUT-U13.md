# B09/U13 — opt-in device solver progress

Review-only child of completion PR #21 (`790292e46db7d852a1d82e6d246de4c9c1ed5e7c`). No release authorization.

The solver offers explicit opt-in saving and explicit resume. SHA-256 binds saved placement indexes and elapsed time to the complete normalized request, grid and placements. Records contain no raw titles, word lists, seed or share URL. At most 20 records and seven days elapsed time per record are supported; malformed, oversized, foreign or duplicate-index records reject, and storage denial/quota do not prevent solving. Clear and replay remove the current record. Progress stays local, is not synchronized, and a digest is an identifier rather than encryption or a guarantee against guessing a known puzzle. Elapsed time includes time while the tab remains open, pauses between closed/navigated sessions and resumes explicitly. Abrupt tab termination can lose time since the last successful save. No account, telemetry or published puzzle change.

Changed files: `OnlineSolver.tsx`, solver CSS, privacy storage disclosure, bounded `lib/puzzle/progress.ts`, unit/browser tests and package script.

Validation (November 6, 2026, Node 25.9.0):
- `npm run lint`, `npm run typecheck`, `npm test`: PASS, 223 tests including 15 progress cases and 150 published fingerprint assertions. Vitest rewrote only snapshot line endings; restored the initially-clean tracked snapshot.
- `npm run build` in E: review worktree: FAIL, existing cross-drive dependency junction causes webpack to resolve `./C:/.../next/dist/client/next.js`. No application compilation error introduced. Built the already-existing detached C: duplicate at `C:/Users/Suhas/.codex/tmp/ws-progress-build-20261106` instead. All seven modified source-file SHA-256 hashes matched before build. That `npm run build`: PASS, 334 pages. Existing workspace-lockfile and ESLint-plugin warnings remain.
- `npm run audit:static-host`: PASS, 217 sitemap pages, 35 redirects, six utility shells.
- `BASE_URL=http://127.0.0.1:3288 npm run test:solver-progress`: PASS desktop keyboard/mobile touch; opt-in, exact resume, time continuity, seed isolation, private record payloads, replay/clear, corrupt data, secure-crypto absence, blocked storage and quota. First run's network assertion counted existing Next RSC prefetches; fixed fixture allows only same-origin GET static `.txt` requests with sole `_rsc` parameter/no body; other fetch/XHR remains forbidden.
- `BASE_URL=http://127.0.0.1:3288 npm run test:completion`: PASS actual PNG, timing/frozen replay, private file-only native share/cancel, mobile/desktop.

Physical devices, browser termination reliability, cross-tab conflict coordination and a named saved-puzzle library remain outside this milestone. Existing route-ad/Lighthouse/dependency release findings are not waived. Protected advertising implementation is unchanged. Rollback by excluding/reverting this package; stale local records remain inert if feature is removed. No main push, merge, auto-merge or production deployment.

- `BASE_URL=http://127.0.0.1:3288 npm run test:ads`: PASS, nine eligible routes at five viewports and 14 ad-free routes. Mocked local advertising regression does not certify real provider compliance.

Integrated browser follow-up: an initial blocked-storage keyboard test raced the solver's scheduled Begin focus. The fixture now waits for actual grid focus before setting synthetic keyboard endpoints; no application assertion or timeout weakened. Three consecutive full progress runs PASS against the combined integration export at3290.
