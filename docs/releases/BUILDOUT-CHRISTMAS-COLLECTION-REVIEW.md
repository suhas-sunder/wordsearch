# X05 / X06 authored collection review assets

These are source-only implementation artifacts, not activated collections or
approval. Reconciliation found only X05/X06 proposal strings and the unchanged
thin kids draft; no equivalent typed review model/export existed. The runtime
registry, collection records, published Christmas puzzle and candidate requests
remain untouched. No new word list, seed, public link, sitemap or URL is created.

`content/staged/christmas-collections.ts` supplies authored selection guidance,
classroom/printing instructions, exact child references, exclusions and independent
collection-fit, audience-suitability and reuse gates. X05 compares the unchanged
published medium Christmas source with X02 forward-path and X01 all-direction
drafts. Its Traditions heading remains an explicit scope decision: object lists
do not establish researched historical/cultural traditions. X04's duplicate-intent
decision and X15's distinct narrow intent are not silently promoted into hub
children.

X06 reviews only X02. It deliberately remains below its two-child minimum; medium
or hard puzzles are not forced into a kids index. No age, grade, reading-level or
educational-outcome claim is inferred from an easy label or short words. Existing
published editorial metadata is preserved; every new collection/audience/reuse,
collection-editorial and owner approval is false. Even simulated approvals do not
make the unpublished X02 an eligible published child. Offline assessment never
authorizes or activates publication.

Run with supported Node 22:

```
npx tsx scripts/export-christmas-collection-review.ts <outside-repository-directory>
```

The exporter produces one self-contained noindex HTML and one JSON manifest per
collection. Each contains complete existing word banks and real grid/direction/
seed summaries, guidance, review questions, exact references and blockers. HTML
has no scripts, external resources, live draft links or approval actions; it is a
review document, not a substitute classroom packet or new PDF renderer. Actual
student/answer output retains the separately tested canonical/export tooling.

Node-only validation passed: four targeted Vitest cases, targeted ESLint,
`tsc --noEmit`, and `git diff --check`. The actual exporter produced four files
under `C:/Users/Suhas/.codex/tmp/christmas-collection-review/`: X05 HTML/JSON
(7,587/8,047 bytes) and X06 HTML/JSON (4,704/4,653 bytes). Both report zero eligible
approved published children and publication/runtime activation false. JSON pins
the review asset and its three source files by SHA-256; the asset hash is
`560117607d13ad758018adf30aed2a0541bd166f946d99b18e15db89b0a49ab4`.

Tests verify unchanged published words/seed, actual two/eight-direction draft
differences, unresolved/duplicate references, independent gates, no padded kids
inventory, escaped HTML and no scripts/external/live draft resources. HTML source
and generated manifests were inspected; rendered visual acceptance is pending.
A production build/static exposure check is pending a serialized slot; no browser
or Next process was started while the final functional suite was active.

The prepared `tests/e2e/christmas-collection-review.mjs` accepts
`COLLECTION_REVIEW_DIRECTORY` and `COLLECTION_REVIEW_OUTPUT` for a bounded local
render check at 390/1280 with page JavaScript disabled. It compares every word bank
and canonical/seed to its exported manifest, checks no external requests or live
resources, overflow and serious/critical axe, and captures full pages/first-child
details. Its syntax/ESLint checks pass; actual browser execution is queued after
the final visual matrix rather than overlapping the active functional job.
