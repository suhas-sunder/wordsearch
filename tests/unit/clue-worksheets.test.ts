import { describe, expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { parseWordInput } from "@/lib/puzzle/parse";
import { puzzleRequestError } from "@/lib/puzzle/request-validation";
import { puzzleBankLabels, puzzleWordBank } from "@/lib/puzzle/word-bank";
import { decodePuzzleShareState, stateId } from "@/lib/share-state/state";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { createPuzzlePdf, PdfLayoutError } from "@/lib/pdf/create-puzzle-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const source = { title: "Clue worksheet", wordsText: "CAT | A small, purring pet | feline\nPLANET | A world orbiting a star\nOX | A working animal", seed: "clues-opt-in", rows: 10, cols: 10, autoSize: false, directions: ["E"] as const, wordBankMode: "clues" as const, wordBankOrder: "input" as const };
const make = (extra = {}) => generatePuzzle({ ...source, directions: [...source.directions], ...extra });

describe("opt-in clue worksheets", () => {
  test("commas and later pipes stay inside clues while omitted mode retains legacy parsing", () => {
    const puzzle = make();
    expect(puzzle.words.map((word) => word.label)).toEqual(["CAT", "PLANET", "OX"]);
    expect(puzzle.words[0].clue).toBe("A small, purring pet | feline");
    expect(parseWordInput(source.wordsText, "latin").words.map((word) => word.label)).toEqual(["CAT", "purring pet", "PLANET", "OX"]);
    expect(puzzleBankLabels(puzzle)).toEqual(["1. A small, purring pet | feline", "2. A world orbiting a star", "3. A working animal"]);
    const replay = generatePuzzle(decodePuzzleShareState(stateId(puzzle.request))!);
    expect(replay).toEqual(puzzle);
  });
  test.each(["CAT", "CAT |", "!!! | Unsupported", `CAT | ${"x".repeat(501)}`])("blocks incomplete input %s without answer fallback", (wordsText) => {
    expect(puzzleRequestError({ ...source, directions: [...source.directions], wordsText })).toMatch(/Clue mode needs/);
  });
  test("numbers remain aligned after sorting, duplicate filtering and excluded answers", () => {
    const puzzle = make({ wordsText: "CAT | Pet\nOX | Animal\nCAT | Duplicate clue\n" + "W".repeat(30) + " | Too long", wordBankOrder: "length" });
    expect(puzzleWordBank(puzzle).map((word) => word.label)).toEqual(["OX", "CAT"]);
    expect(puzzleBankLabels(puzzle)).toEqual(["1. Animal", "2. Pet"]);
    expect(puzzleBankLabels(puzzle, true)).toEqual(["1. OX - Animal", "2. CAT - Pet"]);
    const student = renderToStaticMarkup(PrintablePuzzle({ puzzle, options: { ...defaultPuzzleOutputOptions, qrCode: false } }));
    const teacher = renderToStaticMarkup(PrintablePuzzle({ puzzle, answerKey: true, options: { ...defaultPuzzleOutputOptions, qrCode: false } }));
    expect(student).toContain('aria-label="Clues to solve"');
    expect(student).not.toContain("1. OX");
    expect(teacher).toContain("1. OX - Animal");
    expect(teacher).toContain("2. CAT - Pet");
  });
  test("clue markup is escaped as text", () => {
    const puzzle = make({ wordsText: 'CAT | <img src=x onerror="window.cluePwned=1"> & pet' });
    const markup = renderToStaticMarkup(PrintablePuzzle({ puzzle, options: { ...defaultPuzzleOutputOptions, qrCode: false } }));
    expect(markup).toContain("&lt;img");
    expect(markup).not.toContain("<img");
  });
  test.each(["letter", "a4"] as const)("real %s student and answer PDF retain clue numbering and exact grid", async (paperSize) => {
    const puzzle = make();
    for (const wordBankPlacement of ["below", "beside"] as const) {
      const bytes = await createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, paperSize, wordBankPlacement, includeAnswerKey: true, qrCode: false }, shareUrl: "https://www.ilovewordsearch.com/" });
      const task = getDocument({ data: bytes, useSystemFonts: true });
      try {
        const document = await task.promise;
        expect(document.numPages).toBe(2);
        for (let pageNumber = 1; pageNumber <= 2; pageNumber++) {
          const text = (await (await document.getPage(pageNumber)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []).join(" ");
          for (const label of puzzleBankLabels(puzzle, pageNumber === 2)) expect(text).toContain(label);
          if (pageNumber === 1) expect(text).not.toContain("1. CAT - ");
        }
      } finally { await task.destroy(); }
    }
  });
  test("crowded clue banks fail explicitly instead of drawing over the footer", async () => {
    const puzzle = make({ wordsText: Array.from({ length: 50 }, (_, index) => `WORD${index} | ${"Long clue sentence ".repeat(10)}`).join("\n"), rows: 40, cols: 40 });
    await expect(createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, qrCode: false }, shareUrl: "https://www.ilovewordsearch.com/" })).rejects.toBeInstanceOf(PdfLayoutError);
  });
  test("measured large-print clue banks keep the actual18-point bank and16-point grid floor", async () => {
    const puzzle = make();
    const bytes = await createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, printScale: "large", qrCode: false, includeAnswerKey: true }, shareUrl: "https://www.ilovewordsearch.com/", layoutProfile: "large-print" });
    const task = getDocument({ data: bytes, useSystemFonts: true });
    try {
      const document = await task.promise;
      for (let page = 1; page <= 2; page++) {
        const items = (await (await document.getPage(page)).getTextContent()).items.filter((item) => "str" in item);
        const bank = items.filter((item) => /^\d\./.test(item.str)), grid = items.filter((item) => /^[A-Z]$/.test(item.str));
        expect(bank).toHaveLength(puzzle.placed.length);
        expect(grid).toHaveLength(puzzle.rows * puzzle.cols);
        expect(bank.every((item) => Math.abs(item.transform[0] - 18) < .01)).toBe(true);
        expect(grid.every((item) => item.transform[0] >= 16)).toBe(true);
      }
    } finally { await task.destroy(); }
  });
});
