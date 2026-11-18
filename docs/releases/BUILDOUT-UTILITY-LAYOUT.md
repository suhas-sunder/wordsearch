# F5 / F1 — honest, stable shared-puzzle checking states

Review branch `codex/buildout-utility-layout`, based on frozen integration 03
`1839428c6557dcb3aa663af882cade593618fc6a`. The containing draft PR identifies
the final source. No generator, request decoder, PDF drawing, placement, seed,
metadata, public URL, dependency or advertising lifecycle changes.

## User-visible behavior

Raw play/print/PDF/answer/embed/custom shells previously painted a short loading
message and the footer, then moved that footer when the actual puzzle appeared.
Now a clearly labelled neutral checking preview provides a normal worksheet or
grid footprint. It contains no letters, actual puzzle SVG, ready marker or fake
answer key. Print/PDF routes show their real output labels with native disabled
buttons until validation completes. Browser print during checking shows a wait
message rather than printing a large gray placeholder.

The unrelated footer is withheld only during the ad-free utility's pending
phase, preventing transient/moving link targets while final geometry is unknown.
A small constant inline marker applies the module-scoped class before paint;
layout cleanup removes it immediately on valid/error state and unmount. There
is no timer, arbitrary viewport spacer or ready-output min-height. Root font and
theme classes are preserved. Advertising code/selectors/fill detection/global
placeholder suppression are untouched; utility pages remain ad-free.

Without JavaScript, that marker never runs. A first-viewport explanation replaces
the inert checking preview, and recovery links plus the ordinary footer remain
visible. Invalid-link titles receive a clear hierarchy without changing their
text or generating fallback content. Ready-state visible content is unchanged.

## Frozen repeated verification

Baseline: `http://127.0.0.1:3394`, application SHA above. Final candidate export:
`http://127.0.0.1:3274`. The exact encoded path and SHA-256 of each serialized
request, plus independent DOM grid-token hashes, are retained in the JSON report.

`BASELINE_URL=http://127.0.0.1:3394 BASE_URL=http://127.0.0.1:3274
UTILITY_LAYOUT_OUTPUT=<outside-repo directory> node tests/e2e/utility-layout.mjs`
(set environment variables normally in PowerShell).

All six kinds run at 390/1440 with 8×8, 8×14, 6×40, 40×6 and invalid states.
The square repeats three times: **84 paired comparisons / 168 page loads**.
Every final candidate measured CLS is **0**, against baseline values from about
0.015 to 0.674. The existing `after <= before + 0.01` guard is unchanged. All
request/grid hashes and final visible utility text match; valid/error footers
are visible immediately, pending markers are removed, and no ads appear.

Delayed-JavaScript valid/invalid probes verify the footer is withheld only while
pending, no real output controls are active, and no puzzle/answer SVG or ready
state appears early. Print media shows the checking message. No-JS probes verify
the explanation is near the top, inert previews do not replace navigation, the
footer remains visible, and output buttons stay inactive. Pending and error
screenshots were visually inspected.

Artifacts are outside the repository under the active chat visualization root:
`utility-layout-verified/measurements.json` and sibling before/after/pending PNGs.
The first export's 84-pair results remain separately in `utility-layout/`.

## Regression caught and repaired

The intermediate command against port 3273 failed at play/invalid/390:
baseline 0.0569519866 → candidate 0.1133758025. It was introduced by an anonymous
busy `div` added during no-JS refinement: React reused its large loading-preview
box as the unrelated error `.hero-actions` div. Source inspection showed that
box moving from y87/height598 to y250/height42. It is now a labelled busy
`section`, a distinct semantic checking region rather than an error-action
container. The failure remains in `utility-layout-final/measurements.json`;
no assertion, invalid case or threshold was removed. The final full 84-pair run
includes the correction. An earlier no-JS explanation at y1068 was also moved
to the first viewport and the inert no-JS preview hidden.

## Other checks and boundaries

Full ESLint, TypeScript, 385 tests including all 150 published puzzle fingerprints,
production build (335 pages), static-host (217 sitemap URLs, 35 redirects, six
utility shells) and whitespace checks pass. Existing share-route parity passes
all six rewrites, exact grid/PDF rows, answer paths, QR, invalid states and noindex.
External-input tests pass mobile/desktop bounds, editable recovery and no stale
output/fallback flashes. No formatter script exists.

The parent must integrate this candidate with the later F1 footer fix and rerun
the exact combined release checks. These local Chromium observations are not
physical printing, Safari/Android, screen-reader or production approval. Existing
route-ad and Lighthouse/provider gates remain independent. No main push, merge,
auto-merge or production deployment. Rollback is a reviewed revert.

## Separate ready-print follow-ups owned by the parent

These were reproduced but deliberately not changed in this pending-state batch:

- `StaticPuzzleRoute.tsx`'s ready `window.print()` button and single
  `<PrintablePuzzle>` render (around lines 200/209) ignore an additional browser
  answer sheet. Exact reproduction:
  `/print/eyJ0aXRsZSI6IlV0aWxpdHkgYW5zd2VyIHBhY2tldCIsIndvcmRzVGV4dCI6IkNBVFxuRE9HIiwic2VlZCI6InV0aWxpdHktYW5zd2VyLXBhY2tldCIsImFscGhhYmV0UGFjayI6ImxhdGluIiwiZGlyZWN0aW9ucyI6WyJFIl0sInJvd3MiOjgsImNvbHMiOjgsImF1dG9TaXplIjpmYWxzZX0?answers=1`.
  Browser print and the matching `/pdf/…?answers=1` view show one sheet, while
  the actual downloaded PDF has two pages. Artifact: `utility-followups/answer-packet.pdf`.
- A 40×6 CAT/DOG grid, seed `tall-print-check`, printed through Chromium's Letter
  CSS export produces six pages: header, four grid segments, then bank/QR. All
  240 letters are retained; this demonstrates fragmentation, not lost-character
  proof or physical printer acceptance. Artifact: `utility-followups/tall-browser-letter.pdf`.
