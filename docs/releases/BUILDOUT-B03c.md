# B03c / T05 — measured opt-in pack layout

Status: draft review, not released. Parent is draft #23 at `db13e6b1694af8dcfcda357296f506c63a066778`; branch `release/2026-W46-pack-layout` targets `release/2026-W46-pack-builder`. This record belongs to its containing commit; see the draft PR for the final SHA. No main merge, auto-merge or deployment is authorized.

## Scope and contract

The existing single-puzzle renderer now accepts an explicit `layoutProfile: "pack"`. Its default remains `"legacy"`, including for existing calls to the pack engine. Only the guest builder opts in. The profile wraps and measures titles using the embedded font while reserving the name/date column, measures actual below-grid word-bank row widths, reserves their height, and rejects titles, instructions, bank labels or grid layouts that cannot fit. It requires standard-scale, portrait, below-grid bank, no QR/coordinates, and single-character grid tokens. The enforced minimum grid type is 9 pt, with 9.5 pt bank type; these are implementation floors, not large-print, accessibility or physical-printer certifications. Unsupported output and font cases fail rather than silently truncate. The profile retains the original puzzle request, seeded grid and answer placements.

The guest builder now accepts up to 80 title characters and 2–30 Latin word/phrase lines of 2–14 letters each, retaining the exact title and inputs. It retains 15×15 grids for up to 12 lines and uses 20×20 above that count. Placement and layout can still fail closed for dense lists and unbreakable titles; the form reports the error and retains entries. It remains unlinked and noindex, single-puzzle-per-page, locally generated, and ink-saving rather than strictly monochrome. No content was published or activated. Wider acceptance does not imply that staged content has passed editorial review.

## Evidence

Node 22.23.4; `npm ci` completed with 16 pre-existing advisories (7 moderate, 7 high, 2 critical). Final `npm run lint`, `npm run typecheck`, `npm test` (26 files, 225 tests including 150 unchanged direction fingerprints), `npm run build`, `npm run audit:static-host`, `BASE_URL=http://127.0.0.1:3226 npm run audit:pdf`, and `npm run test:preview` passed. Build retained the existing Next ESLint plugin warning. `BASE_URL=http://127.0.0.1:3226 npm run audit:routes` reproduced the three pre-existing repository eligibility mismatches for the health/wellness category, brain-training collection and hidden-message guide; this is not an AdSense policy finding. Full e2e and Lighthouse were not rerun for this bounded checkpoint; parent records their known baseline.

`npx vitest run tests/unit/pdf-pack-layout.test.ts` checks exact pre-change legacy PDF SHA-256 bytes for Letter (`8c014a73d2fede365ef0b514e4d1ba1560d50438a5ed98397b510450c7a5a56e`) and A4 (`6c14f4c39f5b7b77c99b4ec1470f16fd9238707a3d0f14cd1b2cd6dad2f691f1`), then measures generated 5/10 packs with 20/30 synthetic ten-letter labels in both orders and paper sizes. Each student page's title, grid and bank text geometry is extracted from the real PDF; every corresponding answer's text geometry and drawing paths are compared with its original single-puzzle PDF. Tests check 9 pt grid and 9.5 pt bank floors, footer clearance, title/name-date separation, page bounds, and a fail-closed dense case. The B04 helper was copied test-only from `445b08f01ef0144f981e350cee7e0656dd2f04a4`, with the short wrapped suffix adjustment also present in B04 draft #25 head `39316a0f4efd214365a9fa94f7d378f06e4f0191`. PDF.js text boxes are estimates and the helper assumes Latin single-character grids; coordinate and physical print verification remain necessary beyond these samples.

`BASE_URL=http://127.0.0.1:3226 node tests/e2e/classroom-pack.mjs` passed actual browser generation and download of a 5- and 10-puzzle 30-label set (239,191 and 494,099 bytes). It checks matching grids on answer pages, first-five replay, title-fit failure with input retention, other invalid inputs, busy state, download error, local requests, noindex/sitemap/no-ad, mobile, keyboard and mobile axe. An intermediate run discovered the builder masked layout failures as generic download errors; the final named error handling and rerun passed.

External fixture QA (not imported or committed as runtime content) generated the published medium Christmas puzzle plus frozen draft X01, X02, X04 and X15 from source commit `3a60d11694e8a78cf60a46f08e3ad3d6cdf94b06` using their original title, words, seed, dimensions and directions. Composed five-puzzle Letter/A4 PDFs measured without helper findings: 141,689/152,965 bytes, observed grid fonts 13.95–21.6 pt, word bank 9.5 pt, and bank baselines at least 76.5 pt from the bottom. An earlier independent technical sample included X11 winter; it is not proposed as part of the Christmas pack. The external QA harness was temporary and removed. The frozen candidates remain review-held; these measurements do not approve or publish them.

Roll back by excluding/reverting this isolated package. Integrating B04 and B03c may consolidate their duplicated test-only measurement helper after both are reviewed. Production-equivalent ad behavior, real-device print and the full release gate remain separate work.

## November 6 follow-up

Finished the preserved worktree edits: visible help and validation errors now
match the implemented 80-character title / 30-line / 1500-character limits.
The PDF regression also checks real title/name/date separation and complete
answer headings above the grid, including their page bounds. Node25 lint,
typecheck and all 20 focused classroom/layout tests pass. The final combined
browser rerun is recorded in integration 02; prior evidence above remains dated
to its own checkpoint. No puzzle request or legacy renderer behavior changed.
