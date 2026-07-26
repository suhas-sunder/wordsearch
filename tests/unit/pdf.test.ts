import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { createBrowserPuzzlePdf } from "@/lib/pdf/browser-download";
import { createPuzzlePdf, validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions, pdfPageSpec, sanitizePuzzleFilename } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

const puzzle = generatePuzzle({
  title: "PDF Integrity Test",
  wordsText: "horizontal\nvertical\ndiagonal",
  seed: "pdf-integrity-fixed",
  difficulty: "hard",
  alphabetPack: "latin",
  autoSize: false,
  rows: 10,
  cols: 10,
  directions: ["E", "S", "SE"],
  allowOverlap: true,
  fillerMode: "alphabet",
  instructions: "Find every listed word in the exact seeded grid."
});

async function makePdf(paperSize: "letter" | "a4", orientation: "portrait" | "landscape", includeAnswerKey = false) {
  const options = { ...defaultPuzzleOutputOptions, paperSize, orientation, includeAnswerKey, qrCode: false };
  const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: puzzlePlayUrl(puzzle.request) });
  const loaded = await PDFDocument.load(bytes);
  return { bytes, loaded, options };
}

async function extractedText(bytes: Uint8Array) {
  const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
  const document = await getDocument({ data: bytes.slice(), standardFontDataUrl }).promise;
  const pages: string[] = [];
  for (let index = 1; index <= document.numPages; index += 1) {
    const content = await (await document.getPage(index)).getTextContent();
    pages.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
  }
  await document.destroy();
  return pages;
}

describe("real PDF generation", () => {
  test.each([
    ["letter", "portrait"],
    ["letter", "landscape"],
    ["a4", "portrait"],
    ["a4", "landscape"]
  ] as const)("creates a valid non-empty %s %s PDF with the requested page dimensions", async (paperSize, orientation) => {
    const { bytes, loaded } = await makePdf(paperSize, orientation);
    expect(Buffer.from(bytes.subarray(0, 5)).toString("ascii")).toBe("%PDF-");
    expect(bytes.byteLength).toBeGreaterThan(5_000);
    expect(loaded.getPageCount()).toBe(1);
    expect(loaded.getTitle()).toBe(puzzle.request.title);
    const page = loaded.getPage(0);
    const expected = pdfPageSpec(paperSize, orientation);
    expect(page.getWidth()).toBeCloseTo(expected.width, 1);
    expect(page.getHeight()).toBeCloseTo(expected.height, 1);
  });

  test("adds the exact-placement answer key as a second page only when requested", async () => {
    const withoutKey = await makePdf("letter", "portrait", false);
    const withKey = await makePdf("letter", "portrait", true);
    expect(withoutKey.loaded.getPageCount()).toBe(1);
    expect(withKey.loaded.getPageCount()).toBe(2);
    expect(withKey.bytes.byteLength).toBeGreaterThan(withoutKey.bytes.byteLength);
  });

  test("keeps title, seed-derived definition, grid tokens, and word list available to the PDF renderer", async () => {
    expect(validatePuzzleForPdf(puzzle)).toBe(true);
    expect(puzzle.request.seed).toBe("pdf-integrity-fixed");
    expect(puzzle.grid.flat()).toContain(puzzle.placed[0]?.tokens[0]);
    expect(puzzle.placed.map((placement) => placement.label)).toEqual(expect.arrayContaining(["horizontal", "vertical", "diagonal"]));
    expect(sanitizePuzzleFilename(puzzle.request.title)).toBe("pdf-integrity-test-word-search.pdf");
  });

  test("embeds the exact title, instructions, word list, and every puzzle row as extractable PDF text", async () => {
    const { bytes } = await makePdf("letter", "portrait");
    const [text = ""] = await extractedText(bytes);
    const compact = text.replace(/\s+/g, "").toLocaleUpperCase();
    expect(text).toContain(puzzle.request.title);
    expect(text).toContain("Find every listed word in the exact seeded grid.");
    for (const placement of puzzle.placed) expect(text).toContain(placement.label);
    for (const row of puzzle.grid) expect(compact).toContain(row.join("").toLocaleUpperCase());
  });

  test("rejects malformed or coordinate-inconsistent puzzle payloads", () => {
    expect(validatePuzzleForPdf(null)).toBe(false);
    expect(validatePuzzleForPdf({ ...puzzle, rows: 999 })).toBe(false);
    const altered = structuredClone(puzzle);
    if (altered.placed[0]?.cells[0]) altered.placed[0].cells[0].token = "WRONG";
    expect(validatePuzzleForPdf(altered)).toBe(false);
    const discontinuous = structuredClone(puzzle);
    if (discontinuous.placed[0]?.cells[1]) discontinuous.placed[0].cells[1].col += 1;
    expect(validatePuzzleForPdf(discontinuous)).toBe(false);
    const mismatchedTokens = structuredClone(puzzle);
    if (mismatchedTokens.placed[0]) mismatchedTokens.placed[0].tokens = ["WRONG"];
    expect(validatePuzzleForPdf(mismatchedTokens)).toBe(false);
  });

  test("rejects unsupported PDF glyphs instead of silently corrupting them", async () => {
    const unsupported = structuredClone(puzzle);
    unsupported.request.title = "Kana あ";
    await expect(createPuzzlePdf({
      puzzle: unsupported,
      options: { ...defaultPuzzleOutputOptions, qrCode: false },
      shareUrl: puzzlePlayUrl(unsupported.request)
    })).rejects.toThrow("cannot render");
  });

  test("rejects a QR-enabled PDF request without matching QR image data", async () => {
    await expect(createPuzzlePdf({
      puzzle,
      options: { ...defaultPuzzleOutputOptions, qrCode: true },
      shareUrl: puzzlePlayUrl(puzzle.request)
    })).rejects.toThrow("QR image data is required");
  });

  test("creates the downloadable PDF blob and safe filename entirely in the browser layer", async () => {
    const result = await createBrowserPuzzlePdf(
      puzzle,
      { ...defaultPuzzleOutputOptions, qrCode: false },
      puzzlePlayUrl(puzzle.request)
    );
    const bytes = new Uint8Array(await result.blob.arrayBuffer());
    expect(result.blob.type).toBe("application/pdf");
    expect(result.filename).toBe("pdf-integrity-test-word-search.pdf");
    expect(Buffer.from(bytes.subarray(0, 5)).toString("ascii")).toBe("%PDF-");
  });
});
