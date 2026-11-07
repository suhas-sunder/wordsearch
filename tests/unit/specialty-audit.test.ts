import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WordSearchBuilder } from "@/components/builder/WordSearchBuilder";
import { PDFDocument } from "pdf-lib";
import { describe, expect, test } from "vitest";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { specialtyRoutes } from "@/content/specialty";
import { getAlphabetPack } from "@/lib/alphabet-packs";
import { createPuzzlePdf, UnsupportedPdfTextError } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { parseWordInput } from "@/lib/puzzle/parse";
import { findMatchingPlacement, placementCoordinates } from "@/lib/puzzle/solver";
import { decodePuzzleShareState, puzzlePlayUrl, puzzleShareState, stateId } from "@/lib/share-state/state";

function routePuzzle(route: (typeof specialtyRoutes)[number]) {
  const path = `/specialty/${route.slug}`;
  return generatePuzzle({ title: route.title, wordsText: route.words.join("\n"), difficulty: "medium", alphabetPack: route.alphabetPack, seed: `ilws-${path.replace(/[^a-z0-9]+/gi, "-")}`, autoSize: true, allowOverlap: true, hiddenMessage: route.slug.includes("hidden-message") ? "GREAT JOB" : undefined, nameDateLine: true, wordBankOrder: "alphabetical", instructions: "Find each word in the grid. Words may run forward, backward, up, down, or diagonally." });
}
const unsupportedPdf = new Set(["braille", "greek", "kana", "emoji"]);
describe("specialty route baseline integrity", () => {
  test.each(specialtyRoutes.map((route) => [route.slug, route] as const))("%s: seeded replay, placement paths and printable answer markup", (_slug, route) => {
    const puzzle = routePuzzle(route);
    const decoded = decodePuzzleShareState(stateId(puzzleShareState(puzzle.request)));
    expect(decoded).not.toBeNull();
    const replay = generatePuzzle(decoded!);
    expect(replay.grid).toEqual(puzzle.grid);
    expect(replay.placed).toEqual(puzzle.placed);
    expect(puzzle.placed).toHaveLength(route.words.length);
    expect(puzzle.excluded).toEqual([]);
    expect(puzzle.warnings).toEqual([]);
    for (const placement of puzzle.placed) {
      expect(placement.cells.map((cell) => puzzle.grid[cell.row][cell.col])).toEqual(placement.tokens);
      expect(puzzle.request.directions).toContain(placement.direction);
    }
    const options = { ...defaultPuzzleOutputOptions, qrCode: false, includeAnswerKey: true };
    const student = renderToStaticMarkup(PrintablePuzzle({ puzzle, options }));
    const answer = renderToStaticMarkup(PrintablePuzzle({ puzzle, options, answerKey: true }));
    expect((student.match(/class="puzzle-token"/g) ?? []).length).toBe(puzzle.rows * puzzle.cols);
    expect((answer.match(/<line /g) ?? []).length).toBe(puzzle.placed.length);
    expect(student).toContain('aria-label="Word bank"');
  });
  test.each(specialtyRoutes.map((route) => [route.slug, route] as const))("%s: PDF renders or explicitly rejects unsupported glyphs", async (_slug, route) => {
    const puzzle = routePuzzle(route);
    const output = createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, qrCode: false, includeAnswerKey: true }, shareUrl: puzzlePlayUrl(puzzle.request) });
    if (unsupportedPdf.has(route.alphabetPack)) await expect(output).rejects.toBeInstanceOf(UnsupportedPdfTextError);
    else expect((await PDFDocument.load(await output)).getPageCount()).toBe(2);
  });
});

