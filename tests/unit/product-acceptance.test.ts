import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { productAcceptanceSchema, renderProductAcceptance, validateProductAcceptance } from "@/lib/content/product-acceptance";

const data = () => JSON.parse(readFileSync("docs/releases/PRODUCT-ACCEPTANCE.json", "utf8"));
describe("feature-by-feature acceptance ledger", () => {
  test("covers every F0–F6 feature and numbered owner issue with exact source references", () => { expect(validateProductAcceptance(data())).toEqual([]); });
  test("keeps the human-readable ledger synchronized with its machine manifest", () => {
    expect(readFileSync("docs/releases/PRODUCT-ACCEPTANCE.md", "utf8").trimEnd().replace(/\r\n/g, "\n")).toBe(renderProductAcceptance(productAcceptanceSchema.parse(data())).trimEnd());
  });
  test("rejects omitted features and false automatic manual completion", () => {
    const missing = data(); missing.features.shift();
    expect(validateProductAcceptance(missing).some((issue) => issue.includes("Missing acceptance feature"))).toBe(true);
    const falseApproval = data(); falseApproval.features[0].status = "DONE";
    expect(validateProductAcceptance(falseApproval).some((issue) => issue.includes("named approval evidence"))).toBe(true);
  });
  test("rejects owner deferral of feasible guest work and unsupported bulk approval", () => {
    const deferred = data(); deferred.features[0].status = "OWNER-DEFERRED";
    expect(validateProductAcceptance(deferred).some((issue) => issue.includes("feasible guest"))).toBe(true);
    const approved = data(); approved.productionAccepted = true; approved.contentEditorialApproved = true;
    expect(validateProductAcceptance(approved).length).toBeGreaterThan(0);
  });
});
