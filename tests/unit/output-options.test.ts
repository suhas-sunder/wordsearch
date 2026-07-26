import { describe, expect, test } from "vitest";
import { answerOverlayPaths, answerVisibilityResult, wordRevealState } from "@/lib/puzzle/answer-state";
import { generatePuzzle } from "@/lib/puzzle/generate";
import type { PuzzleRequest } from "@/lib/puzzle/types";
import {
  defaultPuzzleOutputOptions,
  normalizePuzzleOutputOptions,
  outputOptionsForRequest,
  parsePuzzleOutputOptions,
  pdfPagePlan,
  pdfPageSpec,
  sanitizePuzzleFilename,
  serializePuzzleOutputOptions
} from "@/lib/puzzle/output-options";
import { decodeShareState, puzzlePlayPath, puzzlePlayUrl } from "@/lib/share-state/state";

const request: Partial<PuzzleRequest> = {
  title: "Utility Test",
  wordsText: "alpha\nbeta\ngamma",
  seed: "utility-seed",
  difficulty: "medium" as const,
  alphabetPack: "latin" as const,
  autoSize: false,
  rows: 8,
  cols: 8,
  directions: ["E", "S", "SE"],
  allowOverlap: true,
  fillerMode: "alphabet" as const
};

describe("puzzle output options", () => {
  test("provides stable defaults and request-aware visual defaults", () => {
    expect(defaultPuzzleOutputOptions).toMatchObject({
      paperSize: "letter",
      orientation: "portrait",
      printScale: "standard",
      includeAnswerKey: false,
      wordBankPlacement: "below",
      qrCode: true
    });
    expect(outputOptionsForRequest({ largePrint: true, nameDateLine: false, showCoordinates: true })).toMatchObject({
      printScale: "large",
      nameDateLine: false,
      coordinates: true
    });
  });

  test("serializes and parses every supported option", () => {
    const options = {
      ...defaultPuzzleOutputOptions,
      paperSize: "a4" as const,
      orientation: "landscape" as const,
      printScale: "large" as const,
      includeAnswerKey: true,
      wordBankPlacement: "beside" as const,
      qrCode: false,
      inkSaving: true
    };
    expect(parsePuzzleOutputOptions(serializePuzzleOutputOptions(options))).toEqual(options);
  });

  test("falls back safely for corrupted persisted state", () => {
    expect(normalizePuzzleOutputOptions({
      paperSize: "legal",
      orientation: "sideways",
      printScale: "giant",
      includeAnswerKey: "yes",
      wordBankPlacement: "floating"
    })).toEqual(defaultPuzzleOutputOptions);
  });

  test("parses legacy utility query aliases", () => {
    expect(parsePuzzleOutputOptions("paper=A4&orientation=landscape&largePrint=1&answerKey=1&nameDateLine=0&qrCode=0")).toMatchObject({
      paperSize: "a4",
      orientation: "landscape",
      printScale: "large",
      includeAnswerKey: true,
      nameDateLine: false,
      qrCode: false
    });
  });

  test("maps Letter and A4 portrait and landscape dimensions", () => {
    expect(pdfPageSpec("letter", "portrait")).toMatchObject({ width: 612, height: 792, cssPageName: "letter-portrait" });
    expect(pdfPageSpec("letter", "landscape")).toMatchObject({ width: 792, height: 612, cssPageName: "letter-landscape" });
    expect(pdfPageSpec("a4", "portrait").height).toBeCloseTo(841.89, 2);
    expect(pdfPageSpec("a4", "landscape").width).toBeCloseTo(841.89, 2);
  });

  test("includes the answer key only when selected", () => {
    expect(pdfPagePlan(defaultPuzzleOutputOptions)).toEqual(["puzzle"]);
    expect(pdfPagePlan({ ...defaultPuzzleOutputOptions, includeAnswerKey: true })).toEqual(["puzzle", "answer-key"]);
  });

  test("sanitizes unsafe and empty puzzle titles for cross-platform filenames", () => {
    expect(sanitizePuzzleFilename('  My <Unsafe>: Puzzle? * "2026"  ')).toBe("my-unsafe-puzzle-2026-word-search.pdf");
    expect(sanitizePuzzleFilename("***")).toBe("puzzle-word-search.pdf");
  });
});

describe("share and answer utility state", () => {
  test("creates deterministic play links from puzzle-defining state only", () => {
    expect(puzzlePlayPath(request)).toBe(puzzlePlayPath({ ...request }));
    expect(puzzlePlayUrl(request)).toBe(`https://www.ilovewordsearch.com${puzzlePlayPath(request)}`);
    expect(puzzlePlayPath(request)).not.toContain("found");
    expect(puzzlePlayPath(request)).not.toContain("answersVisible");
    expect(puzzlePlayPath(request)).toContain("/play/");
    const stateWithTransientData = { ...request, answerKey: true, foundPlacementIds: ["alpha-0"], answersVisible: true };
    const encoded = puzzlePlayPath(stateWithTransientData).split("/").pop();
    expect(decodeShareState(encoded)).not.toHaveProperty("answerKey");
    expect(decodeShareState(encoded)).not.toHaveProperty("foundPlacementIds");
    expect(decodeShareState(encoded)).not.toHaveProperty("answersVisible");
  });

  test("preserves the same seed through the encoded play link", () => {
    const path = puzzlePlayPath(request);
    expect(path.length).toBeGreaterThan(20);
    expect(generatePuzzle(request).request.seed).toBe("utility-seed");
  });

  test("derives answer overlays from exact placement paths", () => {
    const puzzle = generatePuzzle(request);
    const overlays = answerOverlayPaths(puzzle.placed);
    expect(overlays).toHaveLength(puzzle.placed.length);
    expect(overlays[0]?.cells).toEqual(puzzle.placed[0]?.cells.map(({ row, col }) => ({ row, col })));
    expect(overlays[0]?.start).toEqual({ row: puzzle.placed[0]?.cells[0]?.row, col: puzzle.placed[0]?.cells[0]?.col });
  });

  test("revealed answers never increment progress or manufacture completion", () => {
    const found = new Set(["alpha-0"]);
    const revealed = answerVisibilityResult(found, true);
    expect(revealed.foundCount).toBe(1);
    expect(revealed.foundPlacementIds).toEqual(found);
    expect(revealed.isComplete).toBe(false);
    expect(wordRevealState("beta-1", found, true)).toBe("revealed");
    expect(wordRevealState("alpha-0", found, true)).toBe("found");
  });

  test("hiding answers preserves found progress", () => {
    const found = new Set(["alpha-0"]);
    const hidden = answerVisibilityResult(found, false);
    expect(hidden.foundPlacementIds).toEqual(found);
    expect(hidden.answersVisible).toBe(false);
    expect(wordRevealState("beta-1", found, false)).toBe("unsolved");
  });
});
