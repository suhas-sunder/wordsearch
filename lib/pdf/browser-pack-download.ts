import type { PuzzlePack, PuzzlePackOptions } from "@/lib/pdf/create-puzzle-pack-pdf";
import { sanitizePuzzleFilename } from "@/lib/puzzle/output-options";

export async function createBrowserPuzzlePackPdf(pack: PuzzlePack, options: PuzzlePackOptions) {
  const { createPuzzlePackPdf } = await import("@/lib/pdf/create-puzzle-pack-pdf");
  const bytes = await createPuzzlePackPdf(pack, options);
  const suffix = options.pages === "students" ? "student-worksheets" : options.pages === "answers" ? "teacher-answers" : "word-search-pack";
  return { blob: new Blob([bytes.slice().buffer], { type: "application/pdf" }), filename: sanitizePuzzleFilename(pack.name).replace(/-word-search\.pdf$/, `-${suffix}.pdf`) };
}

export async function downloadBrowserPuzzlePackPdf(pack: PuzzlePack, options: PuzzlePackOptions, isCurrent: () => boolean = () => true) {
  const { blob, filename } = await createBrowserPuzzlePackPdf(pack, options);
  if (!isCurrent()) return false;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  try { document.body.appendChild(anchor); anchor.click(); }
  finally { anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1_000); }
  return true;
}
