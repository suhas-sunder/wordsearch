# Final static and PDF preservation evidence

Current frozen application **B**: `f7849cddda2a7df5daff2425ba179b9af21f6272`.
Static export SHA-256: `3b1b611fe5de81527e8327a31ae6298dd3230596246e2df9b36daa127be279d3`.
The B manifest and audit both record supported Node **v22.23.4**. The earlier Node25 build attempt remains archived under `product-final-f7849cd/node25-attempt/` and is not accepted as supported-runtime evidence; the audit explicitly rejects an export-manifest runtime mismatch.

Previous **A** remains separately recorded at `90a0ee32bc984e583cf39d4ebb4b587a2b630c4b`, export `a8fc1e5ddd6e10dfe30cd572f49ba9eea64d3ea2bc7c708cfa82a2b4c7dda859`. Its original 83-file proof and tested audit-tool bytes are preserved, not relabeled as B.

The bounded Node 22 B audit completed in about nine seconds, made no application edits and ran no build, Chrome, Next or Lighthouse. It verified all 176 source-file and 747 export-file hashes in B's frozen manifest before inspection, then rechecked source hashes afterward. This is fresh static/source/hash verification, **not a fresh PDF corpus execution**.

## Fresh checks at B

| Scope | Result |
| --- | --- |
| Published puzzles | All 150 source definitions, actual exported defaults and generation/grid/answer fingerprints match the established production-derived baseline. |
| Indexable output | All 217 sitemap URLs, rendered metadata and JSON-LD match; all 35 permanent redirects are preserved. |
| Draft isolation | All 61 main staged candidates and eight preserved owner proposals pass source/export checks; unpublished paths/seeds remain isolated. Six existing owner draft shells retain their existing noindex treatment, while the two proposed owner paths remain absent. |
| Additional utilities | All five H08 utility seeds are absent from 722 exported HTML/RSC/JS/JSON/XML text files. T12 reuses exact existing source requests. |
| Source provenance | The original 60 candidates retain their fingerprint groups and seven pinned source-file references. X09 matches its separately validated source and request/grid/answer hashes. The preserved owner raw-source hash remains `b5af328ea612dde28083fa86beedde9aeda370a988a30b730398325ecf17047c`. |
| PDF dependencies | The 14-file literal local import closure of the Node PDF/pack renderer and 14 original input/config/lock files have identical Git blobs to the original `a3988b546eedf44c772691dbe65a139b1a74a523` audit. |

Seven introduced offline source files match their validated commits exactly: X03's manifest/helper (PR89), X09's source record (PR92), T12's manifest/resolver (PR93), and H08's manifest/resolver (PR94). B additionally pins PR100's three amended collection-source/resolver/export files at `0fd07e68d76de122cadf132644f82c7ea778336f`: **ten validated source/export pins total**. PR100 reuses exact X02/X08-A definitions; X06 remains one proposed independent child plus one optional companion, zero approved published children and a minimum of two. The companion has no standalone indexable approval and cannot satisfy that minimum. These files activate no public content. Individual paths, commits and blob IDs are recorded in `carry-proof.json`.

## Actual retained files versus historical corpus evidence

**87 retained actual PDF files were read and hashed again**, with zero differences: 71 original utility/owner/Christmas-probe files, two X03 files from the earlier F freeze, two X09 files, four T12 files, four H08 files and four reused-source X06 files. This is a file count; some X03 outputs deliberately duplicate the earlier exact source probe bytes. X06's four recorded request/grid/answer mappings also match the fresh B source replays. The files retain their original real Letter/A4 student/teacher evidence, rather than being newly rendered at B. A's original 83-file result stays in A's folder.

Separately, all **1,200 recorded published-PDF hashes** were re-compared with the retained original baseline manifest and match. The original a3988 execution, its 120 main-staged PDFs, measured utility corpus and 16 owner PDFs remain historical evidence supported by unchanged inputs/dependencies. **This audit rendered zero PDFs.** Seven historical report files also retain the digests recorded at the preceding F proof. No historical run is relabeled as newly executed at B.

The original 48 legacy landscape PDFs below 9 pt remain a limitation, with minimum grid type 7.8208 pt. This proof does not approve those as measured large print or waive physical-printer review. Twelve selected installed renderer/font dependency digests match the previous F inventory, and the exact locked install, real dependency directory and Node 22 runtime are recorded. The original environment lacked a complete per-file `node_modules` manifest; retrospective complete installed-byte identity is not claimed.

## Reusable exact command and external reports

The parameterized audit reuses the earlier static/default/JSON-LD inspectors and invokes existing source/isolation/provenance CLIs. It refuses to reuse a result folder for a different frozen SHA. The exact B command was:

```powershell
$node22 = 'C:/Users/Suhas/AppData/Local/npm-cache/_npx/361c55be1121897e/node_modules/node/bin/node.exe'
$auditRoot = 'C:/Users/Suhas/.codex/visualizations/2026/11/06/01a1b33a-7733-7163-8af2-24bcc8caa97a'
$candidateRoot = 'E:/PROJECTS-and-WORK/work-projects/all_projects/wordsearch-final-product-review'
& $node22 "$candidateRoot/node_modules/tsx/dist/cli.mjs" --tsconfig "$candidateRoot/tsconfig.json" `
  "$auditRoot/final-carry-audit-tools/audit-final-carry.mts" `
  $candidateRoot 'f7849cddda2a7df5daff2425ba179b9af21f6272' `
  "$auditRoot/product-final-f7849cd/export-manifest.json" `
  "$auditRoot/product-final-f7849cd/static-pdf-carry"
```

Evidence is outside Git under that `$auditRoot`:

- `product-final-f7849cd/static-pdf-carry/summary.json` and `carry-proof.json`: exact B static/PDF/source/dependency scopes, hashes, original execution labels and exclusions. The proof records the audit tool's own SHA-256. `final-carry-audit-tools/B-run.log` reports pass; `B-run.stderr` is empty.
- The same folder contains `preservation.json`, expanded isolation/JSON-LD, fresh 61-candidate and eight-owner isolation, and pinned provenance reports.
- `product-final-90a0ee3/static-pdf-carry/` preserves A's original proof and own-host check. Its tested tool is retained byte-for-byte as `final-carry-audit-tools/audit-final-carry-A-tested.mts` (SHA-256 `4996f35beff391837bdf4aa0467758c79e4c3391083f5e6775bfc25576e442ef`).
- `final-carry-audit-tools/A-run-3.log` and `.stderr` retain A's completed guarded run. Earlier `A-run.log/.stderr` preserve the original Windows cross-drive evidence-path assertion failure; the harness was corrected to accept an absolute path outside the repository. No product code or thresholds changed. `A-run-2` is the earlier successful run before additional historical-report digest guards.

No browser print/layout, QR geometry/CLS, final Lighthouse, hosted-provider, physical device/printer/AT or user acceptance is carried by this Node proof. Editorial and publication approval remain false.

Own-host check: all 19 recovered idle-server PIDs are gone, and the later own 3282 host was closed after its original-session Ctrl+C. No further termination was needed. The coordinator replaced A's finished 3502 host with B's verified 3502 host; this audit did not stop either host or baseline 3394. No own server, build, browser or audit job remains running.
