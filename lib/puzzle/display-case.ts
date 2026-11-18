import type { AlphabetPackId } from "@/lib/puzzle/types";

export type PrintedLetterCase = "uppercase" | "lowercase";

/** Presentation only: never normalize a definition, placement, clue or non-Latin mapping. */
export function printedLatinText(text: string, alphabetPack: AlphabetPackId | undefined, letterCase?: PrintedLetterCase): string {
  return letterCase === "lowercase" && (alphabetPack ?? "latin") === "latin"
    ? text.replace(/[A-Z]/g, (letter) => letter.toLowerCase()) : text;
}
