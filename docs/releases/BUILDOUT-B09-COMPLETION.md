# B09 / U12 / U14 — private completion result image

Status: implemented and tested on an isolated review branch; no production
release. Branch `release/2026-W46-completion-card`, based on weekly PR #16 at
`74b8ff95024b60a7f299175cd153b3c4fb974835`. Final source is this record's containing
commit/PR head. Production remains `471a118dd459f2181cd641ed0572ba6dd7005540`.

## Existing behavior reused, actual change

Source inspection confirmed puzzle-link Web Share, clipboard recovery, local QR
and share dialogs already exist. They are retained. This package adds elapsed
completion timing and a separate, locally generated **result image**, not another
encoded-puzzle sharing implementation or an indexed page.

`OnlineSolver.tsx` starts a monotonic timer when Begin is activated and freezes
the elapsed duration when the last placed word is found. Replay resets timing
and progress together. Display floors to whole seconds; elapsed time includes
time in the background or dialogs, rather than claiming active-only solve time.
No timer is fabricated if a start measurement is unavailable, no competitive
score/percentile/unaided claim is made, and no progress is uploaded or persisted.

`CompletionResult.tsx` offers a real 1200×630 PNG download and file-only native
sharing when supported. It handles busy state, cancellation, failed rendering,
retry and unsupported sharing. Download remains available without native share.
The SVG-to-PNG helper revokes intermediate object URLs; downloads clean up their
URLs after starting or component unmount. No third-party font, image, request or
service is required. The generated result card is intentionally a light image.

`lib/puzzle/completion-card.ts` accepts only validated numeric word count, grid
dimensions and measured elapsed time. It accepts **no title, word list, clue,
answer, hidden message, user name, seed or URL**. The PNG contains generic branding
and those statistics. Native-share data includes the PNG and generic text/title,
with no puzzle URL. A share-sheet handoff is not a delivery receipt. Existing
puzzle-link sharing continues to share encoded puzzle contents; users must choose
the distinct result-image action for this content-free statistic image.

Counts describe placed words, not an assertion that every original input word
fitted. Existing excluded-word/worksheet policy is a separate owner decision.
No existing seed, grid, placement, answer, request encoding or preset changes.

## Validation

Node 22.23.4, clean install; `npm run lint`, `npm run typecheck`, `npm test`
(24 files / 208 tests), production build (334 pages), static-host audit (217
sitemap pages / 35 redirects / six utility shells) and whitespace checks passed.
All published/preset/legacy fingerprints remain unchanged.

Against a frozen exported host on 3260:

- `npm run test:completion`: 390/1280px actual solving, clock advance, frozen
  completion time, replay reset, actual PNG signature/dimensions/download name,
  file-only native-share payload with no private fixture values, cancellation,
  unsupported file sharing, forced canvas failure and successful retry, scoped
  completion axe checks, no overflow or runtime errors. Native share is mocked;
  the PNG is genuinely created and downloaded in Chromium.
- `SOLVER_ONLY=1 node tests/e2e/browser-smoke.mjs`: pointer/touch/tap/keyboard
  solver regression passed. The 53-route × nine-width/search/utility matrix is
  **not run in this mode**. Corrected its former unconditional success log to
  report the actual selected scope; no assertion or timeout changed. Parent
  PR #16 has the full combined matrix evidence.
- `npm run test:ads`: nine eligible routes × five widths and 14 ad-free routes,
  including protected sticky first-fill suppression, passed unchanged.
- `npm run test:preview`, `npm run audit:pdf`, `npm run test:a11y`: existing
  preview/print composition, actual PDF/answers/QR and 14 desktop/mobile archetypes
  passed. No print/PDF implementation or advertising code changed.

The first new unit assertion incorrectly treated the required SVG namespace URI
as an external resource and failed. It now explicitly permits that one namespace
and still rejects resource links/images/scripts. An initial native-share harness
mock failed after TS function serialization; static browser mock source corrected
the harness and the complete focused test passed. These failures are recorded,
not hidden as successful first attempts; no production guard was relaxed.

Representative actual PNG and mobile completion screenshots were inspected.
Artifacts are outside the repo under
`C:\Users\Suhas\.codex\visualizations\2026\11\06\01a1aec8-a64d-7790-8f8e-f0c913f746e9\completion`
(`result-390.png`, `completion-390.png`, plus 1280px variants).

Known parent gates remain: three route-audit repository ad-eligibility failures
(not an AdSense-policy finding), Lighthouse Best Practices 77, production Zod
high and 16 full-tree advisory records. No new route/Lighthouse/security audit is
claimed in this focused batch. Physical Safari/Android/native app sharing and
provider production behavior are unverified. No accessibility certification or
universal native-share support is claimed.

## Review boundary and remaining scope

No new indexable URL, content/data/metadata/canonical, ad runtime/placement/CSS,
static export or Netlify configuration changes. No main push/merge, auto-merge or
deployment. Review this milestone independently, then combine/revalidate through
the normal weekly gate. Roll back via a reviewed revert of this isolated commit;
the current known-good source is `471a118dd459f2181cd641ed0572ba6dd7005540` and
ChatGPT records the actual provider deployment ID before any production release.

Remaining B09 work includes guest saved puzzles/progress/resume, optional replay
history and actual-device sharing. Accounts/cloud storage/paid capture remain
separately approved infrastructure. Development continues without a Friday wait.
