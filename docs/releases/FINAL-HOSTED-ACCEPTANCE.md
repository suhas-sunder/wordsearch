# Final immutable hosted acceptance

All seven serial hosted correctness suites passed without retries under Node **v22.23.4** against READY provider deploy **`6aeebc77f2d9525d41a905c9`**, application commit **B `f7849cddda2a7df5daff2425ba179b9af21f6272`**, at the [immutable preview](https://6aeebc77f2d9525d41a905c9--ilovewordsearch.netlify.app). This is correctness acceptance with standard advertising-loader mocks, not production or advertising-policy approval.

External evidence root: `C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a/product-final-f7849cd/`. Suite artifacts live under `hosted/attempt-01/`; `summary.json`, `SUMMARY.md` and `actual-pdf-manifest.json` retain the execution and download records. `provider-deploy-record.json` has SHA-256 `67ba79a32596c2b359761bd771f10866453ad265881b0e076a7ca261591e08b6`. The pinned package lock has SHA-256 `2f70778d550a925ecb241e8763ad163f030ac33c6a13ed8614426d4e68d09d83`.

## Executed coverage and fixture provenance

Source, provider, test-file and dependency pins were checked before every suite and after completion. All seven exits were 0, with no retry. The provider's build has its own build ID; this evidence does **not** claim byte equality between the local export and Netlify output. The immutable deploy ID, provider commit record, test hashes and actual observed behavior delimit the hosted claim.

| Suite | Passed scope |
| --- | --- |
| 01 share-route-parity | Six utility rewrites; exact grid/PDF rows, answer paths, QR, indexability and invalid recovery; one actual one-page PDF |
| 02 provider-preview-smoke | 217 sitemap URLs; all 61 staged candidate paths absent from sitemap/search and returning 404; actual distinct five-page student packet; search, theme, no-JavaScript and mobile checks |
| 03 bounded-search-queries | Six query-bound, Unicode submission and recovery cases |
| 04 collection-finder | Twelve light/dark control cases and two no-JavaScript cases |
| 05 puzzle-library | Local saved-puzzle storage, reopening and library interactions |
| 06 clue-worksheets | Actual clue worksheet PDFs, offline HTML and keyboard solver; four two-page PDFs |
| 07 single-large-print | Eight measured large-print cases and crowded-layout refusal; eight two-page PDFs |

The following hashes identify the **executed** test bytes. “D override” means the final OPS worktree fixture, not a change to frozen B application code; all other rows executed B's pinned fixture source.

| Executed fixture | Provenance | SHA-256 |
| --- | --- | --- |
| `tests/e2e/share-route-parity.mjs` | D override; base B | `09fce3119f23793177b2739dba54684d33db24b1aafc0dee01ff77ba29762d0d` |
| `tests/e2e/provider-preview-smoke.ts` | B | `caa4a11388d71dca6412fb3e98bf274b2ba01f1c2e14beb4f83f67df37223100` |
| `tests/e2e/bounded-search-queries.ts` | B | `6dc905a9efcc908aeb50fcc1ad3dc3e89e774c8151c8ed41595132b191d857bc` |
| `tests/e2e/collection-finder.mjs` | B | `61356c2b328abdcc65bc4480ca61f8369c5f265ceb2a3955b16dc862d3b530bc` |
| `tests/e2e/puzzle-library.mjs` | B | `84b0f0324599cd51d6ca788a595c978fef82b3660fa788117d31a85e1c8e182f` |
| `tests/e2e/clue-worksheets.ts` | B | `20a107290ea3ed45eb8ae3a96d46c38fcf18afc847594359b0957405a29ca7c4` |
| `tests/e2e/single-large-print.ts` | D override; base B | `e10b1337211e703c9c034f427a3ff0c907aaa0d933b586a5d2e466db2621a91b` |

The parity D override adds the standard empty advertising-loader mock before navigation and optional durable `PARITY_OUTPUT`. The large-print D override adds the same standard mock to its separate final crowded-layout page; its other pages already used the mock. Both preserve existing assertions and defaults. Syntax and scoped ESLint passed before browser execution, followed by the hosted passes above. Their recorded fixture commit was pending the coherent OPS commit; their hashes, rather than an invented B ancestry, identify the executed code. Shared imported generation, word-bank, output, sharing, browser-download, measured-PDF and catalog source modules were pinned to B's corresponding bytes. The unused external preload draft was preserved and never imported.

## Actual hosted PDF downloads

The manifest contains **14 files, 30 pages**: one parity page, one five-page packet, four two-page clue worksheets and eight two-page measured large-print outputs. Every row carries provider ID `6aeebc77f2d9525d41a905c9`, commit B, the immutable preview URL above, exact producing test path/hash and whether a D fixture override applied. The first PDF was produced by the parity fixture, the packet by provider-preview-smoke, all four clue PDFs by clue-worksheets and all eight large-print PDFs by the D single-large-print fixture in the preceding table.

Paths below are relative to `hosted/attempt-01/`. Repeated paper/output choices at different viewport widths legitimately produced identical bytes; fourteen files does not mean fourteen distinct hashes.

| Actual PDF | Pages | SHA-256 |
| --- | ---: | --- |
| `01-share-route-parity/parity/hosted-route-parity.pdf` | 1 | `ce3ed60f59790033ba777cf802e7cb61a00efa1b132855a6b227b72bd7437e86` |
| `02-provider-preview-smoke/provider/provider-student-pack.pdf` | 5 | `04dc6b17e29460af9a735590cacb705f84450c7a7f6a9113165b4d707bd31e3a` |
| `06-clue-worksheets/tmp/ilws-clue-worksheets/a4-below-1280.pdf` | 2 | `15faa4099dc7513f2eb97e75929d4f4d90a16d30a94de33dddad311067c11bc2` |
| `06-clue-worksheets/tmp/ilws-clue-worksheets/a4-beside-390.pdf` | 2 | `7bb164eb4c883cee3b7afd24a69e7352c450c348f815b1d7cfb79498088a18d2` |
| `06-clue-worksheets/tmp/ilws-clue-worksheets/letter-below-390.pdf` | 2 | `65f203f3153f762bc8b5fc6882be221c22dbc5a940f0bd5b05c06f184d342650` |
| `06-clue-worksheets/tmp/ilws-clue-worksheets/letter-beside-1280.pdf` | 2 | `dbae4d0b76eac48f41787817adb3b8d0b67a5b05d5aa437c8cea7234812f69a1` |
| `07-single-large-print/large-print/1280-a4.pdf` | 2 | `27401942f72489e9b4ececb72e53ea8f246c0fcb5eed6caed925ff5e41dd8fce` |
| `07-single-large-print/large-print/1280-letter.pdf` | 2 | `43ab3ba169de8c47337282c3e2075de3eccb4c4c5ec2b4cb250137fef5595b15` |
| `07-single-large-print/large-print/320-a4.pdf` | 2 | `c72509106443c00d5c807b9ab6f3bfb28f4d9af82c11bca75ec0330912f24d55` |
| `07-single-large-print/large-print/320-letter.pdf` | 2 | `dce50bede2c699522b91e7567f342a37178ce8c61d315575e018773cb09e8aef` |
| `07-single-large-print/large-print/390-a4.pdf` | 2 | `27401942f72489e9b4ececb72e53ea8f246c0fcb5eed6caed925ff5e41dd8fce` |
| `07-single-large-print/large-print/390-letter.pdf` | 2 | `43ab3ba169de8c47337282c3e2075de3eccb4c4c5ec2b4cb250137fef5595b15` |
| `07-single-large-print/large-print/844-a4.pdf` | 2 | `27401942f72489e9b4ececb72e53ea8f246c0fcb5eed6caed925ff5e41dd8fce` |
| `07-single-large-print/large-print/844-letter.pdf` | 2 | `43ab3ba169de8c47337282c3e2075de3eccb4c4c5ec2b4cb250137fef5595b15` |

These are actual immutable hosted downloads, with file sizes and page counts preserved in `actual-pdf-manifest.json`. They do not replace the historical 1,200-layout execution or claim it was freshly rerun. [FINAL-STATIC-PDF-PRESERVATION.md](FINAL-STATIC-PDF-PRESERVATION.md) separately identifies the retained corpus hashes and bounded carry-forward proof.

## Acceptance boundaries

Standard correctness-fixture advertising mocks exclude real provider lifecycle and policy assessment. The ordinary Lighthouse gate actually exited 1 with Best Practices 77; the blocked-loader diagnostic score of 100 does not waive it. The separate route audit's exit 1 and exact three retained advertising/noindex eligibility findings also remain open and unwaived. See [FINAL-PERFORMANCE-GATES.md](FINAL-PERFORMANCE-GATES.md) for the ordinary and diagnostic evidence.

All hosted browser and PDFjs tasks closed normally. The run made no production navigation, merge or deployment and used no forced process termination. Physical printing, manual device and assistive-technology review, editorial publication approval, advertising-policy decisions and production authorization remain separate. This record does not approve any staged candidate or activate a new indexable URL.
