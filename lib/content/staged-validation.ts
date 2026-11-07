import { createHash } from "node:crypto";
import { getAlphabetPack } from "@/lib/alphabet-packs";
import { categories } from "@/content/categories";
import type { StagedPuzzleCandidate } from "@/content/staged/model";
import { stagedCandidateSchema } from "@/content/staged/schema";
import { routeInventory, getSitemapRecords } from "@/content/registry";
import { searchCatalog } from "@/lib/search/catalog";
import { auditCandidates } from "@/lib/content/candidates";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { parseWordInput } from "@/lib/puzzle/parse";
import { validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import type { PuzzleResult } from "@/lib/puzzle/types";

export interface ValidationIssue { stage: "schema" | "collision" | "placement" | "exposure" | "pdf"; code: string; id?: string; detail: string }
export interface Freeze { id: string; path: string; requestSha256: string; gridSha256: string; answerSha256: string; rows: number; columns: number; result: PuzzleResult }
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function validateStaged(input: unknown, redirectPaths: string[] = []): { issues: ValidationIssue[]; freezes: Freeze[]; candidates: StagedPuzzleCandidate[] } {
  const issues: ValidationIssue[] = [];
  const freezes: Freeze[] = [];
  const candidates: StagedPuzzleCandidate[] = [];
  if (!Array.isArray(input) || input.length < 1 || input.length > 20) return { issues: [{ stage: "schema", code: "candidate-array", detail: "Expected an array of 1 to 20 candidates." }], freezes, candidates };
  for (const [index, item] of input.entries()) {
    const parsed = stagedCandidateSchema.safeParse(item);
    if (!parsed.success) { for (const error of parsed.error.issues) issues.push({ stage: "schema", code: error.code, detail: `item ${index} ${error.path.join(".")}: ${error.message}` }); continue; }
    candidates.push(parsed.data);
  }
  for (const issue of auditCandidates(candidates, routeInventory, redirectPaths)) issues.push({ stage: "collision", code: issue.code, id: issue.ids[0], detail: `${issue.detail} (${issue.ids.join(", ")})` });
  const priorPuzzles = routeInventory.filter((record) => record.contentType === "puzzle").map((record) => ({ id: record.id, words: record.puzzle.words, pack: record.puzzle.alphabetPack }));
  const tokenSet = (words: string[], pack: StagedPuzzleCandidate["puzzle"]["alphabetPack"]) => new Set(words.map((word) => getAlphabetPack(pack).tokenize(word).join("\u001f")).filter(Boolean));
  for (const candidate of candidates) {
    const left = tokenSet(candidate.puzzle.words, candidate.puzzle.alphabetPack);
    for (const other of priorPuzzles) {
      const right = tokenSet(other.words, other.pack);
      const intersection = [...left].filter((tokens) => right.has(tokens)).length;
      const union = new Set([...left, ...right]).size;
      if (union && intersection / union >= 0.8) issues.push({ stage: "collision", code: intersection === union ? "duplicate-token-sets" : "near-duplicate-token-sets", id: candidate.id, detail: `Normalized token overlap with ${other.id}: ${intersection}/${union}; editorial review required.` });
    }
    priorPuzzles.push({ id: candidate.id, words: candidate.puzzle.words, pack: candidate.puzzle.alphabetPack });
    const add = (stage: ValidationIssue["stage"], code: string, detail: string) => issues.push({ stage, code, id: candidate.id, detail });
    const match = candidate.proposedPath.match(/^\/word-searches\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-z0-9]+(?:-[a-z0-9]+)*)$/);
    const category = categories.find((c) => c.slug === candidate.taxonomy.primaryCategory);
    if (!match) add("schema", "puzzle-path", "Expected /word-searches/<category>/<slug> with no wildcard or parameter.");
    else if (!category || category.pathSegment !== match[1] || category.publicationStatus !== "published") add("schema", "category-path", "Path category must match a published primary category slug; editorial intent still requires human review.");
    if ((candidate.puzzle.rows === undefined) !== (candidate.puzzle.columns === undefined)) add("schema", "dimensions", "Rows and columns must both be set or both omitted.");
    if (new Set(candidate.puzzle.directions).size !== candidate.puzzle.directions.length) add("schema", "directions", "Directions cannot repeat.");
    if (candidate.puzzle.difficulty === "easy" && candidate.puzzle.directions.some((d) => !["E", "S", "SE"].includes(d))) add("schema", "easy-directions", "Easy candidates must use forward directions only.");
    if (candidate.puzzle.difficulty === "hard" && candidate.puzzle.directions.length !== 8) add("schema", "hard-directions", "Hard candidates require all eight directions; difficulty still needs human review.");
    if (routeInventory.some((r) => r.canonicalPath === candidate.proposedPath) || getSitemapRecords().some((r) => r.canonicalPath === candidate.proposedPath) || searchCatalog.some((r) => r.href === candidate.proposedPath)) add("exposure", "public-source", "Candidate path is already present in registry, sitemap or search catalog.");
    const p = candidate.puzzle;
    if (candidate.title !== p.puzzleTitle) add("schema", "title-mismatch", "Candidate and puzzle titles must match to freeze the generated request.");
    const parsed = parseWordInput(p.words.join("\n"), p.alphabetPack);
    if (p.words.some((w) => /[,\n\r\t|]/.test(w))) add("placement", "word-delimiter", "Each intended word must be one plain entry, without input delimiters or clues.");
    if (parsed.words.length !== p.words.length || parsed.warnings.length) add("placement", "unsupported-word", `Parser did not accept all intended words: ${parsed.warnings.join("; ")}`);
    if (parsed.words.some((w) => w.duplicateOf) || new Set(parsed.words.map((w) => w.tokens.join("\u001f"))).size !== parsed.words.length) add("placement", "normalized-duplicate", "Words collide after generator normalization or tokenization.");
    if (p.alphabetPack !== "latin" || p.words.some((w) => !/^[A-Za-z0-9\s-]+$/.test(w))) add("placement", "unsupported-characters", "This validator currently supports plain Latin letters, numbers, spaces and hyphens only; other content requires specialized review.");
    try {
      const result = generatePuzzle({ title: p.puzzleTitle, wordsText: p.words.join("\n"), seed: p.seed, rows: p.rows, cols: p.columns, autoSize: p.rows === undefined && p.columns === undefined, directions: p.directions, allowOverlap: p.allowOverlap, alphabetPack: p.alphabetPack, difficulty: p.difficulty });
      if (result.excluded.length || result.placed.length !== p.words.length) add("placement", "excluded-word", `${result.placed.length}/${p.words.length} intended words placed; ${result.excluded.map((e) => e.word.label).join(", ")}`);
      if (!validatePuzzleForPdf(result)) add("placement", "answer-integrity", "Placement cells do not match generated grid.");
      freezes.push({ id: candidate.id, path: candidate.proposedPath, requestSha256: hash(result.request), gridSha256: hash(result.grid), answerSha256: hash(result.placed.map(({ wordId, direction, cells }) => ({ wordId, direction, cells }))), rows: result.rows, columns: result.cols, result });
    } catch (error) { add("placement", "generation-failed", error instanceof Error ? error.message : String(error)); }
  }
  return { issues, freezes, candidates };
}
