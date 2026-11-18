import type { ParsedWord, PuzzleRequest } from "@/lib/puzzle/types";

// Deterministic preflight, not a wall-clock cutoff: accepted puzzles keep the
// original PRNG sequence, attempt count, placements and filler on every surface.
export const maxPlacementTokenChecks = 16_000_000;

export function choosePuzzleSize(words: ParsedWord[], request: Partial<PuzzleRequest>) {
  if (!request.autoSize && request.rows && request.cols) {
    return { rows: request.rows, cols: request.cols };
  }
  const longest = Math.max(8, ...words.map((word) => word.tokens.length));
  const totalTokens = words.reduce((sum, word) => sum + word.tokens.length, 0);
  const base = request.largePrint ? 12 : 10;
  const density = request.allowOverlap ? 0.24 : 0.18;
  const side = Math.ceil(Math.sqrt(Math.max(base * base, totalTokens / density)));
  const size = Math.min(30, Math.max(longest, side));
  return { rows: size, cols: size };
}

export function placementTokenCheckBound(words: ParsedWord[], rows: number, cols: number, directionCount: number) {
  const attempts = Math.max(300, rows * cols * directionCount);
  return words.reduce((total, word) => total + (word.tokens.length > Math.max(rows, cols) ? 0 : attempts * word.tokens.length), 0);
}
