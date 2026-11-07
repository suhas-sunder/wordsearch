import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import type { PuzzleOutputOptions } from "@/lib/puzzle/output-options";
import type { PuzzleResult } from "@/lib/puzzle/types";
import { splitCoalescedWordBank } from "@/lib/pdf/coalesced-word-bank";

export interface MeasuredBox { text: string; x: number; y: number; width: number; height: number; fontPt: number }
export interface PrintMeasurement {
  paperSize: string; printScale: string; page: { widthPt: number; heightPt: number };
  grid: { rows: number; columns: number; cellWidthPt: number; cellHeightPt: number; minFontPt: number; bounds: { x: number; y: number; width: number; height: number } };
  title: MeasuredBox | null; titleLines: MeasuredBox[]; wordBank: MeasuredBox[]; unmeasuredWords: string[]; findings: { code: string; detail: string }[];
}

/** Extracts actual PDF text geometry in points at 100% scale. Text boxes are PDF.js estimates. */
export async function measurePuzzlePdf(puzzle: PuzzleResult, options: PuzzleOutputOptions): Promise<PrintMeasurement> {
  const bytes = await createPuzzlePdf({ puzzle, options, shareUrl: "https://www.ilovewordsearch.com/" });
  return measurePdfBytes(bytes, puzzle, options);
}

/** Measure a selected puzzle page from an already composed PDF. */
export async function measurePdfBytes(bytes: Uint8Array, puzzle: PuzzleResult, options: PuzzleOutputOptions, pageNumber = 1): Promise<PrintMeasurement> {
  const standardFontDataUrl = `${fileURLToPath(new URL("../../node_modules/pdfjs-dist/standard_fonts/", import.meta.url))}/`;
  const document = await getDocument({ data: bytes.slice(), standardFontDataUrl }).promise;
  try {
    const page = await document.getPage(pageNumber), viewport = page.getViewport({ scale: 1 }), contents = await page.getTextContent();
    const text: MeasuredBox[] = contents.items.flatMap((item) => "str" in item && "transform" in item && item.str.trim() ? [{ text: item.str.trim(), x: item.transform[4], y: item.transform[5], width: item.width, height: item.height, fontPt: Math.abs(item.transform[3]) }] : []);
    const singles = text.filter((item) => /^[A-Z0-9]$/.test(item.text));
    const expected = puzzle.grid.flat().join("");
    const start = singles.map((item) => item.text).join("").indexOf(expected);
    if (start < 0 || puzzle.cols < 2 || puzzle.rows < 2) throw new Error("Could not identify the complete single-token Latin grid in the rendered PDF.");
    const glyphs = singles.slice(start, start + expected.length);
    const cx = (item: MeasuredBox) => item.x + item.width / 2;
    const cy = (item: MeasuredBox) => item.y + item.fontPt * 0.34;
    const cellWidthPt = Math.abs(cx(glyphs[1]) - cx(glyphs[0]));
    const cellHeightPt = Math.abs(cy(glyphs[puzzle.cols]) - cy(glyphs[0]));
    const centersX = glyphs.map(cx), centersY = glyphs.map(cy);
    const bounds = { x: Math.min(...centersX) - cellWidthPt / 2, y: Math.min(...centersY) - cellHeightPt / 2, width: cellWidthPt * puzzle.cols, height: cellHeightPt * puzzle.rows };
    const titleLines = text.filter((item) => item.fontPt >= 12 && item.text.length >= 1 && puzzle.request.title.includes(item.text) && item.y > bounds.y + bounds.height);
    const title = titleLines.length ? { text: titleLines.map((line) => line.text).join(" "), x: Math.min(...titleLines.map((line) => line.x)), y: Math.min(...titleLines.map((line) => line.y)), width: Math.max(...titleLines.map((line) => line.x + line.width)) - Math.min(...titleLines.map((line) => line.x)), height: Math.max(...titleLines.map((line) => line.y + line.height)) - Math.min(...titleLines.map((line) => line.y)), fontPt: Math.min(...titleLines.map((line) => line.fontPt)) } : null;
    const labels = puzzle.placed.map((placement) => placement.label);
    const extracted = text.slice(text.indexOf(glyphs[glyphs.length - 1]) + 1).filter((item) => !["Exact seeded word search", "Scan to open the same unsolved puzzle."].includes(item.text));
    const candidates: MeasuredBox[] = [];
    for (const item of extracted) candidates.push(...(await splitCoalescedWordBank(item, labels) ?? [item]));
    const wordBank: MeasuredBox[] = [], unmeasuredWords: string[] = [];
    const normalized = (value: string) => value.replace(/\s+/g, "").toLowerCase();
    for (const label of labels) {
      const target = normalized(label);
      const exact = candidates.find((item) => !wordBank.includes(item) && normalized(item.text) === target);
      if (exact) { wordBank.push(exact); continue; }
      let remaining = target;
      const segments: MeasuredBox[] = [];
      for (const item of candidates) {
        if (wordBank.includes(item)) continue;
        const part = normalized(item.text);
        if (part && remaining.startsWith(part)) { segments.push(item); remaining = remaining.slice(part.length); if (!remaining) break; }
      }
      if (remaining) unmeasuredWords.push(label);
      else wordBank.push(...segments);
    }
    const findings: PrintMeasurement["findings"] = [];
    const overlaps = (a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    const outside = (box: MeasuredBox) => box.x < 0 || box.y < 0 || box.x + box.width > viewport.width || box.y + box.height > viewport.height;
    for (const box of [title, ...wordBank].filter((item): item is MeasuredBox => item !== null)) if (outside(box)) findings.push({ code: "outside-page", detail: box.text });
    if (title && options.nameDateLine && titleLines.some((line) => text.filter((item) => ["Name", "Date"].includes(item.text)).some((item) => overlaps(line, item)))) findings.push({ code: "title-name-date-overlap", detail: title.text });
    for (const box of wordBank) {
      if (overlaps(box, bounds)) findings.push({ code: "word-bank-grid-overlap", detail: box.text });
      if (text.filter((item) => item.text === "Exact seeded word search" || item.text === "Scan to open the same unsolved puzzle.").some((footer) => overlaps(box, footer))) findings.push({ code: "word-bank-footer-overlap", detail: box.text });
    }
    for (let i = 0; i < wordBank.length; i++) for (let j = i + 1; j < wordBank.length; j++) if (overlaps(wordBank[i], wordBank[j])) findings.push({ code: "word-bank-text-overlap", detail: `${wordBank[i].text} / ${wordBank[j].text}` });
    if (title && title.text !== puzzle.request.title) findings.push({ code: "title-text-clipped", detail: puzzle.request.title });
    if (!title) findings.push({ code: "title-not-measured", detail: puzzle.request.title });
    if (unmeasuredWords.length) findings.push({ code: "words-not-measured", detail: unmeasuredWords.join(", ") });
    return { paperSize: options.paperSize, printScale: options.printScale, page: { widthPt: viewport.width, heightPt: viewport.height }, grid: { rows: puzzle.rows, columns: puzzle.cols, cellWidthPt, cellHeightPt, minFontPt: Math.min(...glyphs.map((item) => item.fontPt)), bounds }, title, titleLines, wordBank, unmeasuredWords, findings };
  } finally { await document.destroy(); }
}
