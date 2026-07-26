import type { PuzzleResult } from "@/lib/puzzle/types";
import { sanitizePuzzleFilename, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";

export async function createBrowserPuzzlePdf(
  puzzle: PuzzleResult,
  options: PuzzleOutputOptions,
  shareUrl: string
) {
  const [{ createPuzzlePdf }, QRCode] = await Promise.all([
    import("@/lib/pdf/create-puzzle-pdf"),
    options.qrCode ? import("qrcode") : Promise.resolve(null)
  ]);
  const qrDataUrl = QRCode
    ? await QRCode.toDataURL(shareUrl, { margin: 4, width: 256, errorCorrectionLevel: "M" })
    : undefined;
  const bytes = await createPuzzlePdf({ puzzle, options, shareUrl, qrDataUrl });
  if (!bytes.length) throw new Error("PDF generation returned an empty file.");
  return {
    blob: new Blob([bytes.slice().buffer], { type: "application/pdf" }),
    filename: sanitizePuzzleFilename(puzzle.request.title)
  };
}

export async function downloadBrowserPuzzlePdf(
  puzzle: PuzzleResult,
  options: PuzzleOutputOptions,
  shareUrl: string
) {
  const { blob, filename } = await createBrowserPuzzlePdf(puzzle, options, shareUrl);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
