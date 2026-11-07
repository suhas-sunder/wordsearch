// Node/editorial tooling only; no runtime route or publication mutation.
import { routeInventory } from "@/content/registry";
import { christmasCandidates } from "@/content/staged/christmas";
import type { StagedCollectionReview } from "@/content/staged/christmas-collections";

export function buildCollectionReview(asset: StagedCollectionReview) {
  const seen = new Set<string>();
  const children = asset.children.map((child) => {
    if (seen.has(child.canonicalPath)) throw new Error(`Duplicate collection child: ${child.canonicalPath}`);
    seen.add(child.canonicalPath);
    const published = child.source === "published" ? routeInventory.find((record) => record.canonicalPath === child.canonicalPath && record.contentType === "puzzle") : undefined;
    const staged = child.source === "staged" ? christmasCandidates.find((candidate) => candidate.id === child.id && candidate.proposedPath === child.canonicalPath) : undefined;
    if (!published && !staged) throw new Error(`Unresolved collection child: ${child.id}`);
    if (published && child.id !== `published:${published.canonicalPath.split("/").at(-1)}`) throw new Error("Published child ID does not match canonical source.");
    const puzzle = published?.contentType === "puzzle" ? published.puzzle : staged!.puzzle;
    const publishedAndReviewed = published?.publicationStatus === "published" && published.editorialStatus === "reviewed";
    return { ...child, title: published?.title ?? staged!.title, sourceFile: published ? "content/curated-topics.ts" : "content/staged/christmas.ts", existingPublicationStatus: published?.publicationStatus ?? "draft", existingEditorialStatus: published?.editorialStatus ?? "unreviewed", words: [...puzzle.words], seed: puzzle.seed, rows: puzzle.rows, columns: puzzle.columns, directions: [...puzzle.directions], difficulty: puzzle.difficulty,
      eligiblePublishedChild: !!publishedAndReviewed && child.collectionFitApproved && child.audienceSuitabilityApproved && child.reuseApproved };
  });
  const approvedPublishedChildCount = children.filter(({ eligiblePublishedChild }) => eligiblePublishedChild).length;
  const blockingReasons: string[] = [];
  if (approvedPublishedChildCount < asset.minimumApprovedPublishedChildren) blockingReasons.push(`Only ${approvedPublishedChildCount} independently approved published children; at least ${asset.minimumApprovedPublishedChildren} required.`);
  if (!asset.collectionEditorialApproved) blockingReasons.push("Collection editorial and scope approval is missing.");
  if (!asset.ownerPublicationApproved) blockingReasons.push("Separate owner publication approval is missing.");
  for (const child of children) {
    if (child.existingPublicationStatus !== "published") blockingReasons.push(`${child.id}: source puzzle is unpublished.`);
    if (!child.collectionFitApproved || !child.audienceSuitabilityApproved || !child.reuseApproved) blockingReasons.push(`${child.id}: independent collection-fit, audience-suitability and/or reuse approval is missing.`);
  }
  return { ...asset, children, approvedPublishedChildCount, blockingReasons, publicationAuthorized: false as const, runtimeActivation: false as const };
}

const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
const list = (items: string[]) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>`;

export function collectionReviewHtml(report: ReturnType<typeof buildCollectionReview>) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(report.title)} — UNREVIEWED</title><style>body{font:16px/1.55 system-ui,sans-serif;max-width:72rem;margin:2rem auto;padding:0 1rem;color:#172033;background:white}article{border:1px solid #8592a4;padding:1rem;margin:1.5rem 0;break-inside:avoid}code{overflow-wrap:anywhere}h1,h2,h3{line-height:1.2}dt{font-weight:bold}dd{margin:0 0 .5rem}a{color:#115b3b}@media print{body{margin:0;max-width:none}article{break-inside:auto}}</style></head><body><main><p><strong>UNREVIEWED — source-only editorial artifact. Publication authorized: false. Runtime activation: false.</strong></p><h1>${escape(report.title)}</h1><p>${escape(report.introduction)}</p><p>Proposed canonical (not activated): <code>${escape(report.proposedPath)}</code></p><h2>Publication blockers</h2>${list(report.blockingReasons)}<h2>Choose and review a worksheet</h2>${list(report.selectionGuidance)}<h2>Classroom and printing instructions</h2>${list(report.classroomInstructions)}<h2>Exact source children</h2>${report.children.map((child) => `<article><h3>${escape(child.id)} — ${escape(child.title)}</h3><p>${escape(child.selectionGuidance)}</p><dl><dt>Canonical source reference (not a local preview link)</dt><dd><code>${escape(child.canonicalPath)}</code></dd><dt>Source</dt><dd>${escape(child.sourceFile)}; ${escape(child.existingPublicationStatus)} / ${escape(child.existingEditorialStatus)}</dd><dt>Frozen configuration</dt><dd>${child.rows}×${child.columns}; ${escape(child.difficulty)}; directions ${escape(child.directions.join(", "))}; seed <code>${escape(child.seed)}</code></dd><dt>Independent collection fit / audience suitability / reuse</dt><dd>${child.collectionFitApproved} / ${child.audienceSuitabilityApproved} / ${child.reuseApproved}</dd></dl><h4>Complete word bank</h4>${list(child.words)}<h4>Review questions</h4>${list(child.reviewQuestions)}</article>`).join("")}<h2>Excluded rather than padded</h2>${list(report.excludedSelections.map(({ id, reason }) => `${id}: ${reason}`))}<p>This review file contains no puzzle renderer, scripts, external assets or approval action. Use the source candidate's separately measured PDF/answer evidence for output review; this HTML is not a classroom packet.</p></main></body></html>`;
}
