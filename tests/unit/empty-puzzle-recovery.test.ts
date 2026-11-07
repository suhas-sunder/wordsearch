import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { noPlacementsError, noPlayableWordsError, puzzleRequestError } from "@/lib/puzzle/request-validation";
import { decodePuzzleShareState, puzzleRecoveryLink, stateId } from "@/lib/share-state/state";
import { createPuzzlePdf, validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { WordSearchBuilder } from "@/components/builder/WordSearchBuilder";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { createHash } from "node:crypto";

const diagonal = { title: "Seed boundary", wordsText: "A".repeat(40), seed: "diagonal-1", autoSize: false, rows: 40, cols: 40, directions: ["SE" as const] };

describe("zero-placement requests fail before generation", () => {
  test.each([{ wordsText: "!!!" }, { wordsText: "CAT |", wordBankMode: "clues" as const }, { wordsText: "CAT", seed: " " }])("semantic invalid maker input stays editable: %s", (initialRequest) => {
    const markup = renderToStaticMarkup(createElement(WordSearchBuilder, { initialRequest }));
    expect(markup).toContain('class="builder-controls"');
    expect(markup).toContain("Words and clues");
    expect(markup).not.toContain('class="puzzle-token"');
  });
  test.each(["", "!!!", "ΕΛΛΑΔΑ", "日本語", "A".repeat(41)])("rejects an unusable list %s", (wordsText) => {
    const request = { wordsText, seed: "empty-migration" };
    expect(puzzleRequestError(request)).toBe(noPlayableWordsError);
    expect(() => generatePuzzle(request)).toThrow(noPlayableWordsError);
    expect(decodePuzzleShareState(stateId(request))).toBeNull();
  });
  test("explicit directions use actual rectangular dimensions, not the longest side", () => {
    const request = { wordsText: "ELEPHANT", rows: 6, cols: 20, autoSize: false, directions: ["S" as const] };
    expect(puzzleRequestError(request)).toBe(noPlayableWordsError);
    expect(puzzleRequestError({ ...request, directions: ["SE"] })).toBe(noPlayableWordsError);
    expect(generatePuzzle({ ...request, directions: ["E"] }).placed).toHaveLength(1);
    expect(generatePuzzle({ ...request, directions: undefined }).placed).toHaveLength(1);
  });
  test("seed-specific bounded placement misses fail centrally and the editor stays usable", () => {
    expect(puzzleRequestError(diagonal)).toBeNull();
    expect(() => generatePuzzle(diagonal)).toThrow(noPlacementsError);
    const markup = renderToStaticMarkup(createElement(WordSearchBuilder, { initialRequest: diagonal }));
    expect(markup).toContain('class="builder-controls"');
    expect(markup).toContain(noPlacementsError);
    expect(markup).not.toContain('class="puzzle-token"');
    const valid = generatePuzzle({ ...diagonal, seed: "diagonal-0" });
    expect(createHash("sha256").update(JSON.stringify(valid.grid)).digest("hex")).toBe("a9210b7da2c947e262b550771608db72ebb7d54b78043e2c6f797e9038d44441");
    expect(createHash("sha256").update(JSON.stringify(valid.placed)).digest("hex")).toBe("b45d0bc120a605d0d4d1f8e375b522de93e674588ca4681fba95941ec1213354");
  });
  test("recovery links retain exact bounded semantic definitions without admitting malformed states", () => {
    for (const request of [{ wordsText: "!!!", seed: "repair" }, { wordsText: "", seed: "repair" }, { wordsText: "CAT |", seed: "repair", wordBankMode: "clues" as const }]) {
      const encoded = stateId(request);
      expect(puzzleRecoveryLink(encoded)?.href).toBe(`/word-search-generator?state=${encodeURIComponent(encoded)}`);
    }
    expect(puzzleRecoveryLink(stateId(diagonal), new Error(noPlacementsError))?.message).toBe(noPlacementsError);
    for (const encoded of ["%%%", "A".repeat(32001), stateId({ wordsText: "CAT", seed: "ok", rows: 0 }), stateId({ wordsText: "CAT", seed: "ok", constructor: "bad" } as never)]) expect(puzzleRecoveryLink(encoded)).toBeNull();
  });
  test("partially fitting requests retain placed answers and existing exclusions", () => {
    const puzzle = generatePuzzle({ wordsText: "CAT\n" + "W".repeat(30), autoSize: false, rows: 6, cols: 6, directions: ["E"] });
    expect(puzzle.placed.map((word) => word.label)).toEqual(["CAT"]);
    expect(puzzle.excluded).toHaveLength(1);
  });
  test("synthetic filler-only PDF input is also rejected", async () => {
    const puzzle = { ...generatePuzzle({ wordsText: "CAT" }), placed: [] };
    expect(validatePuzzleForPdf(puzzle)).toBe(false);
    await expect(createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, qrCode: false }, shareUrl: "https://www.ilovewordsearch.com/" })).rejects.toThrow("Puzzle data is invalid");
  });
});
