# Editorial review checklist for published content

Use this checklist before changing a published puzzle, category, collection, or guide to an indexable state. A marked `reviewed` status and a passing content audit are necessary, but they do not replace the human review below.

## Human review gate

For each puzzle:

- Read the complete title, introduction, difficulty explanation, word-list context, print note, and any teacher-facing copy together. Remove wording that is unclear, overly broad, or promises an outcome the activity cannot establish.
- Verify the puzzle's configured difficulty, grid, word count, and permitted directions against every authored statement about how the puzzle works. Check that the student-facing directions describe the actual generated puzzle and output that will be delivered.
- Check each word for spelling, accepted variants, context, age suitability, and subject accuracy. For teacher-facing material, confirm that terms and definitions are appropriate to the stated subject and audience; do not imply that completing a puzzle demonstrates mastery or improves academic performance.
- Review the generated grid and answer key. Confirm that every intended word is placed once, every answer path matches the grid, and print/PDF/share output reproduces the same seed and puzzle. A structurally valid answer key does not establish that a word list is factually or pedagogically correct.
- Review factual, health, developmental, cognitive, and learning-outcome statements. Keep claims appropriately limited and supported by reliable sources; omit unsupported treatment, diagnosis, prevention, developmental, cognitive-health, and educational-outcome claims. A disclaimer does not substantiate a claim.
- Check that the subject and examples are suitable for general audiences and do not depend on unreviewed protected characters, franchises, celebrities, or trademarks.

For every indexable editorial record, confirm its purpose, unique copy, canonical URL, related links, and visible audience fit. Collections should have a deliberate selection reason; guides should remain accurate for the product's current behavior.

## Record the review

- Set `editorialStatus` to `reviewed` only after a human completes the review.
- For puzzle, collection, and guide records that carry `reviewedOn`, set it to the actual calendar date of that review in `YYYY-MM-DD` format. Do not change dates in bulk or use a build-time date. Updating a date without re-review would overstate the evidence.
- For record types without a review-date field, record the review date and checks in the implementation PR or release evidence; do not imply that a date is stored in the content model.
- In the implementation PR or release evidence, record what was checked, any sources used for factual claims, and unresolved questions. `lastReviewed` records when the review occurred; it does not certify a claim or name a reviewer.
- Preserve a published puzzle's canonical path, seed, word list, directions, placements, and answer key unless an approved migration explicitly calls for a change and its effects have been reviewed.

## Automated checks

Run `npm run audit:content`, `npm run test:seo`, and `npm test`. The structural checks validate review-date shape, indexation controls, puzzle direction keys, duplicate risks, stable inputs, deterministic generation, word placement, answer paths, and PDF readiness for the reviewed inventory.

Automated checks cannot decide whether prose is sensible, a claim is adequately sourced, a term is correct for a grade band, or a puzzle is pedagogically suitable. Those remain human publication gates. A passing test suite is not an editorial approval.
