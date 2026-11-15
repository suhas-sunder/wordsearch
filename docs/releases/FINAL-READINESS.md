# Final production-readiness decision

**NO-GO. Do not release this candidate on November20 while these gates remain open.**
This supersedes the issue117 handoff's acceptance status, not its preserved
editorial decisions or historical evidence. PR118 remains a draft. Main and the
published Netlify deployment are unchanged. Preparation and review-branch pushes
do not authorize production.

## Candidate and rollback boundary

The candidate continues PR118, `codex/owner-approved-quality-117`, from exact
`008ab2ac2484aa6003a37b2ce8708133aeb3ed3d`. The final exact head and immutable
deployment are recorded in the final issue113/PR118 handoff; never substitute the
mutable PR preview URL or a newer untested branch head. The clean isolated
implementation worktree uses `codex/final-release-acceptance-20261114`.

Production remains `471a118dd459f2181cd641ed0572ba6dd7005540`, deploy
`6aedd79021e0a4d96f61990a`. That is the recovery baseline. A future bad published
release requires an approved Git revert/fix-forward and one normal Netlify build,
followed by production SHA and workflow verification. Do not republish an old
deploy, merge historical stacked PRs or change the60-week editorial schedule.
The January2028 review remains unchanged. No newly indexed content is authorized.

## Corrections

1. **Ad-free navigation:** a genuine production Auto Ads creative survived SPA
   navigation to Privacy. Explicit native document links now separate monetized
   documents from audited trust/search/pack/specialty destinations. Published
   navigation and search suggestions retain their existing behavior. Protected
   AdSense lifecycle, slot IDs and first-fill placeholder suppression are unchanged.
2. **Accurate privacy disclosure:** production Cloudflare performance measurement
   contradicted the candidate's no-analytics assurance and includes encoded shared
   URLs. Two precise privacy disclosures now describe these observed facts.
3. **Browser-print preflight:** the hidden iframe could retain optional fallback
   glyphs after `fonts.ready`, accept a crowded bank, and produce a nearly invisible
   student grid with the actual font. Only the hidden measurement CSS now uses
   `font-display:swap` for copied optional faces. Existing fit rules reject the
   bad output; visible fonts and offline output policy are unchanged.
4. **Acceptance ledger:** the historical ledger generator now reproduces the
   issue117 supersession notice. Its strict synchronization test passes; historical
   feature statuses and manifest gates were not rewritten to manufacture approval.

Runtime changes are confined to Privacy; native link entry points in header,
footer, category/guide templates, attribution, standards, shared tools and hubs;
full-search submission; and `lib/print/browser-fit.ts`. `DocumentLink` is a plain
anchor, not a new hydrated page/layout. The ledger generator is tooling only.

## Acceptance decisions

| Gate | Disposition and evidence |
| --- | --- |
| Fresh supported install | GO: Node22.23.4, clean `npm ci`,490 installed packages; no lockfile change. |
| Lint/type/unit/build | GO on corrected runtime: lint and nonincremental TypeScript clean,750 tests/91 files, production static build. One new semantic continuity check separately joins the19 existing focused checks. |
| SEO/routes/puzzles | GO locally:217 canonical routes,35 redirects,227 link targets, six static utility shells; existing puzzle and staged-isolation regressions pass. Final hosted exact-diff record is required below. |
| Navigation isolation | GO for tested document behavior:16 cases,15 clean ad-free document exits and one published SPA control;11 native/hydrated search cases. Inert-provider tests are not genuine fills. |
| Browser workflows and PDFs | See [fresh workflow record](FINAL-READINESS-WORKFLOWS.md), including actual PDF files, three available engines and failure/recovery evidence. |
| Mobile performance | **NO-GO:** matched baseline40 samples materially fail unchanged LCP and editorial performance thresholds. No safe causal application speed fix was established. See [distributions and traces](FINAL-READINESS-PERFORMANCE.md). |
| Provider Best Practices | GO WITH DOCUMENTED EXCEPTION proposed only for exact external `third-party-cookies` and `inspector-issues` audits. Actual77 remains failed; this exception does not cover performance, consent, ads or application faults. |
| Consent and genuine fill | **NO-GO / critical NOT TESTED:** configured regions and real choice/dependency behavior remain unverified. Natural Canadian observations and Firefox GPC forwarding do not certify consent enforcement. See [ad/privacy evidence](FINAL-READINESS-ADS.md). |
| Security | GO for dependency review: fresh audit reports zero vulnerabilities. No new dependencies, services, tracking configuration or secrets. |
| Physical/native acceptance | NOT TESTED: iOS/iPadOS, Android hardware, physical printer, native browser zoom and screen-reader task acceptance. Browser emulation, PDF rendering and keyboard tests are explicitly separate. |
| Independent review | [Independent decision](FINAL-READINESS-INDEPENDENT.md). Source review permits a review-branch push, not production. |

## Exact preservation and evidence

All150 published puzzle definitions, seeds, words and answer paths remain protected
by the existing regression/fingerprint checks. All217 indexable URLs and35 redirects
remain. The61 staged editorial paths remain excluded; no replacement guide dates
were invented. Historical issue117 allowances are unchanged. The only new semantic
allowance is exact `/privacy` `body.editorial`, chained to issue117's hash in
`tests/seo/final-readiness-delta-allowlist.json`. Navigation changes preserve link
labels and destinations. Full hosted capture must match this single-field delta.

The final hosted evidence and its source identity are appended after the immutable
preview is ready. Raw artifacts live outside Git; their manifest is
`FINAL-READINESS-EVIDENCE.json`. Historical PDF reinspection is labeled separately
from newly generated PDFs. Failed attempts remain preserved, including the original
ledger failure, preflight defect, stale selector assertions and interim lint failure.

## Required next release decision

The scheduler must re-read issue113, check main/PR/deploy identities and honor this
NO-GO. It must skip November20 unless the critical gates are explicitly closed on
one exact reviewed SHA. Do not treat a successful preview, lower relative LCP or
the narrow provider exception as production acceptance.

One practical equipment/account checklist remains: verify existing regional Google
messages and reject/opt-out/return/GPC behavior; perform solve/edit/share/download
and orientation checks on an actual iPhone/iPad and Android device; complete a
screen-reader solve/download task and native zoom; print Letter and A4 student/key
pages at100% and check margins, letters, word bank and answer alignment. Record
which exact source each observation covers. Critical privacy gaps cannot be waived
because physical equipment is unavailable.

After an eventual approved release, monitor page-load distributions, failed
downloads/print refusals, ad-free destination traffic/creatives, genuine placeholder
suppression and regional consent changes. Reopen the provider exception if audit
IDs or origins change, an application source appears, or behavior becomes intrusive.

The PC stays on because unrelated projects/browser work are active. Only task-owned
test servers and browser processes may be stopped.

**GSC/Bing sitemap: no action required now. No production deployment occurred.**
The eventual weekly production message must state explicitly whether sitemap
submission/inspection is required after verifying the published217-route sitemap.
