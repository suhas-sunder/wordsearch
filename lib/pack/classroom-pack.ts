import { generatePuzzle } from "@/lib/puzzle/generate";
import { parseWordInput } from "@/lib/puzzle/parse";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

export interface ClassroomPackInput {
  title: string;
  wordsText: string;
  seed: string;
  count: 5 | 10;
}

/** Stable assignment numbers and exact user seed define each reproducible grid. */
export function buildClassroomPack(input: ClassroomPackInput): PuzzlePack {
  if (!input || typeof input.title !== "string" || !/^[A-Za-z0-9][A-Za-z0-9 ' -]{0,79}$/.test(input.title) || input.title.trim() !== input.title || input.title.includes("  ")) throw new Error("Enter a title of 1–80 letters, numbers, spaces, apostrophes or hyphens, with single spaces and no spaces at either end.");
  if (typeof input.seed !== "string" || !/^[A-Za-z0-9_-]{1,64}$/.test(input.seed)) throw new Error("Enter a seed of 1–64 letters, numbers, underscores or hyphens.");
  if (input.count !== 5 && input.count !== 10) throw new Error("Choose 5 or 10 puzzles.");
  if (typeof input.wordsText !== "string" || input.wordsText.length > 1500 || !input.wordsText) throw new Error("Enter 2–30 words or phrases, one per line, up to 1500 characters total.");
  const lines = input.wordsText.split(/\r?\n/);
  if (lines.length < 2 || lines.length > 30 || lines.some((line) => !/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(line))) throw new Error("Enter 2–30 nonempty lines using only English letters and single spaces within phrases; remove blank lines, punctuation and extra spaces.");
  const parsed = parseWordInput(input.wordsText, "latin");
  if (parsed.words.some((word) => word.duplicateOf) || new Set(parsed.words.map((word) => word.tokens.join(""))).size !== parsed.words.length) throw new Error("Remove duplicate words or phrases, ignoring letter case.");
  if (parsed.warnings.length || parsed.words.length !== lines.length || parsed.words.some((word) => word.tokens.length < 2 || word.tokens.length > 14)) throw new Error("Each word or phrase must contain 2–14 letters.");
  const puzzles = Array.from({ length: input.count }, (_, index) => {
    const assignment = String(index + 1).padStart(2, "0");
    const puzzle = generatePuzzle({
      title: `${input.title} - ${assignment}`,
      wordsText: input.wordsText,
      seed: `${input.seed}:assignment:${assignment}`,
      difficulty: "medium",
      alphabetPack: "latin",
      autoSize: false,
      rows: lines.length <= 12 ? 15 : 20,
      cols: lines.length <= 12 ? 15 : 20,
      directions: ["E", "S", "SE", "NE"],
      allowOverlap: true,
      fillerMode: "alphabet"
    });
    if (puzzle.excluded.length || puzzle.placed.length !== parsed.words.length || puzzle.warnings.length) throw new Error(`Assignment ${assignment} could not place every word. Shorten the list or use shorter words; your entries are unchanged.`);
    return { id: `assignment-${assignment}`, puzzle };
  });
  if (new Set(puzzles.map(({ puzzle }) => JSON.stringify(puzzle.grid))).size !== puzzles.length) throw new Error("Two assignments produced the same grid. Choose another seed and try again.");
  return { id: "classroom-pack", name: input.title, puzzles };
}
