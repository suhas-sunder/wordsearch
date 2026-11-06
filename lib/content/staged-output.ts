import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument, OPS } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { defaultPuzzleOutputOptions, pdfPageSpec } from "@/lib/puzzle/output-options";
import type { Freeze, ValidationIssue } from "@/lib/content/staged-validation";

/** Inspect real PDF text and drawing operations; this does not certify print accessibility. */
export async function inspectCandidatePdfs(freeze: Freeze): Promise<{ issues: ValidationIssue[]; evidence: object[] }> {
  const issues: ValidationIssue[] = [];
  const evidence: object[] = [];
  for (const paperSize of ["letter", "a4"] as const) {
    try {
      const options = { ...defaultPuzzleOutputOptions, paperSize, includeAnswerKey: true, qrCode: false };
      const bytes = await createPuzzlePdf({ puzzle: freeze.result, options, shareUrl: "https://www.ilovewordsearch.com/" });
      const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
      const pdf = await getDocument({ data: bytes.slice(), standardFontDataUrl }).promise;
      const spec = pdfPageSpec(paperSize, "portrait");
      if (pdf.numPages !== 2) throw new Error(`Expected two pages, got ${pdf.numPages}`);
      const pages = await Promise.all([pdf.getPage(1), pdf.getPage(2)]);
      const views = pages.map((page) => page.getViewport({ scale: 1 }));
      if (views.some((v) => Math.abs(v.width - spec.width) > 0.1 || Math.abs(v.height - spec.height) > 0.1)) throw new Error("Paper dimensions differ from requested format");
      const contents = await Promise.all(pages.map((page) => page.getTextContent()));
      const text = contents.map((content) => content.items.map((item) => "str" in item ? item.str : "").join(" "));
      for (const placed of freeze.result.placed) if (!text[0].includes(placed.label)) issues.push({ stage: "pdf", code: "missing-word", id: freeze.id, detail: `${paperSize}: ${placed.label} missing from puzzle page` });
      if (!text[1].includes("Answer key")) issues.push({ stage: "pdf", code: "missing-answer-page", id: freeze.id, detail: `${paperSize}: answer label missing` });
      const expectedGrid = freeze.result.grid.flat().join("");
      for (let pageIndex = 0; pageIndex < 2; pageIndex++) {
        const letters = contents[pageIndex].items.flatMap((item) => "str" in item && /^[A-Z0-9]$/.test(item.str.trim()) ? [item.str.trim()] : []).join("");
        if (!letters.includes(expectedGrid)) issues.push({ stage: "pdf", code: "grid-mismatch", id: freeze.id, detail: `${paperSize}: page ${pageIndex + 1} extracted grid does not match frozen grid` });
        for (const item of contents[pageIndex].items) {
          if (!("str" in item) || !("transform" in item) || !item.str.trim()) continue;
          const x = item.transform[4], y = item.transform[5];
          if (x < 0 || y < 0 || x + item.width > views[pageIndex].width + 1 || y > views[pageIndex].height) {
            issues.push({ stage: "pdf", code: "text-outside-page", id: freeze.id, detail: `${paperSize}: page ${pageIndex + 1} contains text outside paper bounds` });
            break;
          }
        }
      }
      const operators = await Promise.all(pages.map((page) => page.getOperatorList()));
      const answerGlyphs = contents[1].items.filter((item) => "str" in item && /^[A-Z0-9]$/.test(item.str.trim()) && "transform" in item);
      const glyphString = answerGlyphs.map((item) => "str" in item ? item.str.trim() : "").join("");
      const gridStart = glyphString.indexOf(expectedGrid);
      const linePaths = operators[1].argsArray.flatMap((args, index) => {
        if (operators[1].fnArray[index] !== OPS.constructPath || !Array.isArray(args) || !Array.isArray(args[1]) || !args[1][0]) return [];
        const coords = Array.from(args[1][0] as ArrayLike<number>);
        return coords.length === 9 && coords[0] === 0 && coords[3] === 0 && coords[6] === 1 ? [[coords[1], coords[2], coords[7], coords[8]]] : [];
      });
      for (const placement of freeze.result.placed) {
        const ends = [placement.cells[0], placement.cells[placement.cells.length - 1]].map((cell) => answerGlyphs[gridStart + cell.row * freeze.columns + cell.col]);
        if (gridStart < 0 || ends.some((item) => !item || !("transform" in item) || !("width" in item))) continue;
        const points = ends.map((item) => "transform" in item && "width" in item ? [item.transform[4] + item.width / 2, item.transform[5] + Math.abs(item.transform[3]) * 0.34] : [0, 0]);
        if (!linePaths.some(([x1, y1, x2, y2]) => Math.abs(x1 - points[0][0]) < 0.2 && Math.abs(y1 - points[0][1]) < 0.2 && Math.abs(x2 - points[1][0]) < 0.2 && Math.abs(y2 - points[1][1]) < 0.2)) issues.push({ stage: "pdf", code: "answer-coordinate-mismatch", id: freeze.id, detail: `${paperSize}: answer line for ${placement.label} does not match frozen cells` });
      }
      const strokes = operators.map((op) => op.fnArray.filter((fn) => fn === OPS.constructPath).length);
      if (strokes[1] - strokes[0] < freeze.result.placed.length - 2) issues.push({ stage: "pdf", code: "answer-lines", id: freeze.id, detail: `${paperSize}: answer drawing count does not match expected placements` });
      const studentLetters = contents[0].items.filter((item) => "str" in item && /^[A-Z0-9]$/.test(item.str.trim()) && "transform" in item);
      const studentString = studentLetters.map((item) => "str" in item ? item.str.trim() : "").join("");
      const studentStart = studentString.indexOf(expectedGrid);
      const gridGlyphs = studentStart < 0 ? [] : studentLetters.slice(studentStart, studentStart + expectedGrid.length);
      const minGridGlyphPt = gridGlyphs.length ? Math.min(...gridGlyphs.map((item) => "transform" in item ? Math.abs(item.transform[3]) : Infinity)) : 0;
      const bankGlyphSizes = freeze.result.placed.flatMap((placement) => contents[0].items.filter((item) => "str" in item && item.str.trim() === placement.label && "transform" in item).map((item) => "transform" in item ? Math.abs(item.transform[3]) : 0));
      const minWordBankPt = bankGlyphSizes.length ? Math.min(...bankGlyphSizes) : 0;
      if (minGridGlyphPt < 8 || minWordBankPt < 9) issues.push({ stage: "pdf", code: "small-text-review", id: freeze.id, detail: `${paperSize}: grid ${minGridGlyphPt.toFixed(2)} pt, word bank ${minWordBankPt.toFixed(2)} pt; inspect physical output before release` });
      const glyphs = contents[0].items.filter((item) => "str" in item && item.str.trim().length === 1 && "transform" in item);
      const minGlyphPt = glyphs.length ? Math.min(...glyphs.map((item) => "transform" in item ? Math.abs(item.transform[3]) : Infinity)) : 0;
      if (glyphs.length < freeze.rows * freeze.columns) issues.push({ stage: "pdf", code: "grid-glyphs", id: freeze.id, detail: `${paperSize}: too few individual extracted grid glyphs` });
      evidence.push({ paperSize, pages: pdf.numPages, widthPt: views[0].width, heightPt: views[0].height, extractedSingleGlyphs: glyphs.length, minExtractedGlyphPt: minGlyphPt, minGridGlyphPt, minWordBankPt, studentPaths: strokes[0], answerPaths: strokes[1], bytes: bytes.length });
      await pdf.destroy();
    } catch (error) { issues.push({ stage: "pdf", code: "pdf-inspection", id: freeze.id, detail: `${paperSize}: ${error instanceof Error ? error.message : String(error)}` }); }
  }
  return { issues, evidence };
}

