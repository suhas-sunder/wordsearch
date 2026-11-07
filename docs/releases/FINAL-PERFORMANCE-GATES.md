# Final performance gates — current C4 and preserved B

Current application C4 is `39c0d3564eb014741e259507c9564a4ee1699f1d`.
The ordinary provider-enabled audit completed33actual audits/11groups on Node22.23.4
and unchanged Lighthouse13.4.1 fixture SHA256
`59a1a9fa8c2685c1452d977c23a664a09a2ab4618d0c5508e60ccb6424de021c`.
**Actual exit1 remains unwaived: Best Practices77 in all11groups.**

Current artifacts are under the external `product-excellence/final-39c0d35/`
namespace: `lighthouse-ordinary/attempt-02/{execution,reported-table}.json` and
`console.log`. This is fresh C4 execution, not a relabeled B score. Every group
contains3runs; scores/metrics below are the unchanged fixture's reported aggregates.

| Route | Device | Runs | Performance | Accessibility | Best Practices | SEO | LCP ms | Median CLS | TBT ms |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | mobile | 3 | 98 | 100 | 77 | 100 | 2253 | 0 | 44 |
| Generator | mobile | 3 | 97 | 100 | 77 | 100 | 2254 | 0 | 84 |
| Easy puzzle | mobile | 3 | 95 | 100 | 77 | 100 | 2253 | 0 | 176 |
| Hard puzzle | mobile | 3 | 86 | 100 | 77 | 100 | 2252 | 0 | 459 |
| Category | mobile | 3 | 99 | 100 | 77 | 100 | 2103 | 0 | 36 |
| Collection | mobile | 3 | 98 | 100 | 77 | 100 | 2253 | 0 | 38 |
| Guide | mobile | 3 | 99 | 100 | 77 | 100 | 2103 | 0 | 42 |
| Topics | mobile | 3 | 98 | 100 | 77 | 100 | 2253 | 0 | 43 |
| Home | desktop | 3 | 100 | 100 | 77 | 100 | 563 | 0 | 0 |
| Generator | desktop | 3 | 100 | 100 | 77 | 100 | 482 | 0 | 0 |
| Topics | desktop | 3 | 100 | 100 | 77 | 100 | 562 | 0 | 0 |

The failed weighted audits are `third-party-cookies` and `inspector-issues` in
every group. All other existing guards pass: accessibility/SEO100, LCP<=2500ms,
CLS<=0.1 and editorial performance>=90. Generator and the two puzzle examples
retain the fixture's original noneditorial classification. **Hard-puzzle mobile
performance86 and TBT459ms are explicitly retained**; there is no independent TBT
assertion. Historical B was87/439ms. These unpaired lab observations establish
no whole-page speed improvement or field Core Web Vitals result. The bounded
print-check coalescing experiment's frame-work reduction is a separate measured
result; it must not be presented as a Lighthouse improvement.

Reported median CLS is0 across11groups, but the retained generator worst trace
contains a0.01351327351823848 shift attributed by Lighthouse to web fonts loading.
Do not claim every raw Lighthouse sample had zero shift. The fixture's original
aggregation and0.1 limit are unchanged; the separate84utility pairs are all0.
No font policy, provider request, audit category or threshold was altered.

Current cookie/inspector IDs agree with earlier provider diagnosis. The specific
Google DoubleClick/WarnThirdPartyPhaseout attribution below belongs to that
historical five-sample diagnosis, not a new C4 domain-level capture. Protected
advertising source/CSS identity is independently verified. Provider-disabled
samples are attribution only, never release passes. The ordinary gate remains
blocked pending provider/owner disposition.

Attempt01 failed before any audit on Windows ESM path handling. The external
output-only launcher was corrected to a `file:` URL; both attempts are retained.
Attempt02 used the exact unchanged fixture/configuration/provider requests and
thresholds; its console-table tap only saves the post-audit reported rows.
ChromePID64308 closed normally by CDP Browser.close, exit0/profileCleanuptrue.
Before/after clean-source guards verified175 selected source files, all747 disk
exports, all747 actual HTTP files and three canonical routes. Whole HEAD/tree
identity additionally protects configuration outside the175-file subset.

## Historical frozen B performance gates

Frozen application B is `f7849cddda2a7df5daff2425ba179b9af21f6272`, with local export SHA-256 `3b1b611fe5de81527e8327a31ae6298dd3230596246e2df9b36daa127be279d3`. The ordinary Lighthouse run **failed with actual exit code 1**. Every one of its eleven route/device groups had Best Practices 77; no threshold, advertising behavior or release gate was waived.

All paths below are relative to the external evidence directory `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-final-f7849cd/`. No generated reports or profiles belong in Git.

## Ordinary gate: retained failure

`lighthouse-ordinary/result.json` records direct Node v22.23.4 execution of `tests/e2e/lighthouse-audit.mjs`, exit 1, observed at `2026-11-07T06:40:45.7928396Z`. Lighthouse 13.4.1 used Headless Chrome 157. Each group below contains three runs; these are the console's reported aggregate values, not field Core Web Vitals.

