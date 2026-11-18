# Provider verification — development in progress

## Verified checkpoint03 preview

This section supersedes the historical pending-preview observations below.
The ready deploy-preview `6aee77638e14f8381b44e510` belongs to draft PR51,
branch `codex/buildout-integration-03`, exact review commit
`08ffcd2ea97aa43fd73ce79904a86623d7752f84`. Its frozen application tree is
`1839428c6557dcb3aa663af882cade593618fc6a`.
[Open the immutable preview](https://6aee77638e14f8381b44e510--ilovewordsearch.netlify.app).
Production remains the deployment/reference recorded below; no production
operation or provider configuration change was performed.

Hosted six-route share parity passed, including encoded rewrites, identical
grids, PDF rows, answer paths, QR targets, invalid states and noindex utilities.
`tests/e2e/provider-preview-smoke.ts` additionally passed preview noindex headers,
production canonicals,217 sitemap entries, all60 current source-candidate paths
404/absent from sitemap/search, actual search/theme interaction, a downloaded
five-student PDF with five distinct225-cell grids, ad-free pack output, mobile
overflow/runtime checks and useful guide HTML with JavaScript disabled.
The automated smoke blocks the advertising loader to avoid artificial ad
impressions; this is not genuine advertising/consent acceptance or a Lighthouse
release pass. Its exact expected SHA is supplied after read-only provider
verification, not independently attested by the test script.

Artifacts are outside the repository in the chat visualization directory,
`provider-preview-03/`: `provider-preview-smoke.json`,
`provider-home-dark.png`, `provider-pack-mobile.png` and
`provider-student-pack.pdf`. Both screenshots were visually inspected: readable
desktop dark navigation/hero and mobile pack controls, with no horizontal
clipping. The mobile screenshot retains keyboard focus on the skip link and
shows the old03 footer wrapping defect, subsequently repaired by PR57.
The initial canonical fixture compared equivalent homepage URLs with different
trailing slashes; it failed and was corrected through URL normalization. The
original failure report remains beside the passing report.

Candidate04 is draft PR70. These03 results do not validate04's newer features.
Its final exact-SHA provider preview, combined regression and independent
manual approval remain outstanding. Do not interpret a ready preview as a
production or editorial approval.

## Historical observations before the preview completed

Read-only Netlify inspection confirmed the existing ilovewordsearch project
`66aedb4c-b210-45ca-b775-d338d4077dc6`. Published deploy
`6aedd79021e0a4d96f61990a` is ready, production context, branchmain, exact commit
`471a118dd459f2181cd641ed0572ba6dd7005540`. Git remote main matches. No provider
configuration, production publish or branch change was made.

The five recent deployments inspected were earlier planning/UI previews. No
integration03 preview was reported, and GitHub combined statuses for its frozen
application commit were empty. PR51 was retargeted to main as a **draft** so the
existing PR preview integration has an eligible base. This documentation push
is after that base change; inspect the resulting provider state before claiming
a real preview exists. The new preview must be checked against its exact SHA
and deploy ID; an older planning/UI preview is not evidence for this candidate.

No manual/CLI deployment or authentication is performed. Do not create another
site, mutate paid infrastructure or silently alter branch build settings to
make a preview appear. If the existing integration does not build this review
branch, investigate its reported status and retain that external gate while
continuing independent development.

Preview checks pending: canonical/robots/sitemap and draft isolation, static
redirect/header behavior, noindex utilities, download and real PDF parity,
keyboard/mobile/theme critical paths, protected ad checks and published-grid
fingerprints. Genuine ad-network/consent, physical printers, Safari/Android,
screen readers and owner signoff remain separately unexecuted manual checks.

Known-good reference is recorded for a future independently authorized release.
For a bad approved production release, prepare a reviewed revert/fix-forward
commit and let normal Git delivery deploy it; never force-push main or use an
unapproved provider restore/publish operation. Failed preview builds do not
replace the production deployment and therefore require no production rollback.
