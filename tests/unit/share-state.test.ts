import { describe, expect, test } from "vitest";
import { defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { decodePuzzleShareState, decodeShareState, encodeShareState, shareUrl } from "@/lib/share-state/state";

describe("share state", () => {
  test("round trips puzzle settings", () => {
    const encoded = encodeShareState(defaultPuzzleRequest);
    expect(decodeShareState(encoded)).toMatchObject({
      title: defaultPuzzleRequest.title,
      seed: defaultPuzzleRequest.seed,
      difficulty: defaultPuzzleRequest.difficulty
    });
  });

  test("creates absolute iLoveWordSearch URLs", () => {
    expect(shareUrl("/word-search-generator?state=abc")).toBe("https://www.ilovewordsearch.com/word-search-generator?state=abc");
  });

  test("rejects malformed, oversized, and seedless puzzle route state", () => {
    expect(decodePuzzleShareState("not-valid-base64-json")).toBeNull();
    expect(decodePuzzleShareState("x".repeat(32_001))).toBeNull();
    expect(decodePuzzleShareState(encodeShareState({ wordsText: "alpha" }))).toBeNull();
    expect(decodePuzzleShareState(encodeShareState({ seed: "seed-only" }))).toBeNull();
    expect(decodePuzzleShareState(encodeShareState(defaultPuzzleRequest))).toMatchObject({ seed: defaultPuzzleRequest.seed });
  });
});
