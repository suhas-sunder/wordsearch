# Issue 117 · Curated puzzle context

Source finding [P-PUB-09 / Q08](QUALITY-PUBLISHED-PUZZLES.md) identified three copies of the same paragraph on each of the 150 indexed puzzle pages. The content registry projects one context value into the hero description, puzzle note, and word-list context.

`components/page/CuratedPuzzlePage.tsx` suppresses a supplemental paragraph when its complete text matches the hero description or introduction after trimming and collapsing whitespace. If the two supplemental paragraphs match each other, the puzzle note takes precedence. Distinct paragraphs render with their authored text. The rule compares full paragraphs, so shared phrases and additional guidance survive. Difficulty, print and classroom guidance use their existing display logic.

The indexed puzzle route is the only caller of `CuratedPuzzlePage`. The rendering change preserves the content records, headings, metadata, structured data, puzzle requests, word banks, and review dates. The local comparison deliberately leaves differences in punctuation, capitalization, and phrasing intact.

## Checks

Run from the repository root with Node 22.

| Command | Result |
| --- | --- |
| `node node_modules/vitest/vitest.mjs run tests/unit/curated-puzzle-context.test.ts tests/content/curated-publication.test.ts tests/seo/semantic-preservation.test.ts` | 32 tests passed across three files. |
| `node node_modules/eslint/bin/eslint.js components/page/CuratedPuzzlePage.tsx tests/unit/curated-puzzle-context.test.ts` | Passed. |

The new suite renders the real topic route for the 150 sitemap puzzle records and checks the hero, introduction, difficulty, and print copy. It mocks the site-wide search component because it requires an App Router context. Synthetic cases cover supplemental duplicates and paragraphs that add information. The publication suite checks deterministic generation, exact answer paths, PDF validity, and share-state compatibility for the same puzzle set.

The production-build and exported-HTML comparison are tracked in the issue 117 release evidence.
