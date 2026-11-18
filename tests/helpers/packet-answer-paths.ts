import { fileURLToPath } from "node:url";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

/** Independently inspect actual answer-page glyphs and vector endpoints. */
export async function inspectPacketAnswerPaths(bytes: Uint8Array, pack: PuzzlePack) {
  const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
  const loading = getDocument({ data: bytes.slice(), standardFontDataUrl });
  const pdf = await loading.promise;
  let checked = 0;
  try {
    if (pdf.numPages !== pack.puzzles.length) throw new Error("Answer packet page count differs from selected worksheets.");
    for (const [index, { puzzle }] of pack.puzzles.entries()) {
      const page = await pdf.getPage(index + 1);
      const content = await page.getTextContent();
      const glyphs = content.items.flatMap(item => "str" in item && /^[A-Z]$/.test(item.str.trim()) ? [item] : []);
      const start = glyphs.map(item => item.str.trim()).join("").indexOf(puzzle.grid.flat().join(""));
      if (start < 0) throw new Error(`Answer page ${index + 1} has a different grid.`);
      const operators = await page.getOperatorList();
      const lines = operators.argsArray.flatMap((args, opIndex): number[][] => {
        if (operators.fnArray[opIndex] !== OPS.constructPath || !Array.isArray(args[1]) || !args[1][0]) return [];
        const coords = Array.from(args[1][0] as ArrayLike<number>);
        return coords.length === 9 && coords[0] === 0 && coords[3] === 0 && coords[6] === 1 ? [[coords[1], coords[2], coords[7], coords[8]]] : [];
      });
      for (const placement of puzzle.placed) {
        const points = [placement.cells[0], placement.cells.at(-1)!].map(({ row, col }) => {
          const glyph = glyphs[start + row * puzzle.cols + col];
          if (!glyph) throw new Error("Answer cell glyph is missing.");
          return [glyph.transform[4] + glyph.width / 2, glyph.transform[5] + Math.abs(glyph.transform[3]) * 0.34];
        });
        if (!lines.some(([x1, y1, x2, y2]) => Math.abs(x1 - points[0][0]) < 0.2 && Math.abs(y1 - points[0][1]) < 0.2 && Math.abs(x2 - points[1][0]) < 0.2 && Math.abs(y2 - points[1][1]) < 0.2)) throw new Error(`Answer line differs from ${placement.label}'s seeded cells.`);
        checked += 1;
      }
    }
    return checked;
  } finally { await loading.destroy(); }
}
