# Final B visual and utility evidence

Application `f7849cddda2a7df5daff2425ba179b9af21f6272`, Node `v22.23.4`, served at `http://127.0.0.1:3502`. The frozen export SHA256 is `3b1b611fe5de81527e8327a31ae6298dd3230596246e2df9b36daa127be279d3`. These checks did not modify the application worktree, HEAD or exported bytes.

## Results

- Expanded visual matrix: **448/448 passed**, 28 archetypes × eight viewport profiles × two themes; zero failed cases and zero notices. Manifest SHA256: `4d45d3d1644a2325c9973a5e523988f905edb03b81a026af9569b8c62a242602`.
- Utility comparison: **84/84 passed; every candidate CLS value was 0**. Historical baseline `1839428c6557dcb3aa663af882cade593618fc6a` had maximum CLS `0.6744444444444444`. Exact request and grid hashes, remaining visible text/order, real print-fit ready states, overflow and recovery assertions remained enforced. The original `.1` absolute and `.01` regression limits were not relaxed.
- Before utility84, between utility84 and visual448, and after visual448, the frozen-export guard verified exact source HEAD/tree/clean status, all **176 source hashes**, the lockfile, the exact **747-file** export set and disk hashes, **all 747 literal HTTP file responses**, and three canonical route responses. All three guards passed.

The visual fixture includes text-line collision checks, serious/critical axe findings, runtime errors, header/ad geometry, keyboard/focus, real export statuses/downloads, local save, clue success/error recovery, measured PDF and default-off sound settings. Ad loading was mocked; this is not an enabled-provider Lighthouse or advertising approval. The 200% profile is an equivalent 640×450 viewport with device scale factor 2, not native browser zoom. Physical printers, Safari and owner/editorial acceptance remain separate.

## Four explicit utility compatibility amendments

The historical baseline predates these already implemented, reviewed UI features. Each amendment asserts its exact scope before removing or normalizing only its own text for legacy comparison. All other text/order, original request fields, grid hashes and thresholds remain exact.

1. The exact long-grid disclosure, `This long grid fits one sheet using small letters. Choose fewer rows or columns for larger type.`, occurs once only on valid print/PDF/answer routes with a dimension above 25, and is absent elsewhere.
2. `Larger grid type` replaces the old `Large print` label exactly once only in valid play/custom preview controls, and is absent elsewhere.
3. PR64's `Edit or save in maker` is absent from the baseline and occurs exactly once only in valid play/custom modes. Its same-origin maker URL has only a state parameter and no hash. The decoded state preserves every original request field, including title, words, seed, alphabet, directions, dimensions and auto-size. Only the asserted link label is removed for legacy text parity.
4. The persistent QR status occurs exactly once only on valid static print/PDF/answer routes, is ready with exact `QR code ready.` text and `Print without a QR code` recovery. The query-only recovery URL is resolved against the actual encoded route, preserves that pathname, and has the exact expected output options with QR disabled. Only this asserted row text is removed. The guard still requires actual print-fit elements and all ready states.

The original failed compatibility attempts remain preserved outside Git; they are not product or CLS passes. The recovery-URL harness correction was proved before the final B run. No observer reset or broad text normalization was added.

## Durable artifacts and manual scope

Durable directory:
`C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-final-f7849cd/visual-and-utility-evidence/`

It contains the visual manifest, complete utility84 measurements, all three full served-byte guard proofs, compact summary, file hashes, 16 unique selected reviewed screenshots, and the two original a3988 defect images/manifests. The full 448 screenshot corpus remains at `C:/Users/Suhas/.codex/tmp/product-final-f7849cd/visual448/`; it was not duplicated wholesale.

The agent individually inspected **14** B images: light 320 PDF utility and solver settings; light 390 export status, clue ready, saved-library detail and measured PDF dialog; light 1280 home, answer hub and clue ready; light 844×390 landscape measured PDF dialog; dark 320 play utility; dark 390 saved-library detail, export error and measured PDF dialog. Root independently inspected **three**: dark 320 generator, dark 390 saved-library detail and light 1280 home menu. One overlaps, making 16 unique. All were readable and contained; no new finding. Neither reviewer claims individual visual inspection of all 448 images. Exact filenames appear in `summary.json`.

Original evidence is retained: a3988 had eight dark play-title contrast failures and separately confirmed mobile export-helper text overlap; the durable before-images and failed manifests remain unchanged. Frozen A's utility comparison had 29 nonzero rows, maximum approximately `.043969`; the independent trace attributed the mobile shift to QR readiness and geometry. B's full 84 comparison now measures zero throughout. The A trace remains at `C:/Users/Suhas/.codex/tmp/product-final-90a0ee3/utility-shift-trace/manifest.json`. PR99 separately covers delayed/error/no-QR/native print behavior: app print buttons are disabled while QR is pending/error; native printing retains the explicit QR-not-ready warning with the worksheet. No universal native print blocking is claimed.

## Repeatable identity guard

Run the direct supported Node executable with `tests/e2e/assert-frozen-export.mjs <export-manifest.json> <frozen-source-root> <outside-repository-proof.json>`. The script requires the manifest's exact Node version and rejects dirty source, mismatched source/export/HTTP bytes, unexpected exported paths or changed manifests. The tool passed Node syntax and targeted ESLint checks, and its three executed B proofs are linked above. Generated artifacts remain outside Git.

Final functional/offline collection review and ordinary enabled-provider Lighthouse are separately owned and must be reconciled with their own exact application provenance. This document does not predeclare their result or authorize publication, merging main or production deployment.
