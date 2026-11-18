# Ten hard evergreen drafts and three measured printable packs

Source-only review work on integration-02 `d9ab6fb`. Nothing is registered in
runtime content, search, sitemap or public links. All ten candidates are drafted
and unreviewed; none has publication approval. Published seeds, grids and answer
keys remain unchanged. The original dirty growth list was inspected and left
untouched; this batch avoids its countries, capitals, landmarks, parks,
American Revolution, Civil Rights, Periodic Table and Genetics topics.

## Built assets

Each candidate has twenty authored entries, a frozen 20×20 grid, all eight
directions, complete placement and an ordered answer fingerprint. Hard describes
configuration; there is no unsupported expert rating or solve-time promise.

| ID | Candidate | Distinction |
| --- | --- | --- |
| H01-P | Pollination Interactions | Flower structures and reproduction processes rather than general flowers/insect names |
| H02-C | Cartography and Projections | Specialist projection names and properties beyond basic map vocabulary |
| H03-O | Ocean Water Processes | Physical-oceanography terms rather than ocean names or animal species |
| H04-P | Historic Print Shop | Tools, production terms and book formats rather than generic invention history |
| H05-M | Mineral Identification Properties | Observation terms rather than another mineral-name list |
| H06-L | Poetic Sound and Structure | Analysis vocabulary beyond introductory poetry words |
| H07-A | Aircraft Structures and Controls | Aircraft parts rather than airport passenger services |
| H07-B | Architectural Elements | Building-detail terminology rather than landmark names |
| H05-R | Renewable Electricity Systems | Sources plus associated equipment; infrastructure is not mislabeled as a renewable source |
| H06-W | Word Formation and Origins | Linguistic processes without fabricated etymological examples |

Three actual named pack compositions are available through editorial tooling:
`hard-variety-10`, `science-systems-5`, and `ideas-and-design-5`. They reuse these
ten original grids, not a repeated list with ten seeds. The latter two partition
the ten children into five science/nature subjects and five mapping/history/
language/design subjects. Their names describe the selections without claiming
curriculum alignment.

```powershell
npx tsx scripts/export-staged-evergreen-pack.ts hard-variety-10 C:/review/evergreen-packs
```

The explicit output directory receives actual Letter/A4 `UNREVIEWED` PDFs,
with puzzle pages followed by their answer keys. The exporter opts into the
measured `pack` profile. It has no publication or runtime-registration operation.

## Research and rights evidence

Candidate source records identify precisely what was checked: NPS pollination
scope; USGS map-projection publication scope; NOAA ocean layering/glossary;
Smithsonian composing-stick catalog entry and Folger quarto format; NPS and
Australian Museum mineral properties; Academy of American Poets glossary;
NASA airplane parts; EPA/EIA energy terminology. No source prose, definitions,
statistics, illustrations, museum images, poems or copyrighted examples are
copied. Short terminology labels form original selections.

Topical research does not verify every entry or imply a source endorses the
puzzle. Architecture and linguistic-process lists explicitly have only an
available dictionary spelling reference; they still require specialist semantic
review. All lists require human factual/terminology, audience, rights, difficulty
and editorial review. A checker cannot decide whether a new public URL is useful
enough to publish; merging with an existing canonical remains an option.

## Validation

- `npm run lint`, `npm run typecheck`, `npm test`: pass, 295 tests.
- Cross-batch collision audit includes Christmas, winter, the prior geography/
  astronomy pilot and this batch against every current record and redirect:
  zero duplicate path/title/seed/word-list or near-duplicate issues.
- Every intended word places and every answer cell matches the generated grid;
  deterministic replay and committed request/grid/ordered-answer hash snapshots
  pass. All ten grids are distinct.
- All three pack compositions export on both Letter and A4 with expected 10/20
  pages and bounded file sizes. Every actual student page measures with zero
  geometry findings, complete bank text, grid type at least 9 pt and bank type
  at least 9.5 pt. This is standard print, not large print.
- `npm run audit:candidates -- C:/Users/Suhas/.codex/tmp/ws-evergreen-hard-candidates.json --export-dir=../wordsearch-buildout-integration-02/out`:
  ten candidates, zero schema/collision/placement/PDF/exposure issues against
  the preserved fresh integration-02 export. Repeat at the next combined head.
- Real CLI export of the ten-puzzle pack passed for Letter and A4.
- `git diff --check` passes; no formatter script is configured.

No app runtime or renderer change is included; production-build coverage uses
the integration-02 export and must be repeated when integrated with later
runtime changes. Physical printer/photocopier review and genuine human editorial
approval remain open. No advertising behavior, ad gate or security failure is
waived. Revert removes only source inventory, review tooling and tests.