| Route | Device | Runs | Performance | Accessibility | Best Practices | SEO | LCP ms | CLS | TBT ms |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile | 3 | 98 | 100 | 77 | 100 | 2252 | 0 | 37 |
| Generator | Mobile | 3 | 98 | 100 | 77 | 100 | 2253 | 0 | 72 |
| Easy puzzle | Mobile | 3 | 94 | 100 | 77 | 100 | 2481 | 0 | 172 |
| Hard puzzle | Mobile | 3 | **87** | 100 | 77 | 100 | 2253 | 0 | **439** |
| Category | Mobile | 3 | 99 | 100 | 77 | 100 | 2103 | 0 | 40 |
| Collection | Mobile | 3 | 98 | 100 | 77 | 100 | 2253 | 0 | 36 |
| Guide | Mobile | 3 | 99 | 100 | 77 | 100 | 2103 | 0 | 37 |
| Topics | Mobile | 3 | 98 | 100 | 77 | 100 | 2254 | 0 | 38 |
| Home | Desktop | 3 | 100 | 100 | 77 | 100 | 553 | 0 | 0 |
| Generator | Desktop | 3 | 100 | 100 | 77 | 100 | 523 | 0 | 0 |
| Topics | Desktop | 3 | 100 | 100 | 77 | 100 | 552 | 0 | 0 |

The existing fixture fails for SEO below 100, accessibility below 100, Best Practices below 95, CLS above 0.1, LCP above 2500 ms, or editorial-route performance below 90. All applicable guards except Best Practices passed. The fixture already classifies the generator and both puzzle examples as noneditorial; that classification was unchanged. Hard-puzzle performance **87 is below 90**, and its TBT is **439 ms**. There is no separate TBT assertion in this fixture. These observations must not be summarized as a universal performance-90 pass. Ordinary LCP ranged from 523 to 2481 ms; all groups had CLS 0 and accessibility/SEO 100.

Retain `lighthouse-ordinary/console.log`, `result.json`, `fixture-diff.txt`, both fixture hash manifests and both source guards. Before and after guards verified clean B source, 176 source files, 747 disk exports, 747 served exports and three canonical routes against the same export hash. These guards bind the local tested export; they do not attest a separate provider build's bytes.

## Five-sample provider diagnosis

`lighthouse-diagnosis/diagnosis.json` and `result.json` record five serial mobile laboratory samples, exit 0, expressly `notAReleasePass: true`. The operator-supplied application/review SHA is B; per-route response hashes bind observed HTML and do not independently attest source. Scores below are observations, not substitute release assertions.

| Sample | Advertising mode | Performance | Accessibility | Best Practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| Home 1 | Enabled | 98 | 100 | 77 | 100 |
| Home 2 | Enabled | 98 | 100 | 77 | 100 |
| About | Ad-free control | 98 | 100 | 100 | 100 |
| Search | Ad-free control | 99 | 100 | 100 | 66 |
| Home | Provider loader blocked, diagnostic only | 98 | 100 | 100 | 100 |

The enabled Home samples each included four server-rendered ad units and a successful provider-script response. The failing weighted audits were third-party cookies and inspector issues, attributed in these artifacts to `https://googleads.g.doubleclick.net`; inspector cookie reasons included `WarnThirdPartyPhaseout`. About and Search had zero ad units and no provider request. Search's SEO 66 was the intentional `noindex` control (`is-crawlable`), not an ordinary-suite failure or authorization to index search results. Blocking the provider loader yielded Best Practices 100 solely as attribution evidence. It does not establish a production fix, waive the ordinary failure or authorize changing protected advertising code.

## Exact executed fixtures and cleanup

The final OPS worktree supplied the following executed fixture bytes; they are distinct from B application source. The before/after hash manifests match. `fixture-diff.txt` preserves the cleanup-only launch/close changes; route flags, thresholds and existing assertions were retained. The coherent OPS commit must include these exact bytes or explicitly record any later fixture change.

| Fixture | SHA-256 |
| --- | --- |
| `tests/e2e/lighthouse-audit.mjs` | `59a1a9fa8c2685c1452d977c23a664a09a2ab4618d0c5508e60ccb6424de021c` |
| `tests/e2e/lighthouse-provider-diagnosis.mjs` | `4b093569356b90b4fbe3882f9519e8c1539b6238b3c06c8c34c28ce261f834e7` |
| `tests/e2e/audit-chrome.mjs` | `8ebd8ac699b13078c2754a3b2a611fbb6ad6bafd82798051435aa095dc44aa77` |
| `tests/e2e/audit-chrome-cleanup.mjs` | `e4830edfb963d07b81e3951160d62c64c27d540d31e3fc04737892a8b1ee3df2` |

`lighthouse-cleanup/attempt-01/cleanup.json` records two real Chrome `157.0.8103.38` cases under Node v22.23.4: normal completion (PID 105160) and an audit-error path (PID 116272). Both used CDP `Browser.close`, exited 0, removed their profiles and closed their debugging ports. The actual ordinary run (PID 18320) and diagnosis (PID 132068) also logged CDP close, exit 0 and profile cleanup. No forced termination was needed. Successful browser cleanup does not change the ordinary audit's exit 1.

The ordinary Best Practices gate remains open and unwaived. These laboratory records establish neither field performance nor physical-device, manual assistive-technology, editorial, advertising-policy or production approval. Hosted correctness results are separately scoped in [FINAL-HOSTED-ACCEPTANCE.md](FINAL-HOSTED-ACCEPTANCE.md).
