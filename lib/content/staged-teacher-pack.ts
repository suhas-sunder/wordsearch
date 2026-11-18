// Editorial tooling only; no public route imports this source inventory.
import { teacherSubjectCandidates } from "@/content/staged/teacher-subjects";
import { validateStaged } from "@/lib/content/staged-validation";
import type { PuzzlePack } from "@/lib/pdf/create-puzzle-pack-pdf";

export const teacherDraftPackIds = ["teacher-subjects-10", "language-and-activities-5", "math-science-history-5"] as const;

export function buildStagedTeacherPack(id: string): PuzzlePack {
  if (!teacherDraftPackIds.includes(id as (typeof teacherDraftPackIds)[number])) throw new Error("Unknown source-only teacher pack.");
  const validation = validateStaged(teacherSubjectCandidates);
  if (validation.issues.length) throw new Error(`Teacher drafts failed validation: ${validation.issues.map(({ code }) => code).join(", ")}`);
  const language = new Set(["T06-A", "T07-A", "T11-A", "T11-B", "T11-C"]);
  const selected = validation.freezes.filter((freeze) => id === "teacher-subjects-10" || (id === "language-and-activities-5" ? language.has(freeze.id) : !language.has(freeze.id)));
  return { id, name: id === "teacher-subjects-10" ? "Teacher Subjects" : id === "language-and-activities-5" ? "Language and Activities" : "Math Science History", puzzles: selected.map(({ id, result }) => ({ id: id.toLowerCase(), puzzle: result })) };
}
