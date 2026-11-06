"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { Download, Play, RefreshCw, Shuffle, Upload } from "lucide-react";
import { defaultPuzzleRequest, generatePuzzle, directionsByDifficulty, directionSelectionError } from "@/lib/puzzle/generate";
import { puzzleInputLimits, puzzleRequestError } from "@/lib/puzzle/request-validation";
import type { AlphabetPackId, Difficulty, DirectionKey, PuzzleRequest, PuzzleResult } from "@/lib/puzzle/types";
import { nextSeed } from "@/lib/puzzle/prng";
import { decodeShareState, stateId } from "@/lib/share-state/state";
import { PuzzleUtilities } from "@/components/puzzle/PuzzleUtilities";

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

const packOptions: Array<[AlphabetPackId, string]> = [
  ["latin", "Latin"],
  ["morse", "Morse"],
  ["braille", "Braille"],
  ["binary", "Binary"],
  ["hex", "Hex"],
  ["greek", "Greek"],
  ["kana", "Kana"],
  ["asl", "ASL labels"]
];

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
  const lastValidRequest = useRef(request);
  const lastValidPuzzle = useRef<PuzzleResult | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number>();
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const urlStateActive = useRef(false);
  const directionHelpId = useId();

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
      const storage = safeLocalStorage();
      if (storage && !urlStateActive.current && !loadError && !puzzleRequestError(request)) {
        try { storage.setItem("ilws:last-builder-state", JSON.stringify(request)); } catch { /* Editing also works without storage. */ }
      }
    }, 220);
    return () => window.clearTimeout(handle);
  }, [persistState, request, loadError]);

  const directionError = directionSelectionError(request.directions);
  const requestError = loadError ?? puzzleRequestError(request);
  useEffect(() => {
    if (!requestError) lastValidRequest.current = request;
  }, [request, requestError]);
  const puzzle = useMemo(() => !stateLoaded || request !== debouncedRequest || requestError || puzzleRequestError(debouncedRequest)
    ? null : generatePuzzle(debouncedRequest), [debouncedRequest, request, requestError, stateLoaded]);
  const encoded = useMemo(() => puzzle ? stateId(puzzle.request) : "", [puzzle]);
  useEffect(() => { if (puzzle) lastValidPuzzle.current = puzzle; }, [puzzle]);
  useEffect(() => {
    if (puzzle && previewRef.current) setPreviewHeight(previewRef.current.getBoundingClientRect().height);
  }, [puzzle]);

  function patch(next: Partial<PuzzleRequest>) {
    setHasUserEdits(true);
    setLoadError(null);
    setRequest((current) => ({ ...current, ...next }));
  }

  function setDifficulty(difficulty: Difficulty) {
    patch({ difficulty, directions: directionsByDifficulty[difficulty] });
  }

  function toggleDirection(direction: DirectionKey) {
    setHasUserEdits(true);
    setRequest((current) => {
      const directions = current.directions ?? directionsByDifficulty[current.difficulty ?? "medium"];
      const remaining = directions.filter((item) => item !== direction);
      if (directions.includes(direction) && !remaining.length) return current;
      return { ...current, directions: directions.includes(direction) ? remaining : [...directions, direction] };
    });
  }

  function downloadSvg() {
    if (!puzzle) return;
    const svg = document.querySelector(".builder-preview .puzzle-svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(puzzle.request.title || "word-search").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > 64_000) {
      setLoadError("The word-list file is too large. Use at most 16000 characters and 200 words.");
      return;
    }
    file.text().then((text) => patch({ wordsText: text })).catch(() => setLoadError("The word-list file could not be read."));
  }

  if (!stateLoaded) {
    return <section className="builder-loading-shell" aria-busy="true"><p>Checking saved puzzle settings…</p></section>;
  }

  if ((requestError || !puzzle) && !hasUserEdits) {
    return (
      <section className="builder-surface content-section" aria-label="Word search builder">
        <h2>Check puzzle settings</h2>
        <p role="alert">{requestError ?? "Updating puzzle settings…"} No puzzle can be played, shared, printed, or exported until the settings are valid.</p>
        {directionError && <button type="button" className="primary-button" onClick={() => setRequest((current) => ({ ...current, difficulty: "medium", directions: directionsByDifficulty.medium }))}>
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
      <div className="builder-grid">
        <div className="builder-controls">
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
          <p id="word-input-help" className="control-help">One per line, comma-separated, TSV/TXT upload, or `answer | clue`.</p>
          <div className="control-row">
            <button type="button" className="secondary-button" onClick={() => fileInput.current?.click()}>
              <Upload size={16} aria-hidden="true" /> Upload TXT/CSV/TSV
            </button>
            <input ref={fileInput} hidden type="file" accept=".txt,.csv,.tsv,text/plain,text/csv" onChange={(event) => handleFile(event.target.files?.[0])} />
            <button type="button" className="secondary-button" onClick={() => patch({ wordsText: initialRequest.wordsText ?? request.wordsText })}>
              <RefreshCw size={16} aria-hidden="true" /> Sample
            </button>
          </div>
          <fieldset>
            <legend>Difficulty</legend>
            <div className="segmented">
              {(["easy", "medium", "hard"] as Difficulty[]).map((difficulty) => (
                <button
                  type="button"
                  key={difficulty}
                  className={request.difficulty === difficulty ? "active" : ""}
                  onClick={() => setDifficulty(difficulty)}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Alphabet pack</legend>
            <select aria-label="Alphabet pack" value={request.alphabetPack ?? "latin"} onChange={(event) => patch({ alphabetPack: event.target.value as AlphabetPackId })}>
              {packOptions.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
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
            <label><input type="checkbox" checked={request.largePrint ?? false} onChange={(event) => patch({ largePrint: event.target.checked })} /> Large print</label>
            <label><input type="checkbox" checked={request.showCoordinates ?? false} onChange={(event) => patch({ showCoordinates: event.target.checked })} /> Coordinates</label>
            <label><input type="checkbox" checked={request.nameDateLine ?? true} onChange={(event) => patch({ nameDateLine: event.target.checked })} /> Name/date line</label>
          </div>
          <details className="advanced-controls">
            <summary>Advanced print and fill controls</summary>
            <label>
              Instructions
              <textarea value={request.instructions ?? ""} rows={3} onChange={(event) => patch({ instructions: event.target.value })} />
            </label>
            <label>
              Hidden message
              <input value={request.hiddenMessage ?? ""} onChange={(event) => patch({ hiddenMessage: event.target.value })} placeholder="Optional leftover-cell message" />
            </label>
            <label>
              Custom filler alphabet
              <input value={request.customFiller ?? ""} onChange={(event) => patch({ customFiller: event.target.value, fillerMode: "custom" })} />
            </label>
          </details>
        </div>
        <div ref={previewRef} className="builder-preview" aria-busy={isPending || !puzzle} style={puzzle ? undefined : { minHeight: previewHeight }}>
          {outputPuzzle ? <PuzzleUtilities puzzle={outputPuzzle} outputsBlocked={!puzzle} leadingActions={<>
            <button type="button" className="primary-button" onClick={() => patch({ seed: nextSeed(String(request.seed ?? "seed")) })}>
              <Shuffle size={16} aria-hidden="true" /> Shuffle
            </button>
            <a className="utility-link" href={`/play/${encoded}`}><Play size={16} aria-hidden="true" /> Play</a>
          </>}>
          {({ previewToolbar, printablePreview }) => puzzle ? <>
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
            <button type="button" onClick={downloadSvg}><Download size={16} aria-hidden="true" /> SVG</button>
            <span>Print, PDF, answer key, play, share, and QR all use this exact seeded state.</span>
          </div>
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
