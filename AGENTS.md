# Repository Instructions

This repository is the Next.js App Router implementation for I Love Word Search.

## Core Stack

- Keep the app in Next.js, TypeScript, and Tailwind CSS.
- Use App Router conventions.
- Do not reintroduce Remix, React Router application routes, Vite server entrypoints, or obsolete framework code.
- Do not add generated build artifacts, dependency caches, or temporary audit output to the repository.
- Reuse existing project conventions before introducing new libraries, abstractions, or directory structures.

## Rendering and Hydration

- Keep indexable editorial, category, collection, printable, and puzzle pages server-rendered or statically generated where practical.
- Keep the builder as the only broadly hydrated surface.
- Use client components only where interaction requires them.
- Do not convert entire pages or layouts to client components for small interactive features.
- Preserve crawlable HTML content for indexable pages.

## Puzzle Integrity

- Preserve deterministic puzzle generation across:
  - preview
  - online play
  - print
  - PDF
  - answer key
  - share links
  - QR links
  - utility pages

- The same puzzle seed and configuration must produce the same grid, word placements, and answer key everywhere.
- Do not silently change existing puzzle-generation behavior without documenting the migration and validating affected URLs.
- Keep puzzle-generation logic centralized rather than duplicating it across page types.
- Treat printable output and answer keys as core functionality, not secondary visual approximations.

## SEO and Content Quality

- Do not create thin, doorway, duplicate, or automatically spun pages.
- Every indexable page must provide a clear purpose and enough original, useful content to satisfy its search intent.
- Do not index raw user-generated puzzles, temporary previews, search result pages, parameter combinations, or other low-value generated states by default.
- Use canonical URLs consistently.
- Preserve unique metadata for indexable pages.
- Keep important page content available without requiring JavaScript.
- Maintain logical internal linking, breadcrumbs, sitemap coverage, and crawlable navigation.
- Avoid keyword stuffing, hidden text, mass location pages, and artificial variations created only for search engines.
- Do not seed editorial puzzle pages around copyrighted franchises, protected characters, celebrities, or trademark-dependent topics unless rights and editorial suitability have been deliberately reviewed.
- Prefer evergreen educational, seasonal, vocabulary, general-interest, classroom, and age-appropriate topics.

## User Experience and Accessibility

- The puzzle grid must remain usable on desktop, tablet, mobile, print, and keyboard-based workflows.
- Do not allow advertising, navigation, or supporting content to obstruct puzzle interaction.
- Avoid intrusive interstitials, forced registration, misleading buttons, accidental-click layouts, or excessive layout shifts.
- Preserve readable touch targets, visible focus states, sufficient contrast, semantic controls, and meaningful labels.
- Do not rely on color alone to communicate selected words, found words, errors, or answers.
- Printing must exclude unnecessary navigation, controls, advertisements, and decorative clutter.
- Do not degrade the primary puzzle experience to increase ad impressions.

## Content and Data Architecture

- Prefer centralized, typed content and metadata models over duplicated page constants.
- Reuse page templates for shared structure while allowing genuinely unique page content.
- Validate slugs, puzzle words, difficulty values, audience values, categories, metadata, and related-page references.
- Keep content data separate from presentation logic where practical.
- Avoid introducing a CMS, database, or external service unless the existing requirements justify it.

## Claims and Safety

- Avoid medical, therapeutic, developmental, cognitive-health, or educational-outcome claims unless they are appropriately sourced and intentionally approved.
- Do not describe word searches as preventing, treating, diagnosing, or improving medical conditions.
- Keep content suitable for general audiences unless a page is intentionally designated for another audience.

## Validation

After each meaningful implementation batch, run the applicable existing checks:

- formatting
- lint
- TypeScript type checking
- automated tests
- production build
- relevant targeted tests for puzzle generation, printing, PDFs, answer keys, metadata, or routing

Do not hide, bypass, or weaken failing checks merely to make validation pass.

When a command cannot run, report:

- the exact command
- the failure
- whether the failure was introduced by the current changes
- any remaining risk

## Worktree, Commit, and Push Rules

- Related fixes may accumulate across multiple safe implementation passes.
- Keep the worktree uncommitted while changes belong to the same major workstream.
- Validate after each meaningful batch, but do not automatically commit.
- Do not commit, push, open a pull request, or modify remote branches unless explicitly instructed.
- Keep changes unstaged unless temporary staging is genuinely useful for inspection.
- Create a milestone commit only when the full major set is coherent, reviewed, stable, and has passed final validation.
- Push only after that milestone commit passes final validation and the user explicitly requests the push.
- Use smaller commits only when isolation is genuinely useful, such as:
  - a risky architectural change
  - a rollback point
  - a dependency migration
  - a clearly unrelated workstream

## Change Discipline

- Inspect the existing implementation before editing it.
- Preserve working functionality unless replacement is part of the task.
- Prefer focused, reversible changes over unnecessary rewrites.
- Do not delete apparently unused code until references, routes, generated output, and build behavior have been checked.
- Do not perform unrelated cleanup during a focused task.
- Document assumptions and unresolved risks in the final implementation summary.
- Finish each pass with:
  - a summary of changed files
  - validation results
  - known limitations or risks
  - recommended next work, without performing unrelated follow-up changes
