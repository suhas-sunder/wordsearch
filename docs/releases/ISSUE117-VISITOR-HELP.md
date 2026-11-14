# Issue 117 category and route hub visitor help

Fifteen field-level corrections address the three category and eight route hub passages classified D and four inaccurate availability passages classified F. The [source-only record](../../content/review/issue117-visitor-help.json) lists the exact original and revised text, the field, the internal constraint, and all 24 baseline occurrences across 14 indexed URLs from the [307-passage review](QUALITY-PAGE-COPY.json).

- Holiday and Books and Reading categories preserve the full topic lists. The Classroom and Values category names two available puzzle themes to use as discussion starters.
- The PDF hub names the existing **Answer key page** option in Print and Download PDF. The answer-key hub points to the existing collection and the **Show Answers** control.
- Adult and Easy hub descriptions name topics from the adjoining cards. The Hard hub points users to the existing print collection. The seniors and ESL hubs describe ways to use the guides they already link to, preserving the print-preview and classroom activity guidance.
- The teacher hub names the three displayed collections. Sports, Music, and Books and Reading cards describe the topics available, including music theory and book parts.

The category edits touch introductions, a selection note, and card summaries. The hub edits touch descriptions above card lists and paragraph text under existing headings. Metadata still uses the existing explicit values. The card summaries also appear in interactive search results, and the selection note supplies search terms. The PDF route's separate `intro` field supplies search index terms and is outside this rendered correction. The existing medical, educational-outcome, and rights-screening constraints are recorded alongside the edits.

Reversing the fifteen recorded replacements recovers both source files at the starting commit. The source check matched each field and its exact route counts against the passage manifest and confirmed that all fifteen published categories still use their explicit metadata title and description. Targeted ESLint and `git diff --check` passed. The combined release review covers the final rendered copy and metadata.
