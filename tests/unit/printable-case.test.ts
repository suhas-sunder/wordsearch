import { describe, expect, test } from "vitest";
import { printedLatinText } from "@/lib/puzzle/display-case";
import { defaultPuzzleOutputOptions, normalizePuzzleOutputOptions, parsePuzzleOutputOptions, serializePuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { puzzleGridText } from "@/lib/print/grid-export";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { renderToStaticMarkup } from "react-dom/server";
import { stateId } from "@/lib/share-state/state";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { puzzleBankLabels } from "@/lib/puzzle/word-bank";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";

describe("optional printable Latin lowercase", () => {
  test("clue prose retains author case while teacher answers become lowercase", async () => {
    const puzzle = generatePuzzle({ wordsText: "CAT | A Purring Pet\nDOG | A Helpful Animal", wordBankMode: "clues", wordBankOrder: "input" });
    expect(puzzleBankLabels(puzzle, false, "lowercase")).toEqual(["1. A Purring Pet", "2. A Helpful Animal"]);
    expect(puzzleBankLabels(puzzle, true, "lowercase")).toEqual(["1. cat - A Purring Pet", "2. dog - A Helpful Animal"]);
    const options = { ...defaultPuzzleOutputOptions, qrCode: false, includeAnswerKey: true, letterCase: "lowercase" as const };
    const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/" });
    for (const pageNumber of [1, 2]) {
      const measured = await measurePdfBytes(bytes, puzzle, options, pageNumber, pageNumber === 2);
      expect(measured.findings).toEqual([]);
      expect(measured.unmeasuredWords).toEqual([]);
    }
  });
  test("legacy/default query serialization is byte-identical and uppercase removes an override", () => {
    const legacy = "paper=letter&orientation=portrait&scale=standard&answers=0&nameDate=1&instructions=1&wordBank=below&qr=1&coordinates=0&ink=0";
    expect(serializePuzzleOutputOptions(defaultPuzzleOutputOptions)).toBe(legacy);
    expect(serializePuzzleOutputOptions({ ...defaultPuzzleOutputOptions, letterCase: "uppercase" })).toBe(legacy);
    const lower = normalizePuzzleOutputOptions({ letterCase: "lowercase" });
    expect(serializePuzzleOutputOptions(lower)).toBe(legacy + "&case=lower");
    expect(parsePuzzleOutputOptions(serializePuzzleOutputOptions(lower))).toEqual(lower);
    expect(normalizePuzzleOutputOptions({ letterCase: "uppercase" }, lower)).toEqual(defaultPuzzleOutputOptions);
  });
  test("only ASCII Latin display changes; tokens, boundaries, request and seed remain intact", () => {
    expect(printedLatinText("CAT É Ñ 1", "latin", "lowercase")).toBe("cat É Ñ 1");
    for (const pack of ["asl", "morse", "hex", "greek", "kana", "spanish", "french"] as const) expect(printedLatinText("ASL-A Α 4F", pack, "lowercase")).toBe("ASL-A Α 4F");
    const puzzle = generatePuzzle({ wordsText: "CAT\nDOG", seed: "print-case", autoSize: false, rows: 8, cols: 8 });
    const before = structuredClone(puzzle), shared = stateId(puzzle.request);
    const options = { ...defaultPuzzleOutputOptions, letterCase: "lowercase" as const, qrCode: false };
    const markup = renderToStaticMarkup(PrintablePuzzle({ puzzle, options }));
    expect(markup).toContain(">cat</span>");
    expect(puzzleGridText(puzzle, { alphabetPack: "latin", letterCase: "lowercase" })).toBe(puzzle.grid.map((row) => row.join("\t").toLowerCase()).join("\n") + "\n");
    expect(puzzle).toEqual(before);
    expect(stateId(puzzle.request)).toBe(shared);
  });
  test.each(["letter", "a4"] as const)("real %s PDF lowers grid and answers without changing source", async (paperSize) => {
    const puzzle = generatePuzzle({ wordsText: "CAT\nDOG", seed: "print-case", autoSize: false, rows: 8, cols: 8 });
    const options = { ...defaultPuzzleOutputOptions, paperSize, qrCode: false, includeAnswerKey: true, letterCase: "lowercase" as const };
    const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/" });
    expect((await measurePdfBytes(bytes, puzzle, options)).findings).toEqual([]);
    const task = getDocument({ data: bytes, useSystemFonts: true });
    try {
      const document = await task.promise;
      for (let page = 1; page <= 2; page++) {
        const text = (await (await document.getPage(page)).getTextContent()).items.flatMap((item) => "str" in item ? [item.str] : []);
        expect(text.filter((item) => /^[a-z]$/.test(item))).toEqual(puzzle.grid.flat().map((token) => token.toLowerCase()));
        if (page === 1) { expect(text).toContain("cat"); expect(text).toContain("dog"); }
      }
    } finally { await task.destroy(); }
  });
});
