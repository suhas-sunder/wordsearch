import { describe, expect, test } from "vitest";
import { allStagedCandidates, stagedCandidateGroups } from "@/content/staged/catalog";
import { routeInventory } from "@/content/registry";
import { auditCandidates } from "@/lib/content/candidates";
import { readSourceInventory } from "@/lib/content/inventory";

describe("complete source-only candidate catalog", () => {
  test("checks cross-family collisions and near-duplicate vocabulary together", () => {
    expect(allStagedCandidates).toHaveLength(61);
    expect(stagedCandidateGroups.find(({ id }) => id === "calendar-gaps")?.candidates).toHaveLength(15);
    expect(stagedCandidateGroups.every(({ candidates }) => candidates.length > 0 && candidates.length <= 20)).toBe(true);
    expect(auditCandidates(allStagedCandidates, routeInventory, readSourceInventory().redirects.map(({ source }) => source))).toEqual([]);
    const ids = new Set(routeInventory.map(({ id }) => id));
    const paths = new Set(routeInventory.map(({ canonicalPath }) => canonicalPath));
    for (const candidate of allStagedCandidates) {
      expect(ids.has(candidate.id)).toBe(false);
      expect(paths.has(candidate.proposedPath)).toBe(false);
      expect(candidate.status).toBe("drafted");
      expect(candidate.approval).toBeUndefined();
    }
  });
});
