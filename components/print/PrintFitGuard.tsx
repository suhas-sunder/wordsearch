"use client";

import { useEffect, useRef, useState } from "react";
import { serializePuzzleOutputOptions, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { browserPrintFitHelp, validateBrowserPrintSheet } from "@/lib/print/browser-fit";

export function PrintFitGuard({ signature, options, editHref }: { signature: string; options: PuzzleOutputOptions; editHref: string }) {
  const marker = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState({ signature: "", state: "checking", message: "Checking worksheet print fit. Wait before printing." });
  const state = result.signature === signature ? result.state : "checking";
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const article = marker.current?.closest("article");
    if (!article) return;
    validateBrowserPrintSheet(article, options, controller.signal).then(() => {
      if (active) setResult({ signature, state: "ready", message: "" });
    }).catch((error: unknown) => {
      if (active) setResult({ signature, state: "error", message: error instanceof Error ? error.message : browserPrintFitHelp });
    });
    return () => { active = false; controller.abort(); };
  }, [signature, options]);
  const belowHref = typeof window !== "undefined" && options.wordBankPlacement === "beside" && /^\/(print|pdf|answer-key)\//.test(window.location.pathname)
    ? `?${serializePuzzleOutputOptions({ ...options, wordBankPlacement: "below" })}` : null;
  return <div ref={marker} className="print-fit-status" data-fit-state={state} role="status">
    {state === "checking" ? "Checking worksheet print fit. Wait before printing." : result.message}
    {state === "error" && <> {belowHref && <a href={belowHref}>Use a bank below the grid</a>} <a href={editHref}>Edit puzzle and print settings</a></>}
  </div>;
}
