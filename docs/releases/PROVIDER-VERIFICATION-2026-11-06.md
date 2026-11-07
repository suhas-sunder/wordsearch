# Provider verification — development in progress

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
