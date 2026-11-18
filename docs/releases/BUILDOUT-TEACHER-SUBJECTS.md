# Teacher subject vocabulary: ten unpublished worksheets

Based on the hard-inventory branch; no public route, sitemap, search result,
runtime registry import or publication approval is added. These are drafted
activity assets for teacher review, not grade-level or curriculum certifications.

| ID | Built worksheet | Scope |
| --- | --- | --- |
| T06-A | AKE Word Family | Twelve words sharing an ending-letter pattern; human phonics/context review required |
| T07-A | Irregular Past Verb Forms | Sixteen selected past forms; teachers supply base verbs and sentences |
| T08-A | Probability Language | Selected formal and everyday likelihood terms, without numerical rules |
| T08-B | Charts and Data Language | Display parts, chart forms and collection terms |
| T09-A | Weather Observation Tools | Instruments distinguished from observed quantities |
| T09-B | Cell Structure Vocabulary | Plant/animal structure labels, without claiming universality |
| T10-A | Primary Source Investigation | Evidence, source-type and inquiry vocabulary without historical inventions |
| T11-A | Cooking Action Words | Short verbs rather than tool/ingredient names; no food or knife instructions |
| T11-B | Public Transit Journey | Short travel vocabulary; regional usage remains reviewable |
| T11-C | Classroom Direction Words | Worksheet task verbs rather than classroom objects or first-week routines |

Easy drafts have twelve entries, 14×14 grids and E/S directions. Medium drafts
have sixteen entries, 18×18 grids and E/S/SE/NE directions. Counts and directions
describe configuration only. No learning outcome, language-proficiency or
reading-level promise is made. The root workspace's dirty growth records remain
untouched; cell structures are scoped separately from Genetics.

Three real printable compositions reuse the frozen children:
`teacher-subjects-10`, `language-and-activities-5`, and
`math-science-history-5`. Five-subject selections partition the ten-child bank.
They are utilities, not three proposed indexed collection pages.

```powershell
npx tsx scripts/export-staged-teacher-pack.ts teacher-subjects-10 C:/review/teacher-packs
```

This writes actual Letter/A4 `UNREVIEWED` PDFs to the explicit destination,
using the measured pack layout with puzzle pages first and answers last.
Separate student/teacher-only output and saved assignments are renderer/product
work in the print lane; these compositions do not pretend to complete those
functions. No new accounts, telemetry, backend or ad behavior is introduced.

## Evidence and validation

- `npm run lint`, `npm run typecheck`, `npm test`: pass, 300 tests.
- All ten drafts pass schema, route/category, collision, normalized word,
  complete placement and answer-cell validation. Request/grid/ordered answer
  SHA-256 snapshots freeze the proposed assets. Replay matches the exact grids.
- Cross-batch audit includes Christmas, winter, prior evergreen pilots and the
  ten hard-inventory drafts against the full registry and redirects: zero issues.
- Three compositions × two paper sizes produce six real PDFs with correct
  10/20-page counts. Every student sheet measures with zero geometry findings,
  all bank entries present, at least 9 pt grid and at least 9.5 pt bank type.
- `npm run audit:candidates -- C:/Users/Suhas/.codex/tmp/ws-teacher-subject-candidates.json --export-dir=../wordsearch-buildout-integration-02/out`:
  zero schema/collision/placement/PDF/exposure issues for all ten candidates.
  This uses the preserved integration-02 export; repeat at the final combined
  export. No app runtime module changed, so no duplicate production build ran.
- Actual ten-puzzle CLI export succeeded for Letter and A4.
- `git diff --check` passes. No formatter command is configured.

NOAA's weather-observation overview was checked for selected instrument names;
NHGRI's organelle entry for topic scope and selected structures; the Library
of Congress analysis guides for observe/reflect/question language; and NIST
for probability topic scope. Their prose, worksheets, illustrations and
definitions are not copied. Source notes explicitly avoid presenting this
limited research as entry-by-entry human verification. Other lists retain an
available dictionary reference for later human spelling/usage review.

All assets remain editorially unreviewed. Required next: teacher spelling,
semantic, regional, audience, rights and physical-print review, with a decision
whether any individual intent merits a public URL or belongs only in a packet.
The tests do not assert universal scientific structures, safe practical
activities, grade suitability or standards alignment. Source rollback is to
remove these draft modules/tooling/tests; published puzzles are unaffected.
