import { describe, expect, test } from "vitest";
import type { Placement } from "@/lib/puzzle/types";
import {
  clientPointToGridPoint,
  coordinatePathsEqual,
  createCoordinatePath,
  findMatchingPlacement,
  nearestCellFromClientPoint,
  resolveSelection,
  reverseCoordinatePath,
  snapEndpoint
} from "@/lib/puzzle/solver";

const horizontal: Placement = {
  wordId: "planet-0",
  label: "Planet",
  tokens: ["P", "L", "A", "N", "E", "T"],
  row: 2,
  col: 1,
  direction: "E",
  cells: [
    { row: 2, col: 1, token: "P" },
    { row: 2, col: 2, token: "L" },
    { row: 2, col: 3, token: "A" },
    { row: 2, col: 4, token: "N" },
    { row: 2, col: 5, token: "E" },
    { row: 2, col: 6, token: "T" }
  ]
};

function placement(wordId: string, label: string, coordinates: Array<[number, number]>): Placement {
  return {
    wordId,
    label,
    tokens: coordinates.map(() => "A"),
    row: coordinates[0]?.[0] ?? 0,
    col: coordinates[0]?.[1] ?? 0,
    direction: "E",
    cells: coordinates.map(([row, col]) => ({ row, col, token: "A" }))
  };
}

describe("solver coordinate geometry", () => {
  test("creates inclusive horizontal and vertical paths", () => {
    expect(createCoordinatePath({ row: 1, col: 1 }, { row: 1, col: 4 })).toEqual([
      { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }
    ]);
    expect(createCoordinatePath({ row: 1, col: 3 }, { row: 4, col: 3 })).toEqual([
      { row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 }, { row: 4, col: 3 }
    ]);
  });

  test("creates down-right and down-left diagonal paths", () => {
    expect(createCoordinatePath({ row: 0, col: 0 }, { row: 3, col: 3 })).toEqual([
      { row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }
    ]);
    expect(createCoordinatePath({ row: 0, col: 3 }, { row: 3, col: 0 })).toEqual([
      { row: 0, col: 3 }, { row: 1, col: 2 }, { row: 2, col: 1 }, { row: 3, col: 0 }
    ]);
  });

  test("rejects a non-straight path and leaves a one-cell path identifiable", () => {
    expect(createCoordinatePath({ row: 1, col: 1 }, { row: 3, col: 4 })).toEqual([]);
    const oneCell = createCoordinatePath({ row: 1, col: 1 }, { row: 1, col: 1 });
    expect(oneCell).toEqual([{ row: 1, col: 1 }]);
    expect(findMatchingPlacement([horizontal], oneCell, new Set())).toBeUndefined();
  });

  test("reverses a coordinate path without mutating it", () => {
    const path = createCoordinatePath({ row: 0, col: 0 }, { row: 0, col: 2 });
    expect(reverseCoordinatePath(path)).toEqual([
      { row: 0, col: 2 }, { row: 0, col: 1 }, { row: 0, col: 0 }
    ]);
    expect(path[0]).toEqual({ row: 0, col: 0 });
  });

  test("converts responsive client coordinates and locates the nearest rectangular-grid cell", () => {
    const rect = { left: 100, top: 50, width: 400, height: 200 };
    expect(clientPointToGridPoint(250, 125, rect, 4, 8)).toEqual({ row: 1, col: 2.5 });
    expect(nearestCellFromClientPoint(251, 126, rect, 4, 8)).toEqual({ row: 1, col: 3 });
  });

  test("clamps endpoints that extend beyond a rectangular grid", () => {
    expect(snapEndpoint({ row: 2, col: 3 }, { row: 2, col: 50 }, 5, 8)).toEqual({ row: 2, col: 7 });
    expect(snapEndpoint({ row: 2, col: 3 }, { row: -20, col: -20 }, 5, 8)).toEqual({ row: 0, col: 1 });
  });

  test("snaps forgiving drag vectors to the closest of eight directions", () => {
    expect(snapEndpoint({ row: 3, col: 3 }, { row: 3.7, col: 6.4 }, 8, 8)).toEqual({ row: 3, col: 6 });
    expect(snapEndpoint({ row: 3, col: 3 }, { row: 6.2, col: 5.6 }, 8, 8)).toEqual({ row: 6, col: 6 });
    expect(snapEndpoint({ row: 3, col: 3 }, { row: 3.1, col: 3.1 }, 8, 8)).toEqual({ row: 3, col: 3 });
  });
});

describe("exact placement matching", () => {
  test("matches the exact ordered placement path forward and reverse", () => {
    const forward = horizontal.cells.map(({ row, col }) => ({ row, col }));
    expect(findMatchingPlacement([horizontal], forward, new Set())?.wordId).toBe("planet-0");
    expect(findMatchingPlacement([horizontal], reverseCoordinatePath(forward), new Set())?.wordId).toBe("planet-0");
  });

  test("rejects the same visible letters at different coordinates", () => {
    const wrongCoordinates = createCoordinatePath({ row: 4, col: 1 }, { row: 4, col: 6 });
    expect(findMatchingPlacement([horizontal], wrongCoordinates, new Set())).toBeUndefined();
  });

  test("supports overlapping placement identities", () => {
    const first = placement("cross-0", "Cross", [[1, 0], [1, 1], [1, 2]]);
    const second = placement("crossing-1", "Crossing", [[0, 1], [1, 1], [2, 1]]);
    const firstResult = resolveSelection([first, second], createCoordinatePath({ row: 1, col: 0 }, { row: 1, col: 2 }), new Set());
    const secondResult = resolveSelection(
      [first, second],
      createCoordinatePath({ row: 0, col: 1 }, { row: 2, col: 1 }),
      firstResult.foundPlacementIds
    );
    expect([...secondResult.foundPlacementIds]).toEqual(["cross-0", "crossing-1"]);
  });

  test("does not count an already solved placement twice", () => {
    const path = horizontal.cells.map(({ row, col }) => ({ row, col }));
    const result = resolveSelection([horizontal], path, new Set([horizontal.wordId]));
    expect(result.placement).toBeUndefined();
    expect(result.foundPlacementIds.size).toBe(1);
  });

  test("uses placement identity when labels repeat", () => {
    const first = placement("echo-0", "Echo", [[0, 0], [0, 1]]);
    const second = placement("echo-1", "Echo", [[2, 0], [2, 1]]);
    const result = resolveSelection([first, second], createCoordinatePath({ row: 2, col: 0 }, { row: 2, col: 1 }), new Set());
    expect(result.placement?.wordId).toBe("echo-1");
  });

  test("matching is coordinate-only and unaffected by letter display case", () => {
    const path = horizontal.cells.map(({ row, col }) => ({ row, col }));
    expect(horizontal.tokens.join("").toLocaleLowerCase()).toBe("planet");
    expect(findMatchingPlacement([horizontal], path, new Set())?.wordId).toBe(horizontal.wordId);
  });

  test("selection and progress reset do not mutate puzzle-definition coordinates", () => {
    const before = JSON.stringify(horizontal);
    const path = horizontal.cells.map(({ row, col }) => ({ row, col }));
    const solved = resolveSelection([horizontal], path, new Set());
    const resetProgress = new Set<string>();
    expect(solved.foundPlacementIds.size).toBe(1);
    expect(resetProgress.size).toBe(0);
    expect(JSON.stringify(horizontal)).toBe(before);
    expect(coordinatePathsEqual(path, horizontal.cells)).toBe(true);
  });
});
