# Independent task and output review

Reviewed 2026-11-12 (America/New_York). Fresh supplementary browser execution
used the immutable C4 preview
`https://6aef630dea767b4dae5a4557--ilovewordsearch.netlify.app`, application
`39c0d3564eb014741e259507c9564a4ee1699f1d`. This is fresh observation of the
historical candidate, **not acceptance of the new changed application**. Parent
integration owns supported-runtime checks and exact new-build verification.

External evidence directory:
`C:/Users/Suhas/.codex/visualizations/2026/11/13/01a1d313-5cce-7880-aff3-d45fd55e6b71/quality/independent/`.
Files below are relative to that directory. No application or test file was
changed by this independent review. Advertising requests to pagead2 were mocked
for correctness, so no genuine-fill, consent or ordinary performance conclusion
is supported.

## Fresh visitor tasks

| Attempt and observed result | Assessment / evidence | SEO / implementation |
| --- | --- | --- |
| On a 390px viewport, enter `hard printable` in homepage search, open Hard Printable Word Searches and choose Browse 16 puzzles. | PASS: search displayed the collection first in the captured view; the collection jump reached its filters and included cards, reporting 16 of 16. No horizontal overflow. `discovery.json`, `hard-search-mobile.png`, `hard-browse-mobile.png` were inspected. | No change. Useful existing discovery/search path preserved. Direct home/printable-hub hard-collection links were assumed by the initial harness but not observed; that incorrect expectation is not a broken-button finding. |
| Open Ancient Egypt and its actual `Print this puzzle` button. | PASS for opening/closing the dialog. The initial and settled alert lists contained only an empty alert region, with no nonempty print-measurement warning. Controls remained visible and legible in the inspected mobile screenshot. `followup.json`, `egypt-print-dialog-mobile.png`. | No change. The other reviewer's transient measurement warning was not reproduced in this sample; this does not prove it cannot occur. Native printing was not invoked. |
| Create a seeded three-word puzzle and download measured large-print Letter and A4, with answer key, name/date and instructions. | PASS: two actual downloads, four pages total. Downloading preserved all 96 browser-preview tokens. Both PDF pages in each file independently extract to those exact 96 tokens. All four rendered pages were personally inspected; titles, instructions, fields, grid, bank and three answer paths were intact and unclipped. | No change to output or grid. The observed old dialog help names `Download large-print PDF`, while the actual action is `Download measured large-print PDF`; this independently supports the parent's narrowly scoped wording correction. New wording still requires new-build verification. |
| Reveal answers before solving; then find CAT, DOG and BIRD using keyboard Enter/ArrowRight/Enter. | PASS: reveal left progress at `0 of 3 words found`; after genuine keyboard selections progress was `3 of 3 words found` and the Puzzle complete heading appeared. Inspected `solver-complete-mobile.png` shows found paths and readable controls; its viewport does not include the below-grid completion card. `flows.json` records assertions. | No change. This is one simple horizontal puzzle, not comprehensive solver/direction or physical-keyboard/assistive-technology acceptance. |
| Read the generator's ASL card and open its actual specialty destination in desktop dark mode. | PASS for truthful disclosure: card says `Format not available yet` and explicitly says it has no handshapes/movement. Settled destination `/specialty/asl-fingerspelling-word-search-generator` repeats that limitation above the builder and shows `ASL labels (not handshapes)`. Inspected `specialty-dark-final.png`; final text/URL in `specialty-final.json`. | Owner-held product decision remains: unavailable formats are prominent in the experimental directory. The current disclosure is clear; removal or capability activation is not authorized by this review. |

The hard collection screenshot also confirms the visible phrase “The count is
derived from reviewed, published records in this collection.” It discusses
publication bookkeeping rather than helping choose a puzzle. Keep this in the
owner-held copy inventory; its visible shared-template scope must be measured
before any replacement. No general rewrite follows from this observation.

## Actual PDFs and finite visual inspection

| Download | SHA256 | Fresh checks |
| --- | --- | --- |
| `measured-letter.pdf` | `f7f502756bc3e3643553380d52fb60b66ede11dcee5026ab9ca957f864179f9b` | 13,438 bytes; two 612×792pt pages; student and answer grids equal preview; pages 1 and 2 rendered and inspected. |
| `measured-a4.pdf` | `7424d4acba58469ecf0ffaab9625c03e681d86c98ed1a41e5696c1d94cb34f92` | 14,406 bytes; two 595.28×841.89pt pages; student and answer grids equal preview; pages 1 and 2 rendered and inspected. |

