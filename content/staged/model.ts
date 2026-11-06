import type { PuzzleContentRecord, PuzzleDefinition, PuzzleEditorialContent } from "@/content/model";

// Staged records are deliberately separate from ContentRecord and the public registry.
export interface StagedPuzzleCandidate {
  id: string;
  proposedPath: string;
  intent: string;
  title: string;
  status: "drafted";
  sourceReferences: { title: string; url: string; note: string }[];
  puzzle: PuzzleDefinition;
  editorial: PuzzleEditorialContent;
  taxonomy: PuzzleContentRecord["taxonomy"];
  approval?: never;
}

export const lifecycle = ["proposal", "researched", "drafted", "built", "qa", "editorial-approved", "scheduled", "published", "monitoring", "retired"] as const;
export type LifecycleStatus = typeof lifecycle[number];
export interface ApprovalEvidence { reviewer: string; reviewedOn: string; reference: string }
export interface PublicationEvidence { contentCommit: string; releaseCommit: string; deploymentReference: string }
export interface LifecycleRecord { status: LifecycleStatus; approval?: ApprovalEvidence; publication?: PublicationEvidence }

/** Records supplied evidence only; this does not register, authorize, or publish a route. */
export function transitionLifecycle(record: LifecycleRecord, next: LifecycleStatus, approval?: ApprovalEvidence, publication?: PublicationEvidence): LifecycleRecord {
  const from = lifecycle.indexOf(record.status);
  const to = lifecycle.indexOf(next);
  if (from < 0 || to < 0) throw new Error("Unknown lifecycle status.");
  if (next === "retired" && record.status !== "retired") return { ...record, status: next };
  if (to !== from + 1) throw new Error("Lifecycle transitions must advance one step at a time.");
  if (approval && next !== "editorial-approved") throw new Error("Approval can only be recorded at the editorial approval step.");
  if (publication && next !== "published") throw new Error("Publication evidence can only be recorded at the published step.");
  const proof = approval ?? record.approval;
  if (to >= lifecycle.indexOf("editorial-approved")) {
    const validDate = proof && /^\d{4}-\d{2}-\d{2}$/.test(proof.reviewedOn) && !Number.isNaN(Date.parse(`${proof.reviewedOn}T00:00:00Z`)) && new Date(`${proof.reviewedOn}T00:00:00Z`).toISOString().slice(0, 10) === proof.reviewedOn && proof.reviewedOn <= new Date().toISOString().slice(0, 10);
    if (!proof?.reviewer.trim() || !proof.reference.trim() || !validDate) throw new Error("Explicit dated editorial approval evidence is required.");
  }
  const release = publication ?? record.publication;
  if (to >= lifecycle.indexOf("published") && (!release || !/^[a-f0-9]{40}$/i.test(release.contentCommit) || !/^[a-f0-9]{40}$/i.test(release.releaseCommit) || !release.deploymentReference.trim())) throw new Error("Publication requires content and release commit SHAs and a deployment reference.");
  return { status: next, ...(proof ? { approval: proof } : {}), ...(release ? { publication: release } : {}) };
}
