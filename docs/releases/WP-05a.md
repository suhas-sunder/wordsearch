# WP05a — Static puzzle action icons

**Branch:** `fasttrack/2026-11-05-puzzle-action-icons`  
**Commit:** `3313b2087118d352ce126617bd12b8c69efc9ac3`  
**Draft PR:** https://github.com/suhas-sunder/wordsearch/pull/7  
**Base:** `fasttrack/2026-11-05-brand-footer` (`3f1b2b3db8ad3ed90e65228855b54c3910251a3e`)

## Change

Added the existing Lucide `Printer` and `FileDown` icons to the Print and PDF download controls on the static `/print`, `/pdf`, and `/answer-key` utility surfaces. The download icon remains visible while the control reports generating or retry status. This matches the established icon size and decorative accessibility treatment used by the puzzle builder and print preview. Puzzle output, copy, links, route metadata, advertising, and control order are unchanged.

## Visual evidence

Captured from the parent branch and this branch using the same encoded puzzle state and static host. Files are stored outside the repository:

- Before desktop: `C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1aec8-a64d-7790-8f8e-f0c913f746e9\wp05a\before-wp05a-desktop.png`
- Before mobile: `C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1aec8-a64d-7790-8f8e-f0c913f746e9\wp05a\before-wp05a-mobile.png`
- After desktop: `C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1aec8-a64d-7790-8f8e-f0c913f746e9\wp05a\after-wp05a-desktop.png`
- After mobile: `C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1aec8-a64d-7790-8f8e-f0c913f746e9\wp05a\after-wp05a-mobile.png`

## Validation

- `npm ci` — passed under Node 22.23.4.
- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm test` — passed, 17 files / 113 tests.
- `npm run build` — passed; static export generated.
- `node tests/e2e/static-utility-icons.mjs` — passed at 1440px and 390px; checks visible controls, one decorative icon per action, no runtime errors, and no horizontal overflow.
- `BASE_URL=http://localhost:3231 npm run test:preview` — passed.
- `BASE_URL=http://localhost:3231 npm run test:a11y` — passed for 14 route archetypes at desktop and mobile sizes, including serious/critical axe, target size, runtime, overflow, skip-link, reduced-motion, and zoom checks.
- `BASE_URL=http://localhost:3231 npm run audit:static-host` — passed 217 sitemap pages, 35 redirects, and 6 utility shells.
- `BASE_URL=http://localhost:3231 npm run audit:pdf` — passed real PDF, two-page A4 landscape, title/word text, answer page, QR, and filename checks.
- `git diff --check` — passed.

The broad `BASE_URL=http://localhost:3231 npm run test:e2e` command was started but interrupted after more than five minutes without output while its full browser matrix was still active. It is **not a pass**. This did not affect the focused static-route browser check, accessibility audit, printable-preview audit, PDF audit, or the 113-test unit suite. No advertising code was changed; protected placeholder behavior remains covered by the passing unit suite, but the separate browser placeholder flow was not completed in this package.

## Limits and follow-up

The icons are decorative because the visible button text already names each action. No icon is added to links or other surfaces in this package. The broader category-semantic icon package is tracked separately as WP05b. Advertising lifecycle and placeholder behavior were not changed. `npm ci` reported 20 existing dependency advisories; no dependencies or lockfiles changed.
