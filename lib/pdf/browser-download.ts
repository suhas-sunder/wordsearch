import type { PuzzleResult } from "@/lib/puzzle/types";
import { sanitizePuzzleFilename, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";

export type BrowserPdfLayout = "legacy" | "readable" | "large-print";

/** Opt-in measured standard layout; ordinary output preferences remain intact. */
export function readablePdfOptions(options: PuzzleOutputOptions): PuzzleOutputOptions {
  return { ...options, orientation: "portrait", printScale: "standard", wordBankPlacement: "below", qrCode: false, coordinates: false };
}

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
  const exportOptions = layoutProfile === "large-print" ? measuredLargePrintOptions(options) : layoutProfile === "readable" ? readablePdfOptions(options) : options;
  if (layoutProfile === "readable" && puzzle.grid.some(row => row.some(token => token.length !== 1))) {
    throw new Error("Readable PDF needs one character per grid cell. Try the ordinary PDF or browser print for this alphabet.");
  }
  const [{ createPuzzlePdf }, QRCode] = await Promise.all([
    import("@/lib/pdf/create-puzzle-pdf"),
    exportOptions.qrCode ? import("qrcode") : Promise.resolve(null)
  ]);
  const qrDataUrl = QRCode
    ? await QRCode.toDataURL(shareUrl, { margin: 4, width: 256, errorCorrectionLevel: "M" })
    : undefined;
  const bytes = await createPuzzlePdf({ puzzle, options: exportOptions, shareUrl, qrDataUrl, layoutProfile: layoutProfile === "readable" ? "pack" : layoutProfile });
  if (!bytes.length) throw new Error("PDF generation returned an empty file.");
  return {
    blob: new Blob([bytes.slice().buffer], { type: "application/pdf" }),
    filename: sanitizePuzzleFilename(puzzle.request.title).replace(/\.pdf$/, layoutProfile === "large-print" ? "-large-print.pdf" : layoutProfile === "readable" ? "-readable.pdf" : ".pdf")
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
