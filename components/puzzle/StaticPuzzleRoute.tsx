"use client";

import Link from "next/link";
import { FileDown, Printer } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { OnlineSolver } from "@/components/puzzle/OnlineSolver";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { PuzzleSvg } from "@/components/puzzle/PuzzleSvg";
import { downloadBrowserPuzzlePdf } from "@/lib/pdf/browser-download";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { outputOptionsForRequest, parsePuzzleOutputOptions, serializePuzzleOutputOptions, type PuzzleOutputOptions } from "@/lib/puzzle/output-options";
import type { PuzzleResult } from "@/lib/puzzle/types";
import { decodePuzzleShareState, puzzlePlayUrl, puzzleRecoveryLink } from "@/lib/share-state/state";
import styles from "./StaticPuzzleRoute.module.css";

export type StaticPuzzleRouteKind = "play" | "print" | "pdf" | "answer-key" | "embed" | "custom";

interface LoadedPuzzleRoute {
  puzzle: PuzzleResult;
  options: PuzzleOutputOptions;
}

function outputHelp(kind: StaticPuzzleRouteKind) {
  return kind === "pdf"
    ? "Download a real PDF generated entirely in this browser, or use browser print."
    : kind === "answer-key"
      ? "This answer key uses the same deterministic placements as the puzzle."
      : "Use your browser print command. This page has print-only CSS and no ads.";
}

