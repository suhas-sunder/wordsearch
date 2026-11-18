import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateCalendarReviewAsset } from "@/lib/content/calendar-review-assets";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";

const [id, destination] = process.argv.slice(2);
if (!id || !destination) throw new Error("Usage: npx tsx scripts/export-calendar-review-asset.ts <asset-id> <output-directory>");
const puzzle = generateCalendarReviewAsset(id);
const output = resolve(destination);
await mkdir(output, { recursive: true });
for (const paperSize of ["letter", "a4"] as const) {
  const bytes = await createPuzzlePdf({ puzzle, options: { ...defaultPuzzleOutputOptions, paperSize, includeAnswerKey: true, qrCode: false, inkSaving: true }, shareUrl: "https://www.ilovewordsearch.com/", layoutProfile: "pack" });
  await writeFile(resolve(output, `${id.toLowerCase()}-${paperSize}-UNREVIEWED.pdf`), bytes);
}
console.log(JSON.stringify({ asset: id, words: puzzle.placed.length, output, editorialApproval: false, publicationAuthorized: false }));
