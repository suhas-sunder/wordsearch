import { getAlphabetPack } from "@/lib/alphabet-packs";
import type { AlphabetPackId, ParsedWord, WordBankOrder } from "@/lib/puzzle/types";

export function parseWordInput(wordsText: string, alphabetPack: AlphabetPackId): { words: ParsedWord[]; warnings: string[] } {
  const pack = getAlphabetPack(alphabetPack);
  const chunks = wordsText
    .split(/\r?\n|,/)
    .map((chunk) => chunk.trim())
    .flatMap((chunk) => chunk.includes("\t") ? chunk.split("\t").map((part) => part.trim()).filter(Boolean) : [chunk])
    .filter(Boolean);
  const warnings: string[] = [];
  const seen = new Map<string, string>();
  const words: ParsedWord[] = [];

  chunks.forEach((chunk, index) => {
    const [answerPart, cluePart] = chunk.includes("|") ? chunk.split("|").map((part) => part.trim()) : [chunk, undefined];
    const encoded = pack.encodeWord(answerPart);
    if (encoded.warning) warnings.push(`${answerPart}: ${encoded.warning}`);
    if (!encoded.tokens.length) {
      warnings.push(`${answerPart || `Line ${index + 1}`} has no supported tokens.`);
      return;
    }
    const id = `${encoded.normalized.replace(/\s+/g, "-").toLowerCase()}-${index}`;
    const duplicateOf = seen.get(encoded.normalized);
    if (!duplicateOf) seen.set(encoded.normalized, id);
    words.push({
      id,
      raw: answerPart,
      label: encoded.label || answerPart,
      normalized: encoded.normalized,
      tokens: encoded.tokens,
      clue: cluePart,
      duplicateOf
    });
  });

  return { words, warnings };
}

export function orderWordBank(words: ParsedWord[], order: WordBankOrder = "custom") {
  const copy = [...words];
  if (order === "alphabetical") return copy.sort((a, b) => a.label.localeCompare(b.label));
  if (order === "length") return copy.sort((a, b) => a.tokens.length - b.tokens.length || a.label.localeCompare(b.label));
  return copy;
}
