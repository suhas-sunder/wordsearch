"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode
} from "react";
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
type AdPageMode = "pending" | "empty" | "filled";

interface AdPageState {
  requested: Partial<Record<AdPlacement, AdUnitStatus>>;
  loaderFailed: boolean;
  hasEverFilled: boolean;
}

type AdPageAction =
  | { type: "register"; placement: AdPlacement }
  | { type: "unregister"; placement: AdPlacement }
  | { type: "status"; placement: AdPlacement; status: AdUnitStatus }
  | { type: "loader-error" };

interface AdPageCoordinatorValue {
  mode: AdPageMode;
  register: (placement: AdPlacement) => void;
  unregister: (placement: AdPlacement) => void;
  reportStatus: (placement: AdPlacement, status: AdUnitStatus) => void;
  reportLoaderError: () => void;
}

const AdPageCoordinatorContext = createContext<AdPageCoordinatorValue | null>(null);
const initialAdPageState: AdPageState = {
  requested: {},
  loaderFailed: false,
  hasEverFilled: false
};

function adPageReducer(state: AdPageState, action: AdPageAction): AdPageState {
  if (action.type === "loader-error") {
    return state.loaderFailed ? state : { ...state, loaderFailed: true };
  }

  if (action.type === "register") {
    if (state.requested[action.placement]) return state;
    return {
      ...state,
      requested: { ...state.requested, [action.placement]: "pending" }
    };
  }

  if (action.type === "unregister") {
    if (!state.requested[action.placement]) return state;
    const requested = { ...state.requested };
    delete requested[action.placement];
    return { ...state, requested };
  }

  if (!state.requested[action.placement]) return state;
  const hasEverFilled = state.hasEverFilled || action.status === "filled";
  if (state.requested[action.placement] === action.status && hasEverFilled === state.hasEverFilled) {
    return state;
  }
  return {
    ...state,
    requested: { ...state.requested, [action.placement]: action.status },
    hasEverFilled
  };
}

function resolvePageMode(state: AdPageState): AdPageMode {
  if (state.hasEverFilled) return "filled";
  if (state.loaderFailed) return "empty";
  const statuses = Object.values(state.requested);
  if (statuses.length > 0 && statuses.every((status) => status === "unfilled")) return "empty";
  return "pending";
}

export function AdSensePageCoordinator({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(adPageReducer, initialAdPageState);
  const register = useCallback((placement: AdPlacement) => dispatch({ type: "register", placement }), []);
  const unregister = useCallback((placement: AdPlacement) => dispatch({ type: "unregister", placement }), []);
  const reportStatus = useCallback(
    (placement: AdPlacement, status: AdUnitStatus) => dispatch({ type: "status", placement, status }),
    []
  );
  const reportLoaderError = useCallback(() => dispatch({ type: "loader-error" }), []);
  const mode = resolvePageMode(state);
  const value = useMemo(
    () => ({ mode, register, unregister, reportStatus, reportLoaderError }),
    [mode, register, unregister, reportStatus, reportLoaderError]
  );

  return (
    <AdPageCoordinatorContext.Provider value={value}>
      {children}
    </AdPageCoordinatorContext.Provider>
  );
}

function useAdPageCoordinator() {
  const coordinator = useContext(AdPageCoordinatorContext);
  if (!coordinator) throw new Error("Live AdSense units require AdSensePageCoordinator.");
  return coordinator;
}

function readUnitStatus(unit: HTMLElement | null): AdUnitStatus {
  const status = unit?.dataset.adStatus;
  if (status === "filled") return "filled";
  if (status === "unfilled" || status === "unfill-optimized") return "unfilled";
  return "pending";
}

export function AdSenseLoader() {
  const { reportLoaderError } = useAdPageCoordinator();

  useEffect(() => {
    const existing = Array.from(document.scripts).find((script) => script.src === ADSENSE_SCRIPT_SRC);
    const script = existing ?? document.createElement("script");
    const handleLoad = () => {
      script.dataset.ilwsAdsenseLoaderState = "loaded";
    };
    const handleError = () => {
      script.dataset.ilwsAdsenseLoaderState = "error";
      reportLoaderError();
    };

    if (script.dataset.ilwsAdsenseLoaderState === "error") {
      reportLoaderError();
      return;
    }

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    if (!existing) {
      script.async = true;
      script.src = ADSENSE_SCRIPT_SRC;
      script.crossOrigin = "anonymous";
      script.dataset.ilwsAdsenseLoader = "true";
      document.head.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, [reportLoaderError]);

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
  const { mode, register, unregister, reportStatus, reportLoaderError } = useAdPageCoordinator();

  useLayoutEffect(() => {
    if (!eligible) return;
    register(placement);
    return () => unregister(placement);
  }, [eligible, placement, register, unregister]);

  useEffect(() => {
    const unit = unitRef.current;
    if (!eligible || !unit) return;

    const update = () => reportStatus(placement, readUnitStatus(unit));
    const observer = new MutationObserver(update);
    observer.observe(unit, { attributes: true, attributeFilter: ["data-ad-status"] });
    update();
    return () => observer.disconnect();
  }, [eligible, placement, reportStatus]);

  useEffect(() => {
    const unit = unitRef.current;
    if (!eligible || !unit || unit.dataset.ilwsAdRequested === "true") return;

    unit.dataset.ilwsAdRequested = "true";
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      reportLoaderError();
      console.warn(`AdSense request failed for ${placement}.`, error);
    }
  }, [eligible, placement, reportLoaderError]);

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
        hidden={mode !== "empty"}
      >
        Advertisements
      </span>
    </>
  );
}
