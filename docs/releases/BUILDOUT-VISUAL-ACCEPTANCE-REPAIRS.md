# Final visual acceptance repairs

Isolated branch `codex/export-help-spacing`, based on application freeze
`a3988b546eedf44c772691dbe65a139b1a74a523`. Development only; no production,
editorial or manual accessibility approval.

The expanded visual review found overlapping export guidance and download status
below the maker preview. The shared form-help rule uses a negative top margin to
sit inside a spaced form grid. These preview paragraphs have no such grid gap.
A scoped positive margin now separates direct preview help and its HTML status
paragraph; form controls retain their existing spacing and live regions remain
mounted.

The dark-mode solver start card had a pale heading on white puzzle paper. Its
stage already reset the light palette, but inherited the body's computed dark
theme text color. The stage now explicitly uses its own ink token. The original
dark320 screenshot and axe contrast failure are retained in frozen evidence.

The real 1200-file PDF audit also disproved an overly absolute help sentence:
ordinary below-grid larger sizing can enlarge bank text from9.5 to11.5pt. Two
help strings now accurately say ordinary sizing does not guarantee a minimum
word-bank size. The separate measured16pt grid/18pt bank action is unchanged.
No PDF bytes, seeded state, print geometry or advertising code changes.

## Validation

Lint and TypeScript checks pass on Node22.23.4. The original full432-case visual
run finished without interruption: eight dark start-card contrast failures,
424 other automated passes and zero notices. Manual inspection found the export
text overlap, now reproduced by the added rendered text-bounds assertion.
Patched focused8 cases, all16 light/dark start-card viewport cases and four390px
export detail cases pass, with zero notices. All start-card headings now use
rgb(23,32,51) on white paper. Reviewed repaired screenshots show separate helper
and status text. The run records baseSHA plus exact tracked patch SHA256
`1b5bad2dd84dc6732b6788b2eae9d61062a8388840b4d5d2ae68dcf57fb01125`.
All514 unit/content/SEO tests,335-page production build and217/35/6 static audit
also pass. Full final combined functional/visual/CLS/provider checks remain open.
The final integration record must identify the replacement application SHA and
distinguish original failing evidence from repaired results.
