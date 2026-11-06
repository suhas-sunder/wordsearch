import type { PuzzlePack, PuzzlePackOptions } from "@/lib/pdf/create-puzzle-pack-pdf";
import { sanitizePuzzleFilename } from "@/lib/puzzle/output-options";

export async function createBrowserPuzzlePackPdf(pack: PuzzlePack, options: PuzzlePackOptions) {
  const { createPuzzlePackPdf } = await import("@/lib/pdf/create-puzzle-pack-pdf");
  const bytes = await createPuzzlePackPdf(pack, options);
  return { blob: new Blob([bytes.slice().buffer], { type: "application/pdf" }), filename: sanitizePuzzleFilename(pack.name).replace(/-word-search\.pdf$/, "-word-search-pack.pdf") };
}

export async function downloadBrowserPuzzlePackPdf(pack: PuzzlePack, options: PuzzlePackOptions) {
  const { blob, filename } = await createBrowserPuzzlePackPdf(pack, options);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
