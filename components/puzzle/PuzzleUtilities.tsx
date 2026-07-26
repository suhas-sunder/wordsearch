"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, FileDown, KeyRound, Printer, Share2, X } from "lucide-react";
import type { PuzzleResult } from "@/lib/puzzle/types";
import {
  normalizePuzzleOutputOptions,
  outputOptionsForRequest,
  type PageOrientation,
  type PaperSize,
  type PuzzleOutputOptions
} from "@/lib/puzzle/output-options";
import { downloadBrowserPuzzlePdf } from "@/lib/pdf/browser-download";
import { puzzlePlayUrl } from "@/lib/share-state/state";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";

const outputStorageKey = "ilws:puzzle-output-options";

type UtilityDialog = "print" | "pdf" | "share" | "answers" | null;
export type PreviewMode = "puzzle" | "answer";

export interface PuzzleUtilitiesContext {
  answersVisible: boolean;
  previewMode: PreviewMode;
  options: PuzzleOutputOptions;
  compactToolbar: ReactNode;
  previewToolbar: ReactNode;
  printablePreview: ReactNode;
}

interface PuzzleUtilitiesProps {
  puzzle: PuzzleResult;
  unfinished?: boolean;
  leadingActions?: ReactNode;
  onAnnouncement?: (message: string) => void;
  children: (context: PuzzleUtilitiesContext) => ReactNode;
}

