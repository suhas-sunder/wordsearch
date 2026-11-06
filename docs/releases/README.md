# Controlled delivery: two independent tracks

## Current review candidates — November 6, 2026

Production/main is `471a118dd459f2181cd641ed0572ba6dd7005540`: ChatGPT
reviewed and squash-merged PR #1 and reports its successful Netlify deployment.
PR #1's old parent commit must not be merged again. Remaining UI deltas from
PRs #7/#10 are reconstructed independently on current main in
[draft PR #15](https://github.com/suhas-sunder/wordsearch/pull/15),
`fasttrack/2026-11-06-ui-integration`, head
`fea066dcf03bb755b166fca23aee991ee541d311`; original branches/PRs remain preserved.

The owner authorized a combined **review candidate**, based on current main, for
PRs #2/#3/#5/#6/#9/#11/#12 plus #4/#13 evidence and #8's classified test repair:
`release/2026-W46-integrated-candidate`. This supersedes earlier scheduling/status
notes for those implemented packages; it does not approve production. The first
weekly target remains Thursday November 12 review / Friday November 13 release,
subject to unresolved gates. See [combined evidence](INTEGRATION-2026-11-06.md),
[workload measurements](WORKLOAD-2026-11-06.md) and
[ad eligibility classification](AD-ELIGIBILITY-2026-11-06.md).
Original package and overnight records are historical evidence, not current
production status. No original `ai-issues` document is rewritten.

Main currently has **no GitHub branch protection**, confirmed through its branch
API. Follow the written PR/release gates regardless. See the
[required-PR protection proposal](BRANCH-PROTECTION-PROPOSAL.md); no administration
settings were changed. Codex must not push/merge main, enable auto-merge or trigger
production under this candidate-preparation authorization. ChatGPT releases and
monitors approved work. After any main change, refresh/revalidate the candidate
before release and record the exact resulting production SHA/deployment ID.

Latest implementation authorization and package status:
[November 5 overnight handoff](OVERNIGHT-2026-11-05.md). It advances the eight
assigned implementation/investigation packages on isolated review branches,
including a WS-A03 child of PR #2, while preserving every production gate below.
Earlier milestone stop instructions remain historical, not a reason to end this
explicitly authorized multi-package run after one PR.

Source of truth for requested product work: [owner README](../../ai-issues/README.md).
The [independent audit](../../ai-issues/2026-10-14-independent-audit-and-release-backlog.md)
is evidence and a candidate backlog, not blanket implementation authorization.
Preserve all original issue documents. Follow [AGENTS.md](../../AGENTS.md),
[launch checklist](../launch-checklist.md), and the
[protected advertising directive](../../ai-issues/AD-PLACEHOLDER-SAFETY.md).

## Permanent GitHub / Netlify release workflow

Every push to `main` automatically triggers a production deployment of the
`ilovewordsearch` Netlify project. Treat any main push as a production action.

1. Never push unfinished weekly work to main. Keep each weekly package on a
   dedicated `release/YYYY-Www-*` branch; push completed work and open/update its PR.
2. Keep fast-track visual work on separate `fasttrack/*` branches with independent
   commits, evidence and PRs. Do not mix functional changes into these branches.
3. Do not merge either track until its release gate has passed. Never enable
   automatic PR merging. Never push unvalidated changes to main or deploy them.
4. ChatGPT has verified access to the correct Netlify project through its connected
   integration and independently reviews published commits/test evidence through
   GitHub, coordinates approved releases and monitors production deployments.
   Codex does not need local Netlify CLI access. Do not request local login,
   authentication tokens or credentials.
5. Only after production approval, merge only the validated change into main.
   Netlify deploys automatically; do not trigger a duplicate manual deployment.
   Approval to prepare/push a review branch does not authorize a main merge.
6. Record the exact production commit SHA and provider deployment ID before and
   after each release for verification and rollback. Validate the deployed SHA,
   not merely the latest branch head.
7. Continue unrelated authorized work if one release is blocked. Keep each track's
   status and blockers independent. Current instruction: finish/push both review
   branches and stop at their PR gates without touching main.

These owner instructions supersede the earlier suggestion of CLI/manual deploys
for fast-track work. Local deployment authentication is not a release blocker;
GitHub review, gate completion and ChatGPT release coordination are the workflow.

## Track A - fast-track UX improvements

Small, clearly low-risk visual improvements may ship immediately after validation;
do not hold them for Friday. Examples: consistent logos/Lucide icons, spacing,
typography, footer presentation, button alignment, minor responsive corrections,
and obvious UI-label fixes. Trace every batch to the owner README issue(s), keep
it independently reversible, and use a separate branch/commit from functional work.
Preserve indexed content, canonical URLs, metadata, structured data, crawlable
links and puzzle behavior. Advertising logic, protected placeholders and ad
placement must remain untouched. No meaningful unexpected layout shifts or
accessibility regressions are acceptable. If classification is uncertain, use
Track B.

Run applicable unit/SEO/browser/accessibility tests, production build, static-host
checks and targeted desktop/mobile visual checks. Compare before/after screenshots
and relevant layout geometry. Validate on the exact commit to be deployed, using
the established production workflow. After successful validation Codex is authorized to commit and push clearly
qualifying Track A batches for independent GitHub review without a Friday hold.
ChatGPT coordinates approval and production through the workflow above. Do not
merge, manually deploy or bundle functional changes under this authorization.

Record issue IDs, changed files, baseline/final commit, GitHub review evidence,
exact test commands/results, production URL/deployment ID, verification and
known-good rollback deployment/SHA in a separate `fast-track-*.md` record. Stop and
restore the known-good deployment if verification shows regressions. Fast-track
records are independent of the weekly ledger and do not mark weekly fixes released.

The first requested batch is logo/icon/footer consistency (owner 1, 2, 8),
on `fasttrack/2026-11-05-brand-footer`; its implementer selects only demonstrably
visual changes and maintains a separate record. Initial batch is implemented and
pushed at `3f1b2b3db8ad3ed90e65228855b54c3910251a3e`, independently reviewed and
released through [PR #1](https://github.com/suhas-sunder/wordsearch/pull/1) as
production/main `471a118dd459f2181cd641ed0572ba6dd7005540` on November 6.
ChatGPT reports successful Netlify deployment; its deployment ID remains to be
recorded by the release operator. [Original Track A evidence](https://github.com/suhas-sunder/wordsearch/blob/3f1b2b3db8ad3ed90e65228855b54c3910251a3e/docs/releases/fast-track-2026-11-05-brand-footer.md).
The earlier O01 weekly candidate may be satisfied by that batch only after
its evidence is linked; do not duplicate completed work.

## Track B - weekly functionality and higher-risk work

Fridays are reserved for functionality, puzzle generation, sharing, exports,
significant navigation, indexable pages, SEO and other potentially disruptive
changes. Require comprehensive regression evidence and explicit independent
review before production. WS-W46-01 remains on this track; its authorization is
branch push plus draft PR only, with no merge or production deployment.

## Schedule and package ledger

All dates are America/New_York. Review Thursday; release Friday only after both
gates pass. Dates are targets, never reasons to skip validation. November 27 and
the December holidays require confirmed reviewer/operator availability; otherwise
hold the known-good production deployment and move the package to the next Friday.
One small independently testable package per pushed review checkpoint/draft PR.
Do not combine separate fixes to fill a weekly release. A larger request must be
split into bounded checkpoints before implementation.

| Review / Friday target | Package / issue | Status | Dependencies / acceptance evidence | Commit / PR | Known risk |
| --- | --- | --- | --- | --- | --- |
| Nov 12 / Nov 13, 2026 | WS-W46-01: release setup + WS-A01 directions | Implemented/tested; independent review and baseline release findings pending (see evidence record) | Runtime reproduction; unit/browser regression; baseline seeded compatibility; launch checks with failures recorded | Branch `release/2026-W46-direction-validation`; [review lookup](https://github.com/suhas-sunder/wordsearch/pulls?q=is%3Apr+head%3Arelease%2F2026-W46-direction-validation); exact references in package record | Empty legacy links fail explicitly; baseline route/Lighthouse/security findings block production |
| Nov 19 / Nov 20 | WS-W47-01: WS-A03 external-input bounds | Implemented/tested overnight; draft review pending | Owner authorized stacked implementation from PR #2; input limits, old-link envelope and 150 fingerprints documented | [PR #9](https://github.com/suhas-sunder/wordsearch/pull/9), `620c5b5` | Pathological old definitions outside the explicit envelope now reject; no published grid migration |
| Nov 26 / Nov 27 | WS-W48-01: WS-A02 difficulty semantics diagnosis | Inventory and safe control fix implemented; semantic decision remains open | Published overrides retained; reselecting active difficulty is a no-op; owner approval needed before changing preset meaning/grids | [PR #3](https://github.com/suhas-sunder/wordsearch/pull/3), `7211ff2` | Holiday staffing; changing presets could change established puzzles |
| Dec 3 / Dec 4 | WS-W49-01: WS-A04 incomplete worksheet integrity | Proposed | Owner decides blocking vs informed override; duplicates/exclusions count and warning parity across builder/utilities; print/PDF/solver tests | Not created | Silent missing answers; avoid adding unplaced words to word bank |
| Dec 10 / Dec 11 | WS-W50-01: WS-A06 direction instruction correctness | Output-only correction implemented/tested; draft review pending | Keep serialized requests/grids; derive legacy default output instructions from permitted directions; preserve other authored text | [PR #5](https://github.com/suhas-sunder/wordsearch/pull/5), `8709048` | Identical legacy/authored default text cannot be distinguished; no mass editorial rewrite |
| Dec 17 / Dec 18 | WS-W51-01: Owner 1 consistent logo | Released November 6 through Track A; replace this future slot | ChatGPT reviewed, merged and reports successful Netlify deployment | [PR #1](https://github.com/suhas-sunder/wordsearch/pull/1), production `471a118` | Record provider deployment ID; no repeated implementation |

These are the first six Track B technical/UI release candidates; clearly qualifying
visual subsets may instead ship through Track A as soon as validated. Record
completion and replace an already-satisfied candidate before scheduling more work. WS-A05 large-print
default is decision-only until intended defaults and seeded effects are reviewed.
WS-A07 share/QR transport research, WS-A09 static-route parity, and WS-A10 human
editorial review are ongoing gates or separately scoped future packages. WS-A08
filler review needs a distinct design; do not promise automatically safe grids.
WS-S01–08 remain evidence-dependent proposals, not scheduled publication work.

## Subsequent owner work

Schedule at most one bounded checkpoint on each subsequent available Friday.
December 25, 2026 and January 1, 2027 are planned holds; resume January 8, 2027.
Candidate Thursday/Friday dates below make the queue durable, but remain subject
to the preceding gate, owner priorities and available reviewers. Track A work
can complete an eligible visual subset sooner; mark it done and replace its future
slot instead of waiting or repeating it. Split larger rows into new numbered
packages. None is approved for implementation by this schedule alone.

| Thursday review / Friday candidate | Owner package checkpoint |
| --- | --- |
| Jan 7 / Jan 8, 2027 | WS-O02 icon consistency on one surface |
| Jan 14 / Jan 15 | WS-O05 header alignment / More menu |
| Jan 21 / Jan 22 | WS-O08 footer legal row, if not already completed via Track A |
| Jan 28 / Jan 29 | WS-O09 verified author attribution |
| Feb 4 / Feb 5 | WS-O11 one section's visual hierarchy |
| Feb 11 / Feb 12 | WS-O13 one reproduced builder defect |
| Feb 18 / Feb 19 | WS-O03 one identified UI/copy correction |
| Feb 25 / Feb 26 | WS-O06 shared discovery design checkpoint |
| Mar 4 / Mar 5 | WS-O07 relevant external owner-property links |
| Mar 11 / Mar 12 | WS-O12 contextual internal links on one page |
| Mar 18 / Mar 19 | WS-O17 verified social section |
| Mar 25 / Mar 26 | WS-O10 representative dark-mode checkpoint |
| Apr 1 / Apr 2 | WS-O15 native share/copy fallback |
| Apr 8 / Apr 9 | WS-O18 one supported output-format checkpoint |
| Apr 15 / Apr 16 | WS-O14 waitlist requirements/design checkpoint |

| Package family / owner issue | First bounded checkpoint | Status / dependency | Required evidence / main risk | Commit / PR |
| --- | --- | --- | --- | --- |
| WS-O02 / 2 | Inventory and standardize existing action/category Lucide icons in one surface | Footer released; action/category subsets reconstructed and combined-tested, draft review pending | Existing Lucide library, accessible decorative icons, desktop/mobile evidence | Footer [PR #1](https://github.com/suhas-sunder/wordsearch/pull/1); current icon candidate [PR #15](https://github.com/suhas-sunder/wordsearch/pull/15); originals #7/#10 preserved |
| WS-O05 / 5 | Header right alignment and organized More menu | Queued; O02 conventions | Keyboard/escape/focus/mobile navigation and crawlable links; search behavior separately reviewed | Not created |
| WS-O08 / 8 | Separate footer copyright/legal row | Released November 6 through Track A | ChatGPT independent review and reported successful production deployment | [PR #1](https://github.com/suhas-sunder/wordsearch/pull/1), production `471a118` |
| WS-O09 / 9 | Author attribution in existing About surface | Queued; owner verifies bio | Human fact-check, metadata and link tests; no invented credentials | Not created |
| WS-O11 / 11 | One existing section's hierarchy/buttons | Queued; screenshot acceptance | Mobile/desktop contrast and focus; retain successful content | Not created |
| WS-O13 / 13 | One reproduced remaining builder-settings defect | Queued; correctness releases reviewed | Failing test first; seed/print/share parity; no broad redesign | Not created |
| WS-O03 / 3 | Correct identified nonsensical wording on one page | Queued; human identifies exact text | Focused copy diff/human review; no bulk rewrite/date refresh | Not created |
| WS-O06 / 6 | Shared tools/search and useful page-specific FAQ design checkpoint | Queued; O05 reviewed | Crawlable discovery, unique FAQ; removal of search route needs explicit redirect/indexability review | Not created |
| WS-O07 / 7 | Three contextually relevant owner-property links | Queued; owner verifies destinations | Relevance and link checks; no fabricated affiliation or spam | Not created |
| WS-O12 / 12 | Contextual internal links on one existing page | Queued; existing route inventory | Real navigation value, no broken/cannibalizing links | Not created |
| WS-O17 / 17 | Social links section from verified owner references | Queued; owner confirms accounts | Correct assets/accessibility and mobile spacing; no ad overlap | Not created |
| WS-O10 / 10 | Theme tokens and one representative dark-mode surface | Queued; dedicated design review | Contrast matrix, persisted choice, hydration and all-template follow-up before global launch; protect ads | Not created |
| WS-O15 / 15 | Native social share with copy fallback | Queued; A07 transport study | Browser support, share replay, QR, cancellation; completed-stat cards separate | Not created |
| WS-O18 / 18 | One demand-supported output format | Queued; owner selects format | Reuse generator; download/answer/seed parity; customization research separate | Not created |
| WS-O14 / 14 | Waitlist requirements and data/privacy design | Queued; explicit product/service decision | Preserve anonymous tools; accounts, history, scoring, realtime and paid tiers each separate projects | Not created |

## Thursday review gate

1. Freeze the candidate SHA. Record baseline/main SHA, branch, touched paths,
   reproduction, exact commands and results, failing/unexecuted checks, seed/URL
   compatibility, screenshots where relevant, risks and rollback target in a
   package record. Never mark unrun checks passed.
2. Run `npm ci` with Node 22; `npm run audit:content`, `npm run lint`,
   `npm run typecheck`, `npm test`, `npm run build`, `npm run audit:static-host`,
   `git diff --check`. There is no repository formatter script; use existing
   style and whitespace validation. Do not add/disable tools to make checks green.
3. Serve only exported `out` via `npm run start`. Run `npm run test:preview`,
   `npm run audit:routes`, `npm run test:a11y`, `npm run test:e2e`,
   `npm run audit:lighthouse`, `npm run audit:pdf`. Run affected targeted tests,
   including `npm run test:directions` for WS-A01. Verify desktop/mobile,
   keyboard, persistence, solver, invalid-state shells, and no console errors.
4. Compare baseline seeded grids/placements/answer cells, old omitted-direction
   links, custom state and share/QR/utility surfaces. Inspect real PDF download
   (Letter/A4, portrait/landscape, title, word bank, dimensions, answers, filename,
   embedded QR) and print preview without navigation/ads/controls.
5. Preserve server-rendered editorial HTML, canonical production host, unique
   metadata, sitemap inventory, crawlable navigation, robots, utility/custom/search
   noindex behavior, static export, Netlify headers/redirects. No mass SEO/copy
   changes or raw generated states becoming indexable. Review human content truth,
   direction claims and solvability where content is touched.
6. Independently review the diff and evidence, approve explicitly, and confirm
   the exact SHA remains unchanged. Any new code after validation requires affected
   checks again. A failed or unexecuted required check blocks release. Do not
   merge or deploy unvalidated changes; no automatic merging. A draft PR is a
   review artifact, not production authorization.

## Friday production gate and verification

For Track B, an authorized operator must confirm Thursday signoff, final green checks on the
exact reviewed SHA, no conflicting main changes, rollback deployment ID/SHA, and
availability to monitor. Merging either track requires release-gate approval; the merge triggers
production automatically. Never enable automatic merging or run a duplicate
manual deploy; WS-W46-01 authorizes only branch push/draft PR.
Provider-generated previews are review-only and must not replace production.

Deploy only `out` with existing Netlify configuration; no runtime plugin,
Functions or Edge Functions. On a production-equivalent preview verify committed
301s, arbitrary encoded utility rewrites, long saved states, `_headers`, caching,
canonical/noindex, invalid links and zero server-function requirements. Local
emulation does not prove provider/DNS behavior.

After authorized deployment, record deployment URL/ID, timestamp and SHA. Run
`BASE_URL=https://www.ilovewordsearch.com npm run audit:routes` (PowerShell: set
`$env:BASE_URL` first). Check HTTPS and preferred-host normalization in one hop;
home, generator, category, collection, guide, easy/hard, topics, search, About,
404 and malformed links on desktop/mobile. Replay seed/share/QR/print/PDF/answers;
confirm no localhost metadata and unchanged sitemap/robots. Monitor browser
errors, broken links and provider invocation metrics during the release window;
record observation and follow-up owner. Production and real-device QR checks stay
pending until actually executed. Field SEO/CWV follow-up uses real data, not
ranking promises or local Lighthouse as field evidence.

Advertising is protected: do not modify fill detection, global first-ad-render
suppression, overlays, wrappers or placeholder policy as incidental work. Preserve
existing live/disabled behavior. Mock checks cannot certify ad policy compliance;
any alternative requires the owner's explicit approval and production-equivalent
real-network evidence required by the protected directive.

## Rollback and record keeping

Before release record the last known-good provider deployment and source SHA.
On wrong grid/answer, broken print/PDF, widespread errors, route/indexability or
ad-overlap regression: stop rollout, restore the known-good provider deployment
first, verify public routes and parity, and record incident time/symptoms/affected
URLs. Keep evidence outside deployment. Revert the isolated merge only through a
reviewed follow-up branch; never force-push main or repair by changing canonicals,
deleting content, weakening tests or altering ad safety. Re-run gates on any fix.

Each `WS-*-*.md` record must carry issue IDs, status, intended release, dependency,
starting/final SHA, commit/PR URL, exact test evidence, limitations, deployment and
rollback references. Status progression: proposed → investigating → implemented
→ validated → independently approved → released → verified (or held/rolled back).
Keep references as durable links; package records may refer to their containing
commit/PR when a self-referential final SHA cannot be embedded in that commit.
