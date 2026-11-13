# B11 — truthful specialty status and loaded selector repair

Review child of specialty audit PR #30 / `9c529c56742ebf5a3e825349001af71c365a9666`. Existing 13 specialty records remain draft/noindex; no activation or generator migration.

The existing route statuses now describe actual limits: ASL text labels have no handshapes, semaphore/Roman numeral conversion is not implemented, Greek/kana are experimental Latin-letter mappings, Spanish ñ and French ligatures lose information, and Unicode-symbol PDF output is unsupported. Removed the absent Morse legend promise and unsupported Braille/emoji accessibility assertions. Hidden-message overflow is described accurately. Original indexed puzzle content and all seeds/tokens stay unchanged.

When an existing request uses Spanish, French or symbols, the alphabet selector now displays that exact pack with a qualified label. The option is present only while that request is active; it is not newly offered from the generic selector. Changing away to Latin removes the legacy active option. This fixes the displayed-selector/state mismatch without advertising incomplete language capabilities.

Changed: `content/specialty.ts`, builder selector, existing specialty tests and focused browser test.

Validation November 6, 2026 (Node25.9.0): `npm run lint`, `npm run typecheck`, `npm test` PASS (237 tests, including37 specialty cases and published fingerprint snapshots); `git diff --check` PASS. Production build PASS334pages using same-drive detached C: mirror to avoid the existing E:-to-C: dependency junction resolution failure. Three changed application/test files copied exactly from the review worktree; source baseline9c529c5. Static-host PASS217sitemap/35redirects/6shells. `BASE_URL=http://127.0.0.1:3292 node tests/e2e/specialty-disclosure.mjs` PASS eight specialty disclosures at390/1280px, noindex, accurate active selector, switching to Latin, no horizontal overflow or page errors.

No claims of language, cultural, tactile, accessibility certification, correct semaphores/handshapes or physical print support. Existing full runtime/advertising acceptance remains a release gate; advertising sources, placement and lifecycle are untouched. No main push, merge, auto-merge or deployment. Rollback exclude/revert this branch; underlying old puzzle output remains compatible.
