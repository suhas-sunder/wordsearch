// Editorial tooling only: importing this into the public app would expose drafts.
import { evergreenHardBatch } from "@/content/staged/evergreen-hard-batch";
import { validateStaged } from "@/lib/content/staged-validation";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

export const evergreenDraftPackIds = ["hard-variety-10", "science-systems-5", "ideas-and-design-5"] as const;

export function buildStagedEvergreenPack(id: string): PuzzlePack {
  if (!evergreenDraftPackIds.includes(id as (typeof evergreenDraftPackIds)[number])) throw new Error("Unknown source-only evergreen pack.");
  const validation = validateStaged(evergreenHardBatch);
  if (validation.issues.length) throw new Error(`Evergreen drafts failed validation: ${validation.issues.map(({ code }) => code).join(", ")}`);
  const science = new Set(["H01-P", "H03-O", "H05-M", "H07-A", "H05-R"]);
  const selected = validation.freezes.filter((freeze) => id === "hard-variety-10" || (id === "science-systems-5" ? science.has(freeze.id) : !science.has(freeze.id)));
  return { id, name: id === "hard-variety-10" ? "Hard Variety" : id === "science-systems-5" ? "Science Systems" : "Ideas and Design", puzzles: selected.map(({ id, result }) => ({ id: id.toLowerCase(), puzzle: result })) };
}
