import { describe, expect, test } from "vitest";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { puzzleWordBank } from "@/lib/puzzle/word-bank";
import { decodePuzzleShareState, puzzlePlayPath } from "@/lib/share-state/state";
import type { WordBankOrder } from "@/lib/puzzle/types";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const request = { title: "Bank ordering", wordsText: "OX\nPLANET\nCAT\nALBATROSS\nDOG\nSTAR", seed: "bank-order", rows: 12, cols: 12, autoSize: false, directions: ["E"] as const };
const make = (wordBankOrder: WordBankOrder | undefined) => generatePuzzle({ ...request, directions: [...request.directions], wordBankOrder });

describe("placed-word bank ordering", () => {
  test.each(["input", "alphabetical", "length", "custom"] as const)("PDF student bank uses the same %s ordering", async (mode) => {
    const puzzle = make(mode);
    const bytes = await createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, qrCode: false }, shareUrl: "https://www.ilovewordsearch.com/" });
    const task = getDocument({ data: bytes, useSystemFonts: true });
    try {
      const document = await task.promise;
      const text = (await (await document.getPage(1)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []);
      const expected = puzzleWordBank(puzzle).map((word) => word.label);
      expect(text.filter((item) => expected.includes(item))).toEqual(expected);
    } finally { await task.destroy(); }
  });
  test.each([
    ["input", ["OX", "PLANET", "CAT", "ALBATROSS", "DOG", "STAR"]],
    ["alphabetical", ["ALBATROSS", "CAT", "DOG", "OX", "PLANET", "STAR"]],
    ["length", ["OX", "CAT", "DOG", "STAR", "PLANET", "ALBATROSS"]]
  ] as const)("renders %s order without changing grid, placements or source arrays", (mode, expected) => {
    const puzzle = make(mode), baseline = make("custom");
    const before = structuredClone(puzzle.placed);
    expect(puzzleWordBank(puzzle).map((word) => word.label)).toEqual(expected);
    expect(puzzle.placed).toEqual(before);
    expect(puzzle.grid).toEqual(baseline.grid);
    expect(puzzle.placed).toEqual(baseline.placed);
  });
  test("preserves legacy custom and omitted order exactly", () => {
    for (const mode of ["custom", undefined] as const) {
      const puzzle = make(mode);
      expect(puzzleWordBank(puzzle).map((word) => word.label)).toEqual(puzzle.placed.map((word) => word.label));
    }
  });
  test("new input order survives the existing validated share decoder", () => {
    const puzzle = make("input");
    const decoded = decodePuzzleShareState(puzzlePlayPath(puzzle.request).split("/").at(-1));
    expect(decoded?.wordBankOrder).toBe("input");
    expect(puzzleWordBank(generatePuzzle(decoded!))).toEqual(puzzleWordBank(puzzle));
  });
  test("includes only placed unique answers, preserves source clue alignment and current placement labels", () => {
    const puzzle = generatePuzzle({ ...request, directions: [...request.directions], wordsText: "CAT | A pet\nDOG | Another pet\nCAT\n" + "W".repeat(30), rows: 6, cols: 6, wordBankOrder: "input" });
    expect(puzzleWordBank(puzzle).map((word) => [word.label, word.clue])).toEqual([["CAT", "A pet"], ["DOG", "Another pet"]]);
    const changed = { ...puzzle, placed: puzzle.placed.map((word, index) => index === 0 ? { ...word, label: "Current label" } : word) };
    expect(puzzleWordBank(changed).map((word) => word.label)).toContain("Current label");
  });
});
