"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export interface SolverPreferences {
  selectionMethod: "drag" | "tap";
  letterSize: "standard" | "large";
  letterWeight: "standard" | "bold";
  letterCase: "uppercase" | "lowercase";
  gridLines: boolean;
  highContrastSelection: boolean;
  showProgress: boolean;
}

export const defaultSolverPreferences: SolverPreferences = {
  selectionMethod: "drag",
  letterSize: "standard",
  letterWeight: "bold",
  letterCase: "uppercase",
  gridLines: true,
  highContrastSelection: false,
  showProgress: true
};

export function normalizeSolverPreferences(value: unknown): SolverPreferences {
  if (!value || typeof value !== "object") return defaultSolverPreferences;
  const saved = value as Partial<SolverPreferences>;
  return {
    selectionMethod: saved.selectionMethod === "tap" ? "tap" : "drag",
    letterSize: saved.letterSize === "large" ? "large" : "standard",
    letterWeight: saved.letterWeight === "standard" ? "standard" : "bold",
    letterCase: saved.letterCase === "lowercase" ? "lowercase" : "uppercase",
    gridLines: saved.gridLines !== false,
    highContrastSelection: saved.highContrastSelection === true,
    showProgress: saved.showProgress !== false
  };
}

interface SolverPreferencesDialogProps {
  open: boolean;
  preferences: SolverPreferences;
  onChange(preferences: SolverPreferences): void;
  onClose(): void;
}

export function SolverPreferencesDialog({ open, preferences, onChange, onClose }: SolverPreferencesDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function patch(next: Partial<SolverPreferences>) {
    onChange({ ...preferences, ...next });
  }

  return (
    <dialog
      ref={dialogRef}
      className="solver-settings-dialog"
      aria-labelledby="solver-settings-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="solver-dialog-panel">
        <header>
          <div>
            <p className="eyebrow">Accessibility and controls</p>
            <h2 id="solver-settings-title">Puzzle settings</h2>
          </div>
          <button ref={closeButtonRef} type="button" className="icon-button" aria-label="Close puzzle settings" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <fieldset>
          <legend>Selection method</legend>
          <div className="solver-choice-row">
            <label>
              <input
                type="radio"
                name="selection-method"
                checked={preferences.selectionMethod === "drag"}
                onChange={() => patch({ selectionMethod: "drag" })}
              />
              <span><strong>Drag</strong><small>Press a letter and trace to the end.</small></span>
            </label>
            <label>
              <input
                type="radio"
                name="selection-method"
                checked={preferences.selectionMethod === "tap"}
                onChange={() => patch({ selectionMethod: "tap" })}
              />
              <span><strong>Tap endpoints</strong><small>Tap the first and last letters.</small></span>
            </label>
          </div>
        </fieldset>

        <div className="solver-settings-grid">
          <label>
            Letter size
            <select value={preferences.letterSize} onChange={(event) => patch({ letterSize: event.target.value as SolverPreferences["letterSize"] })}>
              <option value="standard">Standard</option>
              <option value="large">Large</option>
            </select>
          </label>
          <label>
            Letter weight
            <select value={preferences.letterWeight} onChange={(event) => patch({ letterWeight: event.target.value as SolverPreferences["letterWeight"] })}>
              <option value="standard">Standard</option>
              <option value="bold">Bold</option>
            </select>
          </label>
          <label>
            Letter case
            <select value={preferences.letterCase} onChange={(event) => patch({ letterCase: event.target.value as SolverPreferences["letterCase"] })}>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
            </select>
          </label>
        </div>

        <div className="solver-toggle-list">
          <label><input type="checkbox" checked={preferences.gridLines} onChange={(event) => patch({ gridLines: event.target.checked })} /> Show grid lines</label>
          <label><input type="checkbox" checked={preferences.highContrastSelection} onChange={(event) => patch({ highContrastSelection: event.target.checked })} /> High-contrast selection</label>
          <label><input type="checkbox" checked={preferences.showProgress} onChange={(event) => patch({ showProgress: event.target.checked })} /> Show progress count</label>
        </div>

        <p className="solver-motion-note">Selection feedback follows your device’s reduced-motion setting. Visual preferences never change the puzzle seed or placements.</p>
        <footer>
          <button type="button" className="primary-button" onClick={onClose}>Done</button>
        </footer>
      </div>
    </dialog>
  );
}
