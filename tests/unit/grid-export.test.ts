import { describe, expect, test } from "vitest";
import { gridExportFilename, puzzleGridText } from "@/lib/print/grid-export";

describe("document grid export", () => {
  test("preserves rectangular cell boundaries and multi-character Unicode tokens", () => {
    const grid = [[".-", "⠃", "01000011"], ["<", "&", "é"]];
    expect(puzzleGridText({ grid })).toBe(".-\t⠃\t01000011\n<\t&\té\n");
    expect(grid).toEqual([[".-", "⠃", "01000011"], ["<", "&", "é"]]);
  });
  test("bounds and sanitizes filenames without dropping the format", () => {
    expect(gridExportFilename("école / : puzzle", "png")).toBe("ecole-puzzle-grid.png");
    expect(gridExportFilename("<>", "txt")).toBe("word-search-grid.txt");
    expect(gridExportFilename("a".repeat(500), "svg")).toHaveLength(89);
  });
});
