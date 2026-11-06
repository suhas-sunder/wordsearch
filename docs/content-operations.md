# Content Operations

## Add a Category

1. Add a category object in `content/categories.ts`.
2. Give it a stable `slug` for `/categories/[slug]` and a `pathSegment` for topic URLs.
3. Add at least one related link and category-specific notes.
4. Add or map topics in `content/topics.ts`.
5. Run `npm run test:seo`.

## Add a Topic

1. Add the topic slug to the correct seed list in `content/topics.ts`.
2. If the generated words are not specific enough, extend `baseWords` for that category or add a dedicated word list helper.
3. Keep one canonical topic URL: `/word-searches/[category]/[topic-slug]`.
4. Do not create separate indexable pages for easy, PDF, printable, kids, or large-print variants.
5. Complete the human editorial review in [Content review checklist](./content-review-checklist.md). Record an actual review date; do not bulk-change review dates.
6. Run `npm run audit:content`, `npm run test:seo`, and `npm test`.

## Add a Collection

Only add collection pages for distinct editorial use cases. Add the collection to `content/collections.ts` with a real angle and a concise word list. Avoid automatic permutations.

Complete the human editorial review in [Content review checklist](./content-review-checklist.md) before publishing a collection. The automated audit checks record structure and supported review dates; it cannot evaluate the accuracy or suitability of a collection's editorial angle.

## Change Published Editorial Content

Review the actual generated puzzle and student-facing output against its configured seed, grid, word list, difficulty, and directions. Verify factual terminology and teacher-facing statements, check answer paths and print/PDF consistency, and update `reviewedOn` only after the review is complete. See the [Content review checklist](./content-review-checklist.md) for required human checks and evidence to record.