The student bank contains BIRD, CAT and DOG. Visible answer strokes match DOG at
row 5/columns 6–8, BIRD at row 6/columns 7–10 and CAT at row 8/columns 6–8
(one-based). All four rendered grids match. No QR, advertising or navigation
appears on the output. The student sheets retain requested name/date and custom
instructions; answer pages are clearly separate. White space remains generous
for this deliberately small grid; no cosmetic layout change is justified here.

Read-only PDF review followed the PDF skill. `pdfinfo` confirmed page dimensions;
`pdftoppm -f 1 -l 2 -scale-to 1400 -png measured-letter.pdf letter` and its A4
equivalent created `letter-1.png`, `letter-2.png`, `a4-1.png`, `a4-2.png`. Poppler
reported `No display font for 'Symbol'`; the four inspected Latin renders were
intact. This warning was not hidden or treated as proof of a missing visible
glyph. No physical paper output, tactile accessibility, tagged-PDF acceptance or
all-puzzle corpus inspection is claimed.

The system `pdftotext` command was unavailable, and system Python's `pypdf`
import failed with `ModuleNotFoundError`. These are environment limitations, not
introduced by application changes. The bundled Python reported by
`load_workspace_dependencies` successfully used `pypdf` instead, saving
`pdf-extraction.json`. A comparison of every single-letter extracted grid token
against `flows.json`'s 96 browser tokens passed for both pages of both files.

## Harness corrections retained honestly

`flows.json` and `followup.json` retain failed attempts rather than silently
rewriting them. The first harness guessed `Print` instead of the observed
`Print this puzzle`, assumed a direct hard-collection home link, and requested
nonexistent `/specialty/asl`. Its generic specialty step incorrectly labeled a
404 inspection as pass because it lacked a heading assertion. That step is
**invalid evidence**, not specialty acceptance. The actual destination was then
obtained from the generator's rendered link and independently loaded/checked.

The second specialty capture read text/URL during a Next navigation transition,
mixing old generator text with the new heading. That snapshot is also excluded
from destination acceptance. `specialty-final.json` and
`specialty-dark-final.png`, captured after the actual destination settled,
replace it. Nothing in the application was changed to make these checks pass.

## Startup investigation and environment limits

The exact retained Node22 executable was
`C:/Users/Suhas/AppData/Local/npm-cache/_npx/361c55be1121897e/node_modules/node/bin/node.exe`.
From QA04, `--input-type=module -e 'console.log("before",Date.now()); const p =
await import("playwright"); console.log("after",Date.now(),p.chromium.executablePath());'`
eventually completed: timestamps `1794543130189` → `1794543356232`, approximately
226 seconds. A separate `NODE_DEBUG=module` CJS import advanced through successive
server and client modules before completing; it did not establish a deadlock.
Its retained `playwright-import-debug.log` records that progress. The cause of
the unusually slow local file/module access was not proven.

Local C4 `http://127.0.0.1:3521/` then exceeded Playwright's 30-second navigation
timeout, and a separate `Invoke-WebRequest -TimeoutSec 10` timed out without a
response status. These are failed local-environment attempts, not a demonstrated
public-site regression. No server, application or assertion was altered to
conceal them. A task-owned attempt to copy retained Playwright dependencies to
the external C: directory was not used for acceptance; original QA04 dependencies
were untouched. No unrelated process was stopped.

To make the independent review progress, the successful browser tasks used system
Node **25.9.0** and bundled Playwright **1.62.1**, located by
`load_workspace_dependencies` under
`C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-611-0_26.1112.611.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright`.
Its import completed in about 260ms and used bundled Chromium revision 1234.
This is explicitly **supplementary qualitative/functional evidence**, not the
repository's supported Node22/locked Playwright1.59.1 acceptance. Historical
exact-runtime suites are not relabeled as fresh checks, and the root's separate
clean-install/current-build checks remain necessary.

## Verdict and next gate

The tested finding, keyboard-solving and selected measured-PDF tasks are usable;
the new local help correction addresses a real naming mismatch. This small
independent sample found no new application-side failure requiring a runtime
repair. Internal publication wording and unavailable specialty prominence remain
concrete editorial/product review items. It would be inaccurate to call the whole
site finished on these results: changed-source validation, physical devices,
printers, native browser zoom, assistive technology, ordinary advertising/provider
performance and the existing owner-held copy/legal gates remain separate.
