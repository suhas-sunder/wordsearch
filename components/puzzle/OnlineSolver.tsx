"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, KeyRound, Pencil, RefreshCw, Settings } from "lucide-react";
import type { PuzzleResult } from "@/lib/puzzle/types";
import {
  coordinateKey,
  createCoordinatePath,
  findMatchingPlacement,
  snapClientPointToEndpoint,
  snapEndpoint,
  type Coordinate
} from "@/lib/puzzle/solver";
import {
  defaultSolverPreferences,
  normalizeSolverPreferences,
  SolverPreferencesDialog,
  type SolverPreferences
} from "@/components/puzzle/SolverPreferencesDialog";
import { PuzzleUtilities } from "@/components/puzzle/PuzzleUtilities";
import { CompletionResult } from "@/components/puzzle/CompletionResult";
import { clearProgress, fingerprintPuzzle, readProgress, writeProgress, type ProgressRead } from "@/lib/puzzle/progress";
import { createWordFoundSound, type WordFoundSound } from "@/lib/puzzle/word-found-sound";

const preferencesStorageKey = "ilws:solver-preferences";

interface ActiveSelection {
  start: Coordinate;
  end: Coordinate;
  source: "pointer" | "tap" | "keyboard";
}

function sameCoordinate(first: Coordinate, second: Coordinate) {
  return first.row === second.row && first.col === second.col;
}

function cellFromTarget(target: EventTarget | null): Coordinate | null {
  if (!(target instanceof Element)) return null;
  const cell = target.closest<HTMLElement>("[data-solver-cell]");
  if (!cell) return null;
  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  return Number.isInteger(row) && Number.isInteger(col) ? { row, col } : null;
}

function displayToken(token: string, letterCase: SolverPreferences["letterCase"]) {
  return letterCase === "lowercase" ? token.toLocaleLowerCase() : token.toLocaleUpperCase();
}

