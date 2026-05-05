import { describe, expect, test } from "vitest";
import { defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { decodeShareState, encodeShareState, shareUrl } from "@/lib/share-state/state";

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
});