function optionCheckbox(
  label: string,
  checked: boolean,
  onChange: (checked: boolean) => void
) {
  return (
    <label className="output-checkbox">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function PuzzleUtilities({ puzzle, unfinished = false, leadingActions, onAnnouncement, children }: PuzzleUtilitiesProps) {
  const [options, setOptions] = useState(() => outputOptionsForRequest(puzzle.request));
  const [answersVisible, setAnswersVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("puzzle");
  const [dialog, setDialog] = useState<UtilityDialog>(null);
  const [mounted, setMounted] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [qrStatus, setQrStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [pdfStatus, setPdfStatus] = useState<"idle" | "working" | "error">("idle");
  const [pdfError, setPdfError] = useState("");
  const [utilityAnnouncement, setUtilityAnnouncement] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const qrTargetRef = useRef("");
  const playUrl = useMemo(() => puzzlePlayUrl(puzzle.request), [puzzle.request]);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("utility-print-enabled");
    try {
      const stored = window.localStorage.getItem(outputStorageKey);
      if (stored) setOptions((current) => normalizePuzzleOutputOptions(JSON.parse(stored), current));
    } catch {
      try {
        window.localStorage.removeItem(outputStorageKey);
      } catch {
        // Output controls also work when browser storage is unavailable.
      }
    }
    return () => document.body.classList.remove("utility-print-enabled");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(outputStorageKey, JSON.stringify(options));
    } catch {
      // Output controls remain available when browser storage is unavailable.
    }
  }, [mounted, options]);

  useEffect(() => {
    if (!options.qrCode && dialog !== "share") {
      setQrDataUrl("");
      setQrStatus("idle");
      return;
    }
    if (qrDataUrl && qrTargetRef.current === playUrl) return;
    let active = true;
    setQrStatus("generating");
    import("qrcode")
      .then((QRCode) => QRCode.toDataURL(playUrl, { margin: 4, width: 224, errorCorrectionLevel: "M" }))
      .then((url) => { if (active) { qrTargetRef.current = playUrl; setQrDataUrl(url); setQrStatus("ready"); } })
      .catch(() => { if (active) { setQrDataUrl(""); setQrStatus("error"); } });
    return () => { active = false; };
  }, [dialog, options.qrCode, playUrl, qrDataUrl]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (dialog && !element.open) {
      element.showModal();
      window.requestAnimationFrame(() => initialFocusRef.current?.focus());
    }
    if (!dialog && element.open) element.close();
  }, [dialog]);

  function announce(message: string) {
    setUtilityAnnouncement(message);
    onAnnouncement?.(message);
  }

  function updateOptions(patch: Partial<PuzzleOutputOptions>) {
    setOptions((current) => normalizePuzzleOutputOptions({ ...current, ...patch }, current));
  }

  function openDialog(next: Exclude<UtilityDialog, null>, event: React.MouseEvent<HTMLElement>) {
    returnFocusRef.current = event.currentTarget;
    setPdfStatus("idle");
    setPdfError("");
    setShareMessage("");
    setDialog(next);
  }

  function closeDialog() {
    setDialog(null);
    window.requestAnimationFrame(() => returnFocusRef.current?.focus());
  }

  function toggleAnswers() {
    if (!answersVisible && unfinished) return;
    const next = !answersVisible;
    setAnswersVisible(next);
    announce(next ? "All answers are visible. Found-word progress is unchanged." : "Answers hidden. Found-word progress is unchanged.");
  }

  function requestAnswerToggle(event: React.MouseEvent<HTMLButtonElement>) {
    if (answersVisible) {
      toggleAnswers();
      return;
    }
    if (unfinished) {
      openDialog("answers", event);
      return;
    }
    toggleAnswers();
  }

  function confirmAnswers() {
    setAnswersVisible(true);
    closeDialog();
    announce("All answers are visible. Found-word progress is unchanged.");
  }

  function togglePreviewMode() {
    const next = previewMode === "puzzle" ? "answer" : "puzzle";
    setPreviewMode(next);
    announce(next === "answer" ? "Answer key preview is visible." : "Puzzle preview is visible.");
  }

  function startPrint() {
    closeDialog();
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => window.print()));
  }

  async function downloadPdf() {
    setPdfStatus("working");
    setPdfError("");
    try {
      await downloadBrowserPuzzlePdf(puzzle, options, playUrl);
      setPdfStatus("idle");
      closeDialog();
      announce("PDF download started.");
    } catch (error) {
      setPdfStatus("error");
      setPdfError(error instanceof Error ? error.message : "The PDF could not be generated.");
    }
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(playUrl);
      setShareCopied(true);
      setShareMessage("Link copied.");
      announce("Puzzle play link copied. It opens the same unsolved seeded puzzle.");
      window.setTimeout(() => setShareCopied(false), 1_800);
    } catch {
      setShareCopied(false);
      setShareMessage("Copy was not available. Select the URL above and copy it manually.");
      announce("Select the share URL and copy it manually.");
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: puzzle.request.title, text: "Solve this word search", url: playUrl });
      setShareMessage("Share sheet opened.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareMessage("Sharing was not completed. Copy the link instead.");
      announce("Sharing was not completed. You can copy the link instead.");
    }
  }

  const solverAnswerButton = (
    <button type="button" className={`secondary-button ${answersVisible ? "active" : ""}`} aria-pressed={answersVisible} onClick={requestAnswerToggle}>
      <KeyRound size={17} aria-hidden="true" /> {answersVisible ? "Hide Answers" : "Show Answers"}
    </button>
  );

  const previewAnswerButton = (
    <button
      type="button"
      className={`secondary-button ${previewMode === "answer" ? "active" : ""}`}
      aria-pressed={previewMode === "answer"}
      onClick={togglePreviewMode}
    >
      <KeyRound size={17} aria-hidden="true" /> {previewMode === "answer" ? "Hide Answers" : "Show Answers"}
    </button>
  );

  const utilityButtons = (
    <>
      <button type="button" className="secondary-button" onClick={(event) => openDialog("print", event)}><Printer size={17} aria-hidden="true" /> Print</button>
      <button type="button" className="secondary-button" onClick={(event) => openDialog("pdf", event)}><FileDown size={17} aria-hidden="true" /> Download PDF</button>
      {solverAnswerButton}
      <button type="button" className="secondary-button" onClick={(event) => openDialog("share", event)}><Share2 size={17} aria-hidden="true" /> Share</button>
    </>
  );

  const compactToolbar = <>{utilityButtons}</>;
  const previewToolbar = (
    <div className="preview-toolbar output-preview-toolbar" aria-label="Preview and output controls">
      <label>Paper<select value={options.paperSize} onChange={(event) => updateOptions({ paperSize: event.target.value as PaperSize })}><option value="letter">Letter</option><option value="a4">A4</option></select></label>
      <label>Layout<select value={options.orientation} onChange={(event) => updateOptions({ orientation: event.target.value as PageOrientation })}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
      {optionCheckbox("Large print", options.printScale === "large", (checked) => updateOptions({ printScale: checked ? "large" : "standard" }))}
      {optionCheckbox("Name/date", options.nameDateLine, (checked) => updateOptions({ nameDateLine: checked }))}
      <div className="preview-toolbar-actions" role="group" aria-label="Preview actions">
        <button type="button" className="secondary-button" onClick={(event) => openDialog("share", event)}><Share2 size={17} aria-hidden="true" /> Share</button>
        <button type="button" className="secondary-button" onClick={(event) => openDialog("print", event)}><Printer size={17} aria-hidden="true" /> Print this puzzle</button>
        <button type="button" className="secondary-button" onClick={(event) => openDialog("pdf", event)}><FileDown size={17} aria-hidden="true" /> Download PDF</button>
        {previewAnswerButton}
      </div>
      {leadingActions && <div className="preview-toolbar-context-actions" role="group" aria-label="Puzzle actions">{leadingActions}</div>}
    </div>
  );

  const printablePreview = (
    <div className="preview-paper preview-paper-single" data-preview-mode={previewMode}>
      <PrintablePuzzle
        puzzle={puzzle}
        answerKey={previewMode === "answer"}
        qrDataUrl={qrDataUrl}
        headingLevel={2}
        options={options}
        shareTarget={playUrl}
      />
    </div>
  );

  const printPortal = mounted ? createPortal(
    <div className="utility-print-portal" aria-hidden="true">
      <PrintablePuzzle puzzle={puzzle} qrDataUrl={qrDataUrl} options={options} shareTarget={playUrl} headingLevel={2} />
      {options.includeAnswerKey && <PrintablePuzzle puzzle={puzzle} answerKey qrDataUrl={qrDataUrl} options={options} shareTarget={playUrl} headingLevel={2} />}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {children({ answersVisible, previewMode, options, compactToolbar, previewToolbar, printablePreview })}
      {printPortal}
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{utilityAnnouncement}</p>
      <dialog
        ref={dialogRef}
        className="solver-settings-dialog output-dialog"
        aria-labelledby="output-dialog-title"
        aria-describedby="output-dialog-description"
        onCancel={(event) => { event.preventDefault(); closeDialog(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }}
      >
        <div className="solver-dialog-panel">
          <header>
            <div>
              <p className="eyebrow">Puzzle utilities</p>
              <h2 id="output-dialog-title">{dialog === "answers" ? "Show puzzle answers?" : dialog === "share" ? "Share this puzzle" : dialog === "pdf" ? "Download PDF" : "Print puzzle"}</h2>
            </div>
            <button type="button" className="icon-button" onClick={closeDialog} aria-label="Close dialog"><X aria-hidden="true" /></button>
          </header>

          {dialog === "answers" ? (
            <div className="answer-confirm-body">
              <p id="output-dialog-description">Every placed word path will appear on the current grid. Revealed answers will not count as found, change your progress, or trigger completion.</p>
              <footer>
                <button ref={initialFocusRef} type="button" className="secondary-button" onClick={closeDialog}>Keep solving</button>
                <button type="button" className="primary-button" onClick={confirmAnswers}><KeyRound size={17} aria-hidden="true" /> Show answers</button>
              </footer>
            </div>
          ) : dialog === "share" ? (
            <div className="share-dialog-body">
              <h3>{puzzle.request.title}</h3>
              <p id="output-dialog-description">Anyone with this link gets the same seed, grid, word placements, and unsolved starting state.</p>
              {qrDataUrl ? <img src={qrDataUrl} alt="QR code for the puzzle play link" /> : <div className="share-qr-loading" role="status">{qrStatus === "error" ? "QR code could not be generated. The share link is still available." : "Preparing QR code…"}</div>}
              <label>Share URL<input readOnly value={playUrl} onFocus={(event) => event.currentTarget.select()} /></label>
              <div className="utility-actions">
                <button ref={initialFocusRef} type="button" className="primary-button" onClick={copyShareLink}>{shareCopied ? <Check size={17} aria-hidden="true" /> : <Share2 size={17} aria-hidden="true" />}{shareCopied ? "Copied" : "Copy link"}</button>
                {mounted && typeof navigator.share === "function" && <button type="button" className="secondary-button" onClick={nativeShare}>Share with an app</button>}
              </div>
              <p className="share-status" role="status" aria-live="polite">{shareMessage}</p>
            </div>
          ) : (
            <div className="output-dialog-body">
              <p id="output-dialog-description">These settings apply to the on-page print layout and the downloaded PDF.</p>
              <p className="output-summary"><strong>Preview:</strong> {options.paperSize === "a4" ? "A4" : "US Letter"}, {options.orientation}, {options.printScale} type, {options.includeAnswerKey ? "two pages with answer key" : "one puzzle page"}.</p>
              <div className="output-settings-grid">
                <label>Paper size<select value={options.paperSize} onChange={(event) => updateOptions({ paperSize: event.target.value as PaperSize })}><option value="letter">US Letter</option><option value="a4">A4</option></select></label>
                <label>Orientation<select value={options.orientation} onChange={(event) => updateOptions({ orientation: event.target.value as PageOrientation })}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
                <label>Word bank<select value={options.wordBankPlacement} onChange={(event) => updateOptions({ wordBankPlacement: event.target.value as PuzzleOutputOptions["wordBankPlacement"] })}><option value="below">Below the grid</option><option value="beside">Beside the grid</option></select></label>
              </div>
              <div className="output-toggle-grid">
                {optionCheckbox("Large print", options.printScale === "large", (checked) => updateOptions({ printScale: checked ? "large" : "standard" }))}
                {optionCheckbox("Answer key page", options.includeAnswerKey, (checked) => updateOptions({ includeAnswerKey: checked }))}
                {optionCheckbox("Name/date line", options.nameDateLine, (checked) => updateOptions({ nameDateLine: checked }))}
                {optionCheckbox("Instructions", options.instructions, (checked) => updateOptions({ instructions: checked }))}
                {optionCheckbox("QR code", options.qrCode, (checked) => updateOptions({ qrCode: checked }))}
                {optionCheckbox("Coordinates", options.coordinates, (checked) => updateOptions({ coordinates: checked }))}
                {optionCheckbox("Ink-saving key", options.inkSaving, (checked) => updateOptions({ inkSaving: checked }))}
              </div>
              {pdfStatus === "error" && <div className="output-error" role="alert"><strong>PDF failed.</strong> {pdfError}</div>}
              <footer>
                <button ref={initialFocusRef} type="button" className="secondary-button" onClick={closeDialog}>Cancel</button>
                {dialog === "pdf" ? (
                  <button type="button" className="primary-button" disabled={pdfStatus === "working"} onClick={downloadPdf}><FileDown size={17} aria-hidden="true" />{pdfStatus === "working" ? "Generating…" : pdfStatus === "error" ? "Retry PDF" : "Download PDF"}</button>
                ) : (
                  <button type="button" className="primary-button" onClick={startPrint}><Printer size={17} aria-hidden="true" />Open print dialog</button>
                )}
              </footer>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
