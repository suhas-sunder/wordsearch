import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildStagedEvergreenPack } from "@/lib/content/staged-evergreen-pack";
import { createPuzzlePackPdf } from "@/lib/pdf/create-puzzle-pack-pdf";

const [id, destination] = process.argv.slice(2);
if (!id || !destination) throw new Error("Usage: npx tsx scripts/export-staged-evergreen-pack.ts <pack-id> <output-directory>");
const pack = buildStagedEvergreenPack(id);
const output = resolve(destination);
await mkdir(output, { recursive: true });
for (const paperSize of ["letter", "a4"] as const) {
  const bytes = await createPuzzlePackPdf(pack, { paperSize, order: "answers-last", layoutProfile: "pack" });
  await writeFile(resolve(output, `${pack.id}-${paperSize}-UNREVIEWED.pdf`), bytes);
}
console.log(JSON.stringify({ pack: pack.id, puzzles: pack.puzzles.length, output, editorialApproval: false, publicationAuthorized: false }));
