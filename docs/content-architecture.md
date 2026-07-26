# Content architecture and indexation

`content/model.ts` defines the discriminated content records. `content/registry.ts` is the publication and sitemap source of truth. A route is eligible for the sitemap only when it is `published`, `indexable`, not a redirect, and has `metadata.includeInSitemap` enabled.

Run `npm run audit:content` before promoting a draft. The audit fails on identity, canonical, metadata, word-list, deterministic-input, generated-grid, placement, or complete-puzzle duplicates. It also checks required copy, editorial status, stable seeds, categories, related IDs, thin puzzle records, and sitemap/indexability consistency.

Near-duplicate word lists use normalized Jaccard similarity. A score of 0.80 or higher is a warning requiring editorial review; exact duplicates are errors. Normalization uses Unicode NFKC, lowercase text, trimmed whitespace, and collapsed internal whitespace.

## Current publication decision

The reviewed indexable set consists of the homepage, canonical generator, eight substantial format/audience hubs, the category and guide directories, sixteen category hubs, and seven trust pages. All programmatically assembled topic puzzles, collection details, guide details, specialty details, and generic core/support scaffolds remain accessible but are temporarily `noindex` drafts. Search, encoded share states, online-play state, print, PDF, answer-key, embed, custom, QR, modal, and output-option states are utility surfaces and never enter the sitemap.

Drafts may be incomplete. To promote a curated puzzle, supply a stable ID and canonical path, distinct title/H1/copy/metadata, a topic-specific word list, stable seed and placement settings, category and related records, useful puzzle-specific editorial modules, and a completed editorial review decision. Do not generate a build-time seed or build-time modification date.

`app/sitemap.ts` and `app/robots.ts` are authoritative. The former reads the registry; the latter allows crawling so route-level `noindex` can be observed. Static `public/sitemap.xml` and `public/robots.txt` were removed to prevent drift.
