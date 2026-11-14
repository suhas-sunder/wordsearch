// Editorial utility only; no new topic path or runtime registry entry is created.
import { largePrintDraftPackSelections, largePrintDraftSelections } from "@/content/staged/large-print-selections";
import { generatePuzzle } from "@/lib/puzzle/generate";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

export function generateLargePrintDraft(id: string) {
  const selection = largePrintDraftSelections.find((selection) => selection.id === id);
  if (!selection) throw new Error("Unknown source-only larger-type selection.");
  const puzzle = selection.puzzle;
  const result = generatePuzzle({ title: puzzle.puzzleTitle, wordsText: puzzle.words.join("\n"), seed: puzzle.seed, rows: puzzle.rows, cols: puzzle.columns, autoSize: false, difficulty: puzzle.difficulty, alphabetPack: puzzle.alphabetPack, directions: puzzle.directions, allowOverlap: puzzle.allowOverlap, fillerMode: "alphabet" });
  if (result.excluded.length || result.placed.length !== puzzle.words.length || result.warnings.length) throw new Error(`Selection ${id} cannot place every intended word unchanged.`);
  return result;
}

export function buildStagedLargePrintPack(id: string): PuzzlePack {
  const manifest = largePrintDraftPackSelections.find((manifest) => manifest.id === id);
  if (!manifest) throw new Error("Unknown source-only larger-type pack.");
  return { id: manifest.id, name: manifest.name, puzzles: manifest.children.map((id) => ({ id: id.toLowerCase(), puzzle: generateLargePrintDraft(id) })) };
}
