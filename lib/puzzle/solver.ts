import type { Placement } from "@/lib/puzzle/types";

export interface Coordinate {
  row: number;
  col: number;
}

export interface GridRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface GridPoint {
  row: number;
  col: number;
}

const eightDirections: Coordinate[] = [
  { row: 0, col: 1 },
  { row: 1, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
  { row: -1, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: 1 }
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function coordinateKey(coordinate: Coordinate) {
  return `${coordinate.row}:${coordinate.col}`;
}

export function clientPointToGridPoint(
  clientX: number,
  clientY: number,
  rect: GridRect,
  rows: number,
  cols: number
): GridPoint {
  const cellWidth = rect.width / cols;
  const cellHeight = rect.height / rows;
  return {
    row: (clientY - rect.top) / cellHeight - 0.5,
    col: (clientX - rect.left) / cellWidth - 0.5
  };
}

export function nearestCellFromClientPoint(
  clientX: number,
  clientY: number,
  rect: GridRect,
  rows: number,
  cols: number
): Coordinate {
  const point = clientPointToGridPoint(clientX, clientY, rect, rows, cols);
  return {
    row: clamp(Math.round(point.row), 0, rows - 1),
    col: clamp(Math.round(point.col), 0, cols - 1)
  };
}

function maximumSteps(start: Coordinate, direction: Coordinate, rows: number, cols: number) {
  const rowLimit = direction.row > 0
    ? rows - 1 - start.row
    : direction.row < 0
      ? start.row
      : Number.POSITIVE_INFINITY;
  const colLimit = direction.col > 0
    ? cols - 1 - start.col
    : direction.col < 0
      ? start.col
      : Number.POSITIVE_INFINITY;
  return Math.min(rowLimit, colLimit);
}

export function snapEndpoint(
  start: Coordinate,
  candidate: GridPoint,
  rows: number,
  cols: number
): Coordinate {
  const delta = {
    row: candidate.row - start.row,
    col: candidate.col - start.col
  };
  const magnitude = Math.hypot(delta.row, delta.col);
  if (magnitude < 0.35) return start;

  let direction = eightDirections[0];
  let closestScore = Number.NEGATIVE_INFINITY;
  for (const option of eightDirections) {
    const score = (delta.row * option.row + delta.col * option.col) / Math.hypot(option.row, option.col);
    if (score > closestScore) {
      closestScore = score;
      direction = option;
    }
  }

  const projection = (
    delta.row * direction.row + delta.col * direction.col
  ) / (
    direction.row * direction.row + direction.col * direction.col
  );
  const steps = clamp(Math.round(projection), 0, maximumSteps(start, direction, rows, cols));
  return {
    row: start.row + direction.row * steps,
    col: start.col + direction.col * steps
  };
}

export function snapClientPointToEndpoint(
  start: Coordinate,
  clientX: number,
  clientY: number,
  rect: GridRect,
  rows: number,
  cols: number
) {
  return snapEndpoint(start, clientPointToGridPoint(clientX, clientY, rect, rows, cols), rows, cols);
}

export function createCoordinatePath(start: Coordinate, end: Coordinate): Coordinate[] {
  const rowDistance = end.row - start.row;
  const colDistance = end.col - start.col;
  const isStraight = rowDistance === 0 || colDistance === 0 || Math.abs(rowDistance) === Math.abs(colDistance);
  if (!isStraight) return [];

  const steps = Math.max(Math.abs(rowDistance), Math.abs(colDistance));
  const rowStep = Math.sign(rowDistance);
  const colStep = Math.sign(colDistance);
  return Array.from({ length: steps + 1 }, (_, index) => ({
    row: start.row + rowStep * index,
    col: start.col + colStep * index
  }));
}

export function reverseCoordinatePath(path: readonly Coordinate[]) {
  return [...path].reverse();
}

export function coordinatePathsEqual(first: readonly Coordinate[], second: readonly Coordinate[]) {
  return first.length === second.length && first.every((coordinate, index) => (
    coordinate.row === second[index]?.row && coordinate.col === second[index]?.col
  ));
}

export function placementCoordinates(placement: Placement): Coordinate[] {
  return placement.cells.map(({ row, col }) => ({ row, col }));
}

export function findMatchingPlacement(
  placements: readonly Placement[],
  selectedPath: readonly Coordinate[],
  foundPlacementIds: ReadonlySet<string>
) {
  if (selectedPath.length < 2) return undefined;
  return placements.find((placement) => {
    if (foundPlacementIds.has(placement.wordId)) return false;
    const path = placementCoordinates(placement);
    return coordinatePathsEqual(path, selectedPath) || coordinatePathsEqual(reverseCoordinatePath(path), selectedPath);
  });
}

export function resolveSelection(
  placements: readonly Placement[],
  selectedPath: readonly Coordinate[],
  foundPlacementIds: ReadonlySet<string>
) {
  const placement = findMatchingPlacement(placements, selectedPath, foundPlacementIds);
  const nextFoundPlacementIds = new Set(foundPlacementIds);
  if (placement) nextFoundPlacementIds.add(placement.wordId);
  return { placement, foundPlacementIds: nextFoundPlacementIds };
}
