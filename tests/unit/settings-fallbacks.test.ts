import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { getAlphabetPack } from "@/lib/alphabet-packs";
import { decodePuzzleShareState, stateId } from "@/lib/share-state/state";
import type { AlphabetPackId } from "@/lib/puzzle/types";

const base = { title: "Settings fallbacks", wordsText: "CAT\nDOG", seed: "settings-fallback", autoSize: false, rows: 6, cols: 6, directions: ["E"] as const, allowOverlap: false };
const make = (extra = {}) => generatePuzzle({ ...base, directions: [...base.directions], ...extra });
function remaining(puzzle: ReturnType<typeof make>) {
  const occupied = new Set(puzzle.placed.flatMap((word) => word.cells.map((cell) => `${cell.row}:${cell.col}`)));
  return puzzle.grid.flatMap((row, r) => row.filter((_token, c) => !occupied.has(`${r}:${c}`)));
}

describe("truthful filler and hidden-message fallbacks", () => {
  test("empty custom mode keeps the original defaults without coercing the selected mode", () => {
    const empty = make({ fillerMode: "custom", customFiller: "" });
    expect(empty.grid).toEqual(make({ fillerMode: "alphabet" }).grid);
    expect(empty.request.fillerMode).toBe("custom");
  });
  test("unsupported-only custom characters warn without changing their legacy fallback grid", () => {
    for (const fillerMode of ["custom", "alphabet"]) {
      const puzzle = make({ fillerMode, customFiller: "😀" });
      expect(puzzle.grid).toEqual(make().grid);
      expect(puzzle.warnings).toContain("Custom filler has no supported tokens for this alphabet pack; alphabet defaults are used.");
      expect(puzzle.request.customFiller).toBe("😀");
    }
  });
  test("retained legacy custom override still works until explicitly cleared", () => {
    const legacy = make({ fillerMode: "alphabet", customFiller: "XYZ" });
    expect(legacy.grid).toEqual(make({ fillerMode: "custom", customFiller: "XYZ" }).grid);
    expect(remaining(legacy).every((token) => /^[XYZ]$/.test(token))).toBe(true);
    expect(legacy.request.fillerMode).toBe("alphabet");
    expect(make({ fillerMode: "alphabet", customFiller: "" }).grid).toEqual(make().grid);
  });
  test("unsupported hidden text warns, stays shareable, and preserves the original grid", () => {
    const unsupported = make({ hiddenMessage: "😀" });
    expect(unsupported.grid).toEqual(make().grid);
    expect(unsupported.placed).toEqual(make().placed);
    expect(unsupported.hiddenMessageApplied).toBeUndefined();
    expect(unsupported.warnings).toContain("The hidden message has no supported tokens for this alphabet pack; no message was applied.");
    expect(generatePuzzle(decodePuzzleShareState(stateId(unsupported.request))!)).toEqual(unsupported);
    expect(make({ hiddenMessage: " \n " }).warnings).toEqual([]);
  });
  test("hidden prefix, over-capacity truncation and filler remainder keep their exact semantics", () => {
    const puzzle = make({ fillerMode: "custom", customFiller: "XYZ", hiddenMessage: "HI" });
    expect(remaining(puzzle).slice(0, 2)).toEqual(["H", "I"]);
    expect(remaining(puzzle).slice(2).every((token) => /^[XYZ]$/.test(token))).toBe(true);
    expect(puzzle.hiddenMessageApplied).toBe("HI");
    const overflow = make({ hiddenMessage: "Z".repeat(100) });
    expect(overflow.hiddenMessageApplied).toBe("Z".repeat(30));
    expect(remaining(overflow)).toEqual(Array(30).fill("Z"));
    expect(overflow.warnings).toContain("The hidden message is too long for the remaining cells.");
  });
  test.each(["morse", "binary", "hex"] as AlphabetPackId[])("%s truthfully exposes its unchanged unimplemented custom-filler fallback", (alphabetPack) => {
    const saved = make({ alphabetPack, fillerMode: "custom", customFiller: "XYZ" });
    expect(getAlphabetPack(alphabetPack).supportsCustomFiller).toBe(false);
    expect(saved.grid).toEqual(make({ alphabetPack, fillerMode: "alphabet" }).grid);
    expect(saved.warnings).toContain("Custom filler is not implemented for this alphabet pack; its original alphabet defaults are used.");
    expect(saved.request.customFiller).toBe("XYZ");
  });
});