/** Verify built output, if available, using exact candidate paths. */
export function inspectCandidateExport(paths: string[], outDir = "out"): ValidationIssue[] {
  const output = resolve(outDir);
  const sitemap = resolve(output, "sitemap.xml"), search = resolve(output, "search-index.json");
  if (!existsSync(sitemap) || !existsSync(search)) return [{ stage: "exposure", code: "missing-export", detail: "Build output, sitemap and search index are required for export inspection." }];
  const sitemapText = readFileSync(sitemap, "utf8"), searchText = readFileSync(search, "utf8");
  function htmlFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? htmlFiles(resolve(dir, entry.name)) : entry.isFile() && entry.name.endsWith(".html") ? [resolve(dir, entry.name)] : []);
  }
  const indexedHtml = htmlFiles(output).map((file) => readFileSync(file, "utf8")).filter((html) => !/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html));
  return paths.flatMap((path) => {
    if (!/^\/word-searches\/[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) return [{ stage: "exposure" as const, code: "invalid-export-path", detail: path }];
    const html = resolve(output, `${path.slice(1)}.html`);
    return existsSync(html) || sitemapText.includes(path) || searchText.includes(path) || indexedHtml.some((content) => content.includes(path)) ? [{ stage: "exposure" as const, code: "exported-candidate", detail: path }] : [];
  });
}
