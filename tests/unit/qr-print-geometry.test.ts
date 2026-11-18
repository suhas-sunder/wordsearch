import { describe, expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

describe("QR readiness preserves printed puzzle content", () => {
  test.each([false, true])("unchanged grid/answers through pending, prepared and QR-off: answer=%s", (answerKey) => {
    const puzzle = generatePuzzle({ title: "QR geometry", wordsText: "CAT\nDOG", seed: "qr-geometry", rows: 8, cols: 8, autoSize: false, directions: ["E"] });
    const pending = renderToStaticMarkup(PrintablePuzzle({ puzzle, answerKey, options: { ...defaultPuzzleOutputOptions, qrCode: true } }));
    const ready = renderToStaticMarkup(PrintablePuzzle({ puzzle, answerKey, qrDataUrl: "data:image/png;base64,cXI=", options: { ...defaultPuzzleOutputOptions, qrCode: true } }));
    const without = renderToStaticMarkup(PrintablePuzzle({ puzzle, answerKey, options: { ...defaultPuzzleOutputOptions, qrCode: false } }));
    const grid = (html: string) => html.match(/<svg[\s\S]*?<\/svg>/)?.[0];
    expect(grid(pending)).toBeTruthy();
    expect(grid(pending)).toBe(grid(ready));
    expect(grid(pending)).toBe(grid(without));
    expect(pending).toContain('class="print-qr-unavailable" role="status">QR code not ready');
    expect(ready).toContain('alt="QR code for this puzzle state"');
    expect(ready).not.toContain("print-qr-unavailable");
    expect(without).not.toContain("print-footer");
    expect(puzzle.request.seed).toBe("qr-geometry");
    expect(puzzle.placed.map(({ label }) => label)).toEqual(["CAT", "DOG"]);
  });
});
