import { describe, expect, test } from "vitest";
import { PDFDocument } from "pdf-lib";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

describe("opt-in measured large-print packs", () => {
  test.each(["letter", "a4"] as const)("measures every student grid and word bank on %s", async (paperSize) => {
    const pack = buildClassroomPack({ title: "Family Activity", wordsText: "garden\nflower\nbird\nseed\nleaf\nplant", seed: "large-grid", count: 5 });
    const before = JSON.stringify(pack);
    const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", layoutProfile: "large-print" });
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(10);
    for (let i = 0; i < pack.puzzles.length; i++) {
      const measurement = await measurePdfBytes(bytes, pack.puzzles[i].puzzle, { ...defaultPuzzleOutputOptions, paperSize, printScale: "large", qrCode: false }, i + 1);
      expect(measurement.findings).toEqual([]);
      expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(16);
      expect(measurement.wordBank).toHaveLength(6);
      expect(measurement.wordBank.every((word) => word.fontPt === 18)).toBe(true);
    }
    expect(JSON.stringify(pack)).toBe(before);
  }, 60000);

  test("fails closed when the existing grid cannot meet the type floor", async () => {
    const wordsText = Array.from({ length: 20 }, (_, i) => `WORD${String.fromCharCode(65 + i)}`).join("\n");
    const pack = buildClassroomPack({ title: "Dense List", wordsText, seed: "dense-large", count: 5 });
    await expect(createPuzzlePackPdf(pack, { paperSize: "a4", order: "answers-last", layoutProfile: "large-print" })).rejects.toThrow("16-point");
  });
});
