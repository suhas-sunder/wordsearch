"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, KeyRound, RefreshCw, Settings } from "lucide-react";
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
  const activePointerIdRef = useRef<number | null>(null);
  const pointerStartRef = useRef<Coordinate | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null);
  const foundPlacementIdsRef = useRef(foundPlacementIds);

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
    foundPlacementIdsRef.current = foundPlacementIds;
  }, [foundPlacementIds]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(preferencesStorageKey);
      if (saved) setPreferences(normalizeSolverPreferences(JSON.parse(saved)));
    } catch {
      window.localStorage.removeItem(preferencesStorageKey);
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
    if (path.length < 2) {
      clearPendingSelection();
      return;
    }
    const currentFound = foundPlacementIdsRef.current;
    const placement = findMatchingPlacement(puzzle.placed, path, currentFound);
    if (!placement) {
      clearPendingSelection("That path is not an unfound word. Try another line.");
      return;
    }
    const next = new Set(currentFound);
    next.add(placement.wordId);
    foundPlacementIdsRef.current = next;
    setFoundPlacementIds(next);
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
    setGameStarted(true);
    setAnnouncement(`Puzzle started. ${progressText}.`);
    focusGridCell(focusedCell);
  }

  function resetPuzzle() {
    if (foundPlacementIdsRef.current.size > 0 && !window.confirm("Reset your found-word progress and return to the start screen?")) return;
    const empty = new Set<string>();
    foundPlacementIdsRef.current = empty;
    setFoundPlacementIds(empty);
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
        </div>
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
