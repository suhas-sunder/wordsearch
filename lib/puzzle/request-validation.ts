import { alphabetPacks } from "@/lib/alphabet-packs";
import { parseWordInput } from "@/lib/puzzle/parse";
import { choosePuzzleSize, maxPlacementTokenChecks, placementTokenCheckBound } from "@/lib/puzzle/generation-limits";
import type { AlphabetPackId, PuzzleRequest } from "@/lib/puzzle/types";

export const puzzleInputLimits = {
  minDimension: 6, maxDimension: 40, maxWords: 200, maxTokensPerWord: 128,
  maxTotalTokens: 4096, maxRequestBytes: 24_000, maxShareCharacters: 32_000
} as const;

const stringLimits = {
  title: 256, subtitle: 500, instructions: 2000, wordsText: 16_000,
  seed: 256, customFiller: 2000, hiddenMessage: 2000
} as const;
const booleanKeys = ["autoSize", "allowOverlap", "largePrint", "showCoordinates", "nameDateLine", "answerKey"] as const;
const enumValues = {
  difficulty: ["easy", "medium", "hard"],
  alphabetPack: Object.keys(alphabetPacks),
  fillerMode: ["alphabet", "used", "custom", "rare"],
  wordBankOrder: ["custom", "alphabetical", "length"]
} as const;
const directionKeys = ["E", "W", "S", "N", "SE", "SW", "NE", "NW"];

/** Omitted directions use a preset. An explicit selection is never normalized. */
export function directionSelectionError(directions: unknown): string | null {
  if (directions === undefined) return null;
  if (Array.isArray(directions) && directions.length === 0) return "At least one direction must be selected.";
  if (!Array.isArray(directions) || directions.length > 128 || !Array.from(directions).every((item) =>
    typeof item === "string" && directionKeys.includes(item)
  )) return "Directions must be a nonempty array of valid direction keys (at most 128 entries).";
  return null;
}

/** Validate a partial request without coercing, sorting, dropping fields or adding defaults. */
export function puzzleRequestError(input: unknown): string | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return "Puzzle configuration must be an object.";
  const request = input as Record<string, unknown>;
  for (const key of ["__proto__", "constructor", "prototype"]) {
    if (Object.hasOwn(request, key)) return `Unsupported configuration field: ${key}.`;
  }
  const directionError = directionSelectionError(request.directions);
  if (directionError) return directionError;
  for (const [key, limit] of Object.entries(stringLimits)) {
    const value = request[key];
    if (value !== undefined && (typeof value !== "string" || value.length > limit)) return `${key} must be text of at most ${limit} characters.`;
  }
  for (const key of booleanKeys) {
    if (request[key] !== undefined && typeof request[key] !== "boolean") return `${key} must be true or false.`;
  }
  for (const [key, allowed] of Object.entries(enumValues)) {
    if (request[key] !== undefined && (typeof request[key] !== "string" || !allowed.includes(request[key] as never))) return `${key} is not a supported option.`;
  }
  for (const key of ["rows", "cols"]) {
    const value = request[key];
    if (value !== undefined && (typeof value !== "number" || !Number.isInteger(value) || value < 6 || value > 40)) {
      return `${key} must be a whole grid dimension from 6 to 40.`;
    }
  }
  if (request.autoSize === false && (request.rows === undefined || request.cols === undefined)) return "Manual grid dimensions require both rows and cols.";
  if (typeof request.wordsText === "string") {
    const chunks = request.wordsText.split(/\r?\n|,|\t/).map((part) => part.trim()).filter(Boolean);
    if (chunks.length > puzzleInputLimits.maxWords) return "wordsText must contain at most 200 words or clues.";
    const pack = alphabetPacks[(request.alphabetPack ?? "latin") as keyof typeof alphabetPacks];
    let total = 0;
    for (const chunk of chunks) {
      const tokens = pack.tokenize(chunk.split("|")[0].trim());
      if (tokens.length > puzzleInputLimits.maxTokensPerWord) return "Each word must contain at most 128 supported tokens.";
      total += tokens.length;
      if (total > puzzleInputLimits.maxTotalTokens) return "wordsText must contain at most 4096 supported tokens in total.";
    }
  }
  try {
    if (new TextEncoder().encode(JSON.stringify(request)).length > puzzleInputLimits.maxRequestBytes) return "Puzzle configuration exceeds the 24000-byte share-state limit.";
  } catch {
    return "Puzzle configuration must be serializable JSON.";
  }
  if (typeof request.wordsText === "string") {
    const words = parseWordInput(request.wordsText, (request.alphabetPack ?? "latin") as AlphabetPackId).words.filter((word) => !word.duplicateOf);
    const effective = { autoSize: true, allowOverlap: true, ...request } as Partial<PuzzleRequest>;
    const { rows, cols } = choosePuzzleSize(words, effective);
    const count = Array.isArray(request.directions) ? request.directions.length : request.difficulty === "easy" ? 2 : request.difficulty === "hard" ? 8 : 4;
    if (placementTokenCheckBound(words, rows, cols, count) > maxPlacementTokenChecks) {
      return "Puzzle workload exceeds the safe placement limit. Use fewer or shorter words, a smaller grid, or fewer repeated direction entries.";
    }
  }
  return null;
}

export function assertPuzzleRequest(input: unknown): void {
  const error = puzzleRequestError(input);
  if (error) throw new Error(error);
}
