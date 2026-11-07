// Offline review tooling only. Reuse the original packet and renderer unchanged.
import { substituteTeacherReview } from "@/content/staged/substitute-teacher-review";
import { teacherSubjectCandidates } from "@/content/staged/teacher-subjects";
import { collections } from "@/content/collections";
import { buildStagedTeacherPack } from "@/lib/content/staged-teacher-pack";

export function buildSubstituteTeacherReview() {
  const manifest = substituteTeacherReview;
  const collection = collections.find(({ slug }) => `/collections/${slug}` === manifest.existingDraftPath);
  if (!collection || collection.publicationStatus !== "draft") throw new Error("Substitute collection must remain an existing unpublished draft.");
  const pack = buildStagedTeacherPack(manifest.sourcePackId);
  const worksheets = manifest.worksheets.map((selection, index) => {
    const source = teacherSubjectCandidates.find(({ id }) => id === selection.sourceId);
    const entry = pack.puzzles[index];
    if (!source || !entry || entry.id !== source.id.toLowerCase()) throw new Error("Substitute selection does not match the original ordered teacher packet.");
    if (entry.puzzle.request.seed !== source.puzzle.seed || entry.puzzle.request.wordsText !== source.puzzle.words.join("\n")) throw new Error("Substitute worksheet differs from its exact source definition.");
    return { ...selection, title: source.title, proposedSourcePath: source.proposedPath, sourceFile: "content/staged/teacher-subjects.ts", sourceEditorialStatus: "unreviewed" as const, sourcePublicationStatus: "draft" as const, words: [...source.puzzle.words], seed: source.puzzle.seed, directions: [...source.puzzle.directions], worksheetId: entry.id };
  });
  if (pack.puzzles.length !== worksheets.length || new Set(worksheets.map(({ sourceId }) => sourceId)).size !== worksheets.length) throw new Error("Substitute packet requires five distinct source selections.");
  return {
    ...manifest, worksheets, pack,
    blockingReasons: ["All five source worksheets require human semantic and factual review.", "Audience suitability and reuse for this substitute folder are not approved.", "Collection scope/editorial and separate owner publication approval are missing."],
    runtimeActivation: false as const
  };
}
