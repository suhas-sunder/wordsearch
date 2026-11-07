import { defaultPuzzleRequest } from "@/lib/puzzle/generate";
import type { DirectionKey, PuzzleRequest } from "@/lib/puzzle/types";

const directionText: Record<DirectionKey, string> = {
  E: "left to right", W: "right to left", S: "top to bottom", N: "bottom to top",
  SE: "down and right", SW: "down and left", NE: "up and right", NW: "up and left"
};

/** Render the legacy default accurately without changing stored puzzle or share state. */
export function printableInstructions(request: PuzzleRequest): string {
  if (request.instructions !== defaultPuzzleRequest.instructions) return request.instructions ?? "";
  const directions = [...new Set(request.directions)].map((direction) => directionText[direction]);
  return `${request.wordBankMode === "clues" ? "Solve each numbered clue, then find its answer in the grid." : "Find each word in the grid."} Words may run: ${directions.join(", ")}.`;
}
