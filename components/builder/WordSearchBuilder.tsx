"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { Download, FileCode2, Play, RefreshCw, Shuffle, Upload } from "lucide-react";
import { defaultPuzzleRequest, generatePuzzle, directionsByDifficulty, directionSelectionError } from "@/lib/puzzle/generate";
import { isEditablePuzzleError, nonblankSeedError, puzzleInputLimits, puzzleRequestError } from "@/lib/puzzle/request-validation";
import type { AlphabetPackId, Difficulty, DirectionKey, FillerMode, PuzzleRequest, PuzzleResult, WordBankOrder } from "@/lib/puzzle/types";
import { nextSeed } from "@/lib/puzzle/prng";
import { decodeShareState, stateId } from "@/lib/share-state/state";
import { PuzzleUtilities } from "@/components/puzzle/PuzzleUtilities";
import { LocalPuzzleLibrary } from "@/components/builder/LocalPuzzleLibrary";
import { getAlphabetPack } from "@/lib/alphabet-packs";
import type { PrintedLetterCase } from "@/lib/puzzle/display-case";
import { downloadGridBlob, gridExportFilename, pngGridBlob, puzzleGridText, standaloneGridSvg } from "@/lib/print/grid-export";

export interface BuilderProps {
  initialRequest: Partial<PuzzleRequest>;
  compact?: boolean;
  persistState?: boolean;
}

const directionLabels: Array<[DirectionKey, string]> = [
  ["E", "→"],
  ["W", "←"],
  ["S", "↓"],
  ["N", "↑"],
  ["SE", "↘"],
  ["SW", "↙"],
  ["NE", "↗"],
  ["NW", "↖"]
];

const packOptions: Array<[AlphabetPackId, string]> = (["latin", "morse", "braille", "binary", "hex", "greek", "kana", "asl"] as const).map((id) => [id, id === "asl" ? "ASL labels (not handshapes)" : getAlphabetPack(id).label]);

function safeLocalStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function validDimension(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isInteger(value)
    && value >= puzzleInputLimits.minDimension && value <= puzzleInputLimits.maxDimension ? value : fallback;
}

