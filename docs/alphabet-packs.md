# Alphabet Packs

The puzzle engine is token-based. A cell can contain a letter, Morse token, braille cell, binary byte, hexadecimal token, kana display token, or future symbol.

Each pack in `lib/alphabet-packs/index.ts` defines:

- `normalizeInput`
- `tokenize`
- `encodeWord`
- `fillerTokens`
- `tokenLabel`

## Add a Pack

1. Add the pack id to `AlphabetPackId` in `lib/puzzle/types.ts`.
2. Add a pack implementation in `lib/alphabet-packs/index.ts`.
3. Add route metadata in `content/specialty.ts` when it should have a generator page.
4. Add tests in `tests/unit/alphabet-packs.test.ts`.
5. Verify print and answer-key output because long tokens need smaller SVG text.

## Specialty Status

Morse, braille, binary, hex, Greek, kana, Spanish/French normalization, and hidden message mode are active. ASL/semaphore/emoji-style routes use the same token architecture and are ready for richer artwork without rewriting placement logic.
