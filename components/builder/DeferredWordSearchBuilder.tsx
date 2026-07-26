"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { BuilderProps } from "@/components/builder/WordSearchBuilder";

export function DeferredWordSearchBuilder(props: BuilderProps) {
  const [Builder, setBuilder] = useState<ComponentType<BuilderProps> | null>(null);
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    let active = true;
    const load = () => {
      import("@/components/builder/WordSearchBuilder")
        .then((module) => {
          if (active) setBuilder(() => module.WordSearchBuilder);
        })
        .catch(() => {
          if (active) setStatus("error");
        });
    };
    const idleApi = window as unknown as {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
      setTimeout: (callback: () => void, delay: number) => number;
      clearTimeout: (handle: number) => void;
    };
    const idleId = idleApi.requestIdleCallback
      ? idleApi.requestIdleCallback(load, { timeout: 1_200 })
      : idleApi.setTimeout(load, 250);
    return () => {
      active = false;
      if (idleApi.cancelIdleCallback) idleApi.cancelIdleCallback(idleId);
      else idleApi.clearTimeout(idleId);
    };
  }, []);

  function loadImmediately() {
    setStatus("loading");
    import("@/components/builder/WordSearchBuilder")
      .then((module) => setBuilder(() => module.WordSearchBuilder))
      .catch(() => setStatus("error"));
  }

  if (!Builder) {
    return (
      <section className="builder-loading-shell" aria-busy={status === "loading"} aria-live="polite">
        <div>
          <h2>{status === "error" ? "The interactive puzzle did not load" : "Preparing the interactive puzzle"}</h2>
          <p>{status === "error" ? "Check the connection and retry. The page guidance and links remain available." : "The puzzle editor, preview, and output controls are loading. The page guidance and links remain available."}</p>
          <button type="button" className="secondary-button" onClick={loadImmediately}>
            {status === "error" ? "Retry puzzle" : "Load puzzle now"}
          </button>
        </div>
      </section>
    );
  }

  return <Builder {...props} />;
}
