"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { OnlineSolver } from "@/components/puzzle/OnlineSolver";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { PuzzleSvg } from "@/components/puzzle/PuzzleSvg";
import { downloadBrowserPuzzlePdf } from "@/lib/pdf/browser-download";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { outputOptionsForRequest, parsePuzzleOutputOptions, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";
import type { PuzzleResult } from "@/lib/puzzle/types";
import { decodePuzzleShareState, puzzlePlayUrl } from "@/lib/share-state/state";

export type StaticPuzzleRouteKind = "play" | "print" | "pdf" | "answer-key" | "embed" | "custom";

interface LoadedPuzzleRoute {
  puzzle: PuzzleResult;
  options: PuzzleOutputOptions;
}

function encodedStateFromLocation(kind: StaticPuzzleRouteKind) {
  const prefix = `/${kind}/`;
  const pathname = window.location.pathname.replace(/\/+$/, "");
  if (!pathname.startsWith(prefix)) return null;
  const value = pathname.slice(prefix.length);
  return value && !value.includes("/") ? value : null;
}

export function StaticPuzzleRoute({ kind }: { kind: StaticPuzzleRouteKind }) {
  const [loaded, setLoaded] = useState<LoadedPuzzleRoute | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "invalid">("loading");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "working" | "error">("idle");
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    try {
      const encoded = encodedStateFromLocation(kind);
      const request = decodePuzzleShareState(encoded);
      if (!request) {
        setStatus("invalid");
        return;
      }
      const puzzle = generatePuzzle(request);
      setLoaded({
        puzzle,
        options: parsePuzzleOutputOptions(window.location.search, outputOptionsForRequest(puzzle.request))
      });
      setStatus("ready");
    } catch {
      setStatus("invalid");
    }
  }, [kind]);

  const shareTarget = useMemo(
    () => loaded ? puzzlePlayUrl(loaded.puzzle.request) : "",
    [loaded]
  );

  useEffect(() => {
    if (!loaded?.options.qrCode || !shareTarget) {
      setQrDataUrl("");
      return;
    }
    let active = true;
    import("qrcode")
      .then((QRCode) => QRCode.toDataURL(shareTarget, { margin: 4, width: 224, errorCorrectionLevel: "M" }))
      .then((value) => {
        if (active) setQrDataUrl(value);
      })
      .catch(() => {
        if (active) setQrDataUrl("");
      });
    return () => {
      active = false;
    };
  }, [loaded, shareTarget]);

  async function downloadPdf() {
    if (!loaded) return;
    setPdfStatus("working");
    setPdfError("");
    try {
      await downloadBrowserPuzzlePdf(loaded.puzzle, loaded.options, shareTarget);
      setPdfStatus("idle");
    } catch (error) {
      setPdfStatus("error");
      setPdfError(error instanceof Error ? error.message : "The PDF could not be generated.");
    }
  }

  if (status === "loading") {
    return (
      <main className="utility-page site-shell" aria-busy="true">
        <h1>Loading puzzle…</h1>
        <p className="value-prop">The encoded puzzle is being checked and generated in this browser.</p>
      </main>
    );
  }

  if (status === "invalid" || !loaded) {
    return (
      <main className="utility-page site-shell content-section" data-utility-state="invalid">
        <h1>Puzzle link not found</h1>
        <p>The encoded puzzle link is incomplete, invalid, or no longer available. No fallback puzzle was generated.</p>
        <div className="hero-actions">
          <Link className="primary-button" href="/word-search-generator">Create a puzzle</Link>
          <Link className="secondary-button" href="/topics">Browse topics</Link>
        </div>
      </main>
    );
  }

  const { puzzle, options } = loaded;

  if (kind === "play" || kind === "custom") {
    return (
      <main className="utility-page site-shell" data-utility-state="ready">
        <h1>{puzzle.request.title}</h1>
        <p className="value-prop">Trace each hidden word from its first letter to its last. Print, PDF, answers, share, and QR all preserve this exact seed and placement set.</p>
        <OnlineSolver puzzle={puzzle} />
      </main>
    );
  }

  if (kind === "embed") {
    return (
      <main className="utility-page site-shell" data-utility-state="ready">
        <PuzzleSvg puzzle={puzzle} compact />
      </main>
    );
  }

  const answerKey = kind === "answer-key";
  return (
    <main className="utility-page site-shell" data-utility-state="ready">
      <div className="preview-toolbar static-utility-controls">
        <p className="control-help">
          {kind === "pdf"
            ? "Download a real PDF generated entirely in this browser, or use browser print."
            : answerKey
              ? "This answer key uses the same deterministic placements as the puzzle."
              : "Use your browser print command. This page has print-only CSS and no ads."}
        </p>
        <div className="utility-actions">
          <button type="button" className="secondary-button" onClick={() => window.print()}>Print</button>
          {kind === "pdf" && (
            <button type="button" className="primary-button" disabled={pdfStatus === "working"} onClick={downloadPdf}>
              {pdfStatus === "working" ? "Generating…" : pdfStatus === "error" ? "Retry PDF" : "Download this PDF"}
            </button>
          )}
        </div>
        {pdfStatus === "error" && <div className="output-error" role="alert"><strong>PDF failed.</strong> {pdfError}</div>}
      </div>
      <PrintablePuzzle
        puzzle={puzzle}
        answerKey={answerKey}
        qrDataUrl={qrDataUrl}
        utilityLabel={kind === "pdf" ? "PDF-ready puzzle" : undefined}
        options={options}
        shareTarget={shareTarget}
      />
    </main>
  );
}
