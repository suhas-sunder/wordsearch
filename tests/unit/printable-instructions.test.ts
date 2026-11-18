import { describe, expect, test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { defaultPuzzleRequest, generatePuzzle } from "@/lib/puzzle/generate";
import { printableInstructions } from "@/lib/puzzle/printable-instructions";
import { decodeShareState, encodeShareState } from "@/lib/share-state/state";
import type { DirectionKey } from "@/lib/puzzle/types";

describe("printable direction instructions", () => {
  test.each(["easy", "medium", "hard"] as const)("uses the resolved %s preset when directions are omitted", (difficulty) => {
    const puzzle = generatePuzzle({ difficulty });
    expect(printableInstructions(puzzle.request)).toContain("left to right");
    expect(generatePuzzle(decodeShareState(encodeShareState(puzzle.request))!)).toEqual(puzzle);
  });
  test.each([
    ["easy", ["E", "S"], "left to right, top to bottom"],
    ["medium", ["E", "S", "SE", "NE"], "left to right, top to bottom, down and right, up and right"],
    ["hard", ["E", "W", "S", "N", "SE", "SW", "NE", "NW"], "left to right, right to left, top to bottom, bottom to top, down and right, down and left, up and right, up and left"],
    ["custom", ["NW"], "up and left"]
  ])("renders permitted %s directions in print and shared replay", (_name, directions, expected) => {
    const original = generatePuzzle({ ...defaultPuzzleRequest, directions: directions as DirectionKey[] });
    const replay = generatePuzzle(decodeShareState(encodeShareState(original.request))!);
    expect(replay).toEqual(original);
    expect(printableInstructions(original.request)).toBe(`Find each word in the grid. Words may run: ${expected}.`);
    expect(renderToStaticMarkup(createElement(PrintablePuzzle, { puzzle: replay }))).toContain(expected);
    const answer = renderToStaticMarkup(createElement(PrintablePuzzle, { puzzle: replay, answerKey: true }));
    expect(answer).toContain("Answer key. Keep this page separate");
    expect(answer).not.toContain(expected);
  });
  test("preserves explicitly authored custom instructions", () => {
    const puzzle = generatePuzzle({ instructions: "Find each word left to right.", directions: ["E"] });
    expect(printableInstructions(puzzle.request)).toBe("Find each word left to right.");
    expect(renderToStaticMarkup(createElement(PrintablePuzzle, { puzzle }))).toContain("Find each word left to right.");
  });
});
