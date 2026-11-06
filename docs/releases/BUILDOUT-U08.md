# U08 — visible maintainer and copyright

Track B; review only. Base PR 28 at
`10d6379bc29f2c46589c32d29b4dfae6c3805f19`.
Branch `release/2026-W46-author-trust`; containing commit/PR is the checkpoint.

Investigation found the requested creator profile already exists at `/about`,
with the centralized author record and existing ProfilePage structured data.
Reuse it rather than creating a duplicate author URL or copying a biography.
The footer now identifies the maintainer and links to that existing profile.
The legal row adds the current UTC build-year copyright notice beside the
unchanged policy links. This year is not a content-review date.

The owner's README explicitly identifies Suhas Sunder as a software engineer.
The supplied references were read November 6:
https://www.ilovetimers.com/author/suhas-sunder/ and
https://www.morsewords.com/about . No new education, specialist credentials,
medical/editorial authority, publication dates or personal data were invented.
Existing biography, metadata, canonicals, structured data and review dates are
unchanged. This does not certify every historical `reviewedOn` claim; any date
correction needs actual editorial evidence.

No advertising, content registry, seed, print/PDF renderer or dependency changes.
No new indexable URL. Node 25.9.0 verification: full ESLint, TypeScript --noEmit, all 253 Vitest tests (31 files), content/SEO checks and the existing 150 published puzzle fingerprint snapshots passed. git diff --check passed. No formatter script exists. Production build and desktop/mobile browser/print/accessibility verification are reserved for the next combined integration checkpoint; this package is a draft pending that combined evidence. No application dependency or snapshot changes are included.
No main merge, automatic merge or deployment. Rollback: revert this isolated
checkpoint through review; production remains
`471a118dd459f2181cd641ed0572ba6dd7005540`.

