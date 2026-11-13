# Product excellence owner review handbook

Review [draft PR108](https://github.com/suhas-sunder/wordsearch/pull/108) at the
[immutable C4 preview](https://6aef630dea767b4dae5a4557--ilovewordsearch.netlify.app).
Application: `39c0d3564eb014741e259507c9564a4ee1699f1d`.
Netlify deploy: `6aef630dea767b4dae5a4557`, independently verified READY for this
exact commit on `codex/product-excellence-release-candidate`, deploy-preview,
with no production publication. Preview HTTP noindex is intentional.
Production remains `471a118dd459f2181cd641ed0572ba6dd7005540`.

**This is an owner review procedure, not owner acceptance.** C4 passed 58 local functional fixtures, 448 visual cases, 84 paired zero-CLS utility
measurements and 14 hosted fixtures. Ordinary Lighthouse remains failed with
BestPractices77 in all11groups; hard mobile86/TBT459ms is retained. Earlier
candidate results remain source-scoped, and no manual/owner acceptance is inferred. Read the current
[acceptance ledger](PRODUCT-ACCEPTANCE.md) and
[excellence evidence record](PRODUCT-EXCELLENCE-2026-11-07.md) alongside this handbook.

## What changed and what to preserve

Look for practical improvements: usable mobile editing and navigation, uploads
that preserve newer edits, deliberate classroom seeds, separate readable PDF
choices, and exports that cannot deliver stale work. Settled invalid input should
show an actionable alert without a worksheet-sized blank area or permanent busy
state. At enlarged text sizes the footer should reflow without splitting ordinary
link words. With JavaScript disabled, the interactive builder should show an honest
notice and real Topics/Guides links; search should offer a real browse fallback.
Normal delayed loading and retry must still work.

Published definitions, titles/headings, ordinary historical output and the site's
design language are preserved. Advertising reservations and global placeholder
suppression after the first real fill are protected behavior. Do not treat an empty
reserved ad region as permission to alter advertising.

## Seven owner review flows

1. **Find and print a hard puzzle.** From Home, open Hard Printable Word Searches,
   then Browse 16 puzzles. The jump should land at Included word searches below the
   header; the next Tab should reach filters, or the card list without JavaScript.
   Find a topic, open a puzzle and locate Play, Print, PDF and Answers. Check that
   the collection's introduction, 16 original cards, descriptions/order and selection
   guidance remain intact.

2. **Make a puzzle and recover from mistakes.** Enter a title and five familiar
   words. On a phone, move between Edit words and settings and Preview and print;
   keyboard focus should remain useful. Change one setting at a time. Try an
   invalid dimension, blank seed or incomplete clue such as `CAT |`, then correct
   it without losing words. The settled error should stop announcing busy and
   should not expose a fallback grid or output. Upload a word file, edit while it
   is reading, and confirm completion preserves those newer edits; retry a failed
   read. ASL must remain explicitly labels, not handshapes, with full limitations.
   With JavaScript disabled, confirm the honest tool notice and keyboard-operable
   catalog/guide links replace the inert loading button. Re-enable JavaScript and
   confirm ordinary loading/manual retry works.

3. **Save and reopen locally.** Save a valid definition under a recognizable name.
   Reload and reopen it; compare title, words, settings, seed and grid. Delete it
   without removing other saved puzzles or progress. Open a shared definition and
   confirm it takes precedence over an older local draft. Saving is on this browser;
   no account, cloud synchronization or hidden upload is implied.

4. **Solve, resume and finish.** Find words using pointer and keyboard. Sound when
   a word is found starts off; opt in deliberately if desired. Remember progress
   on this device, reload and verify found words and paused/restarted timing.
   Revealing answers must not count as solving. Complete the puzzle and inspect
   the result image; private word lists should not appear unexpectedly in a public
   result link or image. Actual audio and assistive-device behavior need direct
   owner observations, beyond automated API checks.

5. **Share the intended puzzle.** Copy its definition link and open it separately.
   Grid/settings should match, without transferring another solver's progress.
   Check native-share/copy fallback and WhatsApp/email drafts without sending
   anything unless you choose to. Read the full-word-list-in-link warning before
   sharing sensitive material. Canceling native share should stay canceled.

6. **Inspect student and answer output.** Download ordinary Letter/A4 output and
   its answers. Try the separate Readable PDF and measured large-print actions.
   They keep the exact puzzle and selected answer/name/date/instruction choices,
   using portrait pages, a below-grid bank and no QR/coordinates. Readable has
   minimum 9 pt grid / 9.5 pt bank; measured large print has 16 pt / 18 pt, with smaller
   headers/footer. A puzzle that cannot fit should be refused, not silently shrunk.
   Ordinary Larger grid type does not guarantee a minimum bank size; preserved
   ordinary landscape output includes known small-type cases. Check QR preparing,
   error and Print without a QR code recovery. App printing should wait for QR
   readiness; early native printing should retain the not-ready warning. Print
   selected PDFs at 100% and inspect margins, glyphs, bank and answer paths.
   Automated geometry is not physical-printer approval.

7. **Prepare a classroom set.** Enter a real lesson list; choose a Base seed or
   Choose for me. Create 5, 10 and 20 assignments. Grids should differ within a set,
   while the same saved title/list/seed recreates it. Try students only, answers
   only, answers-last and interleaved output. Add class/name/date and optional
   directions; match every teacher answer to its student ID. Save/load/delete a
   local preset. Change options during an export and confirm an old packet cannot
   download over the new request. Failure/retry should preserve usable form
   entries. Inspect an ordinary and a measured-large packet on actual paper.

For each flow record the browser/device, exact SHA/URL, observed result, artifact
filename, pass/fail/unexecuted status and person responsible for follow-up. Check
keyboard use,390px phone layout, desktop and actual browser zoom. Do not equate
CSS 200% text or emulated reflow with native zoom or physical-device acceptance.

## Actual current artifacts to open

All links below refer to retained C4 evidence on the review workstation. These
selected images were actually viewed; they are not a claim that every screenshot
or PDF received manual inspection.

- [Hosted 14 results and fixture hashes](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/summary.json)
  and the [independent eight-image review](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/INDEPENDENT-HOSTED-AND-CHANGED-STATE-REVIEW.md).
- [Phone no-JavaScript generator](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/14-builder-noscript/nojs-generator-390.png),
  [desktop Dog fallback](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/14-builder-noscript/nojs-dog-1280.png),
  [actual failed-download retry](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/14-builder-noscript/failed-chunk.png)
  and [compact settled clue error](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/12-builder-error-recovery/error-390.png).
- [Readable/measured PDF choices](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/11-readable-pdf/390-letter-words-choice.png)
  and [phone dark maker](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/08-maker-upload-workflow/maker-edit-320-dark.png).
- [Actual hosted PDF manifest](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/actual-pdf-manifest.json):
  **23 files/79 pages**, with every file's SHA256, page count, fixture hash and
  provider/commit provenance. Repeated equivalent outputs remain separate files,
  not new puzzle inventory. Example actual downloads:
  [Letter readable student/answers](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/11-readable-pdf/390-letter-words.pdf),
  [A4 measured large print](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/07-single-large-print/1280-a4.pdf)
  and [five-student set](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/hosted/attempt-01/10-classroom-seed-choice/5-first.pdf).
  These downloads and page/hash checks are not a fresh 1200-layout corpus run or
  physical-printer approval. Hosted correctness uses the standard ad-loader mocks,
  not genuine-fill or ordinary-performance acceptance.

- **Actual teacher packet:** open the current local
  [Botany Review Letter packet](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/functional/temp/ilws-classroom-fields-letter.pdf).
  It contains five student sheets followed by five matching answers. Root
  personally inspected rendered pages1 and6: matching worksheet01/grid, complete
  six-word bank, custom directions and student Name/Date/Class, with unclipped
  margins and all six answer paths. The [student render](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/root-pdf-review/classroom-student-01.png)
  and [answer render](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-39c0d35/root-pdf-review/classroom-answer-06.png)
  support that finite review. Print these exact pages at100% before approving
  physical paper output. Four additional readable/measured PDF pages were
  personally inspected; hashes and observations are in `root-pdf-review/review.json`.

The C2 footer word-splitting defect was fixed in
[PR110](https://github.com/suhas-sunder/wordsearch/pull/110), settled busy/error in
[PR109](https://github.com/suhas-sunder/wordsearch/pull/109), native search in
[PR111](https://github.com/suhas-sunder/wordsearch/pull/111), and the no-JavaScript
builder fallback in [PR112](https://github.com/suhas-sunder/wordsearch/pull/112).
Package evidence and earlier candidate passes remain historical; C4's full
58 functional, 448 visual and 84 utility gates passed; ordinary Lighthouse remains blocked.

## Manual zoom and other decisions still open

A prior C3 native Windows Chrome zoom attempt was stopped by Computer Use because
it could not determine the browser URL confidently enough to enforce policy.
**Zero zoom inputs were sent. No workaround or native-zoom pass is claimed.**
The task-owned context was closed normally. See the exact
[stop record](C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-excellence/final-e7e00eb/native-browser-zoom/computer-use-stop.json).
This remains an unexecuted manual acceptance item for C4; CSS/text-size and
emulated reflow results are separate evidence.

- **Copy:** 13 material changed fields across 7 existing indexed routes remain
  owner/editorial holds: five FAQ body/heading pairs, privacy body/headings and
  editorial-policy body. The independently reviewed Category B footer and tool
  notices do not approve those Category C changes. Existing copy proposals, such
  as the teacher-collection wording mismatch, are not silently approved either.
- **Advertising policy:** the strict historical audit asserts 3 representative
  conflicts; the full measured scope is 12 existing draft/noindex pages with ad
  markup. This is an internal-policy conflict, not a provider violation ruling.
  Choose an approved placement correction or explicit reviewed policy revision
  using the [decision analysis](EXCELLENCE-AD-ELIGIBILITY-DECISION.md). Do not
  publish drafts, waive assertions or change the protected global suppression
  rule to clear the gate.
- **Performance:** fresh ordinary C4 Lighthouse completed 33 audits with actual exit 1,
  BestPractices77/11groups and current cookie/inspector failures. Earlier domain-level
  provider attribution remains historical; the ordinary gate remains unwaived. A provider-disabled diagnostic is not
  release acceptance, and no 90+ or Core Web Vitals pass is claimed here.
- **Manual/independent approval:** actual paper margins/readability, Safari/Android
  and physical devices, assistive technology, genuine ad fill/consent,
  biography/legal accuracy and independent product/editorial approval remain
  separate. No workflow completion grants those approvals.
- **Unpublished inventory:** new seasonal/evergreen content remains unpublished.
  Calendar windows are review opportunities, not automatic release dates. Any
  later release needs separate editorial approval; no quota should create thin or
  near-duplicate pages.

## Release and recovery

This remains a draft. Current authorization does not allow merging, auto-merging,
pushing main or deploying production. After separate independent approval, the
release owner must refresh main, revalidate changed application code and use the
single authorized main-triggered Netlify deployment. Record its exact commit/deploy
and recheck the collection, maker, play/share and student/answer output.

For a bad approved release, prepare a reviewable Git revert and use the authorized
main-triggered deployment. Do not manually publish an older Netlify deploy.
Production reference: commit `471a118dd459f2181cd641ed0572ba6dd7005540`, deploy
`6aedd79021e0a4d96f61990a`. A preview failure does not change production. Frozen
B `f7849cd` and R `ada6b6e` remain historical references in PR97; original owner
edits retain their separate lossless recovery checkpoint `749b5ab`.

To resume local review after reboot, use the preserved clean QA04 export, rather
than resetting the original owner worktree:

```powershell
Set-Location 'E:/PROJECTS-and-WORK/work-projects/all_projects/wordsearch-excellence-release-qa-04'
$env:PORT = '3511'
& 'C:/Users/Suhas/AppData/Local/npm-cache/_npx/361c55be1121897e/node_modules/node/bin/node.exe' tests/e2e/static-export-server.mjs
```

Open `http://127.0.0.1:3511`; stop this review server normally with Ctrl+C when
finished. QA04 remains detached at tested C4, with its frozen export and real
clean-install dependencies. The operations branch is
`codex/product-excellence` in the separate `wordsearch-product-excellence`
worktree; the final GitHub handoff pins its documentation-only review head.
Make approved follow-up changes in another isolated worktree. Do not reset or
repurpose the original `wordsearch` worktree or frozen B/R/QA checkpoints.
