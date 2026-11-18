# Final utility comparison and QR shift attribution

Frozen candidate A is `90a0ee32bc984e583cf39d4ebb4b587a2b630c4b` on 3502,
export SHA-256 `a8fc1e5ddd6e10dfe30cd572f49ba9eea64d3ea2bc7c708cfa82a2b4c7dda859`.
Historical integration 03 baseline is `1839428c6557dcb3aa663af882cade593618fc6a`
on 3394. Neither export was modified. No other browser/build ran during measurement.

## Exact comparison

The original 84-pair fixture stops on its first text comparison because PR64 adds
the authorized `Edit or save in maker` action. That failed run is preserved at
`C:/Users/Suhas/.codex/tmp/product-final-90a0ee3/utility84/measurements.json`.
It is not called a product or CLS failure. The bounded compatibility amendment
asserts exactly one labeled anchor only in valid play/custom modes, none in the
historical baseline/other modes, same-origin maker pathname, only a state query
parameter, and every original decoded request field (words, seed, dimensions,
directions and other supplied settings) unchanged. Only its asserted label is
removed from the legacy visible-text comparison. Two earlier explicit amendments
cover the exact long-grid type hint and ordinary `Larger grid type` label.

The complete rerun passes **84 paired comparisons**, delayed-JS valid/invalid
checks and no-JS recovery. Request/grid hashes, other visible words/order, ready
footers, no ads, overflow and the unchanged `after <= before + 0.01` guard pass.
The after-side print-fit wait also requires a real guard, not vacuous every([]).
Results retain both source SHAs, actual ready states and maker href/field evidence.

Actual maximum CLS is **0.04396895220006331** on A versus baseline maximum
0.6744444444444444. Fifty-five after rows are zero; 29 print/PDF/answer rows are
nonzero. No claim of all-zero utility CLS or field CWV is made. Results:
`utility84-final/measurements.json`, SHA-256
`7be5a603fd3aa254ba499a34027234015a4e40fc837abdae09e83f2c1506da7a`.

## Read-only node trace

`tests/e2e/utility-shift-diagnosis.mjs` observes before navigation without resetting
the observer or changing DOM/styles. Six 390-wide cases compare print, PDF and
answer-key with normal QR preparation and QR-off causal controls. It records
shift node selectors, old/new rectangles, QR readiness, image readiness, actual
control/paper rectangles, font and print-fit timing. QR-off is attribution only,
not a replacement release result. All three QR-on cases reproduce
0.04396895220006331; all QR-off cases are zero.

In the representative print trace, at 132.1ms the controls are 192.75px tall with
the QR-preparing paragraph. At 155.3ms QR arrives, the paragraph disappears and
controls shrink to 136.75px. The article moves from y281.75 to y225.75: **56px**.
The layout-shift entry occurs at 156.6ms. Print-fit remains checking through that
shift and becomes ready at 177.1ms without geometry change. The unsized unavailable
QR text also becomes the real 72px image, changing paper height by 33.625px.

This confirms the QR transition, not the hidden onscreen print-fit marker, as the
cause. It is a later regression from PR67's separately preserved all-zero result
(`utility-layout-verified/measurements.json`, documented in BUILDOUT-UTILITY-LAYOUT).
Passing the broader guard does not waive this ordinary source defect.

Trace evidence is at
`C:/Users/Suhas/.codex/tmp/product-final-90a0ee3/utility-shift-trace/manifest.json`
and sibling captures. A focused separate application repair is in progress:
persistent useful QR status/recovery and actual QR asset dimensions, retaining
disabled printing and error/no-QR behavior. Native-print and delayed/error checks
must pass before a new combined freeze and 448-case visual run.

Syntax/ESLint and actual full84/six-trace execution pass for this tooling package.
It changes no application, advertisement, output threshold, seed, publication or
deployment behavior. The original failures and A export remain preserved.
