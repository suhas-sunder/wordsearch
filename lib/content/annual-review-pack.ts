// Editorial/Node tooling only. No route or client component imports this module.
import type { PuzzleDefinition } from "@/content/model";
import { routeInventory } from "@/content/registry";
import { annualReviewPacks } from "@/content/staged/annual-review-packs";
import { christmasCandidates } from "@/content/staged/christmas";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { winterSeasonalCandidates } from "@/content/staged/winter-seasonal";
import { teacherSubjectCandidates } from "@/content/staged/teacher-subjects";
import { generatePuzzle } from "@/lib/puzzle/generate";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

const candidates = [...christmasCandidates, ...seasonalClassroomCandidates, ...winterSeasonalCandidates, ...teacherSubjectCandidates];

function resolve(id: string): PuzzleDefinition {
  if (id.startsWith("public:")) {
    const record = routeInventory.find((record) => record.canonicalPath === `/word-searches/${id.slice(7)}`);
    if (!record || record.contentType !== "puzzle" || record.publicationStatus !== "published" || !record.indexable) throw new Error(`Unknown published child: ${id}`);
    return record.puzzle;
  }
  const candidate = candidates.find((candidate) => candidate.id === id);
  if (!candidate) throw new Error(`Unknown source-only child: ${id}`);
  return candidate.puzzle;
}

export function buildAnnualReviewPack(id: string): PuzzlePack {
  const manifest = annualReviewPacks.find((manifest) => manifest.id === id);
  if (!manifest) throw new Error("Unknown annual review pack.");
  return { id, name: manifest.name, puzzles: manifest.children.map((id) => {
    const definition = resolve(id);
    const puzzle = generatePuzzle({ title: definition.puzzleTitle, wordsText: definition.words.join("\n"), seed: definition.seed, difficulty: definition.difficulty, alphabetPack: definition.alphabetPack, directions: definition.directions, allowOverlap: definition.allowOverlap, rows: definition.rows, cols: definition.columns, autoSize: definition.rows === undefined && definition.columns === undefined, fillerMode: "alphabet" });
    if (puzzle.excluded.length || puzzle.placed.length !== definition.words.length || puzzle.warnings.length) throw new Error(`Child ${id} cannot export every intended word unchanged.`);
    return { id: id.toLowerCase().replace(/[/:]/g, "-"), puzzle };
  }) };
}
