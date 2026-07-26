import type { PuzzleContentRecord } from "@/content/model";
import { generatePuzzle } from "@/lib/puzzle/generate";

export function normalizeText(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

export function normalizeWords(words: string[]) {
  return words.map(normalizeText).filter(Boolean);
}

export function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function puzzleInputFingerprint(record: PuzzleContentRecord) {
  const puzzle = record.puzzle;
  return stableHash(JSON.stringify({
    words: normalizeWords(puzzle.words),
    seed: puzzle.seed,
    rows: puzzle.rows ?? null,
    columns: puzzle.columns ?? null,
    directions: [...puzzle.directions],
    allowOverlap: puzzle.allowOverlap,
    alphabetPack: puzzle.alphabetPack,
    difficulty: puzzle.difficulty
  }));
}

export function generatedPuzzleFingerprints(record: PuzzleContentRecord) {
  const puzzle = record.puzzle;
  const result = generatePuzzle({
    title: puzzle.puzzleTitle,
    wordsText: puzzle.words.join("\n"),
    seed: puzzle.seed,
    rows: puzzle.rows,
    cols: puzzle.columns,
    autoSize: !puzzle.rows || !puzzle.columns,
    directions: puzzle.directions,
    allowOverlap: puzzle.allowOverlap,
    alphabetPack: puzzle.alphabetPack,
    difficulty: puzzle.difficulty
  });
  const grid = stableHash(result.grid.map((row) => row.join("\u001f")).join("\u001e"));
  const placements = stableHash(JSON.stringify(result.placed.map((placement) => ({
    id: placement.wordId,
    cells: placement.cells.map(({ row, col }) => [row, col])
  }))));
  return { grid, placements, complete: stableHash(`${puzzleInputFingerprint(record)}:${grid}:${placements}`) };
}

export function wordListJaccard(left: string[], right: string[]) {
  const a = new Set(normalizeWords(left));
  const b = new Set(normalizeWords(right));
  const intersection = [...a].filter((word) => b.has(word)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 1;
}
