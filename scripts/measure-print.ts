import { routeInventory } from "@/content/registry";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { generatedPuzzleFingerprints } from "@/lib/content/fingerprint";
import { measurePuzzlePdf } from "@/lib/pdf/measure-pdf";

const ids = process.argv.slice(2).length ? process.argv.slice(2) : ["puzzle-holidays-christmas-word-search", "puzzle-science-biology-word-search", "puzzle-geography-world-capitals-word-search", "puzzle-books-and-reading-nonfiction-text-features-word-search"];
if (ids.length > 10) throw new Error("Provide at most 10 published puzzle IDs.");
const reports = [];
for (const id of ids) {
  const record = routeInventory.find((item) => item.id === id && item.contentType === "puzzle" && item.publicationStatus === "published");
  if (!record || record.contentType !== "puzzle") throw new Error(`Unknown published puzzle: ${id}`);
  const p = record.puzzle;
  const puzzle = generatePuzzle({ title: p.puzzleTitle, wordsText: p.words.join("\n"), seed: p.seed, rows: p.rows, cols: p.columns, autoSize: !p.rows || !p.columns, directions: p.directions, allowOverlap: p.allowOverlap, alphabetPack: p.alphabetPack, difficulty: p.difficulty });
  const measurements = [];
  for (const paperSize of ["letter", "a4"] as const) for (const printScale of ["standard", "large"] as const) measurements.push(await measurePuzzlePdf(puzzle, { ...defaultPuzzleOutputOptions, paperSize, printScale, qrCode: false, includeAnswerKey: true }));
  reports.push({ id, path: record.canonicalPath, fingerprints: generatedPuzzleFingerprints(record), measurements });
}
console.log(JSON.stringify({ unit: "PDF points at 100% (72 points per inch)", scope: "portrait, one puzzle per page, word bank below, QR disabled", reports }, null, 2));
