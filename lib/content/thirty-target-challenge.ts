// Offline review asset only. No change to generation or printable defaults.
import { createHash } from "node:crypto";
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { challengeSourceWordHashes, thirtyTargetChallenge } from "@/content/staged/thirty-target-challenge";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { validateStaged } from "@/lib/content/staged-validation";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

export function buildThirtyTargetChallenge() {
  const validation = validateStaged(evergreenHardBatch);
  if (validation.issues.length) throw new Error("Original challenge sources failed validation.");
  const provenance = thirtyTargetChallenge.sheets.map(sheet => {
    const sources = sheet.sourceIds.map(id => {
      const source = evergreenHardBatch.find(candidate => candidate.id === id);
      if (!source || source.puzzle.words.length !== 20 || createHash("sha256").update(JSON.stringify(source.puzzle.words)).digest("hex") !== challengeSourceWordHashes[id]) throw new Error(`Challenge source ${id} differs from its frozen vocabulary.`);
      return { id, sourceFile: "content/staged/evergreen-hard-batch.ts", sourceWordHash: challengeSourceWordHashes[id], words: source.puzzle.words.slice(0, thirtyTargetChallenge.entriesPerSource), originalTargetCount: source.puzzle.words.length };
    });
    return { ...sheet, sources };
  });
  const pack: PuzzlePack = {
    id: thirtyTargetChallenge.packId,
    name: thirtyTargetChallenge.title,
    puzzles: provenance.map(sheet => {
      const words = sheet.sources.flatMap(source => source.words);
      if (words.length !== 30 || new Set(words.map(word => word.replace(/[^A-Z]/g, ""))).size !== 30) throw new Error("Challenge needs exactly thirty distinct source targets.");
      const puzzle = generatePuzzle({ title: sheet.title, wordsText: words.join("\n"), seed: `${sheet.id}-30-v1`, rows: 20, cols: 20, autoSize: false, difficulty: "hard", alphabetPack: "latin", directions: ["E", "W", "S", "N", "SE", "SW", "NE", "NW"], allowOverlap: true, fillerMode: "alphabet" });
      if (puzzle.placed.length !== 30 || puzzle.excluded.length || puzzle.warnings.length) throw new Error(`${sheet.id} could not place all thirty targets; no words were removed.`);
      return { id: sheet.id, puzzle };
    })
  };
  if (new Set(pack.puzzles.map(({ puzzle }) => JSON.stringify(puzzle.grid))).size !== 5) throw new Error("Challenge packet grids must be distinct.");
  return { ...thirtyTargetChallenge, pack, provenance, baselineTargetCount: 20 as const, additionalTargetsPerSheet: 10 as const, targetCountIncreasePercent: 50 as const };
}
