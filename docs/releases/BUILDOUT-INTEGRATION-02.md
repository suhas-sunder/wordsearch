# Buildout integration02 — frozen review checkpoint

Base PR28 `10d6379bc29f2c46589c32d29b4dfae6c3805f19`; draft PR37,
branch `codex/buildout-integration-02`. Application/test integration is at
`52f2a7a0c9b443d8a808cb1ea561d0a9973478d0`; containing documentation commit
is the final review head. Main confirmed unchanged at
`471a118dd459f2181cd641ed0572ba6dd7005540`.

Preserves original PR ancestry and includes:

| Source | Package / final source head |
| --- | --- |
| PR25 | Real PDF geometry measurement39316a0 |
| PR26 | Unpublished evergreen pilot f34b75a |
| PR27 | Measured opt-in pack layout plus help/parity follow-up8633830 |
| PR29 | Winter sports/wildlife source drafts245845f |
| PR31 | Footer maintainer/copyright e6f7382 |
| PR32 | Clear hub heading3c26769 |
| PR33 | Accessible responsive menu/search2cc4c20 |
| PR34 | Explicit local solver resume e14559f and focus-fixture fix c6553c8 |

Package-script merge conflicts retained all inventory, print-measurement,
navigation, completion and resume commands. No functional branch was dropped.
All new inventory remains outside public registries, search index and sitemap.
Advertising implementation and all150 published puzzle fingerprints remain
unchanged.

Validation November6 Node25, frozen export on3290:

- ESLint, TypeScript, all290tests/37files, production build335pages and
  static-host217sitemap/35redirects/6utilityshell checks PASS.
- Full `test:e2e` PASS: external input/direction checks,53routes×9widths,
  search/navigation/utilities/print and pointer/touch/tap/keyboard solver;
  protected advertising checks9eligible×5widths and14ad-free routes PASS.
- Header keyboard/focus/search/outside-click/no-JS/ad geometry PASS.
- Completion timing/native file share/PNG,5/10 pack PDF downloads with paired
  grids and14-archetype mobile/desktop accessibility/zoom/reduced-motion PASS.
- Resume initially timed out after the Begin button scheduled initial grid
  focus. Fixed the fixture to await that real focus before synthetic keyboard
  input; assertions unchanged. Three consecutive combined resume runs PASS.
  This does not claim bfcache timing support; that follow-up remains separate.
- `audit:routes` FAIL: same three internal noindex/ad-eligibility findings,
  retained unchanged. `npm audit --omit=dev --json` FAIL: one high Zod advisory.
  Their independent fixes/gates belong to later packages, not this frozen tree.
- PR15 repeated visual measurements show intermittent unchanged-threshold CLS
  failures; old all-pass claim superseded. Lighthouse not rerun here; baseline
  best-practices77 remains recorded. No failure was waived or threshold relaxed.

No formatter script exists; whitespace checked with Git. Unit snapshot changes
are line endings only with no normalized diff. Physical printers, real ad-network
rendering, editorial approval and provider/production checks remain external.
No main push/merge, auto-merge or deployment. Exclude this review branch to roll
back; later integration03 is independent and must receive its own validation.
