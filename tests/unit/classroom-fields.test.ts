import { describe, expect, test } from "vitest";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { buildClassroomPack } from "@/lib/pack/classroom-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { parseClassroomPresets } from "@/lib/pack/presets";

const input = { title: "Botany Review", wordsText: "garden\nflower\nbird\nseed\nleaf\nplant", seed: "class-fields", count: 5 as const };
const instructions = "Find each word. Circle the words you know, then compare the vocabulary with a partner. Keep this worksheet for your next lesson.";
describe("classroom worksheet fields and directions", () => {
  test.each(["letter", "a4"] as const)("prints student-only fields/instructions without changing answer grids on %s", async (paperSize) => {
    const plain = buildClassroomPack(input), pack = buildClassroomPack({ ...input, instructions });
    expect(pack.puzzles.map(({ puzzle }) => puzzle.grid)).toEqual(plain.puzzles.map(({ puzzle }) => puzzle.grid));
    for (const layoutProfile of ["pack", "large-print"] as const) {
      const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", classLine: true, layoutProfile });
      const task = getDocument({ data: bytes.slice(), useSystemFonts: true });
      const document = await task.promise;
      try {
        for (let i = 0; i < 5; i++) {
          const student = await (await document.getPage(i + 1)).getTextContent();
          const items = student.items.filter((item) => "str" in item);
          const text = items.map((item) => item.str).join(" ").replace(/\s+/g, " ");
          expect(text).toContain(instructions);
          for (const label of ["Name", "Date", "Class"]) expect(items.filter((item) => item.str === label)).toHaveLength(1);
          const measurement = await measurePdfBytes(bytes, pack.puzzles[i].puzzle, { ...defaultPuzzleOutputOptions, paperSize, printScale: layoutProfile === "large-print" ? "large" : "standard", qrCode: false }, i + 1);
          expect(measurement.findings).toEqual([]);
          const classLabel = items.find((item) => item.str === "Class")!;
          expect(classLabel.transform[5]).toBeGreaterThan(measurement.grid.bounds.y + measurement.grid.bounds.height);
          const answer = await (await document.getPage(i + 6)).getTextContent();
          const answerItems = answer.items.filter((item) => "str" in item);
          expect(answerItems.some((item) => ["Name", "Date", "Class"].includes(item.str))).toBe(false);
          expect(answerItems.map((item) => item.str).join(" ")).not.toContain(instructions);
          expect(answerItems.filter((item) => /^[A-Z]$/.test(item.str)).map((item) => item.str).join("")).toBe(pack.puzzles[i].puzzle.grid.flat().join(""));
        }
      } finally { await task.destroy(); }
    }
  }, 60000);
  test("bounds instructions and retains old/new version1 presets", () => {
    expect(() => buildClassroomPack({ ...input, instructions: "x".repeat(181) })).toThrow("180");
    expect(() => buildClassroomPack({ ...input, instructions: "Unsupported \u{1F642}" })).toThrow("punctuation");
    const base = { input, paperSize: "letter", order: "answers-last", pages: "both" };
    expect(parseClassroomPresets(JSON.stringify({ v: 1, presets: [base] }))).toEqual([base]);
    const custom = { ...base, input: { ...input, instructions }, classLine: true, largePrint: true };
    expect(parseClassroomPresets(JSON.stringify({ v: 1, presets: [custom] }))).toEqual([custom]);
  });
});
