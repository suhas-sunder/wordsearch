"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { completionCardPng, elapsedLabel, type CompletionStats } from "@/lib/puzzle/completion-card";

export function CompletionResult({ stats }: { stats: CompletionStats }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [fileSharing, setFileSharing] = useState(false);
  const downloadUrls = useRef(new Set<string>());
  useEffect(() => {
    try { setFileSharing(typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "word-search-result.png", { type: "image/png" })] })); }
    catch { setFileSharing(false); }
    const urls = downloadUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  async function exportResult(share: boolean) {
    if (busy) return;
    setBusy(true); setMessage("");
    try {
      const blob = await completionCardPng(stats);
      if (share) {
        await navigator.share({ files: [new File([blob], "word-search-result.png", { type: "image/png" })], title: "Word search complete", text: "I completed a word search." });
        setMessage("Result image handed to your sharing app.");
      } else {
        const url = URL.createObjectURL(blob);
        downloadUrls.current.add(url);
        const link = document.createElement("a");
        link.href = url; link.download = "word-search-result.png"; link.click();
        window.setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.current.delete(url); }, 1000);
        setMessage("Result image download started.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setMessage("Result image could not be shared or downloaded. Try again.");
    } finally { setBusy(false); }
  }

  return <div className="solver-result-actions">
    <p>Elapsed time: <strong data-testid="completion-elapsed">{elapsedLabel(stats.elapsedMs)}</strong></p>
    <p className="control-help">The image includes only your word count, grid size and elapsed time. It excludes the puzzle title, words, answers and link.</p>
    <div className="utility-actions">
      <button className="secondary-button" type="button" disabled={busy} onClick={() => exportResult(false)}><Download size={17} aria-hidden="true" />{busy ? "Preparing result…" : "Download result image"}</button>
      {fileSharing && <button className="secondary-button" type="button" disabled={busy} onClick={() => exportResult(true)}><Share2 size={17} aria-hidden="true" />Share result image</button>}
    </div>
    <p role="status" aria-live="polite">{message}</p>
  </div>;
}
