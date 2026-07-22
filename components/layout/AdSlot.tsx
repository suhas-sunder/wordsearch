export type AdPlacement =
  | "top-banner"
  | "left-sidebar"
  | "right-sidebar"
  | "utility-banner"
  | "seo-content-square"
  | "bottom-tools-banner";

interface AdPlacementConfig {
  label: string;
  className: string;
  enabled: boolean;
}

export const adPlacementConfig: Record<AdPlacement, AdPlacementConfig> = {
  "top-banner": { label: "Advertisement placeholder", className: "ad-slot-banner", enabled: true },
  "left-sidebar": { label: "Advertisement placeholder", className: "ad-slot-sidebar", enabled: true },
  "right-sidebar": { label: "Advertisement placeholder", className: "ad-slot-sidebar", enabled: true },
  "utility-banner": { label: "Advertisement placeholder", className: "ad-slot-banner", enabled: true },
  "seo-content-square": { label: "Advertisement placeholder", className: "ad-slot-square", enabled: true },
  "bottom-tools-banner": { label: "Advertisement placeholder", className: "ad-slot-banner", enabled: true }
};

interface AdSlotProps {
  placement: AdPlacement;
  enabled?: boolean;
}

export function AdSlot({ placement, enabled }: AdSlotProps) {
  const config = adPlacementConfig[placement];
  const globallyEnabled = process.env.NEXT_PUBLIC_AD_PLACEHOLDERS !== "off";
  if (!(enabled ?? config.enabled) || !globallyEnabled) return null;

  return (
    <aside
      className={`ad-slot ${config.className}`}
      data-ad-placement={placement}
      aria-label={config.label}
    >
      <span>{config.label}</span>
    </aside>
  );
}
