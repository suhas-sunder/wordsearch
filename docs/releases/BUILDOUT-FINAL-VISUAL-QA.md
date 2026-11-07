# Expanded frozen-candidate visual acceptance

This package extends the existing F1 fixture from 14 to 27 real interface states.
It is development evidence, not editorial, owner, physical-device, production,
advertising-provider or medical acceptance. All staged content stays unpublished.

## Reproducible scope

Run `node tests/e2e/product-visual-acceptance.mjs` with `BASE_URL`, the exact
40-character `F1_SOURCE_SHA`, and an outside-repository `F1_VISUAL_OUTPUT`.
Optional comma-separated `F1_CASE_NAMES` and `F1_VIEWPORT_NAMES` make bounded
regressions explicit in the manifest; a filtered run never claims the full matrix.
The default is 27 cases, eight viewports, and two themes: **432 cases**.

The retained cases cover home, search, generator, published puzzle, hard hub,
collection, category, guide, supported Morse specialty, pack builder, encoded PDF,
About, privacy and 404. Added cases cover teacher/worksheet hubs, print with answer
page, answer key, online play, invalid encoded utility, a real named local save,
ready and invalid/repaired clue worksheets, actual SVG/PNG/TXT downloads, a forced
PNG failure, the measured PDF dialog and the solver settings dialog.

The sound row is exercised default-off, on and off without solving. Instrumented
AudioContext/oscillator construction/start and media requests must remain zero;
Done must return focus to Settings and reopening must preserve off. This does not
certify audible output or physical audio policy. The clue-invalid case captures
the actual error and then repairs the textarea to a ready, accessible worksheet.
Error/export checks preserve the original grid and exercise real live statuses.

Every case checks document overflow, effective palette, header/ad separation,
open-dialog overflow, runtime errors and serious/critical axe findings. The
strengthened fixture also compares rendered text-line rectangles across adjacent
export explanations/statuses, with a 0.5 CSS-pixel tolerance in both axes. It
records actual solver start-title foreground/card background alongside axe.
Container bounds alone do not prove text remains separated.

Widths are 320/390/768/1024/1280/1600, short landscape 844×390, and 640×450 at
deviceScaleFactor 2 as a 200% equivalent reflow sample. The latter is not native
browser zoom acceptance. Screenshots include viewport captures, full pages at
390/1280, and local-library/preview details for the relevant states. Evidence is
outside Git, with one manifest row saved after every case. The actual ad loader
is substituted in this visual fixture; enabled-provider and protected ad lifecycle
checks remain separate gates.

## Frozen candidate and findings

Application `a3988b546eedf44c772691dbe65a139b1a74a523` was served from its exact
production export on `http://127.0.0.1:3493`, using Node 22.23.4. Its 28-case new
state smoke (seven dynamic cases × two narrow/landscape profiles × two themes)
completed with zero automated failures/notices. The subsequent full matrix is
recorded under `C:/Users/Suhas/.codex/tmp/product-candidate-04-a3988b5/visual-full`.
Results from the original and corrected exports must not be combined as one pass.

The original full run completed **432/432**, exit 1: eight serious contrast
failures, all dark `play-tool` start cards, and zero lower axe notices. The other
424 rows passed their then-loaded automated checks. The strengthened bounded
regression (`clue-ready,grid-export-status,grid-export-error,play-tool` at 320,
both themes) completed eight rows, exit 1 with the expected seven failures: all
six helper cases report overlapping text rectangles; dark play reports contrast;
light play passes. Dark start-title foreground is `rgb(232,238,246)` on white,
compared with the light theme's `rgb(23,32,51)`. Evidence is in the sibling
`visual-expected-fail/manifest.json`; no failed check is waived.

Two concrete source defects were found and reported without interrupting or
altering the running frozen export:

1. Direct builder export helper paragraphs inherit the form-oriented
   `.control-help { margin: -8px 0 0 }` without the form's grid gap. Adjacent helper
   and success/error status text visibly overlaps at mobile and desktop widths.
   Representative captures are `light-390-grid-export-status-detail.png`,
   `light-390-grid-export-error-detail.png`, `light-1280-clue-ready-detail.png` and
   `dark-390-clue-ready-detail.png`. The original matrix did not yet contain the
   new text-line collision assertion: its automated passes do not waive this
   manually observed defect. A bounded failing regression is required before the
   scoped spacing correction is accepted.
2. The dark online solver start card preserves white printable paper but inherits
   the body's pale title color. Axe reports serious `color-contrast` on
   `#solver-start-title`; the screenshot confirms pale text on white. The existing
   settings case begins the puzzle first, so it cannot cover the start card.
   `dark-320-play-tool.png` preserves the actual failure.

The parent owns the isolated application corrections and a new frozen build.
Post-fix evidence must identify that new application SHA, retain the original
failures, recheck all eight dark play profiles, and pass the text-bound assertion.
No advertising, puzzle placement, seed, editorial text or publication flag is
changed by this QA package.

Individual review covered 50 original-export captures: every archetype at a
narrow mobile width (dialog checks also use the 320 smoke), selected 1280 desktop
pages/details, light/dark saved-library and clue output, and short-landscape
settings/PDF dialogs. The outside-repository `manual-visual-review.json` records
the exact filenames and findings. Reserved advertising space in the mocked-loader
captures is preserved rather than treated as a reason to change ad placement.

## Isolated repair regression

The isolated repaired export on 3494 is accurately identified as base
`a3988b546eedf44c772691dbe65a139b1a74a523` plus the three-file application patch
SHA-256 `1b5bad2dd84dc6732b6788b2eae9d61062a8388840b4d5d2ae68dcf57fb01125`,
not relabeled as the unchanged base. The same eight previously failing/regression
rows pass with zero failures/notices. A separate 16-row online-play matrix covers
all eight profiles in both themes, also with zero failures/notices; every measured
start title now uses ink `rgb(23,32,51)` on white. Four additional 390-wide export
success/error rows pass and provide readable detail captures for manual comparison.
The light success and dark PNG-error detail screenshots and repaired dark-320
start card were inspected individually: text remains separated and readable.

Artifacts are under
`C:/Users/Suhas/.codex/tmp/product-candidate-04-repaired-patch/` in
`visual-focused`, `visual-play` and `visual-spacing-390`. This bounded patch
evidence does not replace the pending final committed-SHA 432-case run.

## Remaining acceptance boundaries

Manual review is a recorded sample of generated screenshots, not an assertion
that every captured pixel or all 432 screenshots were individually inspected.
Physical mobile/Safari, native browser zoom, real printing, audible sound and owner
visual acceptance remain human checks. Provider-enabled Lighthouse and the
84-pair utility CLS comparison require their separate quiet resource slot and
must retain actual failures. No threshold is reduced to obtain a pass.