export function OnlineSolver({ puzzle }: { puzzle: PuzzleResult }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [foundPlacementIds, setFoundPlacementIds] = useState<Set<string>>(() => new Set());
  const [activeSelection, setActiveSelection] = useState<ActiveSelection | null>(null);
  const [focusedCell, setFocusedCell] = useState<Coordinate>({ row: 0, col: 0 });
  const [announcement, setAnnouncement] = useState("Puzzle ready. Begin when you are ready to solve.");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<SolverPreferences>(defaultSolverPreferences);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const settingsReturnFocusRef = useRef<HTMLElement | null>(null);
  const wordSound = useRef<WordFoundSound | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const pointerStartRef = useRef<Coordinate | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null);
  const foundPlacementIdsRef = useRef(foundPlacementIds);
  const startedAt = useRef<number | null>(null);
  const [completionElapsed, setCompletionElapsed] = useState<number | null>(null);
  const accumulatedMs = useRef(0);
  const pausedForNavigation = useRef(false);
  const completionElapsedRef = useRef<number | null>(null);
  const fingerprintRef = useRef<string | null>(null);
  const rememberRef = useRef(false);
  const [remember, setRemember] = useState(false);
  const [progressRead, setProgressRead] = useState<ProgressRead | { kind: "loading" }>({ kind: "loading" });
  const [storageMessage, setStorageMessage] = useState("");

  function elapsedNow() {
    return completionElapsedRef.current ?? Math.max(0, accumulatedMs.current + (startedAt.current === null ? 0 : performance.now() - startedAt.current));
  }

  function saveSnapshot(ids: ReadonlySet<string>) {
    const fingerprint = fingerprintRef.current;
    if (!rememberRef.current || !fingerprint || (startedAt.current === null && completionElapsedRef.current === null)) return;
    const indices = puzzle.placed.flatMap((placement, index) => ids.has(placement.wordId) ? [index] : []);
    let result: ReturnType<typeof writeProgress>;
    try { result = writeProgress(window.localStorage, { v: 1, fingerprint, indices, elapsedMs: Math.floor(elapsedNow()) }, puzzle.placed.length); }
    catch { result = "unavailable"; }
    if (result === "conflict") {
      rememberRef.current = false;
      setRemember(false);
      setProgressRead({ kind: "invalid" });
      setStorageMessage("Saved progress changed or became invalid. Clear it before saving again; you can keep solving.");
    } else if (result !== "saved") setStorageMessage(result === "limit" ? "Device progress storage is full. Clear a saved puzzle before saving another." : result === "invalid" ? "Progress could not be saved because its size or elapsed time exceeds the supported limit." : "Device storage is unavailable. You can keep solving, but progress may not be saved.");
    else setStorageMessage("");
  }

  const activePath = useMemo(
    () => activeSelection ? createCoordinatePath(activeSelection.start, activeSelection.end) : [],
    [activeSelection]
  );
  const activePathKeys = useMemo(() => new Set(activePath.map(coordinateKey)), [activePath]);
  const foundPlacements = useMemo(
    () => puzzle.placed.filter((placement) => foundPlacementIds.has(placement.wordId)),
    [foundPlacementIds, puzzle.placed]
  );
  const foundCellKeys = useMemo(
    () => new Set(foundPlacements.flatMap((placement) => placement.cells.map(coordinateKey))),
    [foundPlacements]
  );
  const isComplete = puzzle.placed.length > 0 && foundPlacementIds.size === puzzle.placed.length;
  const progressText = `${foundPlacementIds.size} of ${puzzle.placed.length} words found`;

  useEffect(() => {
    let active = true;
    wordSound.current?.stop();
    const empty = new Set<string>();
    foundPlacementIdsRef.current = empty;
    setFoundPlacementIds(empty);
    setGameStarted(false);
    setActiveSelection(null);
    setFocusedCell({ row: 0, col: 0 });
    startedAt.current = null;
    pausedForNavigation.current = false;
    accumulatedMs.current = 0;
    completionElapsedRef.current = null;
    setCompletionElapsed(null);
    fingerprintRef.current = null;
    rememberRef.current = false;
    setRemember(false);
    setProgressRead({ kind: "loading" });
    fingerprintPuzzle(puzzle).then((fingerprint) => {
      if (!active) return;
      fingerprintRef.current = fingerprint;
      try { setProgressRead(readProgress(window.localStorage, fingerprint, puzzle.placed.length)); }
      catch { setProgressRead({ kind: "unavailable" }); }
    }).catch(() => { if (active) setProgressRead({ kind: "unavailable" }); });
    return () => { active = false; };
  }, [puzzle]);

  useEffect(() => {
    const pause = () => {
      saveSnapshot(foundPlacementIdsRef.current);
      if (startedAt.current !== null && completionElapsedRef.current === null) {
        accumulatedMs.current = elapsedNow();
        startedAt.current = null;
        pausedForNavigation.current = true;
      }
    };
    const restore = () => {
      if (!pausedForNavigation.current) return;
      pausedForNavigation.current = false;
      if (completionElapsedRef.current === null) startedAt.current = performance.now();
    };
    window.addEventListener("pagehide", pause);
    window.addEventListener("pageshow", restore);
    return () => {
      window.removeEventListener("pagehide", pause);
      window.removeEventListener("pageshow", restore);
    };
  });

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(preferencesStorageKey);
      if (saved) setPreferences(normalizeSolverPreferences(JSON.parse(saved)));
    } catch {
      try { window.localStorage.removeItem(preferencesStorageKey); } catch { /* Storage may be blocked. */ }
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    try {
      window.localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
    } catch {
      // Solving remains fully available when local preference storage is unavailable.
    }
  }, [preferences, preferencesLoaded]);

  useEffect(() => () => {
    if (pointerFrameRef.current !== null) window.cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useEffect(() => {
    const stop = () => wordSound.current?.stop();
    const hidden = () => { if (document.hidden) stop(); };
    window.addEventListener("pagehide", stop);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("pagehide", stop);
      document.removeEventListener("visibilitychange", hidden);
      wordSound.current?.dispose();
      wordSound.current = null;
    };
  }, []);

  function focusGridCell(coordinate: Coordinate) {
    setFocusedCell(coordinate);
    const cell = cellRefs.current[coordinate.row * puzzle.cols + coordinate.col];
    if (cell && !cell.disabled) {
      cell.focus({ preventScroll: true });
      return;
    }
    window.requestAnimationFrame(() => cellRefs.current[coordinate.row * puzzle.cols + coordinate.col]?.focus({ preventScroll: true }));
  }

  function clearPendingSelection(message?: string) {
    setActiveSelection(null);
    pointerStartRef.current = null;
    if (message) setAnnouncement(message);
  }

  function submitSelection(path: Coordinate[]) {
    if (path.length === 0) {
      clearPendingSelection();
      return;
    }
    const currentFound = foundPlacementIdsRef.current;
    const placement = findMatchingPlacement(puzzle.placed, path, currentFound);
    if (!placement) {
      clearPendingSelection(path.length === 1 ? undefined : "That path is not an unfound word. Try another line.");
      return;
    }
    const next = new Set(currentFound);
    next.add(placement.wordId);
    if (next.size === puzzle.placed.length) {
      const elapsed = startedAt.current === null ? null : elapsedNow();
      completionElapsedRef.current = elapsed;
      setCompletionElapsed(elapsed);
    }
    foundPlacementIdsRef.current = next;
    setFoundPlacementIds(next);
    if (preferences.soundOnFound) {
      wordSound.current ??= createWordFoundSound();
      void wordSound.current.play();
    }
    saveSnapshot(next);
    setActiveSelection(null);
    const nextProgress = `${next.size} of ${puzzle.placed.length} words found`;
    setAnnouncement(
      next.size === puzzle.placed.length
        ? `Found ${placement.label}. Puzzle complete! All ${puzzle.placed.length} words found.`
        : `Found ${placement.label}. ${nextProgress}.`
    );
  }

  function updatePointerSelection(clientX: number, clientY: number) {
    const start = pointerStartRef.current;
    const grid = gridRef.current;
    if (!start || !grid) return;
    const rect = grid.getBoundingClientRect();
    const end = snapClientPointToEndpoint(start, clientX, clientY, rect, puzzle.rows, puzzle.cols);
    setActiveSelection({ start, end, source: "pointer" });
  }

  function clearPointerFrame() {
    if (pointerFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
    pointerPositionRef.current = null;
  }

  function releasePointerCapture(pointerId: number) {
    const grid = gridRef.current;
    if (!grid) return;
    try {
      if (grid.hasPointerCapture(pointerId)) grid.releasePointerCapture(pointerId);
    } catch {
      // Synthetic pointer tests and interrupted gestures may not own capture.
    }
  }

  function cancelPointerSelection(pointerId?: number) {
    const capturedPointer = activePointerIdRef.current;
    if (pointerId !== undefined && capturedPointer !== pointerId) return;
    clearPointerFrame();
    activePointerIdRef.current = null;
    pointerStartRef.current = null;
    setActiveSelection((current) => current?.source === "pointer" ? null : current);
    if (capturedPointer !== null) releasePointerCapture(capturedPointer);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!gameStarted || preferences.selectionMethod !== "drag" || event.isPrimary === false) return;
    if (activePointerIdRef.current !== null) return;
    const start = cellFromTarget(event.target);
    if (!start) return;
    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    pointerStartRef.current = start;
    setFocusedCell(start);
    setActiveSelection({ start, end: start, source: "pointer" });
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture can be unavailable for synthetic events; grid-level handlers still work.
    }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    pointerPositionRef.current = { x: event.clientX, y: event.clientY };
    if (pointerFrameRef.current !== null) return;
    pointerFrameRef.current = window.requestAnimationFrame(() => {
      pointerFrameRef.current = null;
      const position = pointerPositionRef.current;
      if (position) updatePointerSelection(position.x, position.y);
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (activePointerIdRef.current !== event.pointerId) return;
    event.preventDefault();
    clearPointerFrame();
    const start = pointerStartRef.current;
    const grid = gridRef.current;
    activePointerIdRef.current = null;
    pointerStartRef.current = null;
    if (start && grid) {
      const rect = grid.getBoundingClientRect();
      const end = snapClientPointToEndpoint(start, event.clientX, event.clientY, rect, puzzle.rows, puzzle.cols);
      submitSelection(createCoordinatePath(start, end));
    } else {
      setActiveSelection(null);
    }
    releasePointerCapture(event.pointerId);
  }

  function handleTapCell(coordinate: Coordinate) {
    if (!gameStarted || preferences.selectionMethod !== "tap") return;
    if (!activeSelection || activeSelection.source !== "tap") {
      setActiveSelection({ start: coordinate, end: coordinate, source: "tap" });
      setAnnouncement(`Start selected at row ${coordinate.row + 1}, column ${coordinate.col + 1}. Choose an ending letter.`);
      return;
    }
    if (sameCoordinate(activeSelection.start, coordinate)) {
      if (findMatchingPlacement(puzzle.placed, [coordinate], foundPlacementIdsRef.current)) {
        submitSelection([coordinate]);
        return;
      }
      clearPendingSelection("Endpoint selection canceled.");
      return;
    }
    const end = snapEndpoint(activeSelection.start, coordinate, puzzle.rows, puzzle.cols);
    submitSelection(createCoordinatePath(activeSelection.start, end));
  }

  function handleCellKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, coordinate: Coordinate) {
    if (!gameStarted) return;
    if (event.key === "Escape") {
      if (activeSelection) {
        event.preventDefault();
        clearPendingSelection("Selection canceled.");
      }
      return;
    }

    let nextCoordinate: Coordinate | null = null;
    if (event.key === "ArrowLeft") nextCoordinate = { row: coordinate.row, col: Math.max(0, coordinate.col - 1) };
    if (event.key === "ArrowRight") nextCoordinate = { row: coordinate.row, col: Math.min(puzzle.cols - 1, coordinate.col + 1) };
    if (event.key === "ArrowUp") nextCoordinate = { row: Math.max(0, coordinate.row - 1), col: coordinate.col };
    if (event.key === "ArrowDown") nextCoordinate = { row: Math.min(puzzle.rows - 1, coordinate.row + 1), col: coordinate.col };
    if (event.key === "Home") nextCoordinate = { row: coordinate.row, col: 0 };
    if (event.key === "End") nextCoordinate = { row: coordinate.row, col: puzzle.cols - 1 };
    if (nextCoordinate) {
      event.preventDefault();
      focusGridCell(nextCoordinate);
      if (activeSelection?.source === "keyboard") {
        const end = snapEndpoint(activeSelection.start, nextCoordinate, puzzle.rows, puzzle.cols);
        setActiveSelection({ ...activeSelection, end });
      }
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (activeSelection?.source === "keyboard") {
      submitSelection(createCoordinatePath(activeSelection.start, activeSelection.end));
      return;
    }
    setActiveSelection({ start: coordinate, end: coordinate, source: "keyboard" });
    setAnnouncement(`Keyboard start selected at row ${coordinate.row + 1}, column ${coordinate.col + 1}. Use arrow keys, then press Enter or Space.`);
  }

  function beginPuzzle() {
    pausedForNavigation.current = false;
    accumulatedMs.current = 0;
    completionElapsedRef.current = null;
    startedAt.current = performance.now();
    setCompletionElapsed(null);
    saveSnapshot(foundPlacementIdsRef.current);
    setGameStarted(true);
    setAnnouncement(`Puzzle started. ${progressText}.`);
    focusGridCell(focusedCell);
  }

  function discardSavedProgress() {
    const fingerprint = fingerprintRef.current;
    if (!fingerprint) return;
    let cleared = false;
    try { cleared = clearProgress(window.localStorage, fingerprint); } catch { /* Storage can be blocked. */ }
    if (cleared) {
      setProgressRead({ kind: "none" });
      setStorageMessage("Saved progress for this puzzle was cleared.");
    } else setStorageMessage("Saved progress could not be cleared from device storage.");
  }

  function setRememberProgress(enabled: boolean) {
    rememberRef.current = enabled;
    setRemember(enabled);
    if (enabled) {
      setStorageMessage("");
      if (gameStarted) saveSnapshot(foundPlacementIdsRef.current);
    } else {
      discardSavedProgress();
    }
  }

  function resumeProgress() {
    if (progressRead.kind !== "saved") return;
    const saved = progressRead.value;
    pausedForNavigation.current = false;
    const ids = new Set(saved.indices.map((index) => puzzle.placed[index].wordId));
    foundPlacementIdsRef.current = ids;
    setFoundPlacementIds(ids);
    accumulatedMs.current = saved.elapsedMs;
    const complete = ids.size === puzzle.placed.length && puzzle.placed.length > 0;
    completionElapsedRef.current = complete ? saved.elapsedMs : null;
    setCompletionElapsed(complete ? saved.elapsedMs : null);
    startedAt.current = complete ? null : performance.now();
    rememberRef.current = true;
    setRemember(true);
    setProgressRead({ kind: "none" });
    setGameStarted(true);
    setAnnouncement(`Saved progress restored. ${ids.size} of ${puzzle.placed.length} words found.`);
    focusGridCell(focusedCell);
  }

  function resetPuzzle() {
    if (foundPlacementIdsRef.current.size > 0 && !window.confirm("Reset your found-word progress and return to the start screen?")) return;
    wordSound.current?.stop();
    if (rememberRef.current && fingerprintRef.current) {
      try { if (!clearProgress(window.localStorage, fingerprintRef.current)) setStorageMessage("Saved progress could not be cleared from device storage."); }
      catch { setStorageMessage("Saved progress could not be cleared from device storage."); }
    }
    const empty = new Set<string>();
    foundPlacementIdsRef.current = empty;
    setFoundPlacementIds(empty);
    startedAt.current = null;
    pausedForNavigation.current = false;
    accumulatedMs.current = 0;
    completionElapsedRef.current = null;
    setCompletionElapsed(null);
    cancelPointerSelection();
    setActiveSelection(null);
    setFocusedCell({ row: 0, col: 0 });
    setGameStarted(false);
    setAnnouncement("Puzzle reset. The seed, grid, and placements are unchanged.");
    window.requestAnimationFrame(() => startButtonRef.current?.focus());
  }

  function openSettings(event: React.MouseEvent<HTMLElement>) {
    settingsReturnFocusRef.current = event.currentTarget;
    setSettingsOpen(true);
  }

  function closeSettings() {
    setSettingsOpen(false);
    window.requestAnimationFrame(() => settingsReturnFocusRef.current?.focus());
  }

  function updatePreferences(next: SolverPreferences) {
    if (!next.soundOnFound) wordSound.current?.stop();
    if (next.selectionMethod !== preferences.selectionMethod) {
      cancelPointerSelection();
      clearPendingSelection("Selection method changed. Any pending selection was canceled.");
    }
    setPreferences(next);
  }

  const solverClassName = [
    "online-solver",
    preferences.letterSize === "large" ? "solver-large-letters" : "",
    preferences.letterWeight === "bold" ? "solver-bold-letters" : "solver-standard-letters",
    preferences.gridLines ? "" : "solver-no-grid-lines",
    preferences.highContrastSelection ? "solver-high-contrast" : ""
  ].filter(Boolean).join(" ");

  return (
    <PuzzleUtilities
      puzzle={puzzle}
      unfinished={foundPlacementIds.size < puzzle.placed.length}
      onAnnouncement={setAnnouncement}
    >
      {({ answersVisible, compactToolbar, previewToolbar, printablePreview }) => <><section className={solverClassName} aria-label="Online word search solver">
      <div className="solver-control-row">
        {preferences.showProgress && <p className="solver-progress" data-testid="solver-progress">{progressText}</p>}
        <div className="solver-actions" aria-label="Puzzle controls">
          <button type="button" className="secondary-button" onClick={openSettings}><Settings size={17} aria-hidden="true" /> Settings</button>
          <button type="button" className="secondary-button" onClick={resetPuzzle}><RefreshCw size={17} aria-hidden="true" /> Reset puzzle</button>
          {compactToolbar}
          <a className="secondary-button" href={puzzle.sharePath}><Pencil size={17} aria-hidden="true" /> Edit or save in maker</a>
        </div>
      </div>

      <div className="solver-save-progress">
        <label><input type="checkbox" checked={remember} disabled={progressRead.kind !== "none"} onChange={(event) => setRememberProgress(event.target.checked)} /> Remember progress on this device</label>
        <p className="control-help">An opaque puzzle identifier, found-word indexes, and elapsed time are saved on this device. Time continues while this page is open and pauses when you close or navigate away. It continues when the browser restores this page, or when you choose Resume after reloading. Closing a tab may lose time since the last save.</p>
        {progressRead.kind === "saved" && <p>Saved progress is available for this puzzle. Resume it or clear it before enabling a new save.</p>}
        {progressRead.kind === "invalid" && <p>Saved progress for this puzzle is invalid or unsupported. Clear it to start saving again.</p>}
        {progressRead.kind === "unavailable" && <p>Device storage or secure puzzle identification is unavailable. You can still solve without saving.</p>}
        {(progressRead.kind === "saved" || progressRead.kind === "invalid") && <button type="button" className="secondary-button" onClick={discardSavedProgress}>Clear saved progress</button>}
        {storageMessage && <p role="status">{storageMessage}</p>}
      </div>

      <div className="solver-grid-wrap">
        <div className="solver-grid-stage">
          <svg
            className="solver-selection-overlay"
            viewBox={`0 0 ${puzzle.cols} ${puzzle.rows}`}
            aria-hidden="true"
          >
            {(answersVisible ? puzzle.placed : foundPlacements).map((placement) => {
              const first = placement.cells[0];
              const last = placement.cells[placement.cells.length - 1];
              if (!first || !last) return null;
              const found = foundPlacementIds.has(placement.wordId);
              return (
                <line
                  key={placement.wordId}
                  className={found ? "solver-found-line" : "solver-answer-line"}
                  x1={first.col + 0.5}
                  y1={first.row + 0.5}
                  x2={last.col + 0.5}
                  y2={last.row + 0.5}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {activeSelection && (
              <line
                className="solver-active-line"
                x1={activeSelection.start.col + 0.5}
                y1={activeSelection.start.row + 0.5}
                x2={activeSelection.end.col + 0.5}
                y2={activeSelection.end.row + 0.5}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          <div
            ref={gridRef}
            className="solver-grid"
            style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
            role="grid"
            aria-label={`${puzzle.request.title} playable word search, ${puzzle.rows} rows by ${puzzle.cols} columns`}
            aria-hidden={!gameStarted}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={(event) => cancelPointerSelection(event.pointerId)}
            onLostPointerCapture={(event) => cancelPointerSelection(event.pointerId)}
            onContextMenu={(event) => event.preventDefault()}
          >
            {puzzle.grid.map((row, rowIndex) =>
              row.map((token, colIndex) => {
                const coordinate = { row: rowIndex, col: colIndex };
                const key = coordinateKey(coordinate);
                const isActive = activePathKeys.has(key);
                const isFound = foundCellKeys.has(key);
                return (
                  <button
                    ref={(element) => { cellRefs.current[rowIndex * puzzle.cols + colIndex] = element; }}
                    type="button"
                    key={`${rowIndex}-${colIndex}`}
                    role="gridcell"
                    data-solver-cell="true"
                    data-row={rowIndex}
                    data-col={colIndex}
                    className={`${isActive ? "active-path" : ""} ${isFound ? "found-path" : ""}`.trim()}
                    tabIndex={gameStarted && sameCoordinate(focusedCell, coordinate) ? 0 : -1}
                    disabled={!gameStarted}
                    aria-selected={isActive || isFound}
                    aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, ${displayToken(token, preferences.letterCase)}`}
                    onFocus={() => setFocusedCell(coordinate)}
                    onClick={() => handleTapCell(coordinate)}
                    onKeyDown={(event) => handleCellKeyDown(event, coordinate)}
                  >
                    <span>{displayToken(token, preferences.letterCase)}</span>
                  </button>
                );
              })
            )}
          </div>

          {!gameStarted && (
            <div className="solver-start-overlay" role="group" aria-labelledby="solver-start-title">
              <div>
                <p className="eyebrow">Ready to solve</p>
                <h2 id="solver-start-title">{puzzle.request.title}</h2>
                <p>{puzzle.rows} × {puzzle.cols} grid · {puzzle.request.difficulty} · {puzzle.placed.length} words</p>
                <div className="solver-start-actions">
                  {progressRead.kind === "saved" && <button type="button" className="primary-button" onClick={resumeProgress}>Resume saved progress</button>}
                  <button ref={startButtonRef} type="button" className="primary-button" onClick={beginPuzzle}>Begin puzzle</button>
                  <button type="button" className="secondary-button" onClick={openSettings}>Accessibility and controls</button>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="solver-instructions" aria-label="Keyboard instructions">
          <strong>{preferences.selectionMethod === "drag" ? "Drag" : "Tap the first and last letters"} to select a word.</strong>
          <span>Keyboard: arrow keys move; Enter or Space sets and submits a path; Escape cancels.</span>
        </div>

        <div className="solver-bank" aria-label="Words to find">
          {puzzle.placed.map((placement) => {
            const isFound = foundPlacementIds.has(placement.wordId);
            const isRevealed = answersVisible && !isFound;
            return (
              <span key={placement.wordId} className={isFound ? "found" : isRevealed ? "revealed" : ""} aria-label={`${placement.label}, ${isFound ? "found" : isRevealed ? "answer revealed" : "not found"}`}>
                {isFound ? <Check size={16} strokeWidth={3} aria-hidden="true" /> : isRevealed ? <KeyRound size={15} aria-hidden="true" /> : null}
                <span>{placement.label}</span>
                <span className="sr-only">{isFound ? "Found" : isRevealed ? "Answer revealed" : "Not found"}</span>
              </span>
            );
          })}
        </div>

        {isComplete && (
          <section className="solver-completion" aria-labelledby="solver-complete-title">
            <Check size={26} aria-hidden="true" />
            <div>
              <h2 id="solver-complete-title">Puzzle complete</h2>
              <p>You found all {puzzle.placed.length} words. Your completed highlights remain on the grid.</p>
              <CompletionResult stats={{ wordsFound: puzzle.placed.length, rows: puzzle.rows, cols: puzzle.cols, elapsedMs: completionElapsed }} />
            </div>
            <button type="button" className="secondary-button" onClick={resetPuzzle}>Replay this puzzle</button>
          </section>
        )}
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
      <SolverPreferencesDialog
        open={settingsOpen}
        preferences={preferences}
        onChange={updatePreferences}
        onClose={closeSettings}
      />
    </section>
      <section className="solver-print-preview" aria-label="Printable puzzle preview">
        <h2>Printable puzzle</h2>
        <p>Adjust the page layout here, then print or download the same unchanged puzzle.</p>
        {previewToolbar}
        {printablePreview}
      </section>
    </>}
    </PuzzleUtilities>
  );
}
