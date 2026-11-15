# Final production-readiness decision

**NO-GO. Do not release this candidate on November20 while these gates remain open.**
This supersedes the issue117 handoff's acceptance status, not its preserved
editorial decisions or historical evidence. PR118 remains a draft. Main and the
published Netlify deployment are unchanged. Preparation and review-branch pushes
do not authorize production.

## Candidate and rollback boundary

The candidate continues PR118, `codex/owner-approved-quality-117`. Corrected runtime
`676faafc06fc3f63deaf561375122a4b1feccdd6` was independently verified on immutable
[Netlify deploy6af9219f](https://6af9219f10ca250d880fc55a--ilovewordsearch.netlify.app),
READY, deploy-preview, unpublished. It builds on exact
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
| SEO/routes/puzzles | GO: fresh exact-host217-page capture and35 redirects pass;227 local link targets and six static utility shells pass. Independent replay verified every raw response hash, complete sitemap, preview noindex and one exact privacy difference. Existing puzzle/staged-isolation regressions pass. |
| Navigation isolation | GO for tested document behavior:16 cases on local and immutable hosts,15 clean ad-free document exits and one published SPA control;11 native/hydrated search cases. Independent genuine mobile/desktop final Privacy visits had no destination provider traffic, frames, slots or loader; no candidate source fill was available. |
| Accessibility | GO for28 fresh hosted axe archetype/viewport combinations, skip-link, reduced motion and simulated200% CSS viewport checks; no serious/critical violations, runtime errors or overflow. Native AT/zoom remains NOT TESTED. |
| Browser workflows and PDFs | See [fresh workflow record](FINAL-READINESS-WORKFLOWS.md), including actual PDF files, three available engines and failure/recovery evidence. |
| Mobile performance | **NO-GO:** fresh final40 matched samples fail unchanged LCP on11/20 candidate runs and editorial performance on6/10. No safe causal application speed fix was established. See [distributions and traces](FINAL-READINESS-PERFORMANCE.md). |
| Provider Best Practices | GO WITH DOCUMENTED EXCEPTION only for exact external `third-party-cookies` and `inspector-issues` audits. Actual77 remains failed; this exception does not cover performance, consent, ads or application faults. |
| Consent and genuine fill | **NO-GO / critical NOT TESTED:** configured regions and real choice/dependency behavior remain unverified. Natural Canadian observations and Firefox GPC forwarding do not certify consent enforcement. See [ad/privacy evidence](FINAL-READINESS-ADS.md). |
| Security | GO for dependency review: fresh audit reports zero vulnerabilities. No new dependencies, services, tracking configuration or secrets. |
| Physical/native acceptance | NOT TESTED: iOS/iPadOS, Android hardware, physical printer, native browser zoom and screen-reader task acceptance. Browser emulation, PDF rendering and keyboard tests are explicitly separate. |
| Independent review | [Independent decision](FINAL-READINESS-INDEPENDENT.md). Source review permits a review-branch push, not production. |

## Final matched performance result

Five valid cold mobile samples per route and origin on exact runtime676faaf;40
valid, no retries or run warnings. Actual provider traffic remained enabled.

| Route | Candidate median LCP / approximate p75 | Production median LCP |
| --- | ---: | ---: |
| Home | 6368 /6435 ms | 7292 ms |
| Hard collection | 6374 /6460 ms | 2676 ms |
| Ancient Egypt | 2330 /6356 ms | 7969 ms |
| Generator | 6364 /6644 ms | 3193 ms |

Home and Hard median performance both scored69, below90. All candidate accessibility
scores were100 and CLS stayed below0.1. Best Practices remained77 with the same two
DoubleClick audits; production scored58 with additional provider deprecations.
Preview raw SEO66/69 is caused by the expected HTTP noindex boundary; production
canonical/indexable HTML and sitemap were independently checked separately.

The relative comparison is mixed: candidate collection and generator medians were
slower than production in this final series. Lower host load than the first series
and both fast/slow paint clusters prohibit attributing the between-series changes
to the navigation/print fixes. No application performance correction was claimed.
A generator1044ms TBT outlier remains in the valid results. The material failed
thresholds remain release-blocking; they are not a19ms single-run fluctuation.

## Exact preservation and evidence

All150 published puzzle definitions, seeds, words and answer paths remain protected
by the existing regression/fingerprint checks. All217 indexable URLs and35 redirects
remain. The61 staged editorial paths remain excluded; no replacement guide dates
were invented. Historical issue117 allowances are unchanged. The only new semantic
allowance is exact `/privacy` `body.editorial`, chained to issue117's hash in
`tests/seo/final-readiness-delta-allowlist.json`. Navigation changes preserve link
labels and destinations. The full hosted capture matches this single-field delta; main-to-corrected composition
contains2468 explained fields, zero unexplained or stale allowances. Every217 raw
HTML digest and the sitemap were independently replayed.

Hosted evidence is bound to runtime676faaf and deploy6af9219f above.
`final-seo/` and `independent-final-seo.json` contain the exact comparison and replay. Raw artifacts live outside Git; their manifest is
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
