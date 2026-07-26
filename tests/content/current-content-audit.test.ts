import { describe, expect, test } from "vitest";
import { routeInventory } from "@/content/registry";
import { auditContent, formatAudit } from "@/lib/content/audit";

describe("current content inventory", () => {
  test("passes publication and duplicate safeguards", () => {
    const result = auditContent(routeInventory);
    console.log(`\n${formatAudit(result)}\n`);
    expect(result.errors).toEqual([]);
  });
});
