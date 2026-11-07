# Source-only 2027 review calendar and zero-publication ledger

Planning source fetched and read at
`d297f7b71b336029e7d151d4e3e5ca6330438f52`: the 2027 weekly calendar and
product-finalization/acceptance contract. This implements the source inventory
and review ledger, not a scheduler, publishing service, owner approval or
production acceptance. The parent workstream owns F0–F6 product acceptance.

## Built mapping

`content/staged/editorial-calendar-2027.ts` records all **53 Fridays** from
January 1 through December 31, 2027: **35 conditional candidate opportunities,
15 enhancement windows and 3 maintenance holds**. Every row retains the
planning focus/condition, actual review asset IDs, a source-scope note, initial
zero/one cap and an existing published canonical fallback.

`content/staged/editorial-assets.ts` resolves those IDs against **60 real staged
puzzle candidates, 16 larger-type utility selections, 2 preserved owner draft
enhancements and 3 relevant review packages**. References include exact source
file, draft PR and content commit. Twelve unique commit/file pairs were checked
with `git cat-file -e`; no proposal is represented as an owner-reviewed asset.
All new content remains editorially unreviewed and publication unauthorized.

Gap inventory is real implementation in PR 53, commit
`11e492098eaeeb9259ce98ed8b35c75558ba1760`: fifteen authored candidate word banks,
complete seeded grids/answers and actual Letter/A4 outputs. Parks/landmarks
reuse preserved original owner words/seeds at existing draft canonicals rather
than duplicating their intent. Original asserted review dates are not adopted.

Scope reconciliation is explicit:

- Word-family opportunity reuses the built AKE sheet; a blend list is not implied.
- Literary analysis reuses sound/structure; a second overlapping generic page
  is not invented to make the slot appear fuller.
- Larger-type garden/birdwatching remains a utility on the existing canonical;
  type size alone is not a new indexed-page purpose.
- Word-formation terminology supplies the adult hard/etymology option.
- The Christmas customs opportunity has a specific optional paper-craft draft;
  a culturally framed customs release still needs additional evidence.
- Existing draft parks/landmark/hub activation is **not exempt** from the new
  indexable-URL cap merely because a route path already exists.

## Offline selection behavior

```powershell
npx tsx scripts/editorial-calendar.ts
npx tsx scripts/editorial-calendar.ts --slot=2 --assets=H02-01 --disposition=propose-for-review
npx tsx scripts/editorial-calendar.ts --slot=2 --assets=H02-01 --disposition=carry-forward --carry-to=9
```

The default JSON report includes all windows, source/PR/SHA references, inventory
counts, structural audit results and **53 zero-publication ledger entries**.
Optional arguments prepare one hold, review proposal, existing-page merge,
carry-forward or cancellation record. Every result still has empty
`newIndexablePaths`, no recorded editorial/owner approval and
`publicationAuthorized: false`. Calendar dates never trigger an action.

A review proposal may describe at most one hypothetical new indexable URL in
a candidate window. Enhancement/hold windows cannot propose new indexing.
Utilities count zero. Activating a draft canonical counts one. An existing-page
merge is a zero-URL alternative, not permission to modify the page. Carry-forward
records a later candidate-review target only; it does not schedule publication
or silently rewrite the later window's source mapping. Independent review and
an explicit future mapping update remain necessary.

The ledger rejects approval/publication fields, unsupported states, duplicate
or unknown assets, references assigned to a different window, invalid dates/
slots, backwards/hold carry targets, and proposals beyond the initial cap.
It cannot infer human approval from a technical pass, date, draft PR or filename.
No automation, network service, paid infrastructure or production writer exists.

## Verification

- Calendar audit checks every Friday, exact slot sequence, source mix, existing
  published canonical fallbacks, unique IDs, real source ID/path mappings,
  PR/40-character commit fields and zero-publication defaults.
- Snapshot freezes the 53 date/kind/reference mappings. Tests exercise held,
  proposed, cancelled, merged and carried records, draft activation counting,
  utility output reuse and rejection of fake approval/invalid indexing.
- All 60 candidate paths remain absent from runtime registry; all source flags
  remain unreviewed. Source puzzle/PDF correctness is independently tested by
  the underlying source packages, not inferred from calendar metadata.
- Lint/TypeScript/full tests passed with **394 tests**; final carry-forward
  additions also passed the focused five-test suite, lint and type checking.
- All twelve unique exact Git commit/file references exist locally. This is
  provenance verification, not a claim of independent content approval.
- Actual default and single-proposal JSON commands ran successfully; their
  output stays outside the repository. `git diff --check` passes.

No runtime source, published puzzle, metadata, canonical, sitemap, ad behavior,
main branch or production deployment is changed. Dates remain review options;
zero new indexable URLs is the correct result until worthwhile independently
approved content and explicit owner release authorization exist.
