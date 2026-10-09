import type { ReactNode } from "react";
import { AdSenseLoader, AdSensePageCoordinator, AdSenseUnit } from "@/components/layout/AdSense";
import { ADSENSE_ENABLED, AD_PLACEMENTS, type AdPlacement } from "@/lib/monetization/adsense";

export { AD_PLACEMENTS } from "@/lib/monetization/adsense";
export type { AdPlacement } from "@/lib/monetization/adsense";

const AD_PLACEMENT_ACCESSIBLE_LABELS: Readonly<Record<AdPlacement, string>> = {
  "top-banner": "Top banner advertisements",
  "sidebar-left": "Left sidebar advertisements",
  "sidebar-right": "Right sidebar advertisements",
  "below-header-banner": "Below header advertisements",
  "seo-section-square": "Supporting content advertisements",
  "above-footer-banner": "Above footer advertisements"
};

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

export type MonetizationEligibility = "placeholders" | "ad-free";

export interface AdTemplatePolicy {
  eligibility: MonetizationEligibility;
  placements: readonly AdPlacement[];
  reason: string;
}

const ALL_PLACEMENTS = AD_PLACEMENTS;
const DIRECTORY_PLACEMENTS = AD_PLACEMENTS.filter((placement) => placement !== "seo-section-square");
const NO_PLACEMENTS: readonly AdPlacement[] = [];

export const adTemplatePolicy: Readonly<Record<AdTemplate, AdTemplatePolicy>> = {
  home: { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Canonical homepage with substantial navigation and explanatory content." },
  generator: { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Canonical generator with a complete utility experience and supporting content." },
  "curated-puzzle": { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Reviewed canonical puzzle with primary and supporting content." },
  "major-hub": { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Canonical substantive browse or tool hub." },
  category: { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Published category with reviewed puzzle listings and supporting guidance." },
  collection: { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Published collection with reviewed puzzle listings and selection guidance." },
  guide: { eligibility: "placeholders", placements: ALL_PLACEMENTS, reason: "Published guide with substantive explanatory content." },
  topics: { eligibility: "placeholders", placements: DIRECTORY_PLACEMENTS, reason: "Canonical topic directory; the link-dense body intentionally omits the in-content square." },
  draft: { eligibility: "ad-free", placements: NO_PLACEMENTS, reason: "Draft and noindex content stays ad-free." },
  utility: { eligibility: "ad-free", placements: NO_PLACEMENTS, reason: "Raw play, print, PDF, answer, embed, and custom utility states stay ad-free." },
  trust: { eligibility: "ad-free", placements: NO_PLACEMENTS, reason: "Trust, legal, contact, accessibility, and search pages stay ad-free." },
  error: { eligibility: "ad-free", placements: NO_PLACEMENTS, reason: "Unknown, fallback, and error routes default to ad-free." }
};

export function getAdTemplatePolicy(template: AdTemplate | undefined): AdTemplatePolicy {
  return template ? adTemplatePolicy[template] : adTemplatePolicy.error;
}

export function templateAllowsPlacement(template: AdTemplate | undefined, placement: AdPlacement) {
  return getAdTemplatePolicy(template).placements.includes(placement);
}

export function AdSlot({ placement, template, adsenseEnabled = ADSENSE_ENABLED }: { placement: AdPlacement; template?: AdTemplate; adsenseEnabled?: boolean }) {
  if (!templateAllowsPlacement(template, placement)) return null;

  return (
    <aside
      className={`ad-slot ad-placement-${placement}${adsenseEnabled ? " ad-slot-live" : ""}`}
      data-ad-placeholder={adsenseEnabled ? undefined : "true"}
      data-ad-placement={placement}
      data-ad-template={template}
      data-ad-mode={adsenseEnabled ? "live" : "placeholder"}
      aria-label={AD_PLACEMENT_ACCESSIBLE_LABELS[placement]}
    >
      {adsenseEnabled ? <AdSenseUnit placement={placement} /> : <span>Advertisements</span>}
    </aside>
  );
}

export function BelowHeaderAd({ template }: { template: AdTemplate }) {
  if (!templateAllowsPlacement(template, "below-header-banner")) return null;
  return <div className="ad-below-header-region"><AdSlot placement="below-header-banner" template={template} /></div>;
}

export function SeoSectionAd({ template }: { template: AdTemplate }) {
  if (!templateAllowsPlacement(template, "seo-section-square")) return null;
  return <div className="ad-seo-region"><AdSlot placement="seo-section-square" template={template} /></div>;
}

export function MonetizedPageShell({ template, children }: { template: AdTemplate; children: ReactNode }) {
  const policy = getAdTemplatePolicy(template);
  if (policy.eligibility === "ad-free") return <>{children}</>;

  return (
    <AdSensePageCoordinator>
      {ADSENSE_ENABLED ? <AdSenseLoader /> : null}
      <div className="ad-top-region"><AdSlot placement="top-banner" template={template} /></div>
      <div className="ad-page-frame">
        <div className="ad-sidebar-region ad-sidebar-region-left"><AdSlot placement="sidebar-left" template={template} /></div>
        <div className="ad-page-content">{children}</div>
        <div className="ad-sidebar-region ad-sidebar-region-right"><AdSlot placement="sidebar-right" template={template} /></div>
      </div>
      <div className="ad-above-footer-region"><AdSlot placement="above-footer-banner" template={template} /></div>
    </AdSensePageCoordinator>
  );
}
