import assert from "node:assert/strict";
import { test } from "node:test";
import { indexedAdMarkupIssues } from "./ad-markup-contract.mjs";

const slot = { "data-ad-placement": "top-banner", "data-ad-mode": "live" };
const unit = { "data-ad-slot": "6498435012", "data-ad-client": "ca-pub-4810616735714570" };
const fixture = () => ({ slots: [{ ...slot }], units: [{ ...unit }], placeholders: [{ "data-ad-placeholder": "true", hidden: "" }] });
test("a live unit is not a disabled placeholder; its fallback starts hidden", () => assert.deepEqual(indexedAdMarkupIssues(fixture()), []));
test("visible fallbacks still fail", () => {
  const input = fixture(); delete input.placeholders[0].hidden;
  assert.match(indexedAdMarkupIssues(input).join(" "), /visible placeholder/);
});
test("unexpected live placeholder mode still fails", () => {
  const input = fixture(); input.slots[0]["data-ad-mode"] = "placeholder";
  assert.match(indexedAdMarkupIssues(input).join(" "), /unexpected ad mode/);
});
test("a placeholder marker cannot be applied to a live wrapper", () => {
  const input = fixture(); input.slots[0]["data-ad-placeholder"] = "true";
  assert.match(indexedAdMarkupIssues(input).join(" "), /marked as a placeholder/);
});
test("missing, unknown, wrong-client and duplicate units cannot be silently accepted", () => {
  for (const units of [[], [{ ...unit, "data-ad-slot": "missing" }], [{ ...unit, "data-ad-client": "wrong" }], [unit, unit]]) {
    assert.ok(indexedAdMarkupIssues({ ...fixture(), units }).length);
  }
});
test("unknown and duplicate placements fail", () => {
  for (const slots of [[{ ...slot, "data-ad-placement": "unknown" }], [slot, slot]]) {
    assert.ok(indexedAdMarkupIssues({ ...fixture(), slots }).length);
  }
});
test("explicit disabled-mode expectations accept only placeholder wrappers, without live units", () => {
  const input = { slots: [{ ...slot, "data-ad-mode": "placeholder", "data-ad-placeholder": "true" }], units: [], placeholders: [], enabled: false };
  assert.deepEqual(indexedAdMarkupIssues(input), []);
  assert.match(indexedAdMarkupIssues({ ...input, units: [unit] }).join(" "), /disabled advertising/);
});
test("ad-free indexed pages need no units or reserved slots", () => assert.deepEqual(indexedAdMarkupIssues({ slots: [], units: [], placeholders: [] }), []));
test("responsive sidebars defer units in static HTML but do not permit duplicate units", () => {
  const input = { slots: [{ "data-ad-placement": "sidebar-left", "data-ad-mode": "live" }], units: [], placeholders: [] };
  assert.deepEqual(indexedAdMarkupIssues(input), []);
  const sidebarUnit = { ...unit, "data-ad-slot": "3872271670" };
  assert.ok(indexedAdMarkupIssues({ ...input, units: [sidebarUnit, sidebarUnit] }).length);
});
