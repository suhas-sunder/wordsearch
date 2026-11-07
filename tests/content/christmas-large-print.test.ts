import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, test } from "vitest";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { christmasCandidates } from "@/content/staged/christmas";
import { christmasLargePrintArtifact } from "@/content/staged/christmas-large-print";
import { allStagedCandidates } from "@/content/staged/catalog";
import { routeInventory } from "@/content/registry";
import { createChristmasLargePrintReviewPdf, resolveChristmasLargePrintArtifact } from "@/lib/content/staged-christmas-large-print";
import { validateStaged } from "@/lib/content/staged-validation";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";

describe("X03 source-only measured Christmas format", () => {
  test("pins the actual unchanged Christmas source file rather than an inferred reference", () => {
    const source = christmasLargePrintArtifact.source;
    const committed = execFileSync("git", ["show", `${source.contentCommit}:${source.file}`]);
    const current = execFileSync("git", ["show", `HEAD:${source.file}`]);
    expect(committed).toEqual(current); // Exact canonical Git blob bytes.
    const checkout = readFileSync(fileURLToPath(new URL("../../content/staged/christmas.ts", import.meta.url)), "utf8");
    expect(checkout.replace(/\r\n/g, "\n")).toBe(current.toString("utf8")); // Windows checkout convention only.
  });

  test("strictly maps to unchanged X02 without another puzzle or indexable URL", () => {
    const artifact = christmasLargePrintArtifact;
    const source = christmasCandidates.find(({ id }) => id === "X02")!;
    const original = validateStaged([source]).freezes[0];
    expect(resolveChristmasLargePrintArtifact()).toEqual(original);
    expect(artifact.source.id).toBe("X02");
    expect(artifact.source.canonicalPath).toBe(source.proposedPath);
    expect(artifact.layoutProfile).toBe("large-print");
    expect(artifact.runtimeImportAllowed).toBe(false);
    expect(artifact.createsIndexableVariant).toBe(false);
    expect(artifact.newIndexableUrlAllowance).toBe(0);
    expect(artifact.publicationAuthorized).toBe(false);
    expect(artifact.editorialStatus).toBe("unreviewed");
    expect(Object.hasOwn(artifact, "proposedPath")).toBe(false);
    expect(source.puzzle.largePrintSuitable).toBe(false); // Do not relabel ordinary canonical output.
    expect(allStagedCandidates).toHaveLength(60);
    expect(allStagedCandidates.some(({ id }) => id === artifact.id)).toBe(false);
    expect(routeInventory.filter(record => record.contentType === "puzzle" && record.publicationStatus === "published")).toHaveLength(150);
  });

  test.each(["letter", "a4"] as const)("renders actual %s grid/bank/answer geometry at the measured minimum", async paperSize => {
    const artifact = await createChristmasLargePrintReviewPdf(paperSize);
    expect(artifact.sourceCandidateId).toBe("X02");
    expect(artifact.puzzle).toEqual(resolveChristmasLargePrintArtifact().result);
    expect(artifact.options).toMatchObject({ paperSize, orientation: "portrait", printScale: "large", wordBankPlacement: "below", includeAnswerKey: true, qrCode: false, coordinates: false });
    const measurement = await measurePdfBytes(artifact.bytes, artifact.puzzle, artifact.options);
    expect(measurement.findings).toEqual([]);
    expect(measurement.grid.minFontPt).toBeGreaterThanOrEqual(16);
    expect(measurement.wordBank).toHaveLength(12);
    expect(measurement.wordBank.every(({ fontPt }) => fontPt === 18)).toBe(true);
    const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
    const task = getDocument({ data: artifact.bytes.slice(), standardFontDataUrl });
    try {
      const document = await task.promise;
      expect(document.numPages).toBe(2);
      for (const pageNumber of [1, 2]) {
        const page = await document.getPage(pageNumber), content = await page.getTextContent();
        const singles = content.items.flatMap(item => "str" in item && /^[A-Z0-9]$/.test(item.str.trim()) ? [item] : []);
        const expected = artifact.puzzle.grid.flat().join("");
        const start = singles.map(item => item.str.trim()).join("").indexOf(expected);
        expect(start).toBeGreaterThanOrEqual(0);
        const glyphs = singles.slice(start, start + expected.length);
        expect(glyphs).toHaveLength(144);
        expect(glyphs.every(item => Math.abs(item.transform[3]) >= 16)).toBe(true);
        if (pageNumber !== 2) continue;
        const operators = await page.getOperatorList();
        const linePaths = operators.argsArray.flatMap((args, index) => {
          if (operators.fnArray[index] !== OPS.constructPath || !Array.isArray(args) || !Array.isArray(args[1]) || !args[1][0]) return [];
          const coords = Array.from(args[1][0] as ArrayLike<number>);
          return coords.length === 9 && coords[0] === 0 && coords[3] === 0 && coords[6] === 1 ? [[coords[1], coords[2], coords[7], coords[8]]] : [];
        });
        for (const placement of artifact.puzzle.placed) {
          const ends = [placement.cells[0], placement.cells[placement.cells.length - 1]].map(cell => glyphs[cell.row * artifact.puzzle.cols + cell.col]).map(item => [item.transform[4] + item.width / 2, item.transform[5] + Math.abs(item.transform[3]) * .34]);
          expect(linePaths.some(([x1, y1, x2, y2]) => Math.abs(x1 - ends[0][0]) < .2 && Math.abs(y1 - ends[0][1]) < .2 && Math.abs(x2 - ends[1][0]) < .2 && Math.abs(y2 - ends[1][1]) < .2), placement.label).toBe(true);
        }
      }
    } finally { await task.destroy(); }
  });

  test("does not silently use another paper layout", async () => {
    await expect(createChristmasLargePrintReviewPdf("legal" as "letter")).rejects.toThrow("only Letter or A4");
  });
});
