import type { PuzzleResult } from "@/lib/puzzle/types";
import { printedLatinText, type PrintedLetterCase } from "@/lib/puzzle/display-case";

export function gridExportFilename(title: string, extension: "svg" | "png" | "txt") {
  const stem = title.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80).replace(/-$/, "");
  return `${stem || "word-search"}-grid.${extension}`;
}

/** Tabs retain cell boundaries for Morse, Braille and other multi-character tokens. */
export function puzzleGridText(puzzle: Pick<PuzzleResult, "grid">, display?: { alphabetPack?: PuzzleResult["request"]["alphabetPack"]; letterCase?: PrintedLetterCase }) {
  return puzzle.grid.map((row) => row.map((token) => printedLatinText(token, display?.alphabetPack, display?.letterCase)).join("\t")).join("\n") + "\n";
}

/** Standalone SVG must not depend on the surrounding website's CSS or web fonts. */
export function standaloneGridSvg(source: SVGSVGElement) {
  const clone = source.cloneNode(true) as SVGSVGElement;
  const box = source.viewBox.baseVal;
  if (!box.width || !box.height || !source.querySelector(".puzzle-token")) throw new Error("The grid is not ready. Wait for a valid preview.");
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(box.width));
  clone.setAttribute("height", String(box.height));
  const cellWidth = Number(clone.querySelector("g rect")?.getAttribute("width"));
  const context = document.createElement("canvas").getContext("2d");
  if (!context || !cellWidth) throw new Error("The image font could not be checked. Use Grid text or PDF instead.");
  const measured = new Map<string, number>();
  clone.querySelectorAll("text").forEach((text) => {
    text.setAttribute("font-family", "Arial, Helvetica, sans-serif");
    text.setAttribute("font-weight", text.classList.contains("puzzle-token") ? "700" : "400");
    text.setAttribute("fill", text.classList.contains("puzzle-token") ? "#111827" : "#475569");
    if (text.classList.contains("grid-coordinate")) text.setAttribute("font-size", "12");
    if (text.classList.contains("puzzle-token")) {
      const size = Number(text.getAttribute("font-size"));
      const token = text.textContent ?? "";
      const key = `${size}:${token}`;
      let width = measured.get(key);
      if (width === undefined) {
        context.font = `700 ${size}px Arial, Helvetica, sans-serif`;
        const metrics = context.measureText(token);
        width = Math.max(metrics.width, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight);
        measured.set(key, width);
      }
      if (!Number.isFinite(size) || width > cellWidth - 2) throw new Error("Some multi-character symbols are wider than their grid cells in this image format. Use Grid text or choose the Latin alphabet.");
    }
  });
  return { markup: new XMLSerializer().serializeToString(clone), width: box.width, height: box.height };
}

export function downloadGridBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  try { document.body.appendChild(link); link.click(); }
  finally { link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
}

export async function pngGridBlob(source: SVGSVGElement): Promise<Blob> {
  const { markup, width, height } = standaloneGridSvg(source);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("The PNG could not be created. Try SVG or PDF instead."));
      image.src = url;
    });
    // At most3200 pixels on either edge, avoiding unbounded bitmap allocation.
    const scale = Math.min(2, 3200 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale); canvas.height = Math.ceil(height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("PNG export is unavailable in this browser. Try SVG or PDF instead.");
    context.fillStyle = "white"; context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG export failed. Try SVG or PDF instead.")), "image/png"));
  } finally { URL.revokeObjectURL(url); }
}