describe("specialty selector state", () => {
  test.each(["spanish", "french", "emoji"] as const)("%s accurately represents an existing loaded request", (alphabetPack) => {
    const markup = renderToStaticMarkup(createElement(WordSearchBuilder, { initialRequest: { title: "Selector", wordsText: "planet\ncomet", seed: "selector", alphabetPack, difficulty: "medium" } }));
    const options = markup.match(/<select aria-label="Alphabet pack"[\s\S]*?<\/select>/)?.[0];
    expect(options).toBeDefined();
    expect(options).toContain(`value="${alphabetPack}" selected=""`);
    expect(options).toContain(alphabetPack === "emoji" ? "Geometric symbols (legacy mapping)" : "accent-normalized Latin");
  });
});

describe("specialty request boundary", () => {
  test("rejects unknown alphabet packs and directions in encoded shares", () => {
    const valid = routePuzzle(specialtyRoutes[0]).request;
    expect(decodePuzzleShareState(stateId({ ...valid, alphabetPack: "unknown" } as never))).toBeNull();
    expect(decodePuzzleShareState(stateId({ ...valid, directions: ["INVALID"] } as never))).toBeNull();
  });
});

describe("observed language and token boundaries (not semantic approval)", () => {
  test("Spanish ñ loses its tilde and normalized duplicates collapse", () => {
    const parsed = parseWordInput("año\nano", "spanish");
    expect(parsed.words.map((word) => word.normalized)).toEqual(["ANO", "ANO"]);
    expect(parsed.words[1].duplicateOf).toBe(parsed.words[0].id);
  });
  test("French accents normalize while œ is discarded rather than expanded", () => {
    expect(getAlphabetPack("french").encodeWord("noël").tokens.join("")).toBe("NOEL");
    expect(getAlphabetPack("french").encodeWord("cœur").tokens.join("")).toBe("CUR");
  });
  test("native Greek and kana are not accepted as native-script input", () => {
    expect(getAlphabetPack("greek").encodeWord("ΓΕΙΑ").tokens).toEqual([]);
    expect(getAlphabetPack("kana").encodeWord("かな").tokens).toEqual([]);
    expect(getAlphabetPack("kana").encodeWord("ka").tokens).toEqual(["カ", "ア"]);
  });
  test("mapped output can collide and does not represent semaphore or handshapes", () => {
    expect(getAlphabetPack("greek").tokenize("C")).toEqual(getAlphabetPack("greek").tokenize("G"));
    expect(getAlphabetPack("emoji").tokenize("E")).toEqual(getAlphabetPack("emoji").tokenize("S"));
    expect(getAlphabetPack("asl").tokenize("A")).toEqual(["ASL-A"]);
    expect(specialtyRoutes.find((route) => route.slug.startsWith("semaphore"))?.alphabetPack).toBe("emoji");
    expect(specialtyRoutes.find((route) => route.slug.startsWith("roman-numeral"))?.alphabetPack).toBe("latin");
  });
  test("Morse accepts arbitrary dot-dash sequences and braille digits remain Latin tokens", () => {
    expect(getAlphabetPack("morse").encodeWord("..........").tokens).toEqual([".........."]);
    expect(getAlphabetPack("braille").encodeWord("A1").tokens).toEqual(["⠁", "1"]);
  });
  test("a generated one-cell word can be matched at its exact placement", () => {
    const result = generatePuzzle({ title: "One letter", wordsText: "A", seed: "one-cell", difficulty: "easy", alphabetPack: "latin", autoSize: false, rows: 6, cols: 6, directions: ["E"], allowOverlap: true, fillerMode: "alphabet" });
    expect(result.placed).toHaveLength(1);
    expect(findMatchingPlacement(result.placed, placementCoordinates(result.placed[0]), new Set())).toBe(result.placed[0]);
  });
  test("hidden-message overflow warns and applies only available cells", () => {
    const result = generatePuzzle({ title: "Overflow", wordsText: "planet", seed: "overflow", difficulty: "easy", alphabetPack: "latin", autoSize: false, rows: 6, cols: 6, directions: ["E"], allowOverlap: true, fillerMode: "alphabet", hiddenMessage: "A".repeat(100) });
    expect(result.warnings).toContain("The hidden message is too long for the remaining cells.");
    expect(result.hiddenMessageApplied?.length).toBeLessThan(100);
  });
});
