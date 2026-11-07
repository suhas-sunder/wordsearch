# Correct the advertising statement for review

The existing editorial-policy paragraph says advertising is a future feature
and all labelled areas are inactive placeholders. That contradicts the current
production-default configuration in `lib/monetization/adsense.ts`, eligible-page
loader/unit implementation and the actual enabled-provider observations in
BUILDOUT-LIGHTHOUSE-PROVIDER-DIAGNOSIS.md. It also contradicts the existing
privacy disclosure. Production currently remains unchanged.

This focused draft replaces that claim with:

> Eligible content pages may display advertising. Ads must remain separate from puzzle controls, never imitate download or navigation buttons, stay out of print and PDF output, avoid obstructing play, and never determine editorial topic selection.

This is a reviewable factual copy correction, not permission to publish or a
claim of AdSense compliance. Owner editorial acceptance of this exact paragraph
is still required before a separately authorized production release. Other
published editorial prose, metadata, canonicals and review dates are preserved.

Only this paragraph and this evidence file change. No advertising module,
configuration, placement, fill detection, lifecycle, CSS, wrapper, overlay or
global first-filled-ad placeholder suppression is changed. The protected
AD-PLACEHOLDER-SAFETY directive remains controlling. Existing three noindex/ad
findings, genuine network/consent checks and owner decisions remain unresolved.

Validation: Node22 typecheck, targeted ESLint,15 SEO/ad-markup tests and
`git diff --check` pass. A separate production build/browser matrix is not run
for this static string change; final combined candidate validation must render
the updated policy and rerun protected advertising checks. No new unit test
merely mirrors the sentence. Rollback is a reviewed revert of this focused
copy commit. No main push/merge, auto-merge or production deployment.
