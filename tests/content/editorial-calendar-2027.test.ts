import { describe, expect, test } from "vitest";
import { editorialCalendarPolicy, editorialReviewWindows } from "@/content/staged/editorial-calendar-2027";
import { allEditorialPuzzleCandidates, editorialAssetReferences } from "@/content/staged/editorial-assets";
import { auditEditorialCalendar, createZeroPublicationLedger, prepareEditorialSelection } from "@/lib/content/editorial-calendar";
import { routeInventory } from "@/content/registry";

describe("optional source-only 2027 editorial review calendar", () => {
  test("maps all 53 Fridays and 35 conditional opportunities to real source assets", () => {
    expect(auditEditorialCalendar()).toEqual([]);
    expect(editorialReviewWindows.map(({ slot, date, kind, referenceIds }) => ({ slot, date, kind, referenceIds }))).toMatchSnapshot();
    expect(allEditorialPuzzleCandidates).toHaveLength(60);
    expect(editorialAssetReferences.filter(({ kind }) => kind === "utility-selection")).toHaveLength(16);
    expect(editorialAssetReferences.filter(({ kind }) => kind === "existing-draft-enhancement")).toHaveLength(2);
    for (const id of ["OWNER-COUNTRIES", "OWNER-STATE-CAPITALS", "OWNER-AMERICAN-REVOLUTION", "OWNER-CIVIL-RIGHTS", "OWNER-PERIODIC-TABLE", "OWNER-GENETICS"]) {
      expect(editorialAssetReferences.some((reference) => reference.id === id)).toBe(false);
    }
    for (const candidate of allEditorialPuzzleCandidates) {
      expect(editorialAssetReferences.some(({ id, proposedPath }) => id === candidate.id && proposedPath === candidate.proposedPath)).toBe(true);
      expect(routeInventory.some(({ canonicalPath }) => canonicalPath === candidate.proposedPath)).toBe(false);
    }
  });
  test("defaults every window to zero with no inferred editorial or owner approval", () => {
    expect(editorialCalendarPolicy.initialMaximumNewIndexableUrls).toBe(1);
    expect(editorialCalendarPolicy.planningCommit).toBe("d297f7b71b336029e7d151d4e3e5ca6330438f52");
    for (const entry of createZeroPublicationLedger()) {
      expect(entry.disposition).toBe("hold");
      expect(entry.newIndexablePaths).toEqual([]);
      expect(entry.publicationAuthorized).toBe(false);
      expect(entry.editorialApprovalRecorded).toBe(false);
      expect(entry.ownerApprovalRecorded).toBe(false);
    }
  });
  test("a technical candidate can be proposed without becoming approved or published", () => {
    const proposal = prepareEditorialSelection({ slot: 2, assetIds: ["H02-01"], disposition: "propose-for-review" });
    expect(proposal.hypotheticalNewIndexableUrls).toBe(1);
    expect(proposal.references[0].pr).toBe(26);
    expect(proposal.newIndexablePaths).toEqual([]);
    expect(proposal.publicationAuthorized).toBe(false);
    expect(prepareEditorialSelection({ slot: 26, assetIds: ["OWNER-PARKS"], disposition: "propose-for-review" }).hypotheticalNewIndexableUrls).toBe(1);
  });
  test("formats and enhancements retain zero-URL alternatives rather than forcing publication", () => {
    expect(prepareEditorialSelection({ slot: 21, assetIds: ["L01", "L03"], disposition: "propose-for-review" }).hypotheticalNewIndexableUrls).toBe(0);
    const enhancement = prepareEditorialSelection({ slot: 6, assetIds: ["S27-VAL"], disposition: "merge-into-existing", reason: "Use the existing published Valentine canonical after independent review." });
    expect(enhancement.hypotheticalNewIndexableUrls).toBe(0);
    expect(enhancement.newIndexablePaths).toEqual([]);
    expect(prepareEditorialSelection({ slot: 2, assetIds: ["H02-01"], disposition: "cancel", reason: "Not enough independent value; improve the existing Mountains canonical." }).newIndexablePaths).toEqual([]);
    const carried = prepareEditorialSelection({ slot: 2, assetIds: ["H02-01"], disposition: "carry-forward", carryToSlot: 9, reason: "Needs human fact review; reconsider at a later window after updating its source mapping." });
    expect(carried.carriedToReviewSlot).toBe(9);
    expect(carried.newIndexablePaths).toEqual([]);
    expect(carried.publicationAuthorized).toBe(false);
  });
  test("rejects auto-approval, unknown states, duplicate assets, wrong windows and enhancement indexing", () => {
    for (const request of [
      { slot: 2, publicationAuthorized: true }, { slot: 2, editorialApproved: true }, { slot: 2, disposition: "published" },
      { slot: 2, disposition: "propose-for-review" }, { slot: 2, assetIds: ["H02-01", "H02-01"] },
      { slot: 2, assetIds: ["Y27-09"] }, { slot: 54 }, { slot: 2.5 },
      { slot: 6, assetIds: ["S27-VAL"], disposition: "propose-for-review" },
      { slot: 50, assetIds: ["X01", "X02"], disposition: "propose-for-review" },
      { slot: 2, assetIds: ["H02-01"], disposition: "carry-forward", carryToSlot: 1 },
      { slot: 2, assetIds: ["H02-01"], disposition: "carry-forward", carryToSlot: 6 },
      { slot: 2, carryToSlot: 9 }
    ]) expect(() => prepareEditorialSelection(request)).toThrow();
  });
});
