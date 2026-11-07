import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildStagedLargePrintPack } from "@/lib/content/staged-large-print-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";

const [id, destination] = process.argv.slice(2);
if (!id || !destination) throw new Error("Usage: npx tsx scripts/export-staged-large-print.ts <pack-id> <output-directory>");
const pack = buildStagedLargePrintPack(id);
const output = resolve(destination);
await mkdir(output, { recursive: true });
for (const paperSize of ["letter", "a4"] as const) {
  for (const pages of ["students", "answers"] as const) {
    const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", pages, layoutProfile: "large-print" });
    await writeFile(resolve(output, `${pack.id}-${paperSize}-${pages}-UNREVIEWED.pdf`), bytes);
  }
}
console.log(JSON.stringify({ pack: pack.id, puzzles: pack.puzzles.length, output, editorialApproval: false, publicationAuthorized: false }));
