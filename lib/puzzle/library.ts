import type { PuzzleRequest } from "@/lib/puzzle/types";
import { decodePuzzleShareState, puzzleShareState, stateId } from "@/lib/share-state/state";

export const puzzleLibraryKey = "ilws:puzzle-library:v1";
export const puzzleLibraryLimit = 20;
const maxLibraryCharacters = 650_000;
export interface LocalPuzzle { id: string; name: string; state: string }
export type LibraryRead = { kind: "ready"; entries: LocalPuzzle[] } | { kind: "invalid" } | { kind: "unavailable" };
export type LibraryWrite = "saved" | "full" | "duplicate" | "invalid" | "unavailable";
const validId = (id: unknown): id is string => typeof id === "string" && /^[a-f0-9-]{36}$/.test(id);
const validName = (name: unknown): name is string => typeof name === "string" && name.length > 0 && name.length <= 80 && name.trim() === name && ![...name].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);

export function parsePuzzleLibrary(raw: string | null): LibraryRead {
  if (raw === null) return { kind: "ready", entries: [] };
  if (raw.length > maxLibraryCharacters) return { kind: "invalid" };
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { kind: "invalid" };
    const record = value as Record<string, unknown>;
    if (Object.keys(record).sort().join(",") !== "entries,v" || record.v !== 1 || !Array.isArray(record.entries) || record.entries.length > puzzleLibraryLimit) return { kind: "invalid" };
    const entries: LocalPuzzle[] = [];
    for (const item of record.entries) {
      if (!item || typeof item !== "object" || Array.isArray(item) || Object.keys(item).sort().join(",") !== "id,name,state" || !validId(item.id) || !validName(item.name) || typeof item.state !== "string") return { kind: "invalid" };
      const request = decodePuzzleShareState(item.state);
      if (!request || stateId(puzzleShareState(request)) !== item.state) return { kind: "invalid" };
      entries.push({ id: item.id, name: item.name, state: item.state });
    }
    if (new Set(entries.map((entry) => entry.id)).size !== entries.length || new Set(entries.map((entry) => entry.name.toLowerCase())).size !== entries.length) return { kind: "invalid" };
    return { kind: "ready", entries };
  } catch { return { kind: "invalid" }; }
}

export function readPuzzleLibrary(storage: Storage): LibraryRead {
  try { return parsePuzzleLibrary(storage.getItem(puzzleLibraryKey)); } catch { return { kind: "unavailable" }; }
}

export function saveLocalPuzzle(storage: Storage, id: string, name: string, request: Partial<PuzzleRequest>): LibraryWrite {
  try {
    if (!validId(id) || !validName(name)) return "invalid";
    const current = readPuzzleLibrary(storage);
    if (current.kind !== "ready") return current.kind;
    if (current.entries.some((entry) => entry.id === id || entry.name.toLowerCase() === name.toLowerCase())) return "duplicate";
    if (current.entries.length >= puzzleLibraryLimit) return "full";
    const entry = { id, name, state: stateId(puzzleShareState(request)) };
    const raw = JSON.stringify({ v: 1, entries: [...current.entries, entry] });
    if (parsePuzzleLibrary(raw).kind !== "ready") return "invalid";
    storage.setItem(puzzleLibraryKey, raw);
    return "saved";
  } catch { return "unavailable"; }
}

export function deleteLocalPuzzle(storage: Storage, id: string): boolean {
  try {
    const current = readPuzzleLibrary(storage);
    if (current.kind !== "ready") return false;
    const entries = current.entries.filter((entry) => entry.id !== id);
    if (entries.length) storage.setItem(puzzleLibraryKey, JSON.stringify({ v: 1, entries }));
    else storage.removeItem(puzzleLibraryKey);
    return true;
  } catch { return false; }
}

export function clearPuzzleLibrary(storage: Storage): boolean {
  try { storage.removeItem(puzzleLibraryKey); return true; } catch { return false; }
}
