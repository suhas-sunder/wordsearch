# Additional source assets for the conditional 2027 calendar

Planning source: `planning/2026-11-06-christmas-growth` at
`d297f7b71b336029e7d151d4e3e5ca6330438f52`, including the 53-window calendar
and product-finalization contract. Dates are review opportunities, not releases.
No human editorial or owner production approval is recorded by this package.

## Fifteen missing topic assets actually built

| Calendar slot / ID | Authored candidate |
| --- | --- |
| 09 / Y27-09 | Selected World Rivers |
| 11 / Y27-11 | Food Web Relationships |
| 14 / Y27-14 | Seed and Seedling Vocabulary (draft title/path corrected in later quality pass) |
| 15 / Y27-15 | Selected World Deserts |
| 22 / Y27-22 | Context Clue Language |
| 29 / Y27-29 | Deep Sea Animal Groups |
| 33 / Y27-33 | Short I CVC Families |
| 36 / Y27-36 | Electric Circuit Vocabulary (draft title/path corrected in later quality pass) |
| 40 / Y27-40 | Canadian Autumn Wildlife Selection |
| 42 / Y27-42 | Halloween Night Challenge |
| 43 / Y27-43 | Halloween Dress Up Words |
| 45 / Y27-45 | Historic Trade Networks |
| 46 / Y27-46 | Harvest Dinner Preparations |
| 48 / Y27-48 | Christmas Paper Decorations |
| 49 / Y27-49 | Christmas Music Making |

The drafts use original scoped word banks, stable seeds and season-stable
proposed paths. Hard has twenty entries/20×20/all directions; medium sixteen
entries/18×18/E/S/SE/NE; easy twelve entries/14×14/E/S. These describe configuration,
not learning outcomes, age/grade certifications or solve-time guarantees.

Slot 48 is deliberately a specific optional paper-decoration activity rather
than fabricated claims about world Christmas customs. A customs-focused release
would still require separate cultural evidence and review. Canadian wildlife
is a selected multi-region name bank, not a local sighting checklist or a
universal autumn behavior. Harvest dinner does not prescribe a national menu.
Music vocabulary contains no lyrics, branded music or historical-origin claims.

Source notes distinguish checked topical sources (NASA/Canada rivers, EPA food
webs, Minnesota plant science, USGS deserts, NOAA/NOC deep sea, Canadian parks,
UNESCO trade networks) from full entry-by-entry human verification. Dictionary
references on remaining lists are honestly described as references available
for human review, not fabricated proof of a completed spelling audit. No source
prose, illustrations, lessons, definitions or statistics are copied.

## Preserve and reuse the existing owner work

Slots 26 (parks) and 28 (landmarks) overlap the original root worktree's
uncommitted growth file. Instead of inventing replacement variants, two
source-only enhancement snapshots preserve its exact selected words, title,
seed and dimensions. They target the existing **draft** canonicals:

- `/word-searches/geography/national-parks-word-search`
- `/word-searches/geography/landmarks-word-search`

The captured original file SHA-256 is
`b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c`.
The original owner file and all its other records remain untouched. These
snapshots intentionally discard the source's asserted review date and public
promotion plumbing: status stays unreviewed, runtime import forbidden, package
publication allowance zero. Reuse is not approval. Any later change from an
existing draft/noindex canonical to indexable status counts as a newly indexable
URL and must satisfy the calendar's initial one-URL limit and separate approval.

No snapshot is copied into runtime topics, metadata, search, sitemap or links.
The other original geography/history/science records remain preserved owner
work, not automatically declared reviewed or activated.

## Actual export and validation

```powershell
npx tsx scripts/export-calendar-review-asset.ts Y27-42 C:/review/calendar-assets
npx tsx scripts/export-calendar-review-asset.ts OWNER-PARKS C:/review/calendar-assets
```

The explicit destination receives Letter/A4 two-page `UNREVIEWED` PDFs, with
student and matching answer pages, using the measured pack layout. The command
only accepts known IDs and fails if any intended entry is excluded or warned.

- Lint and TypeScript pass; all **389 tests** pass on the package base.
- The fifteen candidates collision-check against all prior forty-five staged
  candidates, every registry record and redirects: zero issues.
- All seventeen review assets place every intended word, reproduce grids and
  match every answer cell. Committed fingerprints cover requests/grids/answers.
- **34 actual Letter/A4 PDFs** have two pages each. Every actual student sheet
  has zero geometry findings, all bank labels present, at least 9 pt grid and
  9.5 pt bank type. No large-print claim is made.
- `npm run audit:candidates -- C:/Users/Suhas/.codex/tmp/ws-calendar-gap-candidates.json --export-dir=../wordsearch-buildout-integration-03/out`:
  fifteen candidates, zero schema/collision/placement/PDF/export-exposure issues.
  Repeat on the exact final integration export. The two preserved target paths
  already exist as draft/noindex routes; this package does not change them.
- Actual hard-Halloween CLI export succeeds on Letter and A4.
- `git diff --check` passes. No formatter script is configured.

Human factual/spelling/semantic, cultural/faith/family context, audience, rights,
distinct-intent and physical-printer review remain required. The later typed
calendar manifest will reference these exact review artifacts rather than
assigning editorial approval or publishing when a date arrives. Advertising,
published puzzles, main and production deployment remain unchanged.
