# Final advertising and privacy acceptance

## Disposition

**NO-GO for production consent acceptance.** Natural Canadian browser observations
and a functioning preview do not verify the publisher's configured markets,
account-side messages, consent choices or regional request dependencies. No CMP,
advertising ID, provider configuration or protected placeholder behavior was changed.
The exact final-source handoff is in `FINAL-READINESS.md` and issue113.

## Demonstrated defects and corrections

An independent reviewer observed a provider-marked filled Google Auto Ads anchor
on production's homepage. Clicking its footer Privacy link retained the same document
(both a unique marker and `performance.timeOrigin` survived). Privacy's H1 loaded
and application ad units disappeared, but the provider-owned anchor creative
showed a visually confirmed creative seven seconds later. The source screenshot
had positive frame geometry but did not yet show creative pixels. An Active View
request started 468ms after
the route change and returned200. A fresh-document Privacy control had no Google
loader, ad units, visible creatives or advertising/CMP requests.

The application cannot dispose of provider DOM outside React by unmounting its own
slots. `DocumentLink` uses an ordinary native anchor for the known ad-free entry
points: shared trust/legal/about/help links, authors and methodology/standards,
full-search links, worksheet packs and specialty utilities. A submitted full
search uses native navigation too. Published suggestions and published-to-published
links retain client navigation; the header search button still opens its menu.
Native encoded puzzle utility links already used the correct boundary.

An inventory of all217 retained indexed candidate pages found209 monetized pages
and4,129 links to recognized ad-free destinations. The audited entry-point classes
are covered by the correction. This is an explicit navigation fix, not a provider
cleanup routine or a newly hydrated layout. Protected `AdSense.tsx`, advertising
IDs, slot requests, CSS stacking and first-filled suppression remain unchanged.

The candidate's categorical assertion about having no separate analytics was also
incorrect. Production loads Cloudflare's beacon and posts performance measurements
to `/cdn-cgi/rum`; preview does not. Two synthetic utility visits confirmed that
the measurement payload includes the encoded shared puzzle path. Privacy now
discloses Cloudflare measurement and that it can include a shared page's URL.
Cookie values and measurement payload contents were not retained in this test.

## Real-network baseline evidence

Evidence root: `readiness-20261114/` in the outside-Git artifact directory recorded
in `FINAL-READINESS-EVIDENCE.json`. These are observations of exact008ab2a and
production471a118, not claims about an untested future production deployment.

`live-ads/observations.json` contains56 visits across390px/light and1600px/dark:
six published templates on both origins, all12 candidate draft routes, candidate
Privacy/search/encoded play, and production encoded play. Requests were genuine;
there was no interception, geolocation override, ad clicking or fabricated fill.

- All24 direct draft observations had no provider requests or app ad markup.
- Direct candidate trust/search/play and production play were ad-free.
- Production mobile Animals had a genuine visible creative; all placeholders were
  hidden. Its screenshot was visually inspected. No puzzle-control overlap was
  observed in the sampled DOM measurements.
- Candidate slots were unfilled in this series. Genuine delayed/later candidate
  fills therefore remain unavailable; mocked lifecycle regressions are distinct.
- Fifteen initial overlap flags were provider-empty iframe shells beneath expected
  placeholders, not observed creatives. The original report remains unchanged.
  The probe now records fill status and excludes explicitly unfilled shells from
  creative-overlap failures, while retaining their DOM geometry.
- Two production homepage interactions timed out looking for the candidate-only
  Theme button. Their network snapshots remain valid; the independent four-case
  navigation probe supplied the missing navigation evidence. The probe now records
  that absent production control instead of pretending it exists.
- Candidate theme/resize observations made no assertion that an unfilled frame was
  a genuine first or later fill. Such acceptance cannot be inferred from exit code.

`independent-navigation/` contains the reproduced production Privacy creative,
candidate/production mobile/desktop navigation records, and fresh-document control.
`ad-document-navigation-local/` separately contains16 deterministic document tests
(15 clean ad-free document exits and one published SPA control); its inert provider
fixture is explicitly not genuine-ad acceptance. `native-search-local/` has11
no-JavaScript and hydrated search tests. Final immutable repeats are recorded in
the main handoff.

## Consent observations and limits

Cloudflare's public trace reported `loc=CA`, `colo=YYZ`. Only country/POP/protocol
were saved; no IP address. Production exposes Google Funding Choices and TCF2.3.
Sampled pings returned loaded, `gdprApplies:false`, `displayStatus:disabled`, with no
GPP/USP API and no visible consent or opt-out controls. The preview did not expose
these production APIs. That difference prevents preview-only consent certification.

The independent Firefox150.0.2 test used two isolated browser-owned profiles and
the browser's native GPC preference. Off: navigator false, no Sec-GPC. On: navigator
true and `Sec-GPC:1` on the document, Google loader, three observed HTTP200 ad
requests and15 Funding Choices requests. Neither profile exposed a visible choice;
observed cookie names were the same, and no `rdp`, `npa` or consent-string query
keys were observed. Cookie values were excluded. **Signal forwarding passed;
publisher/provider opt-out enforcement was not established.** Canadian observations
do not establish behavior in applicable U.S. states, EEA, UK or Switzerland.

Sources: [Google European CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en),
[Google U.S. messages](https://support.google.com/adsense/answer/10961479?hl=en),
[Google RDP settings](https://support.google.com/adsense/answer/14182916),
[Firefox GPC](https://support.mozilla.org/en-US/kb/global-privacy-control),
[Cloudflare collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/),
[Canadian privacy regulator guidance](https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/tracking-and-ads/gl_ba_1112/).
These describe requirements/mechanisms; they do not certify this site's compliance.

## Required acceptance before release

Inspect existing Google Privacy & messaging configuration and its actual configured
regions. In each relevant region, verify the published choices, initial request and
storage dependencies, reject/opt-out persistence, return visits and GPC where
applicable. Confirm genuine fills followed by the corrected ad-free navigation on
the final approved source. No account-side access or geographic enforcement was
bypassed. Native computer-use ended when URL identity could not be verified; no
unsupported workaround was used. These critical missing observations are release
gates, not a legal-compliance waiver.
