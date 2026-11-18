# Lighthouse provider issue diagnosis

F5 operational investigation only. The existing `audit:lighthouse` gate and its
thresholds remain authoritative. This package does not modify ad eligibility,
placement, provider loading/fill lifecycle, consent, environment or deployment.

## Repeatable bounded comparison

Run on supported Node 22 against a separately frozen local static export:

```powershell
$env:BASE_URL = 'http://127.0.0.1:3394'
$env:APP_SHA = '1839428c6557dcb3aa663af882cade593618fc6a'
$env:REVIEW_SHA = '08ffcd2ea97aa43fd73ce79904a86623d7752f84'
$env:DIAGNOSTIC_OUTPUT = 'C:/Users/Suhas/.codex/tmp/ws-lighthouse-diagnosis-03.json'
node tests/e2e/lighthouse-provider-diagnosis.mjs
```

The command runs five serial mobile Lighthouse samples: enabled homepage twice,
ad-free About/search controls, then homepage with only the provider loader URL
blocked inside Lighthouse. Blocking is diagnostic attribution, never a release
configuration, solution or passing release. Ordinary enabled failures stay in
the output. The script never changes application configuration and never calls
an external production URL as its main navigation target.

Evidence contains category scores, exact failed weighted audit IDs, cookie row
counts and origins, inspector categories and CDP warning/exclusion enums. It
does not write raw reports, artifacts, cookie names/values, headers, request
paths, query strings, console text or tokens. A tested allowlist projector
constructs the stored report. Per-route HTML hashes and operator-supplied source
SHAs identify the observed export; those labels are not automatic source
attestation. Provider network evidence records loader status/type without its
query parameters. SSR active ad-unit counts distinguish controls from enabled
pages; the loader itself is inserted after hydration.

Generated JSON stays outside the repository and is saved after each sample so
partial runs remain visibly partial. Chrome is cleaned up in `finally`.

## Results

Frozen integration03 application `1839428c6557dcb3aa663af882cade593618fc6a`,
review `08ffcd2ea97aa43fd73ce79904a86623d7752f84`, local port 3394. Node
22.23.4, Lighthouse 13.4.1 and installed Chrome 157. Five samples completed
2026-11-07 01:18:54–01:19:25 UTC; no full-matrix Lighthouse pass is recorded.

| Sample | Performance | Accessibility | Best Practices | SEO | LCP ms | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Enabled home 1 | 98 | 100 | **77** | 100 | 2253 | 0 |
| Enabled home 2 | 98 | 100 | **77** | 100 | 2254 | 0 |
| Ad-free About | 99 | 100 | 100 | 100 | 2102 | 0 |
| Ad-free search | 94 | 100 | 100 | 66 | 2403 | **0.11186** |
| Blocked-loader home, diagnosis only | 96 | 100 | 100 | 100 | **2554** | 0 |

Both enabled samples reproduced Best Practices 77 with exactly
`third-party-cookies` and `inspector-issues`. The loader returned 200 in both.
One cookie audit row and the inspector Cookie category identified only
`https://googleads.g.doubleclick.net`; CDP recorded `WarnThirdPartyPhaseout`.
The inspector artifact also contained performance issues which were not failed
weighted Best Practices audit IDs. Do not conflate the artifact list with all
failing categories.

The two ad-free controls and blocked-loader diagnostic had no cookie rows,
inspector categories or failed weighted Best Practices audits. This is strong
local attribution to the provider-loader path in these samples, not proof of
all future causes or a production consent finding. No first-party Best
Practices source defect appeared in this bounded sample; no ad-source change
is proposed. Search's SEO 66 comes from `is-crawlable`: this utility deliberately
has `noindex`. Its CLS finding is real on frozen03 and is not waived; separate
search-layout repairs are later work to assess at parent04. The blocked
diagnostic itself exceeded the existing 2500 ms LCP threshold, another reason
it is not a release pass.

Sanitized five-sample artifact:
`C:/Users/Suhas/.codex/tmp/ws-lighthouse-diagnosis-03.json`, SHA-256
`9687ff0b2a3e9d665f0ce8272fdf5e3ebf1faed6218412cc031cf1889743e26e`.
Enabled home HTML SHA-256 was identical across all three homepage modes:
`c0772f0a97f39c793bcbf9eaffd10eea830d50a6f5ca3631878e74703d6c0d12`.
All samples had no Lighthouse runtime error.

After saving all five samples, the initial diagnostic process exited 1 because
its cleanup assumed `chrome.kill()` returned a promise; installed
chrome-launcher returns void here. Cleanup now uses `try { await ... }`, which
supports either return type. An actual separate Chrome launch/cleanup smoke
passed after the fix. The five observed audit records are retained, but that
initial command is not described as an exit-zero full workflow. Parent04 will
exercise the final runner end to end.

A sibling's already-running theme/axe browser fixture overlapped the initial
samples; its healthy work was preserved. Performance scores are descriptive
local observations under that contention, not a stable benchmark or field CWV.

## F5 operational acceptance recommendations

Keep the enabled-provider finding open until exact final-candidate and genuine
provider-preview review. A clean blocked/control result can narrow attribution,
but cannot certify advertising policy, consent, production behavior or privacy
compliance, and cannot waive the existing Best Practices threshold.

Where repeated enabled failures contain only provider cookie warnings and
controls are clean, the next decision belongs to the owner/provider/privacy
review: inspect real HTTPS preview in DevTools Issues and application/storage
panels, distinguish warning from exclusion reasons, and verify applicable
provider/consent configuration through its approved administration process.
Do not remove ads, change fill detection, suppress browser diagnostics or loosen
audits to obtain a green score. Any ordinary first-party defect found during
that review still needs an isolated source fix and regression test.

At parent04, rerun this comparison with its exact frozen application/review SHAs
and output path, then run the existing full `audit:lighthouse` gate in its own
serialized slot. Retain actual failures and raw-score variability. Independent
device, screen-reader, real provider fill/consent and owner production approval
remain separate acceptance gates; no deployment is authorized by this report.

## Tool validation

`node --test tests/e2e/lighthouse-diagnostic-summary.test.mjs` passes two privacy
regressions, including seeded secret values in cookie fields, credentials,
paths, query strings, fragments, user-agent suffixes and unknown issue labels.
Targeted and full ESLint plus TypeScript checks pass. No application source changed,
so no new production build is needed for this diagnostic-only package.
