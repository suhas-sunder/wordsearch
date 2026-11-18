import type { PuzzleResult } from "@/lib/puzzle/types";

export const progressPrefix = "ilws:solver-progress:v1:";
export const maxProgressRecords = 20;
export const maxProgressBytes = 4096;
export const maxElapsedMs = 7 * 24 * 60 * 60 * 1000;
export interface SavedProgress { v: 1; fingerprint: string; indices: number[]; elapsedMs: number }
export type ProgressRead = { kind: "none" } | { kind: "saved"; value: SavedProgress } | { kind: "invalid" } | { kind: "unavailable" };
export type ProgressWrite = "saved" | "limit" | "unavailable" | "invalid" | "conflict";

/** Only the digest is persisted: the input itself never leaves this function. */
export async function fingerprintPuzzle(puzzle: PuzzleResult, cryptoApi: Crypto = globalThis.crypto): Promise<string> {
  if (!cryptoApi?.subtle) throw new Error("Secure puzzle identification is unavailable.");
  const value = JSON.stringify({ request: puzzle.request, rows: puzzle.rows, cols: puzzle.cols, grid: puzzle.grid, placements: puzzle.placed.map(({ wordId, direction, cells }) => ({ wordId, direction, cells })) }, (_key, item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    return Object.fromEntries(Object.entries(item).sort(([first], [second]) => first < second ? -1 : first > second ? 1 : 0));
  });
  const digest = await cryptoApi.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function parseProgress(raw: string, fingerprint: string, placementCount: number): SavedProgress | null {
  if (raw.length > maxProgressBytes || !/^[a-f0-9]{64}$/.test(fingerprint) || !Number.isInteger(placementCount) || placementCount < 0 || placementCount > 200) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const record = value as Record<string, unknown>;
    if (Object.keys(record).sort().join(",") !== "elapsedMs,fingerprint,indices,v" || record.v !== 1 || record.fingerprint !== fingerprint) return null;
    if (!Number.isSafeInteger(record.elapsedMs) || (record.elapsedMs as number) < 0 || (record.elapsedMs as number) > maxElapsedMs) return null;
    if (!Array.isArray(record.indices) || record.indices.length > placementCount || record.indices.some((index) => !Number.isInteger(index) || index < 0 || index >= placementCount) || new Set(record.indices).size !== record.indices.length) return null;
    return { v: 1, fingerprint, indices: record.indices, elapsedMs: record.elapsedMs as number };
  } catch { return null; }
}

export function readProgress(storage: Storage, fingerprint: string, placementCount: number): ProgressRead {
  try {
    const raw = storage.getItem(progressPrefix + fingerprint);
    if (raw === null) return { kind: "none" };
    const value = parseProgress(raw, fingerprint, placementCount);
    return value ? { kind: "saved", value } : { kind: "invalid" };
  } catch { return { kind: "unavailable" }; }
}

export function writeProgress(storage: Storage, value: SavedProgress, placementCount: number): ProgressWrite {
  try {
    const raw = JSON.stringify(value);
    if (!parseProgress(raw, value.fingerprint, placementCount)) return "invalid";
    const key = progressPrefix + value.fingerprint;
    const previous = storage.getItem(key);
    if (previous !== null && !parseProgress(previous, value.fingerprint, placementCount)) return "conflict";
    if (previous === null) {
      let count = 0;
      for (let i = 0; i < storage.length; i++) if (storage.key(i)?.startsWith(progressPrefix)) count++;
      if (count >= maxProgressRecords) return "limit";
    }
    storage.setItem(key, raw);
    return "saved";
  } catch { return "unavailable"; }
}

export function clearProgress(storage: Storage, fingerprint: string): boolean {
  try { storage.removeItem(progressPrefix + fingerprint); return true; } catch { return false; }
}
