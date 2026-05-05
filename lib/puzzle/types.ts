export type DirectionKey = "E" | "W" | "S" | "N" | "SE" | "SW" | "NE" | "NW";

export type Difficulty = "easy" | "medium" | "hard";

export type AlphabetPackId =
  | "latin"
  | "morse"
  | "braille"
  | "binary"
  | "hex"
  | "greek"
  | "kana"
  | "spanish"
  | "french"
  | "emoji"
  | "asl";

export type WordBankOrder = "custom" | "alphabetical" | "length";

export type FillerMode = "alphabet" | "used" | "custom" | "rare";

export interface ParsedWord {
  id: string;
  raw: string;
  label: string;
  normalized: string;
  tokens: string[];
  clue?: string;
  duplicateOf?: string;
}

export interface Placement {
  wordId: string;
  label: string;
  tokens: string[];
  row: number;
  col: number;
  direction: DirectionKey;
  cells: Array<{ row: number; col: number; token: string }>;
}

export interface PuzzleRequest {
  title: string;
  subtitle?: string;
  instructions?: string;
  wordsText: string;
  seed: string;
  difficulty: Difficulty;
  alphabetPack: AlphabetPackId;
  rows?: number;
  cols?: number;
  autoSize: boolean;
  directions: DirectionKey[];
  allowOverlap: boolean;
  fillerMode: FillerMode;
  customFiller?: string;
  hiddenMessage?: string;
  largePrint?: boolean;
  wordBankOrder?: WordBankOrder;
  showCoordinates?: boolean;
  nameDateLine?: boolean;
  answerKey?: boolean;
}

export interface PuzzleResult {
  request: PuzzleRequest;
  rows: number;
  cols: number;
  grid: string[][];
  words: ParsedWord[];
  placed: Placement[];
  excluded: Array<{ word: ParsedWord; reason: string }>;
  warnings: string[];
  hiddenMessageApplied?: string;
  sharePath: string;
}

export interface AlphabetPack {
  id: AlphabetPackId;
  label: string;
  description: string;
  supportsPlainText: boolean;
  normalizeInput(input: string): string;
  tokenize(input: string): string[];
  encodeWord(input: string): { label: string; normalized: string; tokens: string[]; warning?: string };
  fillerTokens(seed: string, usedTokens: string[], custom?: string): string[];
  tokenLabel(token: string): string;
}
