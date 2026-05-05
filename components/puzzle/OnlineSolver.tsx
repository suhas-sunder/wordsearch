"use client";

import { useState } from "react";
import type { PuzzleResult } from "@/lib/puzzle/types";

export function OnlineSolver({ puzzle }: { puzzle: PuzzleResult }) {
  const [found, setFound] = useState<Set<string>>(() => new Set());

  function toggleWord(row: number, col: number) {
    const placement = puzzle.placed.find((item) => item.cells.some((cell) => cell.row === row && cell.col === col));
    if (!placement) return;
    setFound((current) => {
      const next = new Set(current);
      if (next.has(placement.wordId)) next.delete(placement.wordId);
      else next.add(placement.wordId);
      return next;
    });
  }

  return (
    <div className="solver-grid-wrap">
      <div
        className="solver-grid"
        style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
        role="grid"
        aria-label={`${puzzle.request.title} playable word search`}
      >
        {puzzle.grid.map((row, rowIndex) =>
          row.map((token, colIndex) => {
            const placement = puzzle.placed.find((item) => item.cells.some((cell) => cell.row === rowIndex && cell.col === colIndex));
            const isFound = placement ? found.has(placement.wordId) : false;
            return (
              <button
                type="button"
                key={`${rowIndex}-${colIndex}`}
                role="gridcell"
                className={isFound ? "found" : ""}
                onClick={() => toggleWord(rowIndex, colIndex)}
                aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}, ${token}${placement ? `, part of ${placement.label}` : ""}`}
              >
                {token}
              </button>
            );
          })
        )}
      </div>
      <div className="solver-bank">
        {puzzle.placed.map((placement) => (
          <span key={placement.wordId} className={found.has(placement.wordId) ? "found" : ""}>{placement.label}</span>
        ))}
      </div>
    </div>
  );
}