export function WordSearchBuilder({ initialRequest, compact = false, persistState = false }: BuilderProps) {
  const [request, setRequest] = useState<Partial<PuzzleRequest>>({
    ...initialRequest,
    seed: initialRequest.seed ?? "ilws-builder",
    title: initialRequest.title ?? "My Word Search",
    difficulty: initialRequest.difficulty ?? "medium",
    wordsText: initialRequest.wordsText ?? ""
  });
  const [debouncedRequest, setDebouncedRequest] = useState(request);
  const [stateLoaded, setStateLoaded] = useState(!persistState);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasUserEdits, setHasUserEdits] = useState(false);
  const [gridExportMessage, setGridExportMessage] = useState("");
  const [pngWorking, setPngWorking] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileReadSequence = useRef(0);
  const editRevision = useRef(0);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const currentExportRequest = useRef(request);
  currentExportRequest.current = request;
  const exportMounted = useRef(true);
  useEffect(() => { exportMounted.current = true; return () => { exportMounted.current = false; }; }, []);
  useEffect(() => { setGridExportMessage(""); }, [request]);
  const lastValidRequest = useRef(request);
  const lastValidPuzzle = useRef<PuzzleResult | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number>();
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const urlStateActive = useRef(false);
  const directionHelpId = useId();
  const alphabetHelpId = useId();
  const customFillerSupported = getAlphabetPack(request.alphabetPack ?? "latin").supportsCustomFiller;

  useEffect(() => {
    if (!persistState) return;
    // Restore before exposing any default puzzle/output controls for a shared URL.
    setStateLoaded(true);
    const encoded = new URLSearchParams(window.location.search).get("state");
    if (encoded !== null) {
      urlStateActive.current = true;
      const sharedState = decodeShareState(encoded);
      if (!sharedState) setLoadError("The shared puzzle configuration is malformed or too large. No fallback puzzle was generated.");
      else {
        const restored = { ...lastValidRequest.current, ...sharedState };
        setRequest(restored);
        setDebouncedRequest(restored);
      }
      return;
    }
    const storage = safeLocalStorage();
    if (!storage) return;
    try {
      const saved = storage.getItem("ilws:last-builder-state");
      if (!saved) return;
      if (saved.length > puzzleInputLimits.maxShareCharacters) {
        setLoadError("The saved puzzle configuration is too large.");
        return;
      }
      const parsed: unknown = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setLoadError("The saved puzzle configuration must be an object.");
        return;
      }
      const restored = { ...lastValidRequest.current, ...parsed };
      setRequest(restored);
      setDebouncedRequest(restored);
    } catch {
      setLoadError("The saved puzzle settings could not be read. Restore the last valid settings to continue.");
    }
  }, [persistState]);

  useEffect(() => {
    if (!persistState) {
      startTransition(() => setDebouncedRequest(request));
      return;
    }
    const handle = window.setTimeout(() => {
      startTransition(() => setDebouncedRequest(request));
    }, 220);
    return () => window.clearTimeout(handle);
  }, [persistState, request, loadError]);

  const directionError = directionSelectionError(request.directions);
  const configurationError = loadError ?? puzzleRequestError(request) ?? (typeof request.seed !== "string" || !request.seed.trim() ? nonblankSeedError : null);
  const generated = useMemo(() => {
    if (!stateLoaded || request !== debouncedRequest || configurationError || puzzleRequestError(debouncedRequest)) return { puzzle: null, error: null };
    try { return { puzzle: generatePuzzle(debouncedRequest), error: null }; }
    catch (error) { return { puzzle: null, error: error instanceof Error ? error.message : "This puzzle could not be generated. Edit the settings and try again." }; }
  }, [debouncedRequest, request, configurationError, stateLoaded]);
  const puzzle = generated.puzzle;
  const requestError = configurationError ?? generated.error;
  useEffect(() => {
    if (puzzle) lastValidRequest.current = request;
  }, [request, puzzle]);
  useEffect(() => {
    if (!persistState || !puzzle || urlStateActive.current || loadError) return;
    const storage = safeLocalStorage();
    try { storage?.setItem("ilws:last-builder-state", JSON.stringify(request)); } catch { /* Editing also works without storage. */ }
  }, [persistState, puzzle, request, loadError]);
  const encoded = useMemo(() => puzzle ? stateId(puzzle.request) : "", [puzzle]);
  useEffect(() => { if (puzzle) lastValidPuzzle.current = puzzle; }, [puzzle]);
  useEffect(() => {
    if (puzzle && previewRef.current) setPreviewHeight(previewRef.current.getBoundingClientRect().height);
  }, [puzzle]);

  function patch(next: Partial<PuzzleRequest>) {
    editRevision.current++;
    setHasUserEdits(true);
    setLoadError(null);
    setRequest((current) => ({ ...current, ...next }));
  }

  function setDifficulty(difficulty: Difficulty) {
    if (request.difficulty === difficulty) return;
    editRevision.current++;
    setHasUserEdits(true);
    setLoadError(null);
    setRequest((current) => current.difficulty === difficulty
      ? current
      : { ...current, difficulty, directions: directionsByDifficulty[difficulty] });
  }

  function toggleDirection(direction: DirectionKey) {
    editRevision.current++;
    setHasUserEdits(true);
    setRequest((current) => {
      const directions = current.directions ?? directionsByDifficulty[current.difficulty ?? "medium"];
      const remaining = directions.filter((item) => item !== direction);
      if (directions.includes(direction) && !remaining.length) return current;
      return { ...current, directions: directions.includes(direction) ? remaining : [...directions, direction] };
    });
  }

  async function downloadGrid(format: "svg" | "png" | "txt", letterCase?: PrintedLetterCase) {
    if (!puzzle) return;
    const definition = request;
    setGridExportMessage("");
    if (format === "png") setPngWorking(true);
    const svg = previewRef.current?.querySelector<SVGSVGElement>(".puzzle-svg") ?? null;
    const displayedGrid = svg?.outerHTML;
    const isCurrent = () => exportMounted.current && currentExportRequest.current === definition && (previewRef.current?.querySelector(".puzzle-svg") ?? null) === svg && svg?.outerHTML === displayedGrid;
    try {
      if (!svg) throw new Error("The grid is not ready. Wait for a valid preview.");
      const hasAnswers = svg.querySelector("line") !== null;
      const blob = format === "png" ? await pngGridBlob(svg)
        : format === "txt" ? new Blob([puzzleGridText(puzzle, { alphabetPack: puzzle.request.alphabetPack, letterCase })], { type: "text/plain;charset=utf-8" })
          : new Blob([standaloneGridSvg(svg).markup], { type: "image/svg+xml" });
      if (!isCurrent()) return;
      downloadGridBlob(blob, gridExportFilename(puzzle.request.title, format));
      setGridExportMessage(`${format.toUpperCase()} grid downloaded.${format !== "txt" && hasAnswers ? " Includes the visible answer highlights." : ""}`);
    } catch (error) {
      if (isCurrent()) setGridExportMessage(error instanceof Error ? error.message : "The grid could not be downloaded.");
    } finally { if (exportMounted.current) setPngWorking(false); }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const read = ++fileReadSequence.current;
    const revision = editRevision.current;
    const isLatest = () => exportMounted.current && fileReadSequence.current === read;
    if (file.size > 64_000) {
      setUploadMessage("");
      setLoadError("The word-list file is too large. Use at most 16000 characters and 200 words.");
      return;
    }
    setUploadMessage("Reading word list…");
    try {
      const text = await file.text();
      if (!isLatest()) return;
      if (editRevision.current !== revision) {
        setUploadMessage("Your edits were kept. Upload the file again to replace the word list.");
        return;
      }
      patch({ wordsText: text });
      setUploadMessage("Word list loaded.");
    } catch {
      if (isLatest()) setUploadMessage("The word-list file could not be read. Your words were kept. Try uploading it again.");
    }
  }

  if (!stateLoaded) {
    return <section className="builder-loading-shell" aria-busy="true"><p>Checking saved puzzle settings…</p></section>;
  }

  const editableSemanticError = isEditablePuzzleError(requestError);
  if ((requestError || !puzzle) && !hasUserEdits && !editableSemanticError) {
    return (
      <section className="builder-surface content-section" aria-label="Word search builder">
        <h2>Check puzzle settings</h2>
        <p role="alert">{requestError ?? "Updating puzzle settings…"} No puzzle can be played, shared, printed, or exported until the settings are valid.</p>
        {directionError && <button type="button" className="primary-button" onClick={() => patch({ difficulty: "medium", directions: directionsByDifficulty.medium })}>
          Use medium preset directions
        </button>}
        {!directionError && <button type="button" className="primary-button" onClick={() => {
          setLoadError(null);
          setRequest({ ...(puzzleRequestError(lastValidRequest.current) ? defaultPuzzleRequest : lastValidRequest.current) });
        }}>Restore last valid settings</button>}
      </section>
    );
  }

  const placedLabels = new Set(puzzle?.placed.map((placement) => placement.wordId) ?? []);
  const directions = request.directions ?? directionsByDifficulty[request.difficulty ?? "medium"];
  const previewRows = puzzle?.rows ?? lastValidPuzzle.current?.rows ?? 12;
  const previewCols = puzzle?.cols ?? lastValidPuzzle.current?.cols ?? 12;
  const outputPuzzle = puzzle ?? lastValidPuzzle.current;

  return (
    <section className={`builder-surface ${compact ? "compact" : ""}`} aria-label="Word search builder">
      <div className="builder-head">
        <div>
          <h2>Build a word search</h2>
          <p>Preview, print, answer key, play, and share all use the same seed.</p>
        </div>
        <div className="builder-status" aria-live="polite">
          {puzzle ? <>
          <span>{puzzle.placed.length} placed</span>
          <span>{puzzle.excluded.length} excluded</span>
          <span>{puzzle.rows}×{puzzle.cols}</span>
          </> : <span>Check puzzle settings</span>}
        </div>
      </div>
      {persistState && <LocalPuzzleLibrary request={puzzle?.request ?? null} onOpen={(saved) => {
        editRevision.current++;
        setHasUserEdits(true);
        setLoadError(null);
        setRequest({ ...saved });
      }} />}
      {persistState && <div className="builder-shortcuts" role="group" aria-label="Maker sections">
        <button type="button" className="secondary-button" onClick={() => { controlsRef.current?.focus({ preventScroll: true }); controlsRef.current?.scrollIntoView({ block: "start" }); }}>Edit words and settings</button>
      </div>}
      <div className="builder-grid">
        <div ref={controlsRef} className="builder-controls" tabIndex={-1} role="group" aria-label="Puzzle words and settings">
          <label>
            Puzzle title
            <input value={request.title ?? ""} onChange={(event) => patch({ title: event.target.value })} />
          </label>
          <label>
            Words and clues
            <textarea
              value={request.wordsText ?? ""}
              onChange={(event) => patch({ wordsText: event.target.value })}
              spellCheck={false}
              rows={compact ? 6 : 9}
              aria-describedby="word-input-help"
            />
          </label>
          <p id="word-input-help" className="control-help">{request.wordBankMode === "clues"
            ? <>One <code>ANSWER | clue</code> per line. Commas and tabs remain inside the clue. TXT uploads use this same format.</>
            : <>One word per line, comma-separated, or TXT/CSV/TSV upload. Choose Numbered clues under Student bank to print clues instead of answers.</>}</p>
          <div className="control-row">
            <button type="button" className="secondary-button" onClick={() => fileInput.current?.click()}>
              <Upload size={16} aria-hidden="true" /> {request.wordBankMode === "clues" ? "Upload clue text" : "Upload TXT/CSV/TSV"}
            </button>
            <input ref={fileInput} hidden type="file" accept={request.wordBankMode === "clues" ? ".txt,text/plain" : ".txt,.csv,.tsv,text/plain,text/csv"} onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; void handleFile(file); }} />
            <button type="button" className="secondary-button" onClick={() => patch({ wordsText: initialRequest.wordsText ?? request.wordsText })}>
              <RefreshCw size={16} aria-hidden="true" /> Sample
            </button>
          </div>
          <div className={uploadMessage ? undefined : "sr-only"} role="status" aria-live="polite" aria-atomic="true">{uploadMessage && <p className="control-help">{uploadMessage}</p>}</div>
          {persistState && <button type="button" className="secondary-button builder-preview-shortcut" onClick={() => { previewRef.current?.focus({ preventScroll: true }); previewRef.current?.scrollIntoView({ block: "start" }); }}>Preview and print</button>}
          <fieldset>
            <legend>Difficulty</legend>
            <div className="segmented">
              {(["easy", "medium", "hard"] as Difficulty[]).map((difficulty) => (
                <button
                  type="button"
                  key={difficulty}
                  className={request.difficulty === difficulty ? "active" : ""}
                  aria-pressed={request.difficulty === difficulty}
                  onClick={() => setDifficulty(difficulty)}
                >
                  {difficulty}
                </button>
              ))}
            </div>
            <p className="control-help">Choosing a different difficulty applies its direction preset. Selecting the current difficulty keeps your directions.</p>
          </fieldset>
          <fieldset>
            <legend>Alphabet pack</legend>
            <select aria-label="Alphabet pack" aria-describedby={alphabetHelpId} value={request.alphabetPack ?? "latin"} onChange={(event) => patch({ alphabetPack: event.target.value as AlphabetPackId })}>
              {request.alphabetPack && !packOptions.some(([id]) => id === request.alphabetPack) && <option value={request.alphabetPack}>{request.alphabetPack === "emoji" ? "Geometric symbols (legacy mapping)" : `${request.alphabetPack === "spanish" ? "Spanish" : "French"} (accent-normalized Latin)`}</option>}
              {packOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
            <p id={alphabetHelpId} className="control-help">{getAlphabetPack(request.alphabetPack ?? "latin").description}</p>
          </fieldset>
          <div className="size-grid">
            <label>
              <input type="checkbox" checked={request.autoSize ?? true} onChange={(event) => patch({ autoSize: event.target.checked, rows: validDimension(request.rows, previewRows), cols: validDimension(request.cols, previewCols) })} />
              Auto size
            </label>
            <label>
              Rows
              <input type="number" min={6} max={40} value={request.rows === undefined ? previewRows : Number.isFinite(request.rows) ? request.rows : ""} disabled={request.autoSize ?? true} onChange={(event) => patch({ rows: event.target.value === "" ? NaN : Number(event.target.value), cols: request.cols ?? previewCols, autoSize: false })} />
            </label>
            <label>
              Columns
              <input type="number" min={6} max={40} value={request.cols === undefined ? previewCols : Number.isFinite(request.cols) ? request.cols : ""} disabled={request.autoSize ?? true} onChange={(event) => patch({ cols: event.target.value === "" ? NaN : Number(event.target.value), rows: request.rows ?? previewRows, autoSize: false })} />
            </label>
          </div>
          <fieldset>
            <legend>Directions</legend>
            <div className="direction-grid">
              {directionLabels.map(([direction, label]) => (
                <button
                  type="button"
                  key={direction}
                  className={directions.includes(direction) ? "active" : ""}
                  onClick={() => toggleDirection(direction)}
                  aria-label={`Toggle ${direction} direction`}
                  aria-pressed={directions.includes(direction)}
                  aria-disabled={directions.includes(direction) && directions.every((item) => item === direction)}
                  aria-describedby={directionHelpId}
                >
                  {label}
                </button>
              ))}
            </div>
            <p id={directionHelpId} className="control-help">Keep at least one direction selected. To remove the last direction, select another direction first.</p>
          </fieldset>
          <div className="checkbox-list">
            <label><input type="checkbox" checked={request.allowOverlap ?? true} onChange={(event) => patch({ allowOverlap: event.target.checked })} /> Allow overlap</label>
            <label><input type="checkbox" checked={request.largePrint ?? false} onChange={(event) => patch({ largePrint: event.target.checked })} /> Larger grid type</label>
            <label><input type="checkbox" checked={request.showCoordinates ?? false} onChange={(event) => patch({ showCoordinates: event.target.checked })} /> Coordinates</label>
            <label><input type="checkbox" checked={request.nameDateLine ?? true} onChange={(event) => patch({ nameDateLine: event.target.checked })} /> Name/date line</label>
          </div>
          <p className="control-help">Share-link defaults update this preview. Larger grid type can change auto-sized dimensions; it does not guarantee a minimum word-bank size. For measured grid and word-bank sizes, choose the large-print option in Download PDF.</p>
          <details className="advanced-controls">
            <summary>Advanced print and fill controls</summary>
            <label>
              Student bank
              <select aria-label="Student bank" value={request.wordBankMode ?? "words"} onChange={(event) => patch({ wordBankMode: event.target.value as "words" | "clues" })}>
                <option value="words">Words to find</option>
                <option value="clues">Numbered clues</option>
              </select>
            </label>
            <p className="control-help">Clue mode uses one ANSWER | clue per line. Commas and later | characters stay in the clue. Every answer needs a clue. Student pages show clues; included answer pages map each number to its answer. The answer grid and shared definition still contain the answers.</p>
            <label>
              Puzzle seed
              <input value={request.seed ?? ""} maxLength={256} onChange={(event) => patch({ seed: event.target.value })} />
            </label>
            <p className="control-help">Keep the same title, words, seed, and settings to reproduce the same grid. Shuffle chooses another seed.</p>
            <label>
              Word bank order
              <select aria-label="Word bank order" value={request.wordBankOrder ?? "alphabetical"} onChange={(event) => patch({ wordBankOrder: event.target.value as WordBankOrder })}>
                <option value="alphabetical">Alphabetical</option>
                <option value="length">Shortest to longest</option>
                <option value="input">Input order</option>
                {request.wordBankOrder === "custom" && <option value="custom">Placement order (legacy)</option>}
              </select>
            </label>
            <label>
              Filler mode
              <select aria-label="Filler mode" value={request.fillerMode ?? "alphabet"} onChange={(event) => patch(event.target.value === "alphabet" ? { fillerMode: "alphabet", customFiller: "" } : { fillerMode: event.target.value as FillerMode })}>
                <option value="alphabet">Alphabet pack defaults</option>
                <option value="used">Letters or tokens in placed words</option>
                <option value="custom" disabled={!customFillerSupported}>Custom characters</option>
                <option value="rare" disabled={(request.alphabetPack ?? "latin") !== "latin"}>Rare-letter mix (Latin only)</option>
              </select>
            </label>
            {request.fillerMode === "rare" && (request.alphabetPack ?? "latin") !== "latin" && <p className="control-help">Rare-letter filler is defined for Latin only. This saved definition uses the selected pack&apos;s existing filler behavior; choose another mode to change it.</p>}
            {customFillerSupported && request.fillerMode === "custom" && !request.customFiller?.trim() && <p className="control-help">Custom filler is empty, so the pack&apos;s existing defaults are used. Enter characters below or select alphabet defaults.</p>}
            {customFillerSupported && (!request.fillerMode || request.fillerMode === "alphabet") && request.customFiller?.trim() && <div className="control-help">This saved definition has a custom filler override. Its original behavior is preserved. <button type="button" className="secondary-button" onClick={() => patch({ fillerMode: "alphabet", customFiller: "" })}>Use alphabet defaults</button></div>}
            <label>
              Instructions
              <textarea value={request.instructions ?? ""} rows={3} onChange={(event) => patch({ instructions: event.target.value })} />
            </label>
            <label>
              Hidden message
              <input value={request.hiddenMessage ?? ""} onChange={(event) => patch({ hiddenMessage: event.target.value })} placeholder="Optional leftover-cell message" />
            </label>
            <p className="control-help">After crossing out placed words, read unused cells from left to right, top to bottom. The message starts there; later cells contain filler. A message that exceeds the remaining space is shortened with a warning.</p>
            <label>
              Custom filler alphabet
              <input value={request.customFiller ?? ""} disabled={!customFillerSupported} onChange={(event) => patch({ customFiller: event.target.value, fillerMode: "custom" })} />
            </label>
            <p className="control-help">{customFillerSupported ? "Entering characters selects Custom filler. Choosing alphabet defaults clears custom filler." : "Custom filler is unavailable for this format. Choose alphabet defaults or placed-word tokens. Saved custom settings retain the original fallback."}</p>
          </details>
        </div>
        <div ref={previewRef} className="builder-preview" tabIndex={-1} role="group" aria-label="Puzzle preview and downloads" aria-busy={isPending || !puzzle} style={puzzle ? undefined : { minHeight: previewHeight }}>
          {outputPuzzle ? <PuzzleUtilities puzzle={outputPuzzle} outputsBlocked={!puzzle} leadingActions={<>
            <button type="button" className="primary-button" onClick={() => patch({ seed: nextSeed(String(request.seed ?? "seed")) })}>
              <Shuffle size={16} aria-hidden="true" /> Shuffle
            </button>
            <a className="utility-link" href={`/play/${encoded}`}><Play size={16} aria-hidden="true" /> Play</a>
          </>}>
          {({ previewToolbar, printablePreview, downloadHtmlWorksheet, htmlExportMessage, htmlExportWorking, options }) => puzzle ? <>
          {previewToolbar}
          {printablePreview}
          <div className="validation-panel" aria-live="polite">
            {puzzle.warnings.length ? (
              <ul>
                {puzzle.warnings.map((warning) => <li key={warning}>{warning}</li>)}
              </ul>
            ) : (
              <p>All words fit. Seed: <code>{puzzle.request.seed}</code></p>
            )}
            {puzzle.excluded.length > 0 && (
              <div className="excluded-list">
                <strong>Excluded:</strong>
                {puzzle.excluded.map(({ word, reason }) => <span key={word.id}>{word.label}: {reason}</span>)}
              </div>
            )}
          </div>
          <div className="export-row">
            <button type="button" onClick={() => downloadGrid("svg")}><Download size={16} aria-hidden="true" /> SVG grid</button>
            <button type="button" disabled={pngWorking} onClick={() => downloadGrid("png")}><Download size={16} aria-hidden="true" /> {pngWorking ? "Creating PNG…" : "PNG grid"}</button>
            <button type="button" onClick={() => downloadGrid("txt", options.letterCase)}><FileCode2 size={16} aria-hidden="true" /> Grid text</button>
            <button type="button" disabled={htmlExportWorking} onClick={downloadHtmlWorksheet}><FileCode2 size={16} aria-hidden="true" /> {htmlExportWorking ? "Checking HTML…" : "HTML worksheet"}</button>
            <span>Print, PDF, answer key, play, share, and QR all use this exact seeded state.</span>
            {!persistState && <a href={puzzle.sharePath}>Open in maker to save</a>}
          </div>
          <p className="control-help">SVG and PNG save the displayed grid, including visible answers, for your own documents. Grid text saves one tab-separated cell per column. These files contain puzzle letters; keep private puzzles private.</p>
          <p className="control-help" role="status" aria-live="polite" aria-atomic="true">{gridExportMessage}</p>
          <p className="control-help">HTML saves an offline, script-free worksheet with the current paper/layout choices and any included answer page. QR and share links are omitted. It contains your words; keep the file private. Browser printing can use extra sheets for crowded content; use PDF for fixed page layout.</p>
          <div role="status" aria-live="polite" aria-atomic="true">{htmlExportMessage && <p className="control-help">{htmlExportMessage}</p>}</div>
          <div className="sr-only" aria-live="polite">
            {puzzle.placed.length} words placed. {puzzle.excluded.length} words excluded. {Array.from(placedLabels).length} unique placed answers.
          </div>
          </> : <p role={requestError ? "alert" : "status"}>{requestError ?? "Updating puzzle settings…"} Correct the settings above to preview, play, share, print, or export.</p>}
          </PuzzleUtilities> : <p role={requestError ? "alert" : "status"}>{requestError ?? "Updating puzzle settings…"} Correct the settings above to preview, play, share, print, or export.</p>}
        </div>
      </div>
    </section>
  );
}
