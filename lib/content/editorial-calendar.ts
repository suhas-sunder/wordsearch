import { routeInventory } from "@/content/registry";
import { editorialAssetReferences, type EditorialAssetReference } from "@/content/staged/editorial-assets";
import { editorialCalendarPolicy, editorialReviewWindows } from "@/content/staged/editorial-calendar-2027";

const dispositions = ["hold", "propose-for-review", "merge-into-existing", "carry-forward", "cancel"] as const;
export type CalendarDisposition = typeof dispositions[number];
export interface EditorialSelectionLedgerEntry {
  slot: number; date: string; focus: string; disposition: CalendarDisposition; reason: string;
  references: EditorialAssetReference[];
  hypotheticalNewIndexableUrls: number;
  initialWindowCap: 0 | 1;
  existingCanonicalFallback: string;
  newIndexablePaths: [];
  editorialApprovalRecorded: false;
  ownerApprovalRecorded: false;
  publicationAuthorized: false;
  carriedToReviewSlot?: number;
}

/** Pure offline review ledger. It cannot accept or create approval/publication. */
export function prepareEditorialSelection(input: unknown): EditorialSelectionLedgerEntry {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Expected a review selection object.");
  const request = input as Record<string, unknown>;
  if (Object.keys(request).some((key) => !["slot", "assetIds", "disposition", "reason", "carryToSlot"].includes(key))) throw new Error("Approval, publication and other unsupported fields are not accepted by this review ledger.");
  if (!Number.isInteger(request.slot)) throw new Error("Choose an integer review slot.");
  const window = editorialReviewWindows.find(({ slot }) => slot === request.slot);
  if (!window) throw new Error("Unknown review slot.");
  const disposition = request.disposition ?? "hold";
  if (!dispositions.includes(disposition as CalendarDisposition)) throw new Error("Choose a supported review disposition.");
  const assetIds = request.assetIds ?? [];
  if (!Array.isArray(assetIds) || assetIds.length > 8 || assetIds.some((id) => typeof id !== "string") || new Set(assetIds).size !== assetIds.length) throw new Error("Choose a unique bounded list of asset IDs.");
  if (assetIds.some((id) => !window.referenceIds.includes(id))) throw new Error("A review selection must use assets mapped to that window.");
  const references = assetIds.map((id) => {
    const reference = editorialAssetReferences.find((reference) => reference.id === id);
    if (!reference) throw new Error("Unknown review asset.");
    return reference;
  });
  let carriedToReviewSlot: number | undefined;
  if (disposition === "carry-forward") {
    const next = editorialReviewWindows.find(({ slot }) => slot === request.carryToSlot);
    if (!references.length || !next || next.slot <= window.slot || next.kind !== "CANDIDATE") throw new Error("Carry an asset only to a later candidate review window; this does not schedule publication.");
    carriedToReviewSlot = next.slot;
  } else if (request.carryToSlot !== undefined) throw new Error("A carry target is only valid for carry-forward review.");
  if (disposition === "propose-for-review" && !references.length) throw new Error("Choose an asset to propose for review, or hold the window with zero publication.");
  const hypotheticalNewIndexableUrls = disposition === "propose-for-review" ? references.reduce((total, reference) => total + reference.hypotheticalNewIndexableUrls, 0) : 0;
  if (hypotheticalNewIndexableUrls > window.initialMaxNewIndexableUrls || hypotheticalNewIndexableUrls > editorialCalendarPolicy.initialMaximumNewIndexableUrls) throw new Error("This window exceeds the initial new-indexable-URL limit; use an existing-page enhancement or hold it.");
  if (request.reason !== undefined && (typeof request.reason !== "string" || !request.reason.trim() || request.reason.length > 1000)) throw new Error("Use a nonempty review reason of at most 1000 characters.");
  const reason = typeof request.reason === "string" ? request.reason.trim() : "No human editorial or owner release approval is recorded. Use the zero-publication fallback.";
  return { slot: window.slot, date: window.date, focus: window.focus, disposition: disposition as CalendarDisposition, reason, references, hypotheticalNewIndexableUrls, initialWindowCap: window.initialMaxNewIndexableUrls, existingCanonicalFallback: window.fallback.canonicalPath, newIndexablePaths: [], editorialApprovalRecorded: false, ownerApprovalRecorded: false, publicationAuthorized: false, ...(carriedToReviewSlot === undefined ? {} : { carriedToReviewSlot }) };
}

export function createZeroPublicationLedger(): EditorialSelectionLedgerEntry[] {
  return editorialReviewWindows.map(({ slot }) => prepareEditorialSelection({ slot }));
}

export function auditEditorialCalendar(): string[] {
  const issues: string[] = [];
  if (editorialReviewWindows.length !== 53) issues.push("Expected 53 Friday windows.");
  const counts = { CANDIDATE: 0, ENHANCE: 0, HOLD: 0 };
  const dates = new Set<string>();
  for (const [index, window] of editorialReviewWindows.entries()) {
    counts[window.kind] += 1;
    const expected = new Date(Date.UTC(2027, 0, 1 + index * 7)).toISOString().slice(0, 10);
    if (window.slot !== index + 1 || window.date !== expected || dates.has(window.date)) issues.push(`Invalid Friday window ${window.slot}.`);
    dates.add(window.date);
    if (window.initialMaxNewIndexableUrls !== (window.kind === "CANDIDATE" ? 1 : 0)) issues.push(`Wrong initial cap in ${window.slot}.`);
    if (window.publicationAuthorized || window.newIndexablePaths.length || window.selectionStatus !== "unselected") issues.push(`Unexpected approval or publication state in ${window.slot}.`);
    if (window.fallback.publicationAuthorized || window.fallback.newIndexablePaths.length) issues.push(`Fallback publishes content in ${window.slot}.`);
    const fallback = routeInventory.find(({ canonicalPath }) => canonicalPath === window.fallback.canonicalPath);
    if (!fallback || fallback.publicationStatus !== "published" || !fallback.indexable) issues.push(`Fallback is not an existing published indexable canonical in ${window.slot}.`);
    if (!window.referenceIds.length || new Set(window.referenceIds).size !== window.referenceIds.length) issues.push(`Missing or duplicate references in ${window.slot}.`);
    for (const id of window.referenceIds) if (!editorialAssetReferences.some((reference) => reference.id === id)) issues.push(`Unknown asset ${id} in ${window.slot}.`);
  }
  if (counts.CANDIDATE !== 35 || counts.ENHANCE !== 15 || counts.HOLD !== 3) issues.push("Calendar mix differs from the planning source.");
  if (new Set(editorialAssetReferences.map(({ id }) => id)).size !== editorialAssetReferences.length) issues.push("Duplicate asset IDs.");
  for (const reference of editorialAssetReferences) {
    if (!Number.isInteger(reference.pr) || reference.pr < 1 || !/^[a-f0-9]{40}$/.test(reference.contentCommit)) issues.push(`Invalid PR/commit provenance for ${reference.id}.`);
    if (!reference.sourceFile || reference.editorialStatus !== "unreviewed" || reference.publicationAuthorized) issues.push(`Invalid source/review state for ${reference.id}.`);
    if (reference.kind === "utility-selection" && reference.hypotheticalNewIndexableUrls !== 0) issues.push(`Utility format creates a new URL for ${reference.id}.`);
    if (reference.kind === "existing-draft-enhancement" && reference.hypotheticalNewIndexableUrls !== 1) issues.push(`Draft activation is not counted for ${reference.id}.`);
  }
  return issues;
}
