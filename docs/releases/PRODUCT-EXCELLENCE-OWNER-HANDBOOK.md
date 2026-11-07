# Product excellence owner review handbook

Review candidate: [PR108](https://github.com/suhas-sunder/wordsearch/pull/108),
application `d9947d7434d17e5f08dadbdbe907b95bdde3fd46`.
Open [the immutable review site](https://6aef4c73954d65ee7c648251--ilovewordsearch.netlify.app).
Netlify deploy `6aef4c73954d65ee7c648251` is independently verified READY for that
exact commit, branch `codex/product-excellence-release-candidate`, deploy-preview.
The preview's HTTP noindex is intentional. Production remains main `471a118`.

**Combined acceptance is in progress.** This handbook is a review procedure,
not a record of owner approval. The final evidence record and outstanding
failures must be read alongside it before release. The feature ledger keeps
physical/manual, editorial and technical results separate.

## What to look for

The design language, published titles/headings, puzzle definitions and historical
ordinary output are preserved. Changes should feel practical: mobile editing has
a nearby return to preview; delayed uploads preserve newer edits; enlarged text
keeps navigation and supporting layouts usable; specialty limitations use clearer
labels; teachers can deliberately choose a seed and cannot receive a stale pack.
Readable PDF is a separate explicit choice. Advertising blank reservations and
first-filled-ad suppression remain intentional protected behavior.

## Seven high-value review flows

1. **Find and print an existing hard puzzle.** Start at Home, reach Hard Printable Word Searches, and use Browse 16 puzzles. The jump should land at Included word searches below the header, with the next Tab reaching filters or the no-JS card list. Find a subject, open a puzzle and locate Play, Print, PDF and Answers. Compare the collection's title/introduction, all 16 original cards, descriptions/order and selection guidance with production; the new finding/jump controls must not replace them.
2. **Make a custom puzzle and recover from mistakes.** Enter a short title and five familiar words. On mobile, switch between Edit words and settings and Preview and print with keyboard focus remaining useful. Change one setting at a time; try an invalid dimension/blank seed, then recover without losing words. Upload a word file, edit while it is reading, and verify later completion keeps those edits; retry the same file after a read error. The ASL choice should explicitly say labels, not handshapes, while actual unavailable-format limitations remain visible. Do not infer a new ASL capability from a clearer label.
3. **Save and reopen locally.** Explicitly save the valid custom definition under a recognizable name. Reload and reopen it; compare title, words, settings, grid and seed. Delete it and verify other saved definitions/progress remain. Use a shared definition link and confirm the maker reopens that definition rather than a prior local draft. No account, cloud synchronization or hidden upload should be implied.
4. **Solve, resume and complete.** Begin a small puzzle; find words using pointer and keyboard. Keep Sound when word found off initially; opt in deliberately if desired. Remember progress on this device, reload/resume and verify found words and paused/restarted timing behave as described. Revealing answers must not pretend the puzzle was solved. Complete it and review the result image; private word lists must not appear in a public result URL/image unexpectedly.
5. **Share the intended state.** Copy a puzzle definition link and open it separately. Grid and settings should match; it should not transfer the first solver's progress. Inspect native-share/copy fallback and WhatsApp/email draft destinations without sending anything unless the owner chooses to. Read the word-list-in-link warning before sharing sensitive content; cancellation should stay canceled.
6. **Check actual student and answer output.** Download ordinary Letter/A4 output and its answer page. Try the new explicit Readable PDF and separate measured large-print action: they retain the same puzzle and disclose portrait, below-grid bank, no QR/coordinates. Readable promises minimum 9pt grid/9.5pt bank; measured large print promises 16pt/18pt, with smaller headings/footer and refusal when it cannot fit. Ordinary historical output is preserved, including known small landscape cases; do not call it large-print certified. Check QR preparing/error/without-QR recovery. App print is disabled when QR is not ready; early native printing retains the explicit not-ready warning with the worksheet. Actually print selected PDFs at 100% and inspect margins, glyphs, bank and answer paths; automated PDF geometry is not physical-printer approval.
7. **Prepare a classroom set.** Enter an actual lesson list and use Choose for me or enter a Base seed. Create five, ten and twenty assignments; compare that grids differ while the same saved title/list/seed recreates the same set. Try students only, answers only and both answers-last/interleaved. Add Class/name/date and optional directions; verify every teacher answer matches its student ID. Save/load/delete a local preset. Change settings during a held export and confirm an old pack cannot download over the new request; failure/retry should keep form entries usable. Inspect at least one ordinary and one measured-large packet on actual paper.

For each flow record browser/device, exact candidate SHA/URL, actual observations, screenshot/PDF filename, pass/fail or unexecuted, and follow-up owner. Ad spaces and first-filled-ad placeholder suppression are protected; do not classify blank reserved areas as a regression or attempt to fix them during review. Genuine fill/consent, physical assistive technology, Safari/Android, biography/legal accuracy and editorial approval retain their separate manual gates. The initial 230-field copy hold was later narrowed by the [exact Category B footer review](EXCELLENCE-FOOTER-B-REVIEW.md); the remaining 13 material indexed-copy fields are not accepted by completing a functional flow.


## Candidate evidence to inspect

Local artifacts are under
`C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-d9947d7/`.
Final filenames and selected before/after images will be linked after their
fresh runs finish. Check actual downloaded student and answer PDFs, not only
screenshots. A complete page hash comparison does not prove every page received
physical printer or manual geometry inspection.

## Decisions that remain separate

- Thirteen material indexed-copy fields across seven existing routes need
  editorial/owner review: five FAQ body/heading pairs, privacy body/headings,
  and editorial-policy body. The exact independently reviewed footer is Category B;
  its accepted scope does not approve those Category C fields.
- The draft's expanded ad-eligibility scan identifies twelve affected pages.
  The strict historical audit checks three. Choose an independently reviewed
  placement correction or an explicit internal-policy revision before clearing
  that gate. This candidate changes neither infrastructure nor policy.
- Ordinary Lighthouse/provider-cookie diagnostics remain unwaived pending the
  fresh result; do not substitute a provider-disabled diagnostic for release QA.
- Physical printer margins/readability, Safari/Android and actual devices,
  assistive technology, genuine ad fill/consent, biography/legal accuracy and
  independent product/editorial approval require their own observations.
- All new seasonal and evergreen inventory stays unpublished. Calendar review
  windows do not mandate pages; initially at most one genuinely distinct URL per
  independently approved weekly release.

## Release and recovery

This PR is a draft. Do not merge, auto-merge, push main or deploy production
under the current authorization. After independent approval, the release owner
must refresh main and revalidate any changed application before the single
main-triggered Netlify deployment. Record its exact commit/deploy and check the
high-value collection, generator, play/share and student/answer output afterward.

For a bad approved release, prepare a reviewable Git revert of the accepted
application change and let the authorized main-triggered deployment apply that
fix. Do not manually publish/restore an older Netlify deploy. The known current
production reference is `471a118dd459f2181cd641ed0572ba6dd7005540`, deploy
`6aedd79021e0a4d96f61990a`; a failed preview does not alter it.
Preserved baseline B `f7849cd` and review R `ada6b6e` remain frozen in PR97.
Original owner edits retain their separate lossless recovery checkpoint `749b5ab`.
