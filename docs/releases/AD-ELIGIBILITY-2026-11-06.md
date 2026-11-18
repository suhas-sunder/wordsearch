# PR #8 review classification — November 6, 2026

The [owner review](https://github.com/suhas-sunder/wordsearch/pull/8#issuecomment-6686121112)
correctly distinguishes repository eligibility from advertising-network policy.
`noindex` alone does **not** establish an AdSense violation. This investigation
makes no ad-network compliance determination.

The three retained failures violate the documented **repository** rule:

- [Live integration review, section 9](../audits/adsense-live-integration-review.md#9-route-eligibility-policy)
  lists `draft/noindex content` under `Ad-free` and says ad-free pages receive no loader.
- [Placeholder layout review, section 4](../audits/adsense-placeholder-layout-review.md)
  assigns draft/noindex puzzle states to the ad-free `draft` policy.
- [Existing route audit at the production baseline](https://github.com/suhas-sunder/wordsearch/blob/471a118dd459f2181cd641ed0572ba6dd7005540/tests/e2e/route-audit.mjs)
  explicitly rejects ad wrappers on its representative noindex routes.

| Retained route | Source explanation |
| --- | --- |
| `/categories/health-and-wellness-word-searches` | `app/categories/[slug]/page.tsx` uses a category ad shell unconditionally while metadata reads registry indexability |
| `/collections/brain-training-word-searches` | `app/collections/[slug]/page.tsx` uses a collection ad shell unconditionally while metadata reads registry indexability |
| `/guides/how-hidden-message-word-searches-work` | `app/guides/[slug]/page.tsx` uses a guide ad shell unconditionally while metadata reads registry indexability |

These are confirmed wrapper/inventory findings in exported HTML, not proof of
real-network creative fill. The representative audit is not an exhaustive audit
of every noindex route. The three assertions still fail. Only their diagnostic
wording now identifies the repository rule and disclaims a network-policy ruling.

The other 209 former failures confused approved live-ad wrappers with disabled
development placeholders. PR #8's test-only repair checks the live markup contract
instead; its nine regression cases remain in the existing Vitest suite. It does
not remove or soften the separate noindex check.

Owner decision: confirm this eligibility policy and authorize a separate placement
fix, or explicitly review a documented policy revision. Neither is implemented
in this candidate. Do not infer permission to change placements, CSS wrappers,
fill detection, global first-filled-ad suppression, or fallback behavior from this
test repair. The protected advertising directive remains controlling. The weekly
route gate remains failed pending that decision and any approved follow-up.
