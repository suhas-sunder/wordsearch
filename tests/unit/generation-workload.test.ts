import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { choosePuzzleSize, maxPlacementTokenChecks, placementTokenCheckBound } from "@/lib/puzzle/generation-limits";
import { parseWordInput } from "@/lib/puzzle/parse";
import { puzzleRequestError } from "@/lib/puzzle/request-validation";
import { decodePuzzleShareState, encodeShareState } from "@/lib/share-state/state";
import type { DirectionKey } from "@/lib/puzzle/types";

const words = (count: number, length: number) => Array.from({ length: count }, (_, i) =>
  "A".repeat(length - 3) + String.fromCharCode(66, 65 + Math.floor(i / 26), 65 + i % 26)).join("\n");
const base = { seed: "workload-unit", title: "Bounded", rows: 40, cols: 40, autoSize: false, directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"] as DirectionKey[] };

describe("deterministic generation workload gate", () => {
  test("admits the exact conservative token-check boundary and rejects the next word", () => {
    const atLimit = { ...base, wordsText: words(125, 10) };
    expect(placementTokenCheckBound(parseWordInput(atLimit.wordsText, "latin").words, 40, 40, 8)).toBe(maxPlacementTokenChecks);
    expect(puzzleRequestError(atLimit)).toBeNull();
    const excessive = { ...base, wordsText: words(126, 10) };
    expect(puzzleRequestError(excessive)).toMatch(/workload/);
    expect(() => generatePuzzle(excessive)).toThrow(/workload/);
    expect(decodePuzzleShareState(encodeShareState(excessive))).toBeNull();
  });
  test.each([true, false])("rejects dense repeated directions with overlap=%s before allocation", (allowOverlap) => {
    const input = { ...base, directions: Array(128).fill("E") as DirectionKey[], wordsText: words(200, 20), allowOverlap };
    expect(puzzleRequestError(input)).toMatch(/workload/);
    expect(() => generatePuzzle(input)).toThrow(/workload/);
  });
  test("counts effective auto-size, omitted preset directions, duplicates and skipped long words accurately", () => {
    for (const allowOverlap of [true, false]) {
      const input = { wordsText: words(200, 20), autoSize: true, directions: Array(128).fill("E") as DirectionKey[], allowOverlap };
      expect(puzzleRequestError(input)).toMatch(/workload/);
    }
    expect(puzzleRequestError({ ...base, wordsText: words(200, 20), directions: undefined, difficulty: "hard" })).toMatch(/workload/);
    // Omitted autoSize inherits true even if legacy dimensions are present.
    const omittedAuto = { rows: 6, cols: 6, directions: Array(128).fill("E") as DirectionKey[], wordsText: words(20, 20) };
    expect(puzzleRequestError(omittedAuto)).toMatch(/workload/);
    expect(() => generatePuzzle(omittedAuto)).toThrow(/workload/);
    expect(puzzleRequestError({ ...base, wordsText: Array(200).fill("SAME").join("\n"), directions: Array(128).fill("E") })).toBeNull();
    const longWords = parseWordInput(words(20, 40), "latin").words;
    expect(placementTokenCheckBound(longWords, 6, 6, 128)).toBe(0);
    expect(choosePuzzleSize(longWords, { autoSize: false, rows: 6, cols: 6 })).toEqual({ rows: 6, cols: 6 });
  });
  test("retains direction order and repetitions on admitted links", () => {
    const input = { ...base, wordsText: "CAT\nDOG", directions: Array(128).fill("E") as DirectionKey[] };
    expect(puzzleRequestError(input)).toBeNull();
    const restored = decodePuzzleShareState(encodeShareState(input))!;
    expect(restored.directions).toEqual(input.directions);
    expect(generatePuzzle(restored)).toEqual(generatePuzzle(input));
  });
});
