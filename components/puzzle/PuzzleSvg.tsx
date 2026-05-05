import { findPlacement } from "@/lib/puzzle/generate";
import type { PuzzleResult } from "@/lib/puzzle/types";

interface PuzzleSvgProps {
  puzzle: PuzzleResult;
  answerKey?: boolean;
  compact?: boolean;
}

export function PuzzleSvg({ puzzle, answerKey = false, compact = false }: PuzzleSvgProps) {
  const cell = compact ? 30 : puzzle.request.largePrint ? 42 : 34;
  const labelGutter = puzzle.request.showCoordinates ? cell : 0;
  const width = puzzle.cols * cell + labelGutter;
  const height = puzzle.rows * cell + labelGutter;
  const highlightIds = new Set(puzzle.placed.map((placement) => placement.wordId));

  return (
    <svg
      className="puzzle-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${puzzle.request.title} word search grid, ${puzzle.rows} rows by ${puzzle.cols} columns`}
    >
      <rect x="0" y="0" width={width} height={height} fill="white" />
      {puzzle.request.showCoordinates &&
        Array.from({ length: puzzle.cols }, (_, col) => (
          <text key={`col-${col}`} x={labelGutter + col * cell + cell / 2} y={cell * 0.65} textAnchor="middle" className="grid-coordinate">
            {col + 1}
          </text>
        ))}
      {puzzle.request.showCoordinates &&
        Array.from({ length: puzzle.rows }, (_, row) => (
          <text key={`row-${row}`} x={cell * 0.5} y={labelGutter + row * cell + cell * 0.65} textAnchor="middle" className="grid-coordinate">
            {row + 1}
          </text>
        ))}
      {puzzle.grid.map((row, rowIndex) =>
        row.map((token, colIndex) => {
          const placement = answerKey ? findPlacement(puzzle, rowIndex, colIndex) : undefined;
          const x = labelGutter + colIndex * cell;
          const y = labelGutter + rowIndex * cell;
          return (
            <g key={`${rowIndex}-${colIndex}`}>
              <rect
                x={x}
                y={y}
                width={cell}
                height={cell}
                fill={placement && highlightIds.has(placement.wordId) ? "#d8f3e1" : "white"}
                stroke="#111827"
                strokeWidth={compact ? 0.7 : 1}
              />
              <text
                x={x + cell / 2}
                y={y + cell / 2}
                dominantBaseline="middle"
                textAnchor="middle"
                className="puzzle-token"
                fontSize={token.length > 3 ? cell * 0.24 : token.length > 1 ? cell * 0.32 : cell * 0.48}
              >
                {token}
              </text>
            </g>
          );
        })
      )}
      {answerKey &&
        puzzle.placed.map((placement, index) => {
          const first = placement.cells[0];
          const last = placement.cells[placement.cells.length - 1];
          if (!first || !last) return null;
          return (
            <line
              key={placement.wordId}
              x1={labelGutter + first.col * cell + cell / 2}
              y1={labelGutter + first.row * cell + cell / 2}
              x2={labelGutter + last.col * cell + cell / 2}
              y2={labelGutter + last.row * cell + cell / 2}
              stroke={["#1b7a47", "#1d4ed8", "#9a3412", "#6d28d9"][index % 4]}
              strokeWidth={Math.max(3, cell * 0.12)}
              strokeLinecap="round"
              opacity="0.72"
            />
          );
        })}
    </svg>
  );
}
