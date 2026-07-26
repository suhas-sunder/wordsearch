import type { ContentRecord, ContentType, PuzzleContentRecord } from "@/content/model";
import { generatedPuzzleFingerprints, normalizeText, normalizeWords, puzzleInputFingerprint, wordListJaccard } from "@/lib/content/fingerprint";

export const NEAR_DUPLICATE_WORD_THRESHOLD = 0.8;

export interface ContentAuditIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  ids: string[];
}

export interface ContentAuditResult {
  counts: {
    totalRoutes: number;
    indexableRoutes: number;
    noindexRoutes: number;
    redirects: number;
    aliases: number;
    invalidRecords: number;
    exactDuplicateGroups: number;
    nearDuplicateWarnings: number;
    byContentType: Record<ContentType, { total: number; indexable: number; noindex: number }>;
  };
  errors: ContentAuditIssue[];
  warnings: ContentAuditIssue[];
}

function addDuplicateIssues<T extends ContentRecord>(records: T[], issues: ContentAuditIssue[], code: string, label: string, value: (record: T) => string | undefined) {
  const groups = new Map<string, T[]>();
  for (const record of records) {
    const key = value(record);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), record]);
  }
  for (const group of groups.values()) {
    if (group.length > 1) issues.push({ level: "error", code, message: `Duplicate ${label}: ${group.map((item) => item.canonicalPath).join(", ")}`, ids: group.map((item) => item.id) });
  }
}

function isFinishedIndexable(record: ContentRecord) {
  return record.publicationStatus === "published" && record.indexable;
}

