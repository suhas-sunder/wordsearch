import { orderWordBank } from "@/lib/puzzle/parse";
import type { ParsedWord, PuzzleResult } from "@/lib/puzzle/types";
import { printedLatinText, type PrintedLetterCase } from "@/lib/puzzle/display-case";

/** Only placed answers enter the bank. Legacy custom order stays unchanged. */
export function puzzleWordBank(puzzle: PuzzleResult): ParsedWord[] {
  const source = new Map(puzzle.words.map((word) => [word.id, word]));
  const rank = new Map(puzzle.words.map((word, index) => [word.id, index]));
  const placements = [...puzzle.placed];
  if (puzzle.request.wordBankOrder === "input") placements.sort((first, second) => (rank.get(first.wordId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(second.wordId) ?? Number.MAX_SAFE_INTEGER));
  return orderWordBank(placements.map((placement) => ({
    id: placement.wordId,
    raw: placement.label,
    label: placement.label,
    normalized: placement.label,
    tokens: placement.tokens,
    clue: source.get(placement.wordId)?.clue
  })), puzzle.request.wordBankOrder);
}

/** Numbering is shared by student clues, solver clues and teacher answer mappings. */
export function puzzleBankLabels(puzzle: PuzzleResult, answerKey = false, letterCase?: PrintedLetterCase): string[] {
  return puzzleWordBank(puzzle).map((word, index) => {
    const answer = printedLatinText(word.label, puzzle.request.alphabetPack, letterCase);
    if (puzzle.request.wordBankMode !== "clues") return answer;
    if (!word.clue?.trim()) throw new Error("Every placed answer needs a clue before exporting a clue worksheet.");
    return `${index + 1}. ${answerKey ? `${answer} - ` : ""}${word.clue}`;
  });
}
