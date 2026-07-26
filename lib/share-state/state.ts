import type { PuzzleRequest } from "@/lib/puzzle/types";

const puzzleShareKeys = [
  "title",
  "subtitle",
  "instructions",
  "wordsText",
  "seed",
  "difficulty",
  "alphabetPack",
  "rows",
  "cols",
  "autoSize",
  "directions",
  "allowOverlap",
  "fillerMode",
  "customFiller",
  "hiddenMessage",
  "largePrint",
  "wordBankOrder",
  "showCoordinates",
  "nameDateLine"
] as const satisfies readonly (keyof PuzzleRequest)[];

/** Returns only durable puzzle-definition fields, never gameplay or utility UI state. */
export function puzzleShareState(state: Partial<PuzzleRequest>): Partial<PuzzleRequest> {
  return Object.fromEntries(
    puzzleShareKeys.flatMap((key) => state[key] === undefined ? [] : [[key, state[key]]])
  ) as Partial<PuzzleRequest>;
}

export function encodeShareState(state: Partial<PuzzleRequest>) {
  const json = JSON.stringify(state);
  if (typeof window === "undefined" && typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeShareState(value: string | null | undefined): Partial<PuzzleRequest> | null {
  if (!value || value.length > 32_000) return null;
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    if (typeof window === "undefined" && typeof Buffer !== "undefined") {
      const parsed = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as unknown;
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Partial<PuzzleRequest> : null;
    }
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Partial<PuzzleRequest> : null;
  } catch {
    return null;
  }
}

export function decodePuzzleShareState(value: string | null | undefined): Partial<PuzzleRequest> | null {
  const state = decodeShareState(value);
  if (!state) return null;
  if (typeof state.seed !== "string" || !state.seed.trim()) return null;
  if (typeof state.wordsText !== "string" || !state.wordsText.trim()) return null;
  return state;
}

export function shareUrl(path: string) {
  const base = "https://www.ilovewordsearch.com";
  return `${base}${path}`;
}

export function puzzlePlayPath(state: Partial<PuzzleRequest>) {
  return `/play/${stateId(puzzleShareState(state))}`;
}

export function puzzlePlayUrl(state: Partial<PuzzleRequest>) {
  return shareUrl(puzzlePlayPath(state));
}

export function stateId(state: Partial<PuzzleRequest>) {
  return encodeShareState(state);
}
