import { describe, expect, test } from "vitest";
import { specialtyRoutes } from "@/content/specialty";
import { generatePuzzle } from "@/lib/puzzle/generate";

const definition = { wordsText: "CAT\nDOG", seed: "advanced-controls", rows: 8, cols: 8, autoSize: false, directions: ["E"] as const };
const make = (extra = {}) => generatePuzzle({ ...definition, directions: [...definition.directions], ...extra });

describe("advanced settings compatibility", () => {
  test("legacy alphabet plus custom override remains effective until explicitly cleared", () => {
    const legacy = make({ fillerMode: "alphabet", customFiller: "XYZ" });
    expect(legacy.grid).toEqual(make({ fillerMode: "custom", customFiller: "XYZ" }).grid);
    expect(legacy.grid).not.toEqual(make({ fillerMode: "alphabet", customFiller: "" }).grid);
  });
  test("hidden message occupies unplaced cells in row order and reports overflow", () => {
    const puzzle = make({ hiddenMessage: "GREAT JOB" });
    const occupied = new Set(puzzle.placed.flatMap((word) => word.cells.map((cell) => `${cell.row}:${cell.col}`)));
    const remaining = puzzle.grid.flatMap((row, r) => row.filter((_token, c) => !occupied.has(`${r}:${c}`)));
    expect(remaining.slice(0, 8).join("")).toBe("GREATJOB");
    const overflow = make({ hiddenMessage: "Z".repeat(100) });
    expect(overflow.hiddenMessageApplied).toBe("Z".repeat(remaining.length));
    expect(overflow.warnings).toContain("The hidden message is too long for the remaining cells.");
    expect(overflow.placed).toEqual(puzzle.placed);
  });
  test("all specialty entries disclose readiness; scaffolds remain explicitly distinct", () => {
    expect(specialtyRoutes).toHaveLength(13);
    expect(specialtyRoutes.filter((route) => route.implementation === "scaffold").map((route) => route.alphabetPack)).toEqual(["asl", "emoji", "latin"]);
    for (const route of specialtyRoutes) {
      expect(["experimental", "scaffold"]).toContain(route.implementation);
      expect(route.status.length).toBeGreaterThan(25);
    }
  });
});
