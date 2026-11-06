import { PDFDocument } from "pdf-lib";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { createPuzzlePackPdf, type PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { createBrowserPuzzlePackPdf } from "@/lib/pdf/browser-pack-download";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions, pdfPageSpec } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

function makePack(count: number): PuzzlePack {
  return { id: "sample-pack", name: "Sample Pack", puzzles: Array.from({ length: count }, (_, i) => {
    const puzzle = generatePuzzle({ title: `Puzzle ${i + 1}`, wordsText: "planet\ncomet\nstar", seed: `pack-${i}`, difficulty: "medium", alphabetPack: "latin", autoSize: false, rows: 10, cols: 10, directions: ["E", "S", "SE"], allowOverlap: true, fillerMode: "alphabet" });
    return { id: `puzzle-${i + 1}`, puzzle };
  }) };
}
async function pages(bytes: Uint8Array) {
  const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
  const doc = await getDocument({ data: bytes.slice(), standardFontDataUrl }).promise;
  const result = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const text = await page.getTextContent();
    const ops = await page.getOperatorList();
    result.push({ text: text.items.map((item) => "str" in item ? item.str : "").join(" "), fnArray: ops.fnArray, paths: ops.argsArray.filter((_, index) => ops.fnArray[index] === OPS.constructPath) });
  }
  await doc.destroy();
  return result;
}
describe("puzzle pack PDF", () => {
  test.each([[5, "letter", "answers-last"], [10, "a4", "interleaved"], [5, "a4", "interleaved"], [10, "letter", "answers-last"]] as const)("composes %i original puzzle and answer pairs on %s (%s)", async (count, paperSize, order) => {
    const pack = makePack(count);
    const bytes = await createPuzzlePackPdf(pack, { paperSize, order });
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(count * 2);
    expect(bytes.length).toBeLessThan(2_000_000);
    const spec = pdfPageSpec(paperSize, "portrait");
    for (const page of pdf.getPages()) { expect(page.getWidth()).toBeCloseTo(spec.width); expect(page.getHeight()).toBeCloseTo(spec.height); }
    const actual = await pages(bytes);
    for (let i = 0; i < count; i++) {
      const entry = pack.puzzles[i];
      const single = await createPuzzlePdf({ puzzle: entry.puzzle, shareUrl: puzzlePlayUrl(entry.puzzle.request), options: { ...defaultPuzzleOutputOptions, paperSize, orientation: "portrait", includeAnswerKey: true, qrCode: false, inkSaving: true } });
      const original = await pages(single);
      expect(actual[order === "interleaved" ? i * 2 : i]).toEqual(original[0]);
      expect(actual[order === "interleaved" ? i * 2 + 1 : count + i]).toEqual(original[1]);
      for (const row of entry.puzzle.grid) expect(original[0].text.replace(/\s+/g, "")).toContain(row.join(""));
    }
  }, 60000);
  test("rejects invalid bounds, identities, duplicate grids, and options", async () => {
    const pack = makePack(5);
    await expect(createPuzzlePackPdf(makePack(4), { paperSize: "letter", order: "answers-last" })).rejects.toThrow();
    await expect(createPuzzlePackPdf({ ...pack, puzzles: [...pack.puzzles.slice(0, 4), pack.puzzles[0]] }, { paperSize: "letter", order: "answers-last" })).rejects.toThrow();
    await expect(createPuzzlePackPdf({ ...pack, id: "INVALID" }, { paperSize: "letter", order: "answers-last" })).rejects.toThrow();
    await expect(createPuzzlePackPdf(pack, { paperSize: "bad", order: "answers-last" } as never)).rejects.toThrow();
    const duplicate = generatePuzzle({ ...pack.puzzles[0].puzzle.request, wordsText: "planet\nPLANET\ncomet" });
    await expect(createPuzzlePackPdf({ ...pack, puzzles: [{ ...pack.puzzles[0], puzzle: duplicate }, ...pack.puzzles.slice(1)] }, { paperSize: "letter", order: "answers-last" })).rejects.toThrow("duplicate words");
    const excluded = generatePuzzle({ ...pack.puzzles[0].puzzle.request, wordsText: "planet\nextraordinary" });
    await expect(createPuzzlePackPdf({ ...pack, puzzles: [{ ...pack.puzzles[0], puzzle: excluded }, ...pack.puzzles.slice(1)] }, { paperSize: "letter", order: "answers-last" })).rejects.toThrow("unplaced words");
    const unsupported = generatePuzzle({ ...pack.puzzles[0].puzzle.request, wordsText: "planet\n!!!" });
    await expect(createPuzzlePackPdf({ ...pack, puzzles: [{ ...pack.puzzles[0], puzzle: unsupported }, ...pack.puzzles.slice(1)] }, { paperSize: "letter", order: "answers-last" })).rejects.toThrow("input warnings");
    const tampered = structuredClone(pack);
    tampered.puzzles[0].puzzle.request.seed = "different-seed";
    await expect(createPuzzlePackPdf(tampered, { paperSize: "letter", order: "answers-last" })).rejects.toThrow("seeded request");
  });
  test("repeats byte-for-byte for a named set and options", async () => {
    const pack = makePack(5);
    const options = { paperSize: "letter", order: "answers-last" } as const;
    expect(await createPuzzlePackPdf(pack, options)).toEqual(await createPuzzlePackPdf(pack, options));
  });
  test("creates a downloadable browser blob", async () => {
    const result = await createBrowserPuzzlePackPdf(makePack(5), { paperSize: "letter", order: "answers-last" });
    expect(result.blob.type).toBe("application/pdf");
    expect(result.filename).toBe("sample-pack-word-search-pack.pdf");
    expect((await PDFDocument.load(await result.blob.arrayBuffer())).getPageCount()).toBe(10);
  });
});
