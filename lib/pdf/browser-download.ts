import type { PuzzleResult } from "@/lib/puzzle/types";
import { sanitizePuzzleFilename, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";

export type BrowserPdfLayout = "legacy" | "large-print";

/** Explicit measured export; never persists over the user's ordinary output choices. */
export function measuredLargePrintOptions(options: PuzzleOutputOptions): PuzzleOutputOptions {
  return { ...options, orientation: "portrait", printScale: "large", wordBankPlacement: "below", qrCode: false, coordinates: false };
}

export async function createBrowserPuzzlePdf(
  puzzle: PuzzleResult,
  options: PuzzleOutputOptions,
  shareUrl: string,
  layoutProfile: BrowserPdfLayout = "legacy"
) {
  const exportOptions = layoutProfile === "large-print" ? measuredLargePrintOptions(options) : options;
  const [{ createPuzzlePdf }, QRCode] = await Promise.all([
    import("@/lib/pdf/create-puzzle-pdf"),
    exportOptions.qrCode ? import("qrcode") : Promise.resolve(null)
  ]);
  const qrDataUrl = QRCode
    ? await QRCode.toDataURL(shareUrl, { margin: 4, width: 256, errorCorrectionLevel: "M" })
    : undefined;
  const bytes = await createPuzzlePdf({ puzzle, options: exportOptions, shareUrl, qrDataUrl, layoutProfile });
  if (!bytes.length) throw new Error("PDF generation returned an empty file.");
  return {
    blob: new Blob([bytes.slice().buffer], { type: "application/pdf" }),
    filename: sanitizePuzzleFilename(puzzle.request.title).replace(/\.pdf$/, layoutProfile === "large-print" ? "-large-print.pdf" : ".pdf")
  };
}

export async function downloadBrowserPuzzlePdf(
  puzzle: PuzzleResult,
  options: PuzzleOutputOptions,
  shareUrl: string,
  layoutProfile: BrowserPdfLayout = "legacy",
  isCurrent: () => boolean = () => true
) {
  const { blob, filename } = await createBrowserPuzzlePdf(puzzle, options, shareUrl, layoutProfile);
  if (!isCurrent()) return false;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  try { document.body.appendChild(anchor); anchor.click(); }
  finally { anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1_000); }
  return true;
}
