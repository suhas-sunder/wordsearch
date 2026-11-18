# Buildout pull-request reconciliation

GitHub REST collection observed 2026-11-07T05:53:34.118Z. Application freeze: `f7849cddda2a7df5daff2425ba179b9af21f6272`.

This is an inventory of review work, not production or editorial approval.
PR1 was previously approved and squash-merged into production main. The later
merged packages below target isolated review branches; they do not represent
new merges to main. An open historical PR whose code is already contained is
not an instruction to merge it again.

Initial PR2–13 histories were reconstructed in the reviewed15/16 integration;
their original branches and evidence remain preserved. See
[weekly integration](INTEGRATION-2026-11-06.md) and
[candidate integrity](PRODUCT-RELEASE-CANDIDATE-04.md). PR8 has an explicit
four-file/command identity proof rather than a duplicate merge of its old graph.

The table records each actual PR head at observation. The feature ledger may
pin an earlier immutable tested source snapshot; it does not assert every
historical snapshot is the latest branch head. The final evidence PR and
review-only head are recorded in the final PR97 GitHub handoff after this
document is committed, avoiding a self-referential commit-hash loop.

| PR / work | GitHub state | Base | Exact PR head | Application containment |
| --- | --- | --- | --- | --- |
| [PR1](https://github.com/suhas-sunder/wordsearch/pull/1) Track A: consistent footer branding, Lucide icons, and legal row | merged | `main` | `3f1b2b3db8ad3ed90e65228855b54c3910251a3e` | prior squash release |
| [PR2](https://github.com/suhas-sunder/wordsearch/pull/2) WS-W46-01: validate puzzle directions and establish release tracks | open draft | `main` | `c6539992f95ea584498329bc319ac38edbbe160e` | historical reconstruction; see above |
| [PR3](https://github.com/suhas-sunder/wordsearch/pull/3) Preserve customized directions when reselecting difficulty | open draft | `release/2026-W46-direction-validation` | `7211ff2dda4a74321bec5f25414175b3c3569783` | historical reconstruction; see above |
| [PR4](https://github.com/suhas-sunder/wordsearch/pull/4) Investigate share-link and QR reliability | open draft | `release/2026-W46-direction-validation` | `90b09bc9ba82d9432fd0438946438aa1e06649ba` | historical reconstruction; see above |
| [PR5](https://github.com/suhas-sunder/wordsearch/pull/5) Show permitted directions on printable puzzles | open draft | `release/2026-W46-direction-validation` | `8709048d9cf560f259c37626cb497e991e210e4a` | historical reconstruction; see above |
| [PR6](https://github.com/suhas-sunder/wordsearch/pull/6) Strengthen static share-route regression coverage | open draft | `release/2026-W46-direction-validation` | `1e4c147c3db1c21325f7ea0ecf952323330ce064` | historical reconstruction; see above |
| [PR7](https://github.com/suhas-sunder/wordsearch/pull/7) [WP05a] Add Lucide icons to static puzzle actions | open draft | `fasttrack/2026-11-05-brand-footer` | `2d87f3b56db2f5ec8af2eeadfd82c74ee5fb1873` | historical reconstruction; see above |
| [PR8](https://github.com/suhas-sunder/wordsearch/pull/8) WP-08a: classify baseline failures and validate live ad markup accurately | open draft | `release/2026-W46-direction-validation` | `9b8e64d2f211460a01c3143272fe70e22d14f185` | historical reconstruction; see above |
| [PR9](https://github.com/suhas-sunder/wordsearch/pull/9) WP-01: bound external puzzle input and keep invalid edits recoverable | open draft | `release/2026-W46-direction-validation` | `620c5b5df4c14c1e4340fdf2eb916f6b5004cbb9` | historical reconstruction; see above |
| [PR10](https://github.com/suhas-sunder/wordsearch/pull/10) Polish semantic category icons across discovery | open draft | `fasttrack/2026-11-05-brand-footer` | `48c9fa17d11ec126562ba1ea05746a5d0d3e259c` | historical reconstruction; see above |
| [PR11](https://github.com/suhas-sunder/wordsearch/pull/11) Add editorial review and publication safeguards | open draft | `release/2026-W46-direction-validation` | `2470d86e15e07e455f75d3668c399ee980d98893` | historical reconstruction; see above |
| [PR12](https://github.com/suhas-sunder/wordsearch/pull/12) Update compatible dependency security patches | open draft | `release/2026-W46-direction-validation` | `f638e70e45ca3ded5dcb763a7d64fcc6d0769b7d` | historical reconstruction; see above |
| [PR13](https://github.com/suhas-sunder/wordsearch/pull/13) Overnight handoff: eight work packages and final review ledger | open draft | `release/2026-W46-direction-validation` | `db94bc8cf1ca3dcaaf07f3da20b63aa4db06c3bf` | historical reconstruction; see above |
| [PR14](https://github.com/suhas-sunder/wordsearch/pull/14) Master roadmap: full 2027 release calendar and polished WordSearch product acceptance | open draft | `main` | `d297f7b71b336029e7d151d4e3e5ca6330438f52` | exact ancestor |
| [PR15](https://github.com/suhas-sunder/wordsearch/pull/15) [Track A] Reconstruct action/category icons on released main | open draft | `main` | `5730c2cff95a177d375ad4c33901d389aeb41e89` | exact ancestor |
| [PR16](https://github.com/suhas-sunder/wordsearch/pull/16) [Track B] Weekly integrated candidate with bounded generation workload | open draft | `main` | `74b8ff95024b60a7f299175cd153b3c4fb974835` | exact ancestor |
| [PR17](https://github.com/suhas-sunder/wordsearch/pull/17) Add source-only editorial inventory foundation | open draft | `release/2026-W46-integrated-candidate` | `6ed1b0434d82a9bb4e73c4f8964fd7d84b131f7d` | exact ancestor |
| [PR18](https://github.com/suhas-sunder/wordsearch/pull/18) B10/U21: offline cohort measurement and buildout reconciliation | open draft | `release/2026-W46-integrated-candidate` | `5b4d857f910571e6f17a69a18f9f9a333e512416` | exact ancestor |
| [PR19](https://github.com/suhas-sunder/wordsearch/pull/19) B03: Add bounded printable puzzle pack PDF engine | open draft | `release/2026-W46-integrated-candidate` | `283af52e9a9b0e2fcf2417de970c6db3efe8c303` | exact ancestor |
| [PR20](https://github.com/suhas-sunder/wordsearch/pull/20) Validate staged puzzle generation and PDF parity | open draft | `release/2026-W46-buildout-foundation` | `1e904061f3b61ce3264df8c9d4886dafe60bc27d` | exact ancestor |
| [PR21](https://github.com/suhas-sunder/wordsearch/pull/21) B09/U12/U14: private completion result image and elapsed time | open draft | `release/2026-W46-integrated-candidate` | `790292e46db7d852a1d82e6d246de4c9c1ed5e7c` | exact ancestor |
| [PR22](https://github.com/suhas-sunder/wordsearch/pull/22) Draft source-only Christmas puzzle assets X01–X08 | open draft | `release/2026-W46-staged-validation` | `3a60d11694e8a78cf60a46f08e3ad3d6cdf94b06` | exact ancestor |
| [PR23](https://github.com/suhas-sunder/wordsearch/pull/23) B03b: Add unlinked guest classroom pack builder | open draft | `release/2026-W46-print-packs` | `db13e6b1694af8dcfcda357296f506c63a066778` | exact ancestor |
| [PR24](https://github.com/suhas-sunder/wordsearch/pull/24) B13: gated identity, co-solving and business discovery specification | open draft | `release/2026-W46-integrated-candidate` | `ef02bec1e6afa60317ff29107d59d8cea9cc657d` | exact ancestor |
| [PR25](https://github.com/suhas-sunder/wordsearch/pull/25) Measure rendered PDF typography and layout | open draft | `release/2026-W46-integrated-candidate` | `39316a0f4efd214365a9fa94f7d378f06e4f0191` | exact ancestor |
| [PR26](https://github.com/suhas-sunder/wordsearch/pull/26) Add staged evergreen hard pilot drafts | open draft | `release/2026-W46-staged-validation` | `f34b75a7487ac67a87ef70a2316a099726bac727` | exact ancestor |
| [PR27](https://github.com/suhas-sunder/wordsearch/pull/27) B03c: Measure and fit opt-in pack PDF layouts | open draft | `release/2026-W46-pack-builder` | `86338303e81cc14d8c20d9eb91dd6aa431f06659` | exact ancestor |
| [PR28](https://github.com/suhas-sunder/wordsearch/pull/28) Buildout integration 01: inventory, staged QA, packs, completion and monitoring | open draft | `release/2026-W46-integrated-candidate` | `10d6379bc29f2c46589c32d29b4dfae6c3805f19` | exact ancestor |
| [PR29](https://github.com/suhas-sunder/wordsearch/pull/29) X12/X13: source-only winter sports and wildlife inventory | open draft | `release/2026-W46-staged-validation` | `245845f03d5c9ba32748df9fdc2cd119148406d6` | exact ancestor |
| [PR30](https://github.com/suhas-sunder/wordsearch/pull/30) B11: Audit specialty formats, replay and known correctness gaps | open draft | `release/2026-W46-integrated-candidate` | `9c529c56742ebf5a3e825349001af71c365a9666` | exact ancestor |
| [PR31](https://github.com/suhas-sunder/wordsearch/pull/31) U08: Link the site maintainer and add footer copyright | open draft | `release/2026-W46-buildout-integration` | `e6f73822d1e7467c9c57778ee5d10e10d9107c52` | exact ancestor |
| [PR32](https://github.com/suhas-sunder/wordsearch/pull/32) U03: Replace incomplete hub feature heading | open draft | `release/2026-W46-buildout-integration` | `3c2676908ea719f45c583cbf005bea9c0efc5cf7` | exact ancestor |
| [PR33](https://github.com/suhas-sunder/wordsearch/pull/33) U04: Align header navigation and integrate menu search | open draft | `release/2026-W46-buildout-integration` | `2cc4c20885b3d956badd077a92086429470853d5` | exact ancestor |
| [PR34](https://github.com/suhas-sunder/wordsearch/pull/34) B09/U13: Add opt-in device progress and explicit solver resume | open draft | `release/2026-W46-completion-card` | `c6553c8b7b5608730dcbb94b22223ddb552c16ec` | exact ancestor |
| [PR35](https://github.com/suhas-sunder/wordsearch/pull/35) Build sixteen source-only seasonal activities and five printable pack assets | open draft | `codex/buildout-integration-02` | `76c6862748938e8dc5d775439be0d4f6862a023c` | exact ancestor |
| [PR36](https://github.com/suhas-sunder/wordsearch/pull/36) B11: Show truthful specialty limits and exact loaded pack labels | open draft | `release/2026-W46-specialty-audit` | `184727484bcdd55cff97b3cd9c2d90981804b549` | exact ancestor |
| [PR37](https://github.com/suhas-sunder/wordsearch/pull/37) Buildout integration 02: measured PDF layout, staged pilots, navigation and local resume | open draft | `release/2026-W46-buildout-integration` | `9e8b5b9325f757605d0c0eac3d9697093ebcb2f2` | exact ancestor |
| [PR38](https://github.com/suhas-sunder/wordsearch/pull/38) Add twenty-assignment classroom batches and separate student/teacher PDFs | open draft | `codex/buildout-integration-02` | `37b4e526cffa15eb8ae7b4a0702127ab32c77b0a` | exact ancestor |
| [PR39](https://github.com/suhas-sunder/wordsearch/pull/39) Security: Upgrade direct Zod dependency and verify schema compatibility | open draft | `release/2026-W46-buildout-integration` | `67ae6e27f1b1cedbde08bdf5018c9d28d3f72509` | exact ancestor |
| [PR40](https://github.com/suhas-sunder/wordsearch/pull/40) Ten source-only hard evergreen puzzles and measured 5/10-puzzle packs | open draft | `codex/buildout-integration-02` | `7898813bb73fa8d2416cef8380aa0c613eea17a4` | exact ancestor |
| [PR41](https://github.com/suhas-sunder/wordsearch/pull/41) Ten unpublished teacher subject worksheets and measured packets | open draft | `codex/evergreen-hard-inventory` | `b687815c533b5805034045a127bc3a2d2ab75843` | exact ancestor |
| [PR42](https://github.com/suhas-sunder/wordsearch/pull/42) U09: Add persisted system-aware light and dark appearance | open draft | `release/2026-W46-navigation` | `cd4def1fdc26d4587d867a7dbc670212f3d823fa` | exact ancestor |
| [PR43](https://github.com/suhas-sunder/wordsearch/pull/43) Add measured large-print classroom PDF profile | open draft | `codex/classroom-export-options` | `a7af19b14f0ffa2e29c505618a653acf2f622f94` | exact ancestor |
| [PR44](https://github.com/suhas-sunder/wordsearch/pull/44) Save and reopen exact classroom assignments locally | open draft | `codex/classroom-export-options` | `5b5f6f8a3b4ec346105ecbb8bfafeccce5e49c9b` | exact ancestor |
| [PR45](https://github.com/suhas-sunder/wordsearch/pull/45) Security: Remediate all remaining tooling advisories | open draft | `codex/zod-security` | `7909b541e61230efa144c4e19284b30e69a6fe9e` | exact ancestor |
| [PR46](https://github.com/suhas-sunder/wordsearch/pull/46) Build L01–L16 measured larger-type utility inventory and repair coalesced label measurement | open draft | `codex/measured-large-print` | `bd4832c706e8e4220b465805d8f366dc9e315db7` | exact ancestor |
| [PR47](https://github.com/suhas-sunder/wordsearch/pull/47) U13: Pause solver time across cached page navigation | open draft | `release/2026-W46-solver-progress` | `cbf3e092c7d79f2b956781578d98cfb1378c31e3` | exact ancestor |
| [PR48](https://github.com/suhas-sunder/wordsearch/pull/48) U05: Share lower-page search and honor explicit FAQ content | open draft | `release/2026-W46-navigation` | `1748237db3ebd96cc54abe7ce92a46bc1ba0b862` | exact ancestor |
| [PR49](https://github.com/suhas-sunder/wordsearch/pull/49) Fourteen unpublished annual review packets with real Letter/A4 student and teacher PDFs | open draft | `codex/buildout-integration-03` | `6ca81e11b45e1fe8591334dd241f6af54287eebd` | exact ancestor |
| [PR50](https://github.com/suhas-sunder/wordsearch/pull/50) U05: Add practical authored FAQs to five existing hubs | open draft | `codex/buildout-contextual-discovery` | `86987dbf2638f5deabee53ec8be3c694f754c49d` | exact ancestor |
| [PR51](https://github.com/suhas-sunder/wordsearch/pull/51) Product acceptance checkpoint 03: guest print tools, themes and security (draft) | open draft | `main` | `08ffcd2ea97aa43fd73ce79904a86623d7752f84` | exact ancestor |
| [PR52](https://github.com/suhas-sunder/wordsearch/pull/52) U05/F5: Stabilize search loading and remove false empty states | open draft | `release/2026-W46-navigation` | `14414d9b47e0a192052d53f2786155df7f2009cf` | exact ancestor |
| [PR53](https://github.com/suhas-sunder/wordsearch/pull/53) Build fifteen missing calendar candidates and preserve two owner draft enhancements | open draft | `codex/buildout-integration-03` | `11e492098eaeeb9259ce98ed8b35c75558ba1760` | exact ancestor |
| [PR54](https://github.com/suhas-sunder/wordsearch/pull/54) Add classroom instructions and fitted blank class line | open draft | `codex/buildout-integration-03` | `be4b4c852c46c400100d735618dd64ce808ed215` | exact ancestor |
| [PR55](https://github.com/suhas-sunder/wordsearch/pull/55) U13: Add named device puzzle library with exact saved replay | open draft | `codex/buildout-integration-03` | `4b47bf23ffb1d6be0014ad428a1057495ff42244` | exact ancestor |
| [PR56](https://github.com/suhas-sunder/wordsearch/pull/56) Typed 53-window editorial calendar with frozen asset provenance and zero-publication fallback | open draft | `codex/calendar-inventory-gaps` | `1e6d6cc69c455e7bba89d7a21175c67a1ca34474` | exact ancestor |
| [PR57](https://github.com/suhas-sunder/wordsearch/pull/57) F1: Expand visual acceptance and repair footer/title hierarchy | open draft | `codex/buildout-integration-03` | `d55e7937ae60d03a8aae536d354558a8164ba623` | exact ancestor |
| [PR58](https://github.com/suhas-sunder/wordsearch/pull/58) Audit all sixty staged candidates together including the calendar gap inventory | open draft | `codex/buildout-integration-03` | `ea27212e7ced9003c6b69100f1efa1c8156b07f7` | exact ancestor |
| [PR59](https://github.com/suhas-sunder/wordsearch/pull/59) F3: Export offline script-free HTML worksheets with exact answers | open draft | `codex/buildout-integration-03` | `0b8e03681ad69c8aa0839c8082074e38240d6cfa` | exact ancestor |
| [PR60](https://github.com/suhas-sunder/wordsearch/pull/60) Add selective classroom activity links and verified creator profiles | open draft | `codex/buildout-integration-03` | `6a862b7cf28950d6291e9c4cf720b1b19ad56262` | exact ancestor |
| [PR61](https://github.com/suhas-sunder/wordsearch/pull/61) Make the tested guest worksheet pack builder discoverable | open draft | `codex/buildout-integration-03` | `57813648edbb9daa1f2ff1ef4665adc176cb53cc` | exact ancestor |
| [PR62](https://github.com/suhas-sunder/wordsearch/pull/62) Validate classroom activity links and pack discovery after hub FAQs | open draft | `codex/buildout-integration-03` | `d0002b03421505c8e20a828206b192ba1911d5d2` | exact ancestor |
| [PR63](https://github.com/suhas-sunder/wordsearch/pull/63) F2: Solve exact one-cell words with keyboard, pointer and touch | open draft | `codex/buildout-integration-03` | `1780019a4a748cbd084c3705610956b5bdaeb96c` | exact ancestor |
| [PR64](https://github.com/suhas-sunder/wordsearch/pull/64) F2/U13: Save exact curated and shared definitions through the maker | open draft | `codex/local-puzzle-library` | `c80ffe2d0e6f23b392d05897bec6a33bea239e00` | exact ancestor |
| [PR65](https://github.com/suhas-sunder/wordsearch/pull/65) F2: Apply edited request print defaults to preview and PDF | open draft | `codex/offline-html-worksheet` | `587442cdda85d98eeddaa05e612ecfdad05843a5` | exact ancestor |
| [PR66](https://github.com/suhas-sunder/wordsearch/pull/66) F2 combined checkpoint: exact saving, solver input and print controls | open draft | `codex/buildout-integration-03` | `8019e4b441403c81cb4372ef145bd12e410a11af` | exact ancestor |
| [PR67](https://github.com/suhas-sunder/wordsearch/pull/67) F5: Stabilize utility checking states without fallback output | open draft | `codex/buildout-integration-03` | `b3677920d7c28dc91ce5f41ba52ad8456060494e` | exact ancestor |
| [PR68](https://github.com/suhas-sunder/wordsearch/pull/68) Reject broken custom PDF layouts and preserve published output bytes | open draft | `codex/classroom-worksheet-fields` | `28cb5f72659e5567d6052acfe085cf90d31d81d9` | exact ancestor |
| [PR69](https://github.com/suhas-sunder/wordsearch/pull/69) F1: Explain unavailable theme selection before hydration | open draft | `codex/buildout-f1-visual` | `7c8a617b910921667bc6b102aa3349af9a8fce21` | exact ancestor |
| [PR70](https://github.com/suhas-sunder/wordsearch/pull/70) Product candidate04: repaired guest build and unpublished 2027 inventory | open draft | `main` | `26fa36d1113ecbef7721ed158aa9441cd16c57d2` | exact ancestor |
| [PR71](https://github.com/suhas-sunder/wordsearch/pull/71) Diagnose provider Lighthouse failures with sanitized controls | merged | `codex/product-candidate-04` | `fc6c471acb5d26149c7ed6a04db2a3567d576707` | exact ancestor |
| [PR72](https://github.com/suhas-sunder/wordsearch/pull/72) Fit browser worksheets to paper and include requested answer pages | merged | `codex/product-candidate-04` | `160d8b46925799a75f75a5ef4afca26967f9e0a3` | exact ancestor |
| [PR73](https://github.com/suhas-sunder/wordsearch/pull/73) Offer accessible WhatsApp and email puzzle drafts | merged | `codex/product-candidate-04` | `737bcdd0d2adddad7cb2bcf763913cc41015bf78` | exact ancestor |
| [PR74](https://github.com/suhas-sunder/wordsearch/pull/74) Expose seed, filler and bank controls with honest specialty readiness | open draft | `codex/f2-guest-validation` | `e2154fa00f1093dc794952fef8cb77bfd5de52f8` | exact ancestor |
| [PR75](https://github.com/suhas-sunder/wordsearch/pull/75) Add document-ready PNG, standalone SVG and exact grid text exports | merged | `codex/product-candidate-04` | `105eec46c1bfeff186baa72bf19cd8a9007ae1e2` | exact ancestor |
| [PR76](https://github.com/suhas-sunder/wordsearch/pull/76) Add measured large-print PDF choice for single puzzles | merged | `codex/product-candidate-04` | `446e15344f263655c8d97f6290e985fde2bf10d4` | exact ancestor |
| [PR77](https://github.com/suhas-sunder/wordsearch/pull/77) Refuse browser and offline worksheets that fail measured fit | merged | `codex/product-candidate-04` | `0e546929514867328e228dd03a4de65e99ab6b89` | exact ancestor |
| [PR78](https://github.com/suhas-sunder/wordsearch/pull/78) Add opt-in numbered clue worksheets with aligned teacher answers | merged | `codex/product-candidate-04` | `a73301168096c601cb521f44c70027f75d349264` | exact ancestor |
| [PR79](https://github.com/suhas-sunder/wordsearch/pull/79) Preserve all eight owner drafts as isolated review assets | merged | `codex/product-candidate-04` | `41aa3e0a79e411bbd9407ca22106ac35d01a1d0b` | exact ancestor |
| [PR80](https://github.com/suhas-sunder/wordsearch/pull/80) Align private candidate wording and retain explicit distinctness gates | merged | `codex/product-candidate-04` | `4d863d47a2de1df2e40b693b126d4437404c368f` | exact ancestor |
| [PR81](https://github.com/suhas-sunder/wordsearch/pull/81) Offer default-off local word-found sound feedback | merged | `codex/product-candidate-04` | `7cb3dbbd1315b6737825f1793d5a7fb03b105475` | exact ancestor |
| [PR82](https://github.com/suhas-sunder/wordsearch/pull/82) Add optional Latin lowercase to print, PDF and document exports | merged | `codex/product-candidate-04` | `f1413b27a4a2bfac4bc10b04c34c5d2ab55db63e` | exact ancestor |
| [PR83](https://github.com/suhas-sunder/wordsearch/pull/83) Reject filler-only puzzles and keep exact editable error recovery | merged | `codex/product-candidate-04` | `58c284b492a03288cc1031b0282914ead9c076f9` | exact ancestor |
| [PR84](https://github.com/suhas-sunder/wordsearch/pull/84) Correct the advertising availability statement for editorial review | merged | `codex/product-candidate-04` | `0fa79b452c2262482026df1e53002eb9e6e38717` | exact ancestor |
| [PR85](https://github.com/suhas-sunder/wordsearch/pull/85) Cancel stale HTML/PDF downloads and prior-preview PNG errors | merged | `codex/product-candidate-04` | `09d47e5187819f7cd90f05cedc7ac79d8f2b666e` | exact ancestor |
| [PR86](https://github.com/suhas-sunder/wordsearch/pull/86) Explain ignored settings fallbacks and verify the full guest controls | merged | `codex/product-candidate-04` | `8478f1c5744b1e5f215342200d7040ad51caf8a8` | exact ancestor |
| [PR87](https://github.com/suhas-sunder/wordsearch/pull/87) Expand final visual acceptance and expose text/contrast regressions | merged | `codex/product-candidate-04` | `dbd26874841e256ae7615134c2d7ac7ff6ebc6d1` | exact ancestor |
| [PR88](https://github.com/suhas-sunder/wordsearch/pull/88) Repair export guidance overlap and dark solver start contrast | merged | `codex/product-candidate-04` | `25feeb9b427a1f7d990063e1c3bc6c8137ef9bbb` | exact ancestor |
| [PR89](https://github.com/suhas-sunder/wordsearch/pull/89) Materialize source-only X03 measured Christmas format | merged | `codex/product-candidate-04` | `50ccc6d7f45b78cad52d2706a9f7064ceec488d8` | exact ancestor |
| [PR90](https://github.com/suhas-sunder/wordsearch/pull/90) Author gated offline reviews for Christmas traditions and kids collections | open draft | `codex/product-candidate-04` | `f32571499af7092f417566d6bde8bd4218d62e7a` | exact ancestor |
| [PR91](https://github.com/suhas-sunder/wordsearch/pull/91) Maintain final functional fixtures and current footer acceptance | open draft | `codex/product-candidate-04` | `2f200eae87dd5fd387a8a72bf5dcd5894e38f916` | exact ancestor |
| [PR92](https://github.com/suhas-sunder/wordsearch/pull/92) Draft X09 Christian Nativity vocabulary with isolated PDF validation | open draft | `codex/product-candidate-04` | `a203d9badb6d68d742588d715d085c44561b0774` | exact ancestor |
| [PR93](https://github.com/suhas-sunder/wordsearch/pull/93) Curate T12 substitute folder from exact existing teacher worksheets | merged | `codex/final-product-acceptance` | `5b9dce7765f318e00ae638efe193b4fa194e31b0` | exact ancestor |
| [PR94](https://github.com/suhas-sunder/wordsearch/pull/94) Build H08 thirty-target challenge packet from frozen source banks | open draft | `codex/substitute-teacher-review` | `ccb78d53586a3671f6edf9bcddcefefcd582f9ca` | exact ancestor |
| [PR95](https://github.com/suhas-sunder/wordsearch/pull/95) Add finding and stable sorting within published hard and answer collections | merged | `codex/final-product-acceptance` | `09bc53d9c71aa178cb5ca33d1748c3e26d90d192` | exact ancestor |
| [PR96](https://github.com/suhas-sunder/wordsearch/pull/96) Bound popup, URL and collection search queries before ranking | merged | `codex/final-product-acceptance` | `e4a0637fb936ffd935a91a2d1bd157604aebe3b7` | exact ancestor |
| [PR97](https://github.com/suhas-sunder/wordsearch/pull/97) Final guest product release candidate and unpublished 2027 inventory | open draft | `main` | `f7849cddda2a7df5daff2425ba179b9af21f6272` | exact ancestor |
| [PR98](https://github.com/suhas-sunder/wordsearch/pull/98) Preserve exact utility parity and attribute the QR layout shift | merged | `codex/final-product-acceptance` | `982f47cf91b8133c9f71a0cbb76c899d8ec9273a` | exact ancestor |
| [PR99](https://github.com/suhas-sunder/wordsearch/pull/99) Keep QR readiness and actual image geometry stable | merged | `codex/final-product-acceptance` | `4a07d67704a92846a4b44931ac4ec282c8c24839` | exact ancestor |
| [PR100](https://github.com/suhas-sunder/wordsearch/pull/100) Resolve X06 action companion with strict source and publication gates | merged | `codex/final-product-acceptance` | `0fd07e68d76de122cadf132644f82c7ea778336f` | exact ancestor |

Total: 100 PRs; 87 exact application ancestors. Original PR1–13 remain preserved separately.