function LoadingPreview({ kind }: { kind: StaticPuzzleRouteKind }) {
  if (kind === "embed") return <div className={styles.embed}><h1 className="sr-only">Checking puzzle link…</h1><div className={styles.grid} aria-hidden="true" /></div>;
  if (kind === "play" || kind === "custom") return <>
    <h1>Checking puzzle link…</h1>
    <p className="value-prop">Trace each hidden word from its first letter to its last. Print, PDF, answers, share, and QR all preserve this exact seed and placement set.</p>
    <div className={styles.solver}><p role="status">The encoded definition is being checked before a playable grid is shown.</p><div className={styles.grid} aria-hidden="true" /></div>
  </>;
  return <>
    <div className={`preview-toolbar static-utility-controls ${styles.checking}`}>
      <p className="control-help">{outputHelp(kind)}</p>
      <div className="utility-actions">
        <button type="button" className="secondary-button" disabled><Printer size={17} aria-hidden="true" /> Print</button>
        {kind === "pdf" && <button type="button" className="primary-button" disabled><FileDown size={17} aria-hidden="true" /> Download this PDF</button>}
      </div>
    </div>
    <div className={styles.paper}>
      <div className="print-header">
        <div><p className="print-brand">www.iLoveWordSearch.com</p><h1>{kind === "answer-key" ? "Checking answers…" : "Checking puzzle…"}</h1><p className="print-instructions">Validating the link before any puzzle output is enabled.</p></div>
        {kind !== "answer-key" && <div className="name-date" aria-hidden="true"><span>Name</span><span>Date</span></div>}
      </div>
      <div className={styles.grid} aria-hidden="true" />
      {kind !== "answer-key" && <div className={`print-word-bank ${styles.bank}`} aria-hidden="true"><span /><span /><span /></div>}
      <div className="print-footer" aria-hidden="true"><div><strong>Checking link</strong><span>The preview appears after validation.</span></div><div className={styles.qr} /></div>
    </div>
  </>;
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
  const [recovery, setRecovery] = useState<ReturnType<typeof puzzleRecoveryLink>>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrFailed, setQrFailed] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<"idle" | "working" | "error">("idle");
  const [pdfError, setPdfError] = useState("");
  const [printMessage, setPrintMessage] = useState("");
  const pdfJob = useRef(0);
  const pdfMounted = useRef(false);
  const currentPdf = useRef({ loaded, status });
  currentPdf.current = { loaded, status };

  useEffect(() => {
    pdfMounted.current = true;
    return () => { pdfMounted.current = false; };
  }, []);

  useLayoutEffect(() => {
    if (status === "loading") {
      document.documentElement.dataset.ilwsUtilityPending = "true";
      document.documentElement.classList.add(styles.pending);
    } else {
      delete document.documentElement.dataset.ilwsUtilityPending;
      document.documentElement.classList.remove(styles.pending);
    }
    return () => {
      delete document.documentElement.dataset.ilwsUtilityPending;
      document.documentElement.classList.remove(styles.pending);
    };
  }, [status]);

  useEffect(() => {
    const encoded = encodedStateFromLocation(kind);
    setRecovery(null);
    try {
      const request = decodePuzzleShareState(encoded);
      if (!request) {
        setRecovery(puzzleRecoveryLink(encoded));
        setStatus("invalid");
        return;
      }
      const puzzle = generatePuzzle(request);
      setLoaded({
        puzzle,
        options: parsePuzzleOutputOptions(window.location.search, outputOptionsForRequest(puzzle.request))
      });
      setStatus("ready");
    } catch (error) {
      setRecovery(puzzleRecoveryLink(encoded, error));
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
    setQrFailed(false);
    import("qrcode")
      .then((QRCode) => QRCode.toDataURL(shareTarget, { margin: 4, width: 224, errorCorrectionLevel: "M" }))
      .then((value) => {
        if (active) setQrDataUrl(value);
      })
      .catch(() => {
        if (active) { setQrDataUrl(""); setQrFailed(true); }
      });
    return () => {
      active = false;
    };
  }, [loaded, shareTarget]);

  async function downloadPdf() {
    if (!loaded) return;
    const job = ++pdfJob.current;
    const selected = loaded;
    const selectedPath = window.location.pathname + window.location.search;
    const isCurrent = () => pdfMounted.current && pdfJob.current === job && currentPdf.current.status === "ready" && currentPdf.current.loaded === selected && window.location.pathname + window.location.search === selectedPath;
    setPdfStatus("working");
    setPdfError("");
    try {
      const downloaded = await downloadBrowserPuzzlePdf(selected.puzzle, selected.options, shareTarget, "legacy", isCurrent);
      if (downloaded && isCurrent()) setPdfStatus("idle");
    } catch (error) {
      if (!isCurrent()) return;
      setPdfStatus("error");
      setPdfError(error instanceof Error ? error.message : "The PDF could not be generated.");
    } finally { if (pdfMounted.current && pdfJob.current === job) setPdfStatus((current) => current === "working" ? "idle" : current); }
  }

  function printBrowser() {
    const unavailable = document.querySelector<HTMLElement>('main[data-utility-state="ready"] .print-fit-status:not([data-fit-state="ready"])');
    if (unavailable) {
      setPrintMessage(unavailable.textContent ?? "Wait for the worksheet print check before printing.");
      return;
    }
    setPrintMessage("");
    window.print();
  }

  if (status === "loading") {
    return (
      <main className={`utility-page site-shell ${styles.checking}`} data-utility-state="loading">
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.dataset.ilwsUtilityPending="true";document.documentElement.classList.add(${JSON.stringify(styles.pending)})` }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: `.${styles.checking} > :not(noscript):not([data-utility-recovery]){display:none}` }} />
          <h1>JavaScript is required for a shared puzzle</h1>
          <p>The puzzle link cannot be checked or generated without JavaScript. You can still browse the published catalog below.</p>
        </noscript>
        <section aria-busy="true" aria-label="Checking shared puzzle"><LoadingPreview kind={kind} /></section>
        <p className={styles.printChecking}>Please wait for the puzzle link to be checked before printing.</p>
        <p className="control-help" data-utility-recovery>You can <Link href="/topics">browse published topics</Link> or <Link href="/word-search-generator">open the generator</Link>.</p>
      </main>
    );
  }

  if (status === "invalid" || !loaded) {
    return (
      <main className={`utility-page site-shell content-section ${styles.invalid}`} data-utility-state="invalid">
        <h1>{recovery ? "Puzzle needs changes" : "Puzzle link not found"}</h1>
        <p>{recovery ? recovery.message : "The encoded puzzle link is incomplete, invalid, or no longer available. No fallback puzzle was generated."}</p>
        {recovery && <p><Link href={recovery.href} prefetch={false}>Edit this puzzle</Link></p>}
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
          {outputHelp(kind)}
        </p>
        {(puzzle.rows > 25 || puzzle.cols > 25) && <p className="control-help">This long grid fits one sheet using small letters. Choose fewer rows or columns for larger type.</p>}
        <div className="utility-actions">
          <button type="button" className="secondary-button" disabled={options.qrCode && !qrDataUrl} onClick={printBrowser}><Printer size={17} aria-hidden="true" /> Print</button>
          {kind === "pdf" && (
            <button type="button" className="primary-button" disabled={pdfStatus === "working"} onClick={downloadPdf}>
              <FileDown size={17} aria-hidden="true" /> {pdfStatus === "working" ? "Generating…" : pdfStatus === "error" ? "Retry PDF" : "Download this PDF"}
            </button>
          )}
        </div>
        {options.qrCode && !qrDataUrl && <p role="status">{qrFailed ? "The QR code could not be prepared." : "Preparing the QR code before printing."} <a href={`?${serializePuzzleOutputOptions({ ...options, qrCode: false })}`}>Print without a QR code</a>.</p>}
        {pdfStatus === "error" && <div className="output-error" role="alert"><strong>PDF failed.</strong> {pdfError}</div>}
        {printMessage && <p role="status">{printMessage}</p>}
      </div>
      <PrintablePuzzle
        puzzle={puzzle}
        answerKey={answerKey}
        qrDataUrl={qrDataUrl}
        utilityLabel={kind === "pdf" ? "PDF-ready puzzle" : undefined}
        options={options}
        shareTarget={shareTarget}
      />
      {!answerKey && options.includeAnswerKey && <PrintablePuzzle
        puzzle={puzzle}
        answerKey
        headingLevel={2}
        qrDataUrl={qrDataUrl}
        options={options}
        shareTarget={shareTarget}
      />}
    </main>
  );
}
