// Node/editorial tooling only. Never import this module into a public page.
import { routeInventory } from "@/content/registry";
import { christmasCandidates } from "@/content/staged/christmas";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { seasonalDraftPacks } from "@/content/staged/seasonal-packs";
import { generatePuzzle } from "@/lib/puzzle/generate";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";
import type { PuzzleDefinition } from "@/content/model";

function resolve(id: string): PuzzleDefinition {
  if (id.startsWith("published:")) {
    const path = `/word-searches/holidays/${id.slice(10)}`;
    const record = routeInventory.find((record) => record.canonicalPath === path && record.publicationStatus === "published");
    if (!record || record.contentType !== "puzzle") throw new Error(`Unknown published puzzle: ${id}`);
    return record.puzzle;
  }
  const candidate = [...christmasCandidates, ...seasonalClassroomCandidates].find((candidate) => candidate.id === id);
  if (!candidate) throw new Error(`Unknown candidate: ${id}`);
  return candidate.puzzle;
}

/** Resolve named, frozen children without registering new routes or approval. */
export function buildStagedSeasonalPack(id: string): PuzzlePack {
  const manifest = seasonalDraftPacks.find((manifest) => manifest.id === id);
  if (!manifest) throw new Error("Unknown source-only seasonal pack.");
  return {
    id: manifest.id, name: manifest.name,
    puzzles: manifest.children.map((id) => {
      const puzzle = resolve(id);
      return {
        id: id.toLowerCase().replaceAll(":", "-").replaceAll("_", "-"),
        puzzle: generatePuzzle({ title: puzzle.puzzleTitle, wordsText: puzzle.words.join("\n"), seed: puzzle.seed, difficulty: puzzle.difficulty, alphabetPack: puzzle.alphabetPack, rows: puzzle.rows, cols: puzzle.columns, autoSize: puzzle.rows === undefined && puzzle.columns === undefined, directions: puzzle.directions, allowOverlap: puzzle.allowOverlap, fillerMode: "alphabet" })
      };
    })
  };
}
