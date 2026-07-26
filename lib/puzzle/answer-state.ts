import type { Placement } from "@/lib/puzzle/types";
import type { Coordinate } from "@/lib/puzzle/solver";

export type WordRevealState = "unsolved" | "revealed" | "found";

export interface AnswerOverlayPath {
  placementId: string;
  label: string;
  start: Coordinate;
  end: Coordinate;
  cells: Coordinate[];
}

export function answerOverlayPaths(placements: readonly Placement[]): AnswerOverlayPath[] {
  return placements.flatMap((placement) => {
    const first = placement.cells[0];
    const last = placement.cells[placement.cells.length - 1];
    if (!first || !last) return [];
    return [{
      placementId: placement.wordId,
      label: placement.label,
      start: { row: first.row, col: first.col },
      end: { row: last.row, col: last.col },
      cells: placement.cells.map(({ row, col }) => ({ row, col }))
    }];
  });
}

export function wordRevealState(
  placementId: string,
  foundPlacementIds: ReadonlySet<string>,
  answersVisible: boolean
): WordRevealState {
  if (foundPlacementIds.has(placementId)) return "found";
  return answersVisible ? "revealed" : "unsolved";
}

export function answerVisibilityResult<T>(foundPlacementIds: ReadonlySet<T>, answersVisible: boolean, totalPlacements = Number.POSITIVE_INFINITY) {
  return {
    foundPlacementIds: new Set(foundPlacementIds),
    foundCount: foundPlacementIds.size,
    answersVisible,
    isComplete: totalPlacements > 0 && foundPlacementIds.size === totalPlacements
  };
}
