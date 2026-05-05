# I Love Word Search

Live on: https://www.ilovewordsearch.com

An SEO-first Next.js word search platform with a deterministic puzzle generator, printable worksheet surfaces, curated category/topic pages, and specialty alphabet-pack scaffolding.

## Features

- Next.js App Router with static editorial pages.
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
```

## Validation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment

### Docker Deployment

```bash
docker build -t ilove-word-search .
docker run -p 3000:3000 ilove-word-search
```

The containerized application can be deployed to any platform that supports Docker.

### DIY Deployment

Deploy with a host that supports Next.js, or run the compiled app with:

```bash
npm run build
npm run start
```

## Styling

Tailwind CSS v4 is connected through `app/globals.css`. The design system uses Inter, Source Serif 4, and Atkinson Hyperlegible Next via `next/font/google`.
