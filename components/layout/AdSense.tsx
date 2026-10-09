"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADSENSE_CLIENT,
  ADSENSE_SCRIPT_SRC,
  ADSENSE_UNITS,
  placementMediaQuery,
  type AdPlacement
} from "@/lib/monetization/adsense";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdUnitStatus = "pending" | "filled" | "unfilled";

function readUnitStatus(unit: HTMLElement | null): AdUnitStatus {
  const status = unit?.dataset.adStatus;
  if (status === "filled") return "filled";
  if (status === "unfilled" || status === "unfill-optimized") return "unfilled";
  return "pending";
}

export function AdSenseLoader() {
  useEffect(() => {
    const existing = Array.from(document.scripts).find((script) => script.src === ADSENSE_SCRIPT_SRC);
    if (existing) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = ADSENSE_SCRIPT_SRC;
    script.crossOrigin = "anonymous";
    script.dataset.ilwsAdsenseLoader = "true";
    document.head.appendChild(script);
  }, []);

  return null;
}

function usePlacementEligibility(placement: AdPlacement) {
  const query = placementMediaQuery(placement);
  const [eligible, setEligible] = useState(query === null);

  useEffect(() => {
    if (!query) return;
    const mediaQuery = window.matchMedia(query);
    const update = () => setEligible(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return eligible;
}

export function AdSenseUnit({ placement }: { placement: AdPlacement }) {
  const eligible = usePlacementEligibility(placement);
  const unitRef = useRef<HTMLModElement>(null);
  const [status, setStatus] = useState<AdUnitStatus>("pending");

  useEffect(() => {
    const unit = unitRef.current;
    if (!eligible || !unit) return;

    const update = () => setStatus(readUnitStatus(unit));
    const observer = new MutationObserver(update);
    observer.observe(unit, { attributes: true, attributeFilter: ["data-ad-status"] });
    update();
    return () => observer.disconnect();
  }, [eligible]);

  useEffect(() => {
    const unit = unitRef.current;
    if (!eligible || !unit || unit.dataset.ilwsAdRequested === "true") return;

    unit.dataset.ilwsAdRequested = "true";
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.warn(`AdSense request failed for ${placement}.`, error);
    }
  }, [eligible, placement]);

  if (!eligible) return null;

  return (
    <>
      <ins
        ref={unitRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ilws-ad-unit="true"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_UNITS[placement].slot}
      />
      <span
        className="ad-slot-live-fallback"
        data-ad-placeholder="true"
        hidden={status !== "unfilled"}
      >
        Advertisements
      </span>
    </>
  );
}
