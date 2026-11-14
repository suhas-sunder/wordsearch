import { createHash } from "node:crypto";
import { describe, expect, test } from "vitest";
import { routeInventory } from "@/content/registry";
import { defaultPuzzleRequest, directionsByDifficulty, generatePuzzle } from "@/lib/puzzle/generate";
import type { PuzzleRequest } from "@/lib/puzzle/types";
import { decodeShareState, encodeShareState, puzzlePlayPath } from "@/lib/share-state/state";

describe("direction validation", () => {
  test("documents published direction overrides against builder presets", () => {
    const published = routeInventory.filter((record) => record.contentType === "puzzle" && record.publicationStatus === "published");
    const overrides = (difficulty: PuzzleRequest["difficulty"]) => published.filter((record) =>
      record.contentType === "puzzle" && record.puzzle.difficulty === difficulty &&
      record.puzzle.directions.join(",") !== directionsByDifficulty[difficulty].join(","));
    expect([overrides("easy").length, overrides("medium").length, overrides("hard").length]).toEqual([48, 86, 0]);
    expect(overrides("medium").every((record) => record.contentType === "puzzle" && record.puzzle.directions.join(",") === directionsByDifficulty.hard.join(","))).toBe(true);
  });
  test.each([[], null, "E", {}, [""], ["BAD"], ["E", "BAD"], [null], [1], ["constructor"], ["__proto__"]].map((directions) => ({ directions })))("rejects explicit invalid directions $directions before generation", ({ directions }) => {
    const input = { ...defaultPuzzleRequest, directions } as unknown as PuzzleRequest;
    expect(() => generatePuzzle(input)).toThrow(/direction/i);
    const decoded = decodeShareState(encodeShareState(input));
    expect(decoded?.directions).toEqual(directions);
    expect(() => generatePuzzle(decoded!)).toThrow(/direction/i);
  });

  test.each(["easy", "medium", "hard"] as const)("omitted directions retain the %s preset", (difficulty) => {
    expect(generatePuzzle({ difficulty }).request.directions).toEqual(directionsByDifficulty[difficulty]);
    expect(generatePuzzle({ difficulty, directions: undefined }).request.directions).toEqual(directionsByDifficulty[difficulty]);
    expect(decodeShareState(encodeShareState({ difficulty }))).not.toHaveProperty("directions");
  });

  test("rejects sparse direction arrays and checks directions before allocating a grid", () => {
    expect(() => generatePuzzle({ directions: Array(1) })).toThrow(/direction/i);
    expect(() => generatePuzzle({ directions: [], autoSize: false, rows: 1e9, cols: 1e9 })).toThrow(/direction/i);
  });

  test.each([["E"], directionsByDifficulty.hard].map((directions) => ({ directions })))("replays valid directions $directions through share state", ({ directions }) => {
    const input = { ...defaultPuzzleRequest, directions } as PuzzleRequest;
    const puzzle = generatePuzzle(input);
    expect(puzzle.placed.length).toBeGreaterThan(0);
    expect(puzzle.placed.every((placement) => input.directions.includes(placement.direction))).toBe(true);
    const encoded = puzzlePlayPath(input).split("/").at(-1)!;
    expect(generatePuzzle(decodeShareState(encoded)!)).toEqual(puzzle);
  });

  test("preserves every published seeded grid, placement, answer cell, and share URL from main", () => {
    const fingerprints = routeInventory.flatMap((record) => {
      if (record.contentType !== "puzzle" || record.publicationStatus !== "published") return [];
      const p = record.puzzle;
      const result = generatePuzzle({
        title: p.puzzleTitle, wordsText: p.words.join("\n"), difficulty: p.difficulty,
        alphabetPack: p.alphabetPack, seed: p.seed, rows: p.rows, cols: p.columns,
        autoSize: !p.rows || !p.columns, directions: p.directions, allowOverlap: p.allowOverlap,
        largePrint: p.largePrintSuitable, nameDateLine: true, wordBankOrder: "alphabetical",
        instructions: "Find each word in the grid. Words may run forward, backward, up, down, or diagonally."
      });
      return [[record.canonicalPath, createHash("sha256").update(JSON.stringify(result)).digest("hex")]];
    });
    expect(fingerprints.length).toBeGreaterThan(0);
    expect(fingerprints).toMatchSnapshot();
    expect(["easy", "medium", "hard"].map((difficulty) => {
      const result = generatePuzzle({ difficulty: difficulty as PuzzleRequest["difficulty"] });
      return createHash("sha256").update(JSON.stringify(result)).digest("hex");
    })).toMatchSnapshot();
  });
});
