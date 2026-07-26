import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { orderWordBank } from "@/lib/puzzle/parse";
import { directionVectors } from "@/lib/puzzle/generate";
import type { PuzzleResult } from "@/lib/puzzle/types";
import {
  pdfPagePlan,
  pdfPageSpec,
  type PuzzleOutputOptions
} from "@/lib/puzzle/output-options";

export interface CreatePuzzlePdfInput {
  puzzle: PuzzleResult;
  options: PuzzleOutputOptions;
  shareUrl: string;
  qrDataUrl?: string;
}

export class UnsupportedPdfTextError extends Error {
  constructor() {
    super("This puzzle contains characters that the downloadable PDF font cannot render. Use browser print for this alphabet pack.");
    this.name = "UnsupportedPdfTextError";
  }
}

function pdfSafeText(value: string | undefined, font: PDFFont) {
  if (!value) return "";
  const normalized = value
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return Array.from(normalized, (character) => {
    try {
      font.encodeText(character);
      return character;
    } catch {
      throw new UnsupportedPdfTextError();
    }
  }).join("");
}

function textWidth(font: PDFFont, text: string, size: number) {
  return font.widthOfTextAtSize(text, size);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && textWidth(font, candidate, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function drawCenteredText(page: PDFPage, text: string, font: PDFFont, size: number, centerX: number, y: number) {
  page.drawText(text, {
    x: centerX - textWidth(font, text, size) / 2,
    y,
    size,
    font,
    color: rgb(0.07, 0.1, 0.16)
  });
}

function pngBytes(dataUrl: string) {
  const encoded = dataUrl.split(",")[1];
  if (!encoded) throw new Error("QR image data is invalid.");
  const binary = globalThis.atob(encoded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function orderedLabels(puzzle: PuzzleResult) {
  return orderWordBank(
    puzzle.placed.map((placement) => ({
      id: placement.wordId,
      raw: placement.label,
      label: placement.label,
      normalized: placement.label,
      tokens: placement.tokens
    })),
    puzzle.request.wordBankOrder
  ).map((word) => word.label);
}

function drawWordBankBelow(
  page: PDFPage,
  labels: string[],
  font: PDFFont,
  y: number,
  left: number,
  width: number,
  large: boolean
) {
  const size = large ? 11.5 : 9.5;
  const gap = 12;
  let x = left;
  let currentY = y;
  for (const rawLabel of labels) {
    const label = pdfSafeText(rawLabel, font);
    const itemWidth = textWidth(font, label, size) + gap;
    if (x > left && x + itemWidth > left + width) {
      x = left;
      currentY -= size + 6;
    }
    page.drawText(label, { x, y: currentY, size, font, color: rgb(0.08, 0.12, 0.18) });
    x += itemWidth;
  }
}

function drawWordBankBeside(
  page: PDFPage,
  labels: string[],
  font: PDFFont,
  top: number,
  left: number,
  width: number,
  large: boolean
) {
  const size = large ? 11.5 : 9.5;
  let y = top;
  for (const rawLabel of labels) {
    const label = pdfSafeText(rawLabel, font);
    const lines = wrapText(label, font, size, width);
    for (const line of lines) {
      page.drawText(line, { x: left, y, size, font, color: rgb(0.08, 0.12, 0.18) });
      y -= size + 3;
    }
    y -= 4;
  }
}

async function drawPuzzlePage(
  document: PDFDocument,
  puzzle: PuzzleResult,
  options: PuzzleOutputOptions,
  answerKey: boolean,
  fonts: { regular: PDFFont; bold: PDFFont },
  shareTarget: string,
  qrDataUrl?: string
) {
  const spec = pdfPageSpec(options.paperSize, options.orientation);
  const page = document.addPage([spec.width, spec.height]);
  const { width, height } = page.getSize();
  const margin = options.orientation === "landscape" ? 30 : 36;
  const usableWidth = width - margin * 2;
  const large = options.printScale === "large";
  const ink = options.inkSaving ? rgb(0.08, 0.08, 0.08) : rgb(0.07, 0.1, 0.16);

  page.drawText("www.iLoveWordSearch.com", {
    x: margin,
    y: height - margin + 2,
    size: 8,
    font: fonts.bold,
    color: options.inkSaving ? ink : rgb(0.08, 0.36, 0.22)
  });

  const title = pdfSafeText(`${puzzle.request.title}${answerKey ? " - Answer Key" : ""}`, fonts.bold);
  const titleSize = large ? 20 : 18;
  page.drawText(title, { x: margin, y: height - margin - 24, size: titleSize, font: fonts.bold, color: ink });
  let headerBottom = height - margin - 42;

  if (!answerKey && puzzle.request.subtitle) {
    const subtitle = pdfSafeText(puzzle.request.subtitle, fonts.regular);
    page.drawText(subtitle, { x: margin, y: headerBottom, size: 9.5, font: fonts.regular, color: rgb(0.3, 0.34, 0.4) });
    headerBottom -= 15;
  }

  if (options.instructions) {
    const instructions = pdfSafeText(
      answerKey ? "Answer key. Keep this page separate from puzzle copies." : puzzle.request.instructions,
      fonts.regular
    );
    const lines = wrapText(instructions, fonts.regular, 9.2, usableWidth * (options.nameDateLine && !answerKey ? 0.68 : 1));
    for (const line of lines.slice(0, 2)) {
      page.drawText(line, { x: margin, y: headerBottom, size: 9.2, font: fonts.regular, color: rgb(0.3, 0.34, 0.4) });
      headerBottom -= 12;
    }
  }

  if (options.nameDateLine && !answerKey) {
    const lineWidth = Math.min(140, usableWidth * 0.25);
    const lineX = width - margin - lineWidth;
    const topLineY = height - margin - 20;
    page.drawText("Name", { x: lineX, y: topLineY, size: 8, font: fonts.regular, color: ink });
    page.drawLine({ start: { x: lineX, y: topLineY - 4 }, end: { x: lineX + lineWidth, y: topLineY - 4 }, thickness: 0.7, color: ink });
    page.drawText("Date", { x: lineX, y: topLineY - 25, size: 8, font: fonts.regular, color: ink });
    page.drawLine({ start: { x: lineX, y: topLineY - 29 }, end: { x: lineX + lineWidth, y: topLineY - 29 }, thickness: 0.7, color: ink });
  }

  headerBottom -= 8;
  page.drawLine({ start: { x: margin, y: headerBottom }, end: { x: width - margin, y: headerBottom }, thickness: 0.7, color: rgb(0.65, 0.68, 0.72) });
  headerBottom -= 14;

  const labels = orderedLabels(puzzle);
  const footerHeight = options.qrCode ? 94 : 30;
  const belowBankHeight = !answerKey && options.wordBankPlacement === "below"
    ? Math.min(92, Math.max(42, Math.ceil(labels.length / (large ? 4 : 6)) * (large ? 18 : 15)))
    : 0;
  const besideWidth = !answerKey && options.wordBankPlacement === "beside" ? Math.min(150, usableWidth * 0.27) : 0;
  const coordinateUnits = options.coordinates ? 1 : 0;
  const gridAreaWidth = usableWidth - besideWidth - (besideWidth ? 18 : 0);
  const gridAreaHeight = headerBottom - margin - footerHeight - belowBankHeight;
  const cell = Math.min(
    gridAreaWidth / (puzzle.cols + coordinateUnits),
    gridAreaHeight / (puzzle.rows + coordinateUnits)
  );
  const gutter = coordinateUnits * cell;
  const gridWidth = puzzle.cols * cell + gutter;
  const gridHeight = puzzle.rows * cell + gutter;
  const gridLeft = margin + Math.max(0, (gridAreaWidth - gridWidth) / 2);
  const gridBottom = margin + footerHeight + belowBankHeight + Math.max(0, (gridAreaHeight - gridHeight) / 2);

  if (options.coordinates) {
    for (let col = 0; col < puzzle.cols; col += 1) {
      drawCenteredText(page, String(col + 1), fonts.regular, Math.max(6, cell * 0.26), gridLeft + gutter + col * cell + cell / 2, gridBottom + gridHeight - cell * 0.67);
    }
    for (let row = 0; row < puzzle.rows; row += 1) {
      drawCenteredText(page, String(row + 1), fonts.regular, Math.max(6, cell * 0.26), gridLeft + cell / 2, gridBottom + gridHeight - gutter - row * cell - cell * 0.64);
    }
  }

  for (let row = 0; row < puzzle.rows; row += 1) {
    for (let col = 0; col < puzzle.cols; col += 1) {
      const x = gridLeft + gutter + col * cell;
      const y = gridBottom + (puzzle.rows - row - 1) * cell;
      page.drawRectangle({ x, y, width: cell, height: cell, borderWidth: options.inkSaving ? 0.45 : 0.7, borderColor: ink });
      const token = pdfSafeText(puzzle.grid[row]?.[col] ?? "", fonts.bold);
      const tokenSize = token.length > 3
        ? cell * (large ? 0.29 : 0.24)
        : token.length > 1
          ? cell * (large ? 0.39 : 0.32)
          : cell * (large ? 0.58 : 0.48);
      drawCenteredText(page, token, fonts.bold, tokenSize, x + cell / 2, y + (cell - tokenSize) / 2 + tokenSize * 0.16);
    }
  }

  if (answerKey) {
    for (const placement of puzzle.placed) {
      const first = placement.cells[0];
      const last = placement.cells[placement.cells.length - 1];
      if (!first || !last) continue;
      const center = (coordinate: { row: number; col: number }) => ({
        x: gridLeft + gutter + coordinate.col * cell + cell / 2,
        y: gridBottom + (puzzle.rows - coordinate.row - 1) * cell + cell / 2
      });
      page.drawLine({
        start: center(first),
        end: center(last),
        thickness: Math.max(3, cell * 0.15),
        color: options.inkSaving ? rgb(0.1, 0.1, 0.1) : rgb(0.12, 0.34, 0.68),
        opacity: options.inkSaving ? 0.52 : 0.48
      });
    }
  } else if (options.wordBankPlacement === "beside") {
    drawWordBankBeside(page, labels, fonts.bold, headerBottom - 4, margin + gridAreaWidth + 18, besideWidth, large);
  } else {
    drawWordBankBelow(page, labels, fonts.bold, gridBottom - 18, margin, usableWidth, large);
  }

  const footerY = margin + 4;
  const qrSize = options.qrCode && qrDataUrl ? 72 : 0;
  const footerRuleY = footerY + (qrSize ? qrSize + 6 : 22);
  const footerTitleY = footerY + (qrSize ? 34 : 9);
  const footerDetailY = footerY + (qrSize ? 21 : -2);
  page.drawLine({ start: { x: margin, y: footerRuleY }, end: { x: width - margin, y: footerRuleY }, thickness: 0.5, color: rgb(0.7, 0.72, 0.76) });
  page.drawText(answerKey ? "Answer key" : "Exact seeded word search", { x: margin, y: footerTitleY, size: 8, font: fonts.bold, color: ink });
  page.drawText(options.qrCode ? "Scan to open the same unsolved puzzle." : pdfSafeText(shareTarget.slice(0, 86), fonts.regular), {
    x: margin,
    y: footerDetailY,
    size: 7.2,
    font: fonts.regular,
    color: rgb(0.35, 0.38, 0.43)
  });

  if (options.qrCode && qrDataUrl) {
    const qr = await document.embedPng(pngBytes(qrDataUrl));
    page.drawImage(qr, { x: width - margin - qrSize, y: footerY, width: qrSize, height: qrSize });
  }
}

export function validatePuzzleForPdf(value: unknown): value is PuzzleResult {
  if (!value || typeof value !== "object") return false;
  const puzzle = value as Partial<PuzzleResult>;
  if (!Number.isInteger(puzzle.rows) || !Number.isInteger(puzzle.cols)) return false;
  if (!puzzle.rows || !puzzle.cols || puzzle.rows < 1 || puzzle.cols < 1 || puzzle.rows > 40 || puzzle.cols > 40) return false;
  if (!puzzle.request || typeof puzzle.request.title !== "string" || !puzzle.request.title.trim() || puzzle.request.title.length > 200) return false;
  if (typeof puzzle.request.wordsText !== "string" || puzzle.request.wordsText.length > 100_000) return false;
  if (typeof puzzle.request.seed !== "string" || !puzzle.request.seed.trim() || puzzle.request.seed.length > 300) return false;
  if (!(["easy", "medium", "hard"] as const).includes(puzzle.request.difficulty)) return false;
  if (typeof puzzle.request.autoSize !== "boolean" || typeof puzzle.request.allowOverlap !== "boolean") return false;
  if (!Array.isArray(puzzle.request.directions) || !puzzle.request.directions.length || !puzzle.request.directions.every((direction) => direction in directionVectors)) return false;
  if (!Array.isArray(puzzle.grid) || puzzle.grid.length !== puzzle.rows) return false;
  if (!puzzle.grid.every((row) => Array.isArray(row) && row.length === puzzle.cols && row.every((token) => typeof token === "string" && token.length <= 32))) return false;
  if (!Array.isArray(puzzle.placed) || puzzle.placed.length > 300) return false;
  const placementIds = new Set<string>();
  return puzzle.placed.every((placement) => {
    if (typeof placement.wordId !== "string" || !placement.wordId || placementIds.has(placement.wordId)) return false;
    placementIds.add(placement.wordId);
    if (typeof placement.label !== "string" || placement.label.length > 200) return false;
    if (!Array.isArray(placement.tokens) || !placement.tokens.length || placement.tokens.some((token) => typeof token !== "string" || token.length > 32)) return false;
    if (!Array.isArray(placement.cells) || placement.cells.length !== placement.tokens.length) return false;
    if (!(placement.direction in directionVectors) || !Number.isInteger(placement.row) || !Number.isInteger(placement.col)) return false;
    const vector = directionVectors[placement.direction];
    return placement.cells.every((cell, index) => (
      Number.isInteger(cell.row)
      && Number.isInteger(cell.col)
      && cell.row === placement.row + vector.dr * index
      && cell.col === placement.col + vector.dc * index
      && cell.row >= 0
      && cell.col >= 0
      && cell.row < puzzle.rows!
      && cell.col < puzzle.cols!
      && typeof cell.token === "string"
      && cell.token === placement.tokens[index]
      && puzzle.grid?.[cell.row]?.[cell.col] === cell.token
    ));
  });
}

export async function createPuzzlePdf({ puzzle, options, shareUrl, qrDataUrl }: CreatePuzzlePdfInput) {
  if (!validatePuzzleForPdf(puzzle)) throw new Error("Puzzle data is invalid for PDF generation.");
  if (options.qrCode && !qrDataUrl) throw new Error("QR image data is required when QR output is enabled.");
  const parsedShareUrl = new URL(shareUrl);
  if (parsedShareUrl.protocol !== "https:" && parsedShareUrl.protocol !== "http:") throw new Error("Share URL is invalid.");
  if (shareUrl.length > 8192) throw new Error("Share URL is too long for PDF generation.");

  const document = await PDFDocument.create();
  document.setTitle(puzzle.request.title);
  document.setAuthor("I Love Word Search");
  document.setSubject("Printable word search puzzle");
  document.setCreator("I Love Word Search");
  document.setProducer("I Love Word Search PDF generator");
  const stableDate = new Date("2000-01-01T00:00:00.000Z");
  document.setCreationDate(stableDate);
  document.setModificationDate(stableDate);
  const fonts = {
    regular: await document.embedFont(StandardFonts.Helvetica),
    bold: await document.embedFont(StandardFonts.HelveticaBold)
  };

  for (const pageType of pdfPagePlan(options)) {
    await drawPuzzlePage(document, puzzle, options, pageType === "answer-key", fonts, shareUrl, qrDataUrl);
  }
  return document.save({ useObjectStreams: false });
}
