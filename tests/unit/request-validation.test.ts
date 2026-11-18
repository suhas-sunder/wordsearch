import { describe, expect, test } from "vitest";
import { createHash } from "node:crypto";
import { defaultPuzzleRequest, generatePuzzle } from "@/lib/puzzle/generate";
import { decodePuzzleShareState, decodeShareState, encodeShareState } from "@/lib/share-state/state";
import type { PuzzleRequest } from "@/lib/puzzle/types";

const request = { ...defaultPuzzleRequest, wordsText: "cat\ndog", autoSize: false, rows: 12, cols: 12 };
const unsafe = (value: unknown) => value as Partial<PuzzleRequest>;

describe("external puzzle configuration", () => {
  test.each([0, -1, 5, 40.5, NaN, Infinity, -Infinity, "12", null, true, {}, []].map((rows) => ({ rows })))("rejects invalid row values $rows", ({ rows }) => {
    expect(() => generatePuzzle(unsafe({ ...request, rows }))).toThrow(/row|grid|dimension/i);
  });
  test.each(["difficulty", "alphabetPack", "fillerMode", "wordBankOrder"])("rejects wrong enum %s", (key) => {
    expect(() => generatePuzzle(unsafe({ ...request, [key]: "not-valid" }))).toThrow(new RegExp(key, "i"));
  });
  test.each(["autoSize", "allowOverlap", "largePrint", "showCoordinates", "nameDateLine", "answerKey"])("rejects wrong boolean %s", (key) => {
    expect(() => generatePuzzle(unsafe({ ...request, [key]: "false" }))).toThrow(new RegExp(key, "i"));
  });
  test("rejects oversized dimensions before allocation, including ignored auto-size dimensions", () => {
    for (const autoSize of [true, false]) {
      expect(() => generatePuzzle({ ...request, autoSize, rows: 1e9, cols: 1e9 })).toThrow(/row|grid|dimension/i);
    }
    expect(() => generatePuzzle({ ...request, cols: 0 })).toThrow(/col|grid|dimension/i);
    expect(() => generatePuzzle({ ...request, rows: undefined })).toThrow(/manual|dimension|row/i);
  });
  test.each(["title", "subtitle", "instructions", "wordsText", "seed", "customFiller", "hiddenMessage"])("bounds and type-checks %s", (key) => {
    expect(() => generatePuzzle(unsafe({ ...request, [key]: 1 }))).toThrow(new RegExp(key, "i"));
    expect(() => generatePuzzle(unsafe({ ...request, [key]: "x".repeat(32_001) }))).toThrow(new RegExp(key, "i"));
  });
  test("bounds parsed word count, individual token count, and aggregate tokens", () => {
    expect(() => generatePuzzle({ wordsText: Array(201).fill("cat").join("\t") })).toThrow(/200|word/i);
    expect(() => generatePuzzle({ wordsText: "x".repeat(129) })).toThrow(/token|word/i);
    expect(() => generatePuzzle({ wordsText: Array(100).fill("x".repeat(50)).join("\n") })).toThrow(/token/i);
    expect(() => generatePuzzle({ directions: Array(129).fill("E") })).toThrow(/direction/i);
  });
  test("preserves legacy duplicate-direction replay using a pre-change baseline fingerprint", () => {
    const result = generatePuzzle({ ...defaultPuzzleRequest, directions: Array(9).fill("E") });
    expect(createHash("sha256").update(JSON.stringify(result)).digest("hex")).toBe("8c2052fa32c071e091a19c2e2003beaef16e515787ee84fc0d8fca3e0ea04830");
  });
  test("rejects invalid puzzle-link configuration without changing raw empty/omitted meaning", () => {
    for (const patch of [{ rows: 0 }, { cols: "12" }, { directions: [] }, { alphabetPack: "missing" }]) {
      const encoded = encodeShareState(unsafe({ ...request, ...patch }));
      expect(decodePuzzleShareState(encoded)).toBeNull();
    }
    expect(decodeShareState(encodeShareState({ directions: [] }))?.directions).toEqual([]);
    expect(decodeShareState(encodeShareState({ title: "legacy partial" }))).not.toHaveProperty("directions");
  });
  test("rejects malformed, excessive and wrong-shaped share payloads", () => {
    for (const value of ["!", "x".repeat(32_001), "A", encodeShareState(unsafe([])), encodeShareState(unsafe(null))]) {
      expect(decodeShareState(value)).toBeNull();
    }
    const malformedUtf8 = Buffer.from([123, 34, 116, 105, 116, 108, 101, 34, 58, 34, 255, 34, 125]).toString("base64url");
    expect(decodeShareState(malformedUtf8)).toBeNull();
  });
  test("valid boundary sizes and old omitted defaults replay identically", () => {
    for (const size of [6, 40]) {
      const input = { ...request, rows: size, cols: size };
      expect(generatePuzzle(decodePuzzleShareState(encodeShareState(input))!)).toEqual(generatePuzzle(input));
    }
    const partial = { title: "Café & classroom", seed: "legacy-omitted", wordsText: "café\nniño" };
    expect(generatePuzzle(decodePuzzleShareState(encodeShareState(partial))!)).toEqual(generatePuzzle(partial));
    // Filler-only definitions now fail closed; valid legacy replay above stays exact.
    expect(() => generatePuzzle({ wordsText: "" })).toThrow(/supported word.*fits/i);
  });
});
