// Editorial tooling only. This never registers a route or records approval.
import { calendarGapCandidates } from "@/content/staged/calendar-gap-candidates";
import { preservedGrowthEnhancements } from "@/content/staged/preserved-growth-enhancements";
import { generatePuzzle } from "@/lib/puzzle/generate";

export function generateCalendarReviewAsset(id: string) {
  const source = calendarGapCandidates.find((source) => source.id === id) ?? preservedGrowthEnhancements.find((source) => source.id === id);
  if (!source) throw new Error("Unknown calendar review asset.");
  const definition = source.puzzle;
  const result = generatePuzzle({ title: definition.puzzleTitle, wordsText: definition.words.join("\n"), seed: definition.seed, difficulty: definition.difficulty, alphabetPack: definition.alphabetPack, rows: definition.rows, cols: definition.columns, autoSize: false, directions: definition.directions, allowOverlap: definition.allowOverlap, fillerMode: "alphabet" });
  if (result.excluded.length || result.warnings.length || result.placed.length !== definition.words.length) throw new Error(`${id} cannot place all intended words unchanged.`);
  return result;
}
