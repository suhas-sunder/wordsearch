import type { ContentRecord } from "@/content/model";
import type { StagedPuzzleCandidate } from "@/content/staged/model";
import { normalizeText, normalizeWords, wordListJaccard } from "@/lib/content/fingerprint";

export interface CandidateIssue { code: string; ids: string[]; detail: string }

/** Check proposals against all registry records, including drafts and redirects. */
export function auditCandidates(candidates: StagedPuzzleCandidate[], records: ContentRecord[], additionalPaths: string[] = []): CandidateIssue[] {
  const issues: CandidateIssue[] = [];
  const seenIds = new Map(records.map((r) => [r.id, r.id]));
  const seenPaths = new Map([...records.map((r) => [r.canonicalPath.toLowerCase(), r.id] as const), ...additionalPaths.map((p) => [p.toLowerCase(), `redirect:${p}`] as const)]);
  const intents = new Map<string, string>();
  const puzzles = records.filter((r) => r.contentType === "puzzle").map((r) => ({ id: r.id, title: r.title, words: r.puzzle.words, seed: r.puzzle.seed }));
  for (const candidate of candidates) {
    const path = candidate.proposedPath.toLowerCase();
    const intent = normalizeText(candidate.intent);
    const add = (code: string, other: string, detail: string) => issues.push({ code, ids: [candidate.id, other], detail });
    if (seenIds.has(candidate.id)) add("duplicate-id", seenIds.get(candidate.id)!, candidate.id);
    if (seenPaths.has(path)) add("duplicate-path", seenPaths.get(path)!, path);
    if (!/^\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(candidate.proposedPath)) add("invalid-path", candidate.id, candidate.proposedPath);
    if (!intent) add("missing-intent", candidate.id, "Intent is required");
    if (intents.has(intent)) add("duplicate-intent", intents.get(intent)!, intent);
    for (const puzzle of puzzles) {
      if (normalizeText(candidate.title) === normalizeText(puzzle.title)) add("duplicate-title-intent", puzzle.id, candidate.title);
      if (candidate.puzzle.seed && candidate.puzzle.seed === puzzle.seed) add("duplicate-seed", puzzle.id, candidate.puzzle.seed);
      const left = [...normalizeWords(candidate.puzzle.words)].sort().join("\u001f");
      const right = [...normalizeWords(puzzle.words)].sort().join("\u001f");
      if (left && left === right) add("duplicate-words", puzzle.id, "Identical normalized word set");
      else if (wordListJaccard(candidate.puzzle.words, puzzle.words) >= 0.8) add("near-duplicate-words", puzzle.id, "At least 80% normalized word overlap; editorial review required");
    }
    seenIds.set(candidate.id, candidate.id); seenPaths.set(path, candidate.id); intents.set(intent, candidate.id);
    puzzles.push({ id: candidate.id, title: candidate.title, words: candidate.puzzle.words, seed: candidate.puzzle.seed });
  }
  return issues;
}
