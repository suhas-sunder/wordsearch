# I Love Word Search

Live on: https://www.ilovewordsearch.com

An SEO-first Next.js word search platform with a deterministic puzzle generator, printable worksheet surfaces, curated category/topic pages, and specialty alphabet-pack scaffolding.

## Features

- Next.js App Router with a full static export.
- Deterministic seeded word-search generation.
- SVG puzzle preview shared by screen, print, and utility pages.
- Printable student and answer-key surfaces with QR/share state.
- Structured content for core hubs, categories, topics, collections, guides, and specialty generators.
- TypeScript, Tailwind CSS, and focused unit/SEO tests.

## Getting Started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

```bash
npm run build
npm run audit:static-host
npm run start
```

The deployable site is written to `out`. The local `start` command serves only
that exported directory and emulates the committed Netlify redirects and
headers for validation. The build also generates `out/search-index.json`, which
the browser loads for search and autocomplete without an API.

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment

### Netlify

Netlify runs `npm run build` and publishes `out`. Search, PDF generation, puzzle
state, utility routes, redirects, and headers require no Function or Edge
Function. Do not add the Netlify Next.js runtime plugin.

## Styling

Tailwind CSS v4 is connected through `app/globals.css`. The design system uses Inter, Source Serif 4, and Atkinson Hyperlegible Next via `next/font/google`.
