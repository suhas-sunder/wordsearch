import { PDFDocument, StandardFonts } from "pdf-lib";
import type { MeasuredBox } from "@/lib/pdf/measure-pdf";

/**
 * PDF.js sometimes combines separate below-grid labels into one text item.
 * Only recover unambiguous whole-label sequences whose observed width agrees
 * with this renderer's Helvetica-Bold text and 12-point inter-label gaps.
 * Unknown font/spacing or ambiguous segmentation stays unmeasured.
 */
export async function splitCoalescedWordBank(box: MeasuredBox, labels: string[]): Promise<MeasuredBox[] | null> {
  const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();
  const source = normalize(box.text);
  const choices = [...new Set(labels)].map((label) => ({ label, normalized: normalize(label) })).filter(({ normalized }) => normalized);
  if (choices.some(({ normalized }) => normalized === source)) return null;
  const memo = new Map<string, string[][]>();
  function segment(remaining: string): string[][] {
    if (!remaining) return [[]];
    const cached = memo.get(remaining);
    if (cached) return cached;
    const answers: string[][] = [];
    for (const choice of choices) {
      if (remaining !== choice.normalized && !remaining.startsWith(`${choice.normalized} `)) continue;
      const rest = remaining.slice(choice.normalized.length).trimStart();
      for (const tail of segment(rest)) {
        answers.push([choice.label, ...tail]);
        if (answers.length > 1) { memo.set(remaining, answers); return answers; }
      }
    }
    memo.set(remaining, answers);
    return answers;
  }
  const alternatives = segment(source);
  if (alternatives.length !== 1 || alternatives[0].length < 2) return null;
  const words = alternatives[0];
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.HelveticaBold);
  let advances: number[];
  let widths: number[];
  try {
    advances = words.map((word) => font.widthOfTextAtSize(word, box.fontPt));
    widths = words.map((word) => [...word].reduce((total, character) => total + font.widthOfTextAtSize(character, box.fontPt), 0));
  }
  catch { return null; }
  // Cursor placement uses pdf-lib's kerned widths, while PDF.js measures the
  // emitted glyph advances. Account for the last label's actual glyph extent.
  const expectedWidth = advances.slice(0, -1).reduce((total, width) => total + width, 0) + 12 * (words.length - 1) + widths[widths.length - 1];
  // Larger deviations cannot be treated as this known rendering contract.
  if (Math.abs(expectedWidth - box.width) > 0.05) return null;
  let x = box.x;
  return words.map((text, index) => {
    const measured = { ...box, text, x, width: widths[index] };
    x += advances[index] + 12;
    return measured;
  });
}
