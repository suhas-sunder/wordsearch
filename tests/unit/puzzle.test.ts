import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import type { PuzzleRequest } from "@/lib/puzzle/types";

const base: Partial<PuzzleRequest> = {
  title: "Test Puzzle",
  wordsText: "solar system\nplanet\norbit\nmoon\nstar",
  seed: "fixed-seed",
  difficulty: "medium" as const,
  alphabetPack: "latin" as const,
  autoSize: true,
  directions: ["E", "S", "SE", "NE"],
  allowOverlap: true,
  fillerMode: "alphabet" as const
};

describe("word search generation", () => {
  test("is deterministic for the same seed and request", () => {
    const first = generatePuzzle(base);
    const second = generatePuzzle(base);
    expect(second.grid).toEqual(first.grid);
    expect(second.placed).toEqual(first.placed);
  });

  test("changes output when seed changes", () => {
    const first = generatePuzzle(base);
    const second = generatePuzzle({ ...base, seed: "another-seed" });
    expect(second.grid).not.toEqual(first.grid);
  });

  test("places phrase tokens while keeping readable labels", () => {
    const puzzle = generatePuzzle(base);
    const phrase = puzzle.placed.find((placement) => placement.label === "solar system");
    expect(phrase?.tokens.join("")).toBe("SOLARSYSTEM");
  });

  test("reports words that cannot fit in a manual grid", () => {
    const puzzle = generatePuzzle({
      ...base,
      wordsText: "supercalifragilistic",
      autoSize: false,
      rows: 6,
      cols: 6
    });
    expect(puzzle.excluded[0]?.reason).toContain("longer");
    expect(puzzle.warnings.join(" ")).toContain("did not fit");
  });

  test("respects disabled directions", () => {
    const puzzle = generatePuzzle({ ...base, directions: ["E"] });
    expect(puzzle.placed.every((placement) => placement.direction === "E")).toBe(true);
  });

  test("applies hidden message into leftover cells when it fits", () => {
    const puzzle = generatePuzzle({ ...base, hiddenMessage: "done" });
    expect(puzzle.hiddenMessageApplied).toBe("DONE");
  });
});
