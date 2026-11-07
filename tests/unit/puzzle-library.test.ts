import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { decodePuzzleShareState, puzzleShareState, stateId } from "@/lib/share-state/state";
import { clearPuzzleLibrary, deleteLocalPuzzle, parsePuzzleLibrary, puzzleLibraryKey, puzzleLibraryLimit, readPuzzleLibrary, saveLocalPuzzle } from "@/lib/puzzle/library";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key: string) { return this.data.get(key) ?? null; }
  key(index: number) { return [...this.data.keys()][index] ?? null; }
  removeItem(key: string) { this.data.delete(key); }
  setItem(key: string, value: string) { this.data.set(key, value); }
}
const id = (i: number) => `00000000-0000-4000-8000-${i.toString(16).padStart(12, "0")}`;
const puzzle = generatePuzzle({ title: "Private assignment", wordsText: "CAT\nDOG\nBIRD", seed: "exact-local-seed", rows: 8, cols: 8, autoSize: false, directions: ["E"], difficulty: "medium", allowOverlap: false, hiddenMessage: "GREAT" });

describe("explicit local puzzle definitions", () => {
  test("saves and reopens identical grids, placements and normalized request without changing other storage", () => {
    const storage = new MemoryStorage(); storage.setItem("ilws:solver-progress:v1:example", "keep");
    expect(saveLocalPuzzle(storage, id(1), "Week one", puzzle.request)).toBe("saved");
    const read = readPuzzleLibrary(storage);
    expect(read.kind).toBe("ready");
    if (read.kind !== "ready") throw new Error("Missing library");
    const request = decodePuzzleShareState(read.entries[0].state)!;
    const reopened = generatePuzzle(request);
    expect(reopened.grid).toEqual(puzzle.grid);
    expect(reopened.placed).toEqual(puzzle.placed);
    expect(puzzleShareState(reopened.request)).toEqual(puzzleShareState(puzzle.request));
    expect(deleteLocalPuzzle(storage, id(1))).toBe(true);
    expect(storage.getItem(puzzleLibraryKey)).toBeNull();
    expect(storage.getItem("ilws:solver-progress:v1:example")).toBe("keep");
  });
  test("rejects duplicate names, invalid definitions, names and excessive count without overwriting", () => {
    const storage = new MemoryStorage();
    expect(saveLocalPuzzle(storage, id(1), "Week one", puzzle.request)).toBe("saved");
    const before = storage.getItem(puzzleLibraryKey);
    expect(saveLocalPuzzle(storage, id(2), "week ONE", puzzle.request)).toBe("duplicate");
    expect(saveLocalPuzzle(storage, id(2), "", puzzle.request)).toBe("invalid");
    expect(saveLocalPuzzle(storage, id(2), "x".repeat(81), puzzle.request)).toBe("invalid");
    expect(saveLocalPuzzle(storage, id(2), "Control\u0000name", puzzle.request)).toBe("invalid");
    expect(saveLocalPuzzle(storage, id(2), "Invalid", { ...puzzle.request, directions: [] })).toBe("invalid");
    expect(storage.getItem(puzzleLibraryKey)).toBe(before);
    for (let i = 2; i <= puzzleLibraryLimit; i++) expect(saveLocalPuzzle(storage, id(i), `Puzzle ${i}`, puzzle.request)).toBe("saved");
    expect(saveLocalPuzzle(storage, id(21), "Too many", puzzle.request)).toBe("full");
  });
  test.each([
    "{", " ".repeat(650001), JSON.stringify({ v: 2, entries: [] }),
    JSON.stringify({ v: 1, entries: [{ id: id(1), name: "Broken", state: "invalid" }] }),
    JSON.stringify({ v: 1, entries: [{ id: id(1), name: "Broken", state: stateId({ ...puzzleShareState(puzzle.request), directions: [] }) }] }),
    JSON.stringify({ v: 1, entries: [], extra: true })
  ])("refuses malformed storage and preserves it until explicit clear", (raw) => {
    const storage = new MemoryStorage(); storage.setItem(puzzleLibraryKey, raw);
    expect(parsePuzzleLibrary(raw)).toEqual({ kind: "invalid" });
    expect(saveLocalPuzzle(storage, id(1), "New", puzzle.request)).toBe("invalid");
    expect(deleteLocalPuzzle(storage, id(1))).toBe(false);
    expect(storage.getItem(puzzleLibraryKey)).toBe(raw);
    expect(clearPuzzleLibrary(storage)).toBe(true);
    expect(readPuzzleLibrary(storage)).toEqual({ kind: "ready", entries: [] });
  });
  test("rejects duplicate record IDs and survives blocked storage or quota failures", () => {
    const entry = { id: id(1), name: "One", state: stateId(puzzleShareState(puzzle.request)) };
    expect(parsePuzzleLibrary(JSON.stringify({ v: 1, entries: [entry, { ...entry, name: "Two" }] }))).toEqual({ kind: "invalid" });
    const blocked = new Proxy(new MemoryStorage(), { get() { throw new Error("Storage denied"); } });
    expect(readPuzzleLibrary(blocked)).toEqual({ kind: "unavailable" });
    expect(saveLocalPuzzle(blocked, id(1), "One", puzzle.request)).toBe("unavailable");
    expect(clearPuzzleLibrary(blocked)).toBe(false);
    const quota = new MemoryStorage(); quota.setItem = () => { throw new Error("Quota"); };
    expect(saveLocalPuzzle(quota, id(1), "One", puzzle.request)).toBe("unavailable");
  });
});