export function auditContent(records: ContentRecord[]): ContentAuditResult {
  const errors: ContentAuditIssue[] = [];
  const warnings: ContentAuditIssue[] = [];
  const indexable = records.filter(isFinishedIndexable);
  const puzzles = indexable.filter((record): record is PuzzleContentRecord => record.contentType === "puzzle");

  addDuplicateIssues(records, errors, "duplicate-id", "content ID", (record) => record.id);
  addDuplicateIssues(records, errors, "duplicate-path", "canonical path", (record) => record.canonicalPath);
  addDuplicateIssues(indexable, errors, "duplicate-slug", "indexable slug within its content namespace", (record) => `${record.contentType}:${record.slug}`);
  addDuplicateIssues(indexable, errors, "duplicate-title", "title", (record) => normalizeText(record.title));
  addDuplicateIssues(indexable, errors, "duplicate-h1", "H1", (record) => normalizeText(record.h1));
  addDuplicateIssues(indexable, errors, "duplicate-meta-title", "meta title", (record) => normalizeText(record.metadata.title));
  addDuplicateIssues(indexable, errors, "duplicate-meta-description", "meta description", (record) => normalizeText(record.metadata.description));
  addDuplicateIssues(indexable, errors, "duplicate-introduction", "introduction", (record) => normalizeText(record.introduction));
  addDuplicateIssues(indexable, errors, "duplicate-description", "description", (record) => normalizeText(record.description));
  addDuplicateIssues(puzzles, errors, "duplicate-ordered-words", "ordered word list", (record) => normalizeWords(record.puzzle.words).join("\u001f"));
  addDuplicateIssues(puzzles, errors, "duplicate-word-set", "sorted word set", (record) => [...normalizeWords(record.puzzle.words)].sort().join("\u001f"));
  addDuplicateIssues(puzzles, errors, "duplicate-seed-settings", "seed and puzzle settings", (record) => JSON.stringify({ seed: record.puzzle.seed, rows: record.puzzle.rows, columns: record.puzzle.columns, directions: record.puzzle.directions, overlap: record.puzzle.allowOverlap, pack: record.puzzle.alphabetPack }));
  addDuplicateIssues(puzzles, errors, "duplicate-input-fingerprint", "puzzle input fingerprint", puzzleInputFingerprint);
  addDuplicateIssues(puzzles, errors, "duplicate-grid", "generated grid", (record) => generatedPuzzleFingerprints(record).grid);
  addDuplicateIssues(puzzles, errors, "duplicate-placements", "placement fingerprint", (record) => generatedPuzzleFingerprints(record).placements);
  addDuplicateIssues(puzzles, errors, "duplicate-puzzle", "complete puzzle fingerprint", (record) => generatedPuzzleFingerprints(record).complete);

  const ids = new Set(records.map((record) => record.id));
  const recordsById = new Map(records.map((record) => [record.id, record]));
  for (const record of records) {
    if (record.canonicalPath !== record.metadata.canonical) {
      errors.push({ level: "error", code: "canonical-mismatch", message: `${record.canonicalPath} does not match its metadata canonical ${record.metadata.canonical}.`, ids: [record.id] });
    }
    if (record.indexable !== !record.metadata.noindex || record.indexable !== record.metadata.includeInSitemap) {
      errors.push({ level: "error", code: "indexation-mismatch", message: `${record.canonicalPath} has inconsistent index, robots, or sitemap controls.`, ids: [record.id] });
    }
    if ((record.contentType === "utility" || record.canonicalPath.startsWith("/search")) && record.indexable) {
      errors.push({ level: "error", code: "utility-indexed", message: `${record.canonicalPath} is a utility route but is indexable.`, ids: [record.id] });
    }
    for (const relatedId of record.relatedContentIds ?? []) {
      if (!ids.has(relatedId)) errors.push({ level: "error", code: "broken-related-id", message: `${record.canonicalPath} references missing content ID ${relatedId}.`, ids: [record.id] });
    }
    if (record.contentType === "hub" || record.contentType === "collection") {
      for (const childId of record.childContentIds ?? []) {
        if (!ids.has(childId)) errors.push({ level: "error", code: "broken-child-id", message: `${record.canonicalPath} references missing child content ID ${childId}.`, ids: [record.id] });
        else if (record.indexable && !isFinishedIndexable(recordsById.get(childId)!)) errors.push({ level: "error", code: "unpublished-child", message: `${record.canonicalPath} exposes unfinished child content ID ${childId}.`, ids: [record.id, childId] });
      }
      if (record.id.startsWith("category-") && record.indexable && !(record.childContentIds?.length)) warnings.push({ level: "warning", code: "empty-category", message: `${record.canonicalPath} has no child puzzle records.`, ids: [record.id] });
    }
    if (!isFinishedIndexable(record)) continue;
    if (!record.h1.trim() || !record.introduction.trim() || !record.description.trim() || !record.metadata.title.trim() || !record.metadata.description.trim()) {
      errors.push({ level: "error", code: "missing-content", message: `${record.canonicalPath} is missing required finished-page copy or metadata.`, ids: [record.id] });
    }
    if (record.editorialStatus !== "reviewed") {
      errors.push({ level: "error", code: "unreviewed-indexable", message: `${record.canonicalPath} is indexable without reviewed editorial status.`, ids: [record.id] });
    }
    if (record.contentType === "puzzle") {
      if (!record.puzzle.seed.trim()) errors.push({ level: "error", code: "missing-seed", message: `${record.canonicalPath} is missing a stable seed.`, ids: [record.id] });
      if (!record.puzzle.words.length) errors.push({ level: "error", code: "empty-word-list", message: `${record.canonicalPath} has an empty word list.`, ids: [record.id] });
      if (!record.taxonomy.primaryCategory.trim()) errors.push({ level: "error", code: "missing-category", message: `${record.canonicalPath} has no primary category.`, ids: [record.id] });
      if (!(record.relatedContentIds?.length)) errors.push({ level: "error", code: "missing-related-links", message: `${record.canonicalPath} has no related content.`, ids: [record.id] });
      const usefulModules = [record.editorial.puzzleNote, record.editorial.difficultyExplanation, record.editorial.wordListContext, record.editorial.suggestedUses?.join(" ")].filter(Boolean);
      if (!usefulModules.length) errors.push({ level: "error", code: "thin-indexable-puzzle", message: `${record.canonicalPath} has only generic puzzle content.`, ids: [record.id] });
    }
  }

  for (let left = 0; left < puzzles.length; left += 1) {
    for (let right = left + 1; right < puzzles.length; right += 1) {
      const score = wordListJaccard(puzzles[left].puzzle.words, puzzles[right].puzzle.words);
      if (score >= NEAR_DUPLICATE_WORD_THRESHOLD && score < 1) warnings.push({ level: "warning", code: "high-word-overlap", message: `${puzzles[left].canonicalPath} and ${puzzles[right].canonicalPath} have ${(score * 100).toFixed(0)}% normalized Jaccard word overlap (review threshold: 80%).`, ids: [puzzles[left].id, puzzles[right].id] });
    }
  }

  const referenced = new Set(records.flatMap((record) => record.relatedContentIds ?? []));
  for (const puzzle of puzzles) {
    if (!referenced.has(puzzle.id)) warnings.push({ level: "warning", code: "orphan-puzzle", message: `${puzzle.canonicalPath} has no inbound related-content reference.`, ids: [puzzle.id] });
  }

  const exactDuplicateGroups = new Set(errors.filter((issue) => issue.code.startsWith("duplicate-")).map((issue) => `${issue.code}:${issue.ids.sort().join(",")}`)).size;
  const contentTypes: ContentType[] = ["puzzle", "hub", "collection", "guide", "tool", "trust", "utility"];
  const byContentType = Object.fromEntries(contentTypes.map((contentType) => {
    const matching = records.filter((record) => record.contentType === contentType);
    return [contentType, { total: matching.length, indexable: matching.filter((record) => record.indexable).length, noindex: matching.filter((record) => !record.indexable).length }];
  })) as Record<ContentType, { total: number; indexable: number; noindex: number }>;
  return {
    counts: {
      totalRoutes: records.length,
      indexableRoutes: indexable.length,
      noindexRoutes: records.filter((record) => !record.indexable).length,
      redirects: records.filter((record) => record.publicationStatus === "redirect").length,
      aliases: records.filter((record) => record.publicationStatus === "alias").length,
      invalidRecords: records.filter((record) => record.publicationStatus === "invalid").length,
      exactDuplicateGroups,
      nearDuplicateWarnings: warnings.filter((issue) => issue.code === "high-word-overlap").length,
      byContentType
    },
    errors,
    warnings
  };
}

export function formatAudit(result: ContentAuditResult) {
  const lines = [
    "I Love Word Search content audit",
    `Routes: ${result.counts.totalRoutes} total | ${result.counts.indexableRoutes} indexable | ${result.counts.noindexRoutes} noindex`,
    `Redirects: ${result.counts.redirects} | aliases: ${result.counts.aliases} | invalid: ${result.counts.invalidRecords}`,
    `Exact duplicate groups: ${result.counts.exactDuplicateGroups} | near-duplicate warnings: ${result.counts.nearDuplicateWarnings}`
  ];
  lines.push(`Types: ${Object.entries(result.counts.byContentType).map(([type, counts]) => `${type} ${counts.total} (${counts.indexable} indexable/${counts.noindex} noindex)`).join(" | ")}`);
  for (const issue of result.errors) lines.push(`ERROR [${issue.code}] ${issue.message}`);
  for (const issue of result.warnings) lines.push(`WARN  [${issue.code}] ${issue.message}`);
  lines.push(result.errors.length ? `FAILED with ${result.errors.length} error(s).` : `PASSED with ${result.warnings.length} warning(s).`);
  return lines.join("\n");
}
