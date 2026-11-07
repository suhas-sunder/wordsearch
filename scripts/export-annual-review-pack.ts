import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildAnnualReviewPack } from "@/lib/content/annual-review-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";

const [id, destination] = process.argv.slice(2);
if (!id || !destination) throw new Error("Usage: npx tsx scripts/export-annual-review-pack.ts <pack-id> <output-directory>");
const pack = buildAnnualReviewPack(id);
const output = resolve(destination);
await mkdir(output, { recursive: true });
for (const paperSize of ["letter", "a4"] as const) for (const pages of ["students", "answers"] as const) {
  const bytes = await createPuzzlePackPdf(pack, { paperSize, pages, order: "answers-last", layoutProfile: "pack" });
  await writeFile(resolve(output, `${pack.id}-${paperSize}-${pages}-UNREVIEWED.pdf`), bytes);
}
console.log(JSON.stringify({ pack: pack.id, puzzles: pack.puzzles.length, output, editorialApproval: false, publicationAuthorized: false }));
