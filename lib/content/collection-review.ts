// Node/editorial tooling only; no runtime route or publication mutation.
import { routeInventory } from "@/content/registry";
import { christmasCandidates } from "@/content/staged/christmas";
import { seasonalClassroomCandidates } from "@/content/staged/seasonal-classroom";
import { createHash } from "node:crypto";
import type { StagedCollectionReview } from "@/content/staged/christmas-collections";

const sourceCommit = "bd6f2d12098968c094cdd05eba122fe5b59b2c46";
const stagedSources = [
  { id: "X01", sourceFile: "content/staged/christmas.ts", hash: "1bb04e0497f6616c3ad41a4ea48080365ebb25048efb6d330affcb37a92142da" },
  { id: "X02", sourceFile: "content/staged/christmas.ts", hash: "8c0df348ae488fc326cca61d1e031e6137b3c20ae52cb35063d9aea1b9c56836" },
  { id: "X08-A", sourceFile: "content/staged/seasonal-classroom.ts", hash: "9a1008f683d74ecac1f434d75d2ac8c6ea5b5557eff4feaf8719599d20b6cdc7" }
] as const;
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function buildCollectionReview(asset: StagedCollectionReview) {
  const seen = new Set<string>();
  const children = asset.children.map((child) => {
    if (seen.has(child.canonicalPath)) throw new Error(`Duplicate collection child: ${child.canonicalPath}`);
    seen.add(child.canonicalPath);
    const published = child.source === "published" ? routeInventory.find((record) => record.canonicalPath === child.canonicalPath && record.contentType === "puzzle") : undefined;
    const source = stagedSources.find(({ id }) => id === child.id);
    const staged = child.source === "staged" && source ? [...christmasCandidates, ...seasonalClassroomCandidates].find((candidate) => candidate.id === child.id && candidate.proposedPath === child.canonicalPath) : undefined;
    if (!published && !staged) throw new Error(`Unresolved collection child: ${child.id}`);
    if (published && child.id !== `published:${published.canonicalPath.split("/").at(-1)}`) throw new Error("Published child ID does not match canonical source.");
    if (staged && hash(staged) !== source!.hash) throw new Error(`Collection source drift: ${child.id}`);
    if (published && (child.id !== "published:christmas-word-search" || published.contentType !== "puzzle" || hash(published.puzzle) !== "e82a11c488da8d0b724956f391d8571be820852c951ce233cd7674b4c15177e8")) throw new Error(`Unknown or changed published collection source: ${child.id}`);
    if (child.id === "X08-A" && child.role !== "optional-companion") throw new Error("X08-A must remain an optional companion, not an indexable child.");
    if (child.role === "optional-companion" && (child.newIndexableUrlAllowance !== 0 || child.standaloneIndexableIntentApproved !== false)) throw new Error("Optional companions require explicit zero-new-URL, unapproved standalone intent.");
    const puzzle = published?.contentType === "puzzle" ? published.puzzle : staged!.puzzle;
    const publishedAndReviewed = published?.publicationStatus === "published" && published.editorialStatus === "reviewed";
    return { ...child, role: child.role ?? "candidate-child", title: published?.title ?? staged!.title, sourceFile: published ? "content/curated-topics.ts" : source!.sourceFile, sourceCommit: published ? "471a118dd459f2181cd641ed0572ba6dd7005540" : sourceCommit, sourceSha256: published ? hash(puzzle) : source!.hash, existingPublicationStatus: published?.publicationStatus ?? "draft", existingEditorialStatus: published?.editorialStatus ?? "unreviewed", words: [...puzzle.words], seed: puzzle.seed, rows: puzzle.rows, columns: puzzle.columns, directions: [...puzzle.directions], difficulty: puzzle.difficulty,
      eligiblePublishedChild: child.role !== "optional-companion" && !!publishedAndReviewed && child.collectionFitApproved && child.audienceSuitabilityApproved && child.reuseApproved };
  });
  const approvedPublishedChildCount = children.filter(({ eligiblePublishedChild }) => eligiblePublishedChild).length;
  const proposedIndexableChildCount = children.filter(({ role }) => role !== "optional-companion").length;
  const optionalCompanionCount = children.length - proposedIndexableChildCount;
  const blockingReasons: string[] = [];
  if (approvedPublishedChildCount < asset.minimumApprovedPublishedChildren) blockingReasons.push(`Only ${approvedPublishedChildCount} independently approved published children; at least ${asset.minimumApprovedPublishedChildren} required.`);
  if (!asset.collectionEditorialApproved) blockingReasons.push("Collection editorial and scope approval is missing.");
  if (!asset.ownerPublicationApproved) blockingReasons.push("Separate owner publication approval is missing.");
  if (optionalCompanionCount) blockingReasons.push("Optional companions do not count toward the independently approved published-child minimum or justify a separate indexable URL.");
  for (const child of children) {
    if (child.existingPublicationStatus !== "published") blockingReasons.push(`${child.id}: source puzzle is unpublished.`);
    if (!child.collectionFitApproved || !child.audienceSuitabilityApproved || !child.reuseApproved) blockingReasons.push(`${child.id}: independent collection-fit, audience-suitability and/or reuse approval is missing.`);
  }
  return { ...asset, children, approvedPublishedChildCount, proposedIndexableChildCount, optionalCompanionCount, blockingReasons, publicationAuthorized: false as const, runtimeActivation: false as const };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;

export function collectionReviewHtml(report: ReturnType<typeof buildCollectionReview>) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(report.title)} — UNREVIEWED</title><style>body{font:16px/1.55 system-ui,sans-serif;max-width:72rem;margin:2rem auto;padding:0 1rem;color:#172033;background:white}article{border:1px solid #8592a4;padding:1rem;margin:1.5rem 0;break-inside:avoid}code{overflow-wrap:anywhere}h1,h2,h3{line-height:1.2}dt{font-weight:bold}dd{margin:0 0 .5rem}a{color:#115b3b}@media print{body{margin:0;max-width:none}article{break-inside:auto}}</style></head><body><main><p><strong>UNREVIEWED — source-only editorial artifact. Publication authorized: false. Runtime activation: false.</strong></p><h1>${escape(report.title)}</h1><p>${escape(report.introduction)}</p><p>Proposed canonical (not activated): <code>${escape(report.proposedPath)}</code></p><p>Proposed independent children: ${report.proposedIndexableChildCount}. Optional companions: ${report.optionalCompanionCount}. Approved published children: ${report.approvedPublishedChildCount}; at least ${report.minimumApprovedPublishedChildren} required.</p><h2>Publication blockers</h2>${list(report.blockingReasons)}<h2>Choose and review a worksheet</h2>${list(report.selectionGuidance)}<h2>Classroom and printing instructions</h2>${list(report.classroomInstructions)}<h2>Exact source selections</h2>${report.children.map((child) => `<article><h3>${escape(child.id)} — ${escape(child.title)}</h3><p><strong>${child.role === "optional-companion" ? "Optional companion — zero new URLs; not an independently indexable child" : "Proposed independent child — not approved for this collection"}</strong></p><p>${escape(child.selectionGuidance)}</p><dl><dt>Canonical source reference (not a local preview link)</dt><dd><code>${escape(child.canonicalPath)}</code></dd><dt>Source</dt><dd>${escape(child.sourceFile)}; commit <code>${escape(child.sourceCommit)}</code>; source hash <code>${escape(child.sourceSha256)}</code>; ${escape(child.existingPublicationStatus)} / ${escape(child.existingEditorialStatus)}</dd><dt>Frozen configuration</dt><dd>${child.rows}×${child.columns}; ${escape(child.difficulty)}; directions ${escape(child.directions.join(", "))}; seed <code>${escape(child.seed)}</code></dd><dt>Independent collection fit / audience suitability / reuse</dt><dd>${child.collectionFitApproved} / ${child.audienceSuitabilityApproved} / ${child.reuseApproved}</dd></dl><h4>Complete word bank</h4>${list(child.words)}<h4>Review questions</h4>${list(child.reviewQuestions)}</article>`).join("")}<h2>Excluded rather than padded</h2>${list(report.excludedSelections.map(({ id, reason }) => `${id}: ${reason}`))}<p>This review file contains no puzzle renderer, scripts, external assets or approval action. Use the source candidate's separately measured PDF/answer evidence for output review; this HTML is not a classroom packet.</p></main></body></html>`;
}
