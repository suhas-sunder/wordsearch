# F2 — one-cell words are solvable

Existing generation accepted and placed one-character words, but the shared matcher rejected every path shorter than two cells and the UI discarded same-cell completion. Before edits, the new exact-placement unit regression failed with undefined instead of the placed A.

The matcher now accepts a one-cell path only when it is the exact unfound placement. Keyboard double-Enter, pointer click and repeated tap endpoints can find a genuine one-cell word. Ordinary single-cell cancellation and already-found behavior stay intact; duplicates cannot count twice. No generator, seed, placement, share definition, PDF or answer-grid behavior changes. The specialty audit's earlier observed-gap regression is updated to verify actual repaired support.

Validation: source lint/typecheck and391tests51files PASS; all150 published fingerprints unchanged. Per managing-agent direction, final production/browser validation was combined with named-save reachability and edited print defaults in isolated wordsearch-growth-f2-validation, retaining existing03/55/59/47 ancestry. Combined Node22.23.4 lint/typecheck411tests53files,335page build/static-host PASS. One-cell keyboard/pointer/mobile tap, mixed-length completion and no double counts PASS. Initial mouse fixture attempted an offscreen final row; scrolling into view fixes the actual gesture setup. Tap radio includes explanatory text in its accessible name; fixture uses that real radio name, not an incorrect exact short label.

Combined regressions PASS: opt-in progress/time/cache restoration, completion PNG/share, named library, real offline HTML/PDF,8width preview, protected ads9eligiblex5widths+14ad-free and14archetype mobile/desktop accessibility/skiplink/reducedmotion/zoom. No assertions or timeout thresholds weakened. See combined F2 evidence and final PR SHAs; source changes have not been independently deployed.

Physical device/screen-reader/printer acceptance remains manual. This bounded fix does not claim the complete F2 settings matrix or specialty language certification. Rollback exclude/revert this package. No main merge/push, auto-merge or production deployment.
