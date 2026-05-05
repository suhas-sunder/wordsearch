import { fillerByMode, getAlphabetPack } from "@/lib/alphabet-packs";
import { parseWordInput } from "@/lib/puzzle/parse";
import { createPrng, shuffleSeeded } from "@/lib/puzzle/prng";
import type { DirectionKey, ParsedWord, Placement, PuzzleRequest, PuzzleResult } from "@/lib/puzzle/types";
import { encodeShareState } from "@/lib/share-state/state";

export const directionVectors: Record<DirectionKey, { dr: number; dc: number; label: string }> = {
  E: { dr: 0, dc: 1, label: "left to right" },
  W: { dr: 0, dc: -1, label: "right to left" },
  S: { dr: 1, dc: 0, label: "top to bottom" },
  N: { dr: -1, dc: 0, label: "bottom to top" },
  SE: { dr: 1, dc: 1, label: "down diagonal" },
  SW: { dr: 1, dc: -1, label: "down reverse diagonal" },
  NE: { dr: -1, dc: 1, label: "up diagonal" },
  NW: { dr: -1, dc: -1, label: "up reverse diagonal" }
};

export const directionsByDifficulty: Record<string, DirectionKey[]> = {
  easy: ["E", "S"],
  medium: ["E", "S", "SE", "NE"],
  hard: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"]
};

export const defaultPuzzleRequest: PuzzleRequest = {
  title: "My Word Search",
  wordsText: "puzzle\nsearch\nletters\nprint\nteacher\nfamily\nwords\nsolve\nbrain\npaper",
  seed: "ilws-default",
  difficulty: "medium",
  alphabetPack: "latin",
  autoSize: true,
  directions: directionsByDifficulty.medium,
  allowOverlap: true,
  fillerMode: "alphabet",
  instructions: "Find each word in the grid. Words may run forward, backward, up, down, or diagonally.",
  nameDateLine: true,
  wordBankOrder: "alphabetical"
};

function chooseSize(words: ParsedWord[], request: PuzzleRequest) {
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

function emptyGrid(rows: number, cols: number): (string | null)[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
}

function canPlace(
  grid: (string | null)[][],
  word: ParsedWord,
  row: number,
  col: number,
  direction: DirectionKey,
  allowOverlap: boolean
) {
  const vector = directionVectors[direction];
  const cells: Placement["cells"] = [];
  for (let index = 0; index < word.tokens.length; index += 1) {
    const nextRow = row + vector.dr * index;
    const nextCol = col + vector.dc * index;
    if (nextRow < 0 || nextCol < 0 || nextRow >= grid.length || nextCol >= grid[0].length) return null;
    const current = grid[nextRow][nextCol];
    const token = word.tokens[index];
    if (current && (!allowOverlap || current !== token)) return null;
    cells.push({ row: nextRow, col: nextCol, token });
  }
  return cells;
}

function applyPlacement(grid: (string | null)[][], word: ParsedWord, cells: Placement["cells"], direction: DirectionKey): Placement {
  cells.forEach((cell) => {
    grid[cell.row][cell.col] = cell.token;
  });
  return {
    wordId: word.id,
    label: word.label,
    tokens: word.tokens,
    row: cells[0]?.row ?? 0,
    col: cells[0]?.col ?? 0,
    direction,
    cells
  };
}

export function generatePuzzle(input: Partial<PuzzleRequest>): PuzzleResult {
  const request: PuzzleRequest = {
    ...defaultPuzzleRequest,
    ...input,
    directions: input.directions?.length ? input.directions : directionsByDifficulty[input.difficulty ?? defaultPuzzleRequest.difficulty]
  };
  const pack = getAlphabetPack(request.alphabetPack);
  const { words, warnings } = parseWordInput(request.wordsText, request.alphabetPack);
  const uniqueWords = words.filter((word) => !word.duplicateOf);
  if (!uniqueWords.length) {
    warnings.push("Add at least one supported word to generate a puzzle.");
  }
  if (!request.directions.length) {
    warnings.push("At least one direction must be enabled.");
  }

  const { rows, cols } = chooseSize(uniqueWords, request);
  const grid = emptyGrid(rows, cols);
  const random = createPrng(`${request.seed}:${request.title}:${request.difficulty}:${request.alphabetPack}`);
  const placed: Placement[] = [];
  const excluded: PuzzleResult["excluded"] = [];
  const wordsByLength = [...uniqueWords].sort((a, b) => b.tokens.length - a.tokens.length);

  for (const word of wordsByLength) {
    if (word.tokens.length > Math.max(rows, cols)) {
      excluded.push({ word, reason: "The word is longer than the selected grid." });
      continue;
    }
    const directions = shuffleSeeded(request.directions, `${request.seed}:${word.id}:directions`);
    let placement: Placement | undefined;
    const attempts = Math.max(300, rows * cols * directions.length);
    for (let attempt = 0; attempt < attempts && !placement; attempt += 1) {
      const direction = directions[attempt % directions.length];
      const row = Math.floor(random() * rows);
      const col = Math.floor(random() * cols);
      const cells = canPlace(grid, word, row, col, direction, request.allowOverlap);
      if (cells) placement = applyPlacement(grid, word, cells, direction);
    }
    if (placement) {
      placed.push(placement);
    } else {
      excluded.push({
        word,
        reason: request.allowOverlap
          ? "No available position was found. Try a larger grid or fewer words."
          : "No available non-overlapping position was found. Allow overlap or enlarge the grid."
      });
    }
  }

  const usedTokens = placed.flatMap((item) => item.tokens);
  const fillerTokens = fillerByMode(request.fillerMode, usedTokens, pack, request.customFiller);
  let hiddenMessageApplied = "";
  const hiddenTokens = request.hiddenMessage ? pack.tokenize(request.hiddenMessage) : [];
  const emptyCells = grid.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => ({ value, row: rowIndex, col: colIndex })).filter((cell) => cell.value === null)
  );
  if (hiddenTokens.length > emptyCells.length) {
    warnings.push("The hidden message is too long for the remaining cells.");
  }
  emptyCells.forEach((cell, index) => {
    const hiddenToken = hiddenTokens[index];
    if (hiddenToken) {
      grid[cell.row][cell.col] = hiddenToken;
      hiddenMessageApplied += hiddenToken;
      return;
    }
    grid[cell.row][cell.col] = fillerTokens[Math.floor(random() * fillerTokens.length)] ?? "A";
  });

  if (excluded.length) {
    warnings.push(`${excluded.length} word${excluded.length === 1 ? "" : "s"} did not fit. Increase the grid, reduce the list, or allow more directions/overlap.`);
  }

  const finalGrid = grid.map((row) => row.map((token) => token ?? "A"));
  return {
    request,
    rows,
    cols,
    grid: finalGrid,
    words,
    placed,
    excluded,
    warnings,
    hiddenMessageApplied: hiddenMessageApplied || undefined,
    sharePath: `/word-search-generator?state=${encodeShareState(request)}`
  };
}

export function findPlacement(result: PuzzleResult, row: number, col: number) {
  return result.placed.find((placement) => placement.cells.some((cell) => cell.row === row && cell.col === col));
}
