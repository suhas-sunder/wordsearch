# Issue #117 editorial corrections

## Approved pilot

The [historical pilot](../../content/review/pilot.ts) records the exact original and approved replacement text, source field, internal constraint, and baseline reuse for each of five changes. Its approval status describes the historical proposal record. The [implementation manifest](../../content/review/issue117.ts) links those five proposals to issue #117 and records the baseline commit.

| Field | Correction | Baseline indexed URLs / occurrences |
| --- | --- | --- |
| Ancient Egypt context | Name vocabulary from the original word bank. | 7 / 9 |
| Hard collection angle | Give visitors a choice of print or online play. | 1 / 1 |
| Hard collection selection guidance | Retain the full description of the grid, terms, overlap and directions. Remove the draft-inventory sentence. | 1 / 1 |
| Homophones introduction | Correct the count to seven. The 16 terms form two triples and five pairs. | 1 / 1 |
| Answer-key guide verification body | Point visitors to Show Answers and tell them how to review excluded words before printing. | 1 / 1 |

The pilot reaches nine distinct indexed routes. The Ancient Egypt context already appears on the Hard collection.

## Follow-up

The second tranche addresses the confirmed editor instructions on the Reading and Swimming homepage cards and the three other Hard puzzle contexts classified D in the [published-puzzle review](QUALITY-PUBLISHED-PUZZLES.md). The [implementation manifest](../../content/review/issue117.ts) records each exact before/after pair, its factual rationale, its internal constraint and every observed indexed path.

| Context | Visitor copy | Baseline indexed URLs / occurrences |
| --- | --- | --- |
| Reading | Suggest pointing out a title, an author’s name and a chapter when reading together. | 7 / 9 |
| Swimming | Name four strokes and give a vocabulary grouping prompt with a practical water-safety boundary. | 7 / 9 |
| North America | Clarify that country and island names appear alongside Arctic and Caribbean regional terms. | 6 / 8 |
| Ancient Rome | Keep the Republic and Empire scope and name civic terms and structures. | 5 / 7 |
| Industrial Revolution | Identify production, transport and energy vocabulary from the bank. | 6 / 8 |

The reuse counts come from both retained 217-URL HTTP captures. SHA-256 verification succeeded for all 434 stored responses. Counts use normalized body text, excluding scripts, styles and SVG. Puzzle pages contained three occurrences each in the retained capture. Ancient Egypt and the 15 follow-up contexts are also reused as puzzle descriptions in the generated search index. The Hard collection angle contributes search terms. The search page can expose revised descriptions through its interactive result cards.

## Expanded puzzle contexts

The remaining ten class-D contexts from the published-puzzle review use the same frozen banks. Human Body, Money, and Percentages suggest sorting or connecting vocabulary. Gratitude suggests a short thank-you note, and Singing suggests listening for a verse and chorus. Electricity and Crafts give practical safety reminders. Sculpture contrasts materials with studio and display vocabulary. Mother’s Day acknowledges different caregivers and country-specific dates. Medieval Times identifies the bank’s European focus.

The same two HTTP captures showed identical indexed reuse for the expanded tranche. Each puzzle had three own-page occurrences, with one on each listed card surface. The [implementation manifest](../../content/review/issue117.ts) records all per-field routes and original constraints.

| Context | Baseline indexed URLs / occurrences |
| --- | --- |
| Human Body | 5 / 7 |
| Electricity | 5 / 7 |
| Money | 6 / 8 |
| Percentages | 6 / 8 |
| Gratitude | 5 / 7 |
| Mother’s Day | 5 / 7 |
| Medieval Times | 5 / 7 |
| Singing | 4 / 6 |
| Sculpture | 4 / 6 |
| Crafts | 4 / 6 |

## Collections and guides

Fourteen body fields across eight routes replace internal narration with visitor steps, retain the history collection’s six topics, and clarify the two large-print options. The large-print guide names the ordinary Larger grid type control and the separate Download measured large-print PDF action with its 16-point grid and 18-point word-bank minima. The [implementation manifest](../../content/review/issue117.ts) records the exact before and after values. Each original field appeared once on its own route in the audited 217-URL review capture.

These editorial changes touch 34 public fields. The source-only records keep editorial constraints out of the app dependency graph. The focused test reverses exactly 17 puzzle copy edits and checks both authored files against their baseline SHA-256 hashes. The existing direction snapshot independently verifies all published seeded grids, placements and answer paths. Final rendered diff and browser verification belong to the combined issue #117 release evidence.
