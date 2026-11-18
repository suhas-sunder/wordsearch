// Static markup checks only. Fill detection and global placeholder suppression
// remain covered by the existing browser advertising regression suite.
export const approvedAdSlots = {
  "top-banner": "6498435012", "below-header-banner": "8471746257",
  "sidebar-left": "3872271670", "sidebar-right": "5709851549",
  "seo-section-square": "4396769879", "above-footer-banner": "7230906061"
};
const client = "ca-pub-4810616735714570";

export function indexedAdMarkupIssues({ slots, units, placeholders, enabled = true }) {
  const issues = [];
  const placements = new Set();
  for (const slot of slots) {
    const placement = slot["data-ad-placement"];
    if (!Object.hasOwn(approvedAdSlots, placement)) issues.push(`unknown ad placement ${placement}`);
    if (placements.has(placement)) issues.push(`duplicate ad placement ${placement}`);
    placements.add(placement);
    if (slot["data-ad-mode"] !== (enabled ? "live" : "placeholder")) issues.push(`unexpected ad mode for ${placement}`);
    if (enabled && Object.hasOwn(slot, "data-ad-placeholder")) issues.push(`live slot ${placement} is marked as a placeholder`);
    if (!enabled && slot["data-ad-placeholder"] !== "true") issues.push(`disabled slot ${placement} lacks its placeholder marker`);
    const matching = units.filter((unit) => unit["data-ad-slot"] === approvedAdSlots[placement]);
    // Sidebars mount their unit after matchMedia in the browser; SSR keeps only
    // the reserved wrapper. Their actual fill/placement is checked by test:ads.
    const deferredSidebar = placement === "sidebar-left" || placement === "sidebar-right";
    if (enabled && (matching.length > 1 || (!deferredSidebar && matching.length !== 1))) issues.push(`live slot ${placement} requires exactly one matching unit`);
  }
  if (!enabled && units.length) issues.push("disabled advertising renders live units");
  for (const unit of units) {
    if (unit["data-ad-client"] !== client) issues.push("unexpected ad client");
    if (![...placements].some((placement) => approvedAdSlots[placement] === unit["data-ad-slot"])) issues.push("ad unit has no approved placement");
  }
  if (enabled && placeholders.some((placeholder) => !Object.hasOwn(placeholder, "hidden"))) issues.push("visible placeholder in live static markup");
  return issues;
}
