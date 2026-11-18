import { webcrypto } from "node:crypto";
import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { clearProgress, fingerprintPuzzle, maxElapsedMs, maxProgressRecords, parseProgress, progressPrefix, readProgress, writeProgress, type SavedProgress } from "@/lib/puzzle/progress";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}
const fingerprint = "a".repeat(64);
const saved: SavedProgress = { v: 1, fingerprint, indices: [0, 2], elapsedMs: 1234 };

describe("private opt-in progress records", () => {
  test("stores only bounded index data, restores exactly and clears only its own key", () => {
    const storage = new MemoryStorage(); storage.setItem("other", "untouched");
    expect(writeProgress(storage, saved, 3)).toBe("saved");
    expect(readProgress(storage, fingerprint, 3)).toEqual({ kind: "saved", value: saved });
    expect(storage.getItem(progressPrefix + fingerprint)).toBe(JSON.stringify(saved));
    expect(clearProgress(storage, fingerprint)).toBe(true);
    expect(readProgress(storage, fingerprint, 3)).toEqual({ kind: "none" });
    expect(storage.getItem("other")).toBe("untouched");
  });
  test.each([
    { ...saved, indices: [-1] }, { ...saved, indices: [3] }, { ...saved, indices: [0, 0] },
    { ...saved, indices: [0.5] }, { ...saved, elapsedMs: -1 }, { ...saved, elapsedMs: NaN },
    { ...saved, elapsedMs: Infinity }, { ...saved, elapsedMs: maxElapsedMs + 1 },
    { ...saved, v: 2 }, { ...saved, fingerprint: "b".repeat(64) }, { ...saved, privateWords: "SECRET" }
  ])("rejects malformed or tampered records", (value) => {
    expect(parseProgress(JSON.stringify(value), fingerprint, 3)).toBeNull();
  });
  test("rejects oversized and corrupt data, refuses excessive records and survives storage denial", () => {
    expect(parseProgress(" ".repeat(4097), fingerprint, 3)).toBeNull();
    expect(parseProgress("{", fingerprint, 3)).toBeNull();
    const storage = new MemoryStorage();
    for (let i = 0; i < maxProgressRecords; i++) storage.setItem(progressPrefix + i.toString(16).padStart(64, "0"), "{}");
    expect(writeProgress(storage, saved, 3)).toBe("limit");
    const blocked = new Proxy(storage, { get() { throw new Error("denied"); } });
    expect(readProgress(blocked, fingerprint, 3)).toEqual({ kind: "unavailable" });
    expect(writeProgress(blocked, saved, 3)).toBe("unavailable");
    expect(clearProgress(blocked, fingerprint)).toBe(false);
  });
  test("never overwrites a record that became corrupt after it was read", () => {
    const storage = new MemoryStorage();
    storage.setItem(progressPrefix + fingerprint, "{broken");
    expect(writeProgress(storage, saved, 3)).toBe("conflict");
    expect(storage.getItem(progressPrefix + fingerprint)).toBe("{broken");
  });
  test("binds the digest to exact configuration and does not include private source text", async () => {
    const config = { title: "PRIVATE TITLE", wordsText: "CAT\nDOG", seed: "SECRET SEED", rows: 8, cols: 8, autoSize: false, directions: ["E"] as const };
    const a = generatePuzzle({ ...config, directions: [...config.directions] });
    const b = generatePuzzle({ ...config, seed: "another", directions: [...config.directions] });
    const digest = await fingerprintPuzzle(a, webcrypto as unknown as Crypto);
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(await fingerprintPuzzle(a, webcrypto as unknown as Crypto)).toBe(digest);
    expect(await fingerprintPuzzle(b, webcrypto as unknown as Crypto)).not.toBe(digest);
    const reordered = { ...a, request: Object.fromEntries(Object.entries(a.request).reverse()) as typeof a.request };
    expect(await fingerprintPuzzle(reordered, webcrypto as unknown as Crypto)).toBe(digest);
    const record = JSON.stringify({ ...saved, fingerprint: digest });
    expect(record).not.toMatch(/PRIVATE|TITLE|CAT|DOG|SECRET|SEED/);
  });
});
