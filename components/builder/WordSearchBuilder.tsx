"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Download, Play, RefreshCw, Shuffle, Upload } from "lucide-react";
import { generatePuzzle, directionsByDifficulty } from "@/lib/puzzle/generate";
import type { AlphabetPackId, Difficulty, DirectionKey, PuzzleRequest } from "@/lib/puzzle/types";
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

export function WordSearchBuilder({ initialRequest, compact = false, persistState = false }: BuilderProps) {
  const [request, setRequest] = useState<Partial<PuzzleRequest>>({
    ...initialRequest,
    seed: initialRequest.seed ?? "ilws-builder",
    title: initialRequest.title ?? "My Word Search",
    difficulty: initialRequest.difficulty ?? "medium",
    wordsText: initialRequest.wordsText ?? ""
  });
  const [debouncedRequest, setDebouncedRequest] = useState(request);
  const [isPending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const urlStateActive = useRef(false);

  useEffect(() => {
    if (!persistState) return;
    const sharedState = decodeShareState(new URLSearchParams(window.location.search).get("state"));
    if (sharedState) {
      urlStateActive.current = true;
      setRequest((current) => ({ ...current, ...sharedState }));
      return;
    }
    const storage = safeLocalStorage();
    if (!storage) return;
    const saved = storage.getItem("ilws:last-builder-state");
    if (!saved) return;
    try {
      setRequest((current) => ({ ...current, ...JSON.parse(saved) }));
    } catch {
      storage.removeItem("ilws:last-builder-state");
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
      if (storage && !urlStateActive.current) storage.setItem("ilws:last-builder-state", JSON.stringify(request));
    }, 220);
    return () => window.clearTimeout(handle);
  }, [persistState, request]);

  const puzzle = useMemo(() => generatePuzzle(debouncedRequest), [debouncedRequest]);
  const encoded = useMemo(() => stateId(puzzle.request), [puzzle.request]);

  function patch(next: Partial<PuzzleRequest>) {
    setRequest((current) => ({ ...current, ...next }));
  }

  function setDifficulty(difficulty: Difficulty) {
    patch({ difficulty, directions: directionsByDifficulty[difficulty] });
  }

  function toggleDirection(direction: DirectionKey) {
    const directions = request.directions ?? directionsByDifficulty[request.difficulty ?? "medium"];
    patch({
      directions: directions.includes(direction)
        ? directions.filter((item) => item !== direction)
        : [...directions, direction]
    });
  }

  function downloadSvg() {
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
    file.text().then((text) => patch({ wordsText: text }));
  }

  const placedLabels = new Set(puzzle.placed.map((placement) => placement.wordId));
  const directions = request.directions ?? directionsByDifficulty[request.difficulty ?? "medium"];

  return (
    <PuzzleUtilities
      puzzle={puzzle}
      leadingActions={
        <>
          <button type="button" className="primary-button" onClick={() => patch({ seed: nextSeed(String(request.seed ?? "seed")) })}>
            <Shuffle size={16} aria-hidden="true" /> Shuffle
          </button>
          <a className="utility-link" href={`/play/${encoded}`}><Play size={16} aria-hidden="true" /> Play</a>
        </>
      }
    >
      {({ previewToolbar, printablePreview }) => <section className={`builder-surface ${compact ? "compact" : ""}`} aria-label="Word search builder">
      <div className="builder-head">
        <div>
          <h2>Build a word search</h2>
          <p>Preview, print, answer key, play, and share all use the same seed.</p>
        </div>
        <div className="builder-status" aria-live="polite">
          <span>{puzzle.placed.length} placed</span>
          <span>{puzzle.excluded.length} excluded</span>
          <span>{puzzle.rows}×{puzzle.cols}</span>
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
              <input type="checkbox" checked={request.autoSize ?? true} onChange={(event) => patch({ autoSize: event.target.checked })} />
              Auto size
            </label>
            <label>
              Rows
              <input type="number" min={6} max={40} value={request.rows ?? puzzle.rows} disabled={request.autoSize ?? true} onChange={(event) => patch({ rows: Number(event.target.value), autoSize: false })} />
            </label>
            <label>
              Columns
              <input type="number" min={6} max={40} value={request.cols ?? puzzle.cols} disabled={request.autoSize ?? true} onChange={(event) => patch({ cols: Number(event.target.value), autoSize: false })} />
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
                >
                  {label}
                </button>
              ))}
            </div>
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
        <div className="builder-preview" aria-busy={isPending}>
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
        </div>
      </div>
    </section>}
    </PuzzleUtilities>
  );
}
