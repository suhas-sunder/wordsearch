/** Result images intentionally accept no puzzle title, words, seed, URL or user name. */
export interface CompletionStats {
  wordsFound: number;
  rows: number;
  cols: number;
  elapsedMs: number | null;
}

export function elapsedLabel(milliseconds: number | null): string {
  if (milliseconds === null) return "Time not measured";
  if (!Number.isFinite(milliseconds) || milliseconds < 0 || milliseconds > Number.MAX_SAFE_INTEGER) throw new Error("Invalid elapsed time.");
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export function completionCardSvg(stats: CompletionStats): string {
  for (const value of [stats.rows, stats.cols]) if (!Number.isInteger(value) || value < 6 || value > 40) throw new Error("Invalid result grid size.");
  if (!Number.isInteger(stats.wordsFound) || stats.wordsFound < 1 || stats.wordsFound > 200) throw new Error("Invalid found-word count.");
  const elapsed = elapsedLabel(stats.elapsedMs);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">Word search complete</title><desc id="description">${stats.wordsFound} placed words found in a ${stats.rows} by ${stats.cols} grid. Elapsed: ${elapsed}. No puzzle content or link included.</desc>
  <rect width="1200" height="630" fill="#f3faf6"/><rect x="40" y="40" width="1120" height="550" rx="28" fill="#ffffff" stroke="#187b50" stroke-width="3"/>
  <g font-family="Arial, sans-serif" fill="#152237"><text x="90" y="125" font-size="30" fill="#187b50">I Love Word Search</text>
  <text x="90" y="215" font-size="64" font-weight="700">Puzzle complete</text>
  <text x="90" y="305" font-size="42">${stats.wordsFound} placed words found</text>
  <text x="90" y="375" font-size="36">${stats.rows} × ${stats.cols} grid</text>
  <text x="90" y="445" font-size="36">Elapsed: ${elapsed}</text>
  <text x="90" y="535" font-size="24" fill="#43546a">A little puzzle break, completed.</text></g></svg>`;
}

export async function completionCardPng(stats: CompletionStats): Promise<Blob> {
  const source = new Blob([completionCardSvg(stats)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(source);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 630;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Result image could not be created.");
    context.drawImage(image, 0, 0);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Result image could not be created.")), "image/png"));
  } finally { URL.revokeObjectURL(url); }
}
