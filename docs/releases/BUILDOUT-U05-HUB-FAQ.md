# U05 — practical questions for five existing hubs

Review branch `codex/buildout-hub-faqs`, stacked on shared-search PR 48 at
`1748237db3ebd96cc54abe7ce92a46bc1ba0b862`. Fifteen explicitly authored questions
live in the existing typed `SitePage.faq` field. The hub template now renders
supplied questions with the existing native details/summary component.

Covered hubs: printable, online play, PDF, large print and teachers. Answers
address actual output controls and Answer key page/Name-date labels; Letter/A4
and printer scaling; keyboard/tap selection; exact reprints; local PDF/QR;
share-link privacy and QR capacity; and physical limits of dense large-print
grids. There are no medical, learning-outcome, fixed-point-size or unsupported
accessibility claims. No template-generated FAQ permutations are added.

The existing introductory/editorial paragraphs, all puzzle bodies/configurations,
metadata, URLs, publication flags and reviewedOn dates are unchanged. No new
indexable URL, seasonal publication or human review is claimed. Trust/legal and
individual topic FAQs remain separate editorial scopes rather than receiving
generic additions automatically. Advertising and its geometry/lifecycle styles
are untouched; the ordinary in-flow details section appears below the tools.

## Verification

Node 25.9.0: focused ESLint, TypeScript, existing 43 SEO/published-fingerprint/
FAQ-rendering tests pass. The production build passes 335 pages, and static-host
checks retain 217 sitemap URLs, 35 redirects and six utility shells. No formatter
script exists. The final diff passes whitespace checks.

No-JavaScript Chromium inspection at 390px confirms all five exported hubs
contain their exact three supplied questions and answers (15 total) as server
HTML. Each question is distinct and was checked against the current solver,
PuzzleUtilities and browser PDF implementation. The inherited shared-search
package has seven-template mobile/desktop and protected advertising evidence;
the later combined integration must rerun its broader browser/ad matrix.

Independent review remains required. Existing route-ad, Lighthouse and variable
search CLS gates are not waived. No main push, merge, auto-merge or deployment.
Rollback is a reviewed revert of this isolated package; production remains
`471a118dd459f2181cd641ed0572ba6dd7005540`.
