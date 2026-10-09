export const AD_PLACEMENTS = [
  "top-banner",
  "sidebar-left",
  "sidebar-right",
  "below-header-banner",
  "seo-section-square",
  "above-footer-banner"
] as const;

export type AdPlacement = (typeof AD_PLACEMENTS)[number];

export const ADSENSE_CLIENT = "ca-pub-4810616735714570";
export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

export const ADSENSE_UNITS: Readonly<Record<AdPlacement, { name: string; slot: string }>> = {
  "top-banner": { name: "ilovewordsearch-above-header-banner", slot: "6498435012" },
  "below-header-banner": { name: "ilovewordsearch-below-header-banner", slot: "8471746257" },
  "sidebar-left": { name: "ilovewordsearch-sidebar-left", slot: "3872271670" },
  "sidebar-right": { name: "ilovewordsearch-sidebar-right", slot: "5709851549" },
  "seo-section-square": { name: "ilovewordsearch-seo-section-square", slot: "4396769879" },
  "above-footer-banner": { name: "ilovewordsearch-above-footer", slot: "7230906061" }
};

export function resolveAdSenseEnabled(value: string | undefined) {
  return value === "on";
}

export const ADSENSE_ENABLED = resolveAdSenseEnabled(process.env.NEXT_PUBLIC_ADSENSE_ENABLED);

export function placementMediaQuery(placement: AdPlacement) {
  if (placement === "top-banner") return "(min-width: 768px)";
  if (placement === "sidebar-left" || placement === "sidebar-right") return "(min-width: 1600px)";
  return null;
}
