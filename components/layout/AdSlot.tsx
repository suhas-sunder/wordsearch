export type AdPlacement =
  | "top-banner"
  | "left-sidebar"
  | "right-sidebar"
  | "utility-banner"
  | "seo-content-square"
  | "bottom-tools-banner";

export type AdTemplate =
  | "home"
  | "generator"
  | "curated-puzzle"
  | "major-hub"
  | "category"
  | "collection"
  | "guide"
  | "topics"
  | "draft"
  | "utility"
  | "trust"
  | "error";

interface AdPlacementConfig {
  label: string;
  className: string;
  enabled: boolean;
}

export const adPlacementConfig: Record<AdPlacement, AdPlacementConfig> = {
  "top-banner": { label: "Advertisement", className: "ad-slot-banner", enabled: true },
  "left-sidebar": { label: "Advertisement", className: "ad-slot-sidebar", enabled: true },
  "right-sidebar": { label: "Advertisement", className: "ad-slot-sidebar", enabled: true },
  "utility-banner": { label: "Advertisement", className: "ad-slot-banner", enabled: true },
  "seo-content-square": { label: "Advertisement", className: "ad-slot-square", enabled: true },
  "bottom-tools-banner": { label: "Advertisement", className: "ad-slot-banner", enabled: true }
};

export const adTemplateEligibility: Record<AdTemplate, readonly AdPlacement[]> = {
  home: ["top-banner", "utility-banner", "seo-content-square", "bottom-tools-banner"],
  generator: ["top-banner", "utility-banner", "seo-content-square", "bottom-tools-banner"],
  "curated-puzzle": ["top-banner", "utility-banner", "seo-content-square", "bottom-tools-banner"],
  "major-hub": ["top-banner", "left-sidebar", "right-sidebar", "utility-banner", "seo-content-square", "bottom-tools-banner"],
  category: ["top-banner", "utility-banner", "seo-content-square", "bottom-tools-banner"],
  collection: ["top-banner", "seo-content-square", "bottom-tools-banner"],
  guide: ["top-banner", "utility-banner", "seo-content-square", "bottom-tools-banner"],
  topics: ["utility-banner"],
  draft: [],
  utility: [],
  trust: [],
  error: []
};

interface AdSlotProps {
  placement: AdPlacement;
  template: AdTemplate;
  enabled?: boolean;
}

export function AdSlot({ placement, template, enabled }: AdSlotProps) {
  const config = adPlacementConfig[placement];
  const globallyEnabled = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS === "on";
  const templateAllowsPlacement = adTemplateEligibility[template].includes(placement);
  if (!(enabled ?? config.enabled) || !globallyEnabled || !templateAllowsPlacement) return null;

  return (
    <aside
      className={`ad-slot ${config.className}`}
      data-ad-placement={placement}
      data-ad-template={template}
      aria-label={config.label}
    >
      <span>{config.label}</span>
    </aside>
  );
}
