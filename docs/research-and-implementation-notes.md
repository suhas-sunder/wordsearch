# Research and Implementation Notes

## Product Research

Competitor patterns reviewed:

- Word Search Labs emphasizes custom generation, print/export/share/embed, layouts, shapes, filler choices, and privacy settings.
- TheWordSearch.com makes each puzzle playable online and offers printable/PDF output with solution access.
- The Teacher's Corner exposes rows/columns, directions, shapes, hidden messages, language controls, and printable/image/PDF style outputs.
- WordMint combines large libraries with fonts, images, multilingual support, and document/image export formats.
- Discovery Education's Puzzlemaker still shows useful older controls: overlap, case/output choices, hidden messages, and puzzle dimensions.

Common UX problems to avoid:

- Burying the generator under SEO copy.
- Letting print controls create a mismatched grid, answer key, or share page.
- Ads inside the grid or builder controls.
- Pages for every synonym/filter combination.
- PDF/print layouts that clip on Letter or A4.

## Print and PDF Expectations

Printable word searches should include a title, short instructions, readable grid, word bank, name/date space when useful, a separate answer key, and clean margins. Letter and A4 users expect portrait by default, with landscape available for larger grids. Teacher and homeschool users need black-and-white friendly output, predictable answer keys, and no ads or sticky UI on print surfaces.

Large-print output should use fewer words, larger cells, high contrast, and calm spacing. Branding and QR codes belong in a footer or utility area, never inside the puzzle grid or word bank.

## Design Direction

The supplied owner references share a few useful traits:

- Clean whitespace and strong hierarchy.
- Dark navy used as a trustworthy structural color.
- Friendly accent color, but not a loud classroom palette.
- Rounded but controlled UI surfaces.
- Simple illustrations/product visuals used as orientation, not clutter.

The site translates those preferences into an original system: white pages, neutral grays, deep ink/navy text, one restrained green accent, small warm brand touches, 1px borders, light shadows only on elevated builder/header surfaces, and print-first typography.

## Migration Notes

The repository started as a React Router/Remix-style app using `@react-router/*`, `@remix-run/netlify`, Vite, an Express server, and a single landing page. The reset removes those framework entrypoints and replaces them with a Next.js App Router architecture.
