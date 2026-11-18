# Buildout integration 01 — review held

Track B; November 6, 2026. Intended earliest review November 12 / release
November 13, only after independent approval. No production authorization.

Base: weekly candidate PR #16, `74b8ff95024b60a7f299175cd153b3c4fb974835`.
Branch: `release/2026-W46-buildout-integration`. The containing commit/PR is
the exact integration checkpoint; production remains
`471a118dd459f2181cd641ed0572ba6dd7005540`.

## Included source milestones

Ordinary merges preserve the original branches and their evidence:

| PR | Scope | Source SHA |
| --- | --- | --- |
| 15 | Remaining UI icons, excluding already released PR 1 | fea066dcf03bb755b166fca23aee991ee541d311 |
| 17 | B01 inventory/lifecycle and unchanged planning documents | 6ed1b0434d82a9bb4e73c4f8964fd7d84b131f7d |
| 18 | B10 offline aggregate release measurement | 5b4d857f910571e6f17a69a18f9f9a333e512416 |
| 19, 23 | B03 deterministic 5/10 PDF engine and noindex pack builder | db13e6b1694af8dcfcda357296f506c63a066778 |
| 20 | B02 bounded candidate QA and output fingerprints | 1e904061f3b61ce3264df8c9d4886dafe60bc27d |
| 22 | Five source-only Christmas/winter candidates | 3a60d11694e8a78cf60a46f08e3ad3d6cdf94b06 |
| 21 | B09 local completion PNG and elapsed timer | 790292e46db7d852a1d82e6d246de4c9c1ed5e7c |
| 24 | B13 optional identity/business discovery; implementation deferred | ef02bec1e6afa60317ff29107d59d8cea9cc657d |

Package scripts were retained together. No source conflicts required dropping
functionality. Combined testing exposed an old utility-icon fixture using the
invalid alphabet ID `english`; corrected it to the existing valid ID `latin`.
The strict input validator remains unchanged. Original PR evidence is preserved.

## Combined validation

Node 22.23.4; fresh frozen static export served on local port 3261.

- `npm run lint`, `npm run typecheck`, `npm test`: passed, 253 tests / 31 files.
- `npm run build`, `npm run audit:static-host`: passed; 217 sitemap URLs,
  35 permanent redirects and six utility shells checked.
- `npm run test:e2e`: passed input/direction regressions, 53 routes at nine
  widths, solver pointer/touch/tap/keyboard, search/navigation/print, then
  advertising checks on nine eligible routes at five widths and 14 ad-free routes.
- Completion, classroom-pack, category-icons, corrected utility-icons,
  share-route parity, printable instructions, preview, PDF and accessibility
  targeted scripts passed. Pack downloads contained matching student/answer grids.
- `audit:candidates -- <five-candidate JSON> --export`: no issues; exact paths
  absent from exported public surfaces; human review explicitly still required.
- `report:cohorts`: baseline report runs with zero newly released content cohorts.
- `audit:routes`: **failed**, retaining the same three draft/noindex repository
  ad-eligibility mismatches documented in AD-ELIGIBILITY-2026-11-06.md.
  These are not determinations about advertising-network policy. No ad behavior
  was changed to silence them.

`npm audit --omit=dev --json` was rerun: exit 1, one high vulnerability retained.
Lighthouse baseline failures remain release risks, not waived checks; Lighthouse
was not rerun for this milestone (weekly PR 16 records its 77 failures).
Additional runs, if executed, are appended before the checkpoint is finalized.
The snapshot file rewritten by the unit runner was verified to have the same
Git-normalized hash as HEAD; no snapshot values changed.

## Safeguards and gates

Existing seeded-grid fingerprints and content tests pass. No published puzzle
content, presets, canonical URLs, metadata, redirects or protected advertising
source changed in this integration. The new pack utility alone adds a scoped
noindex header. New draft files have no public registry imports. There are zero
new human-approved publication assets, and no new production content cohorts.

PRs 25–27, navigation, opt-in resume and later seasonal work are separate
milestones, **not included here**. Their successful individual tests must not be
represented as validation of this frozen candidate.

Independent review, unresolved baseline findings, physical print checks,
editorial approval and production-equivalent verification remain gates. Keep
production unchanged. After approval, revalidate against then-current main;
ChatGPT coordinates the single main-triggered Netlify deployment and records its
exact SHA/ID. Rollback reference is the current production SHA above plus its
verified provider deployment, which must be captured before release. Use the
reviewed revert/restore procedure in README.md; never force-push main.

