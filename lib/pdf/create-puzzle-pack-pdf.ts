import { PDFDocument } from "pdf-lib";
import { createPuzzlePdf, validatePuzzleForPdf } from "@/lib/pdf/create-puzzle-pdf";
import { defaultPuzzleOutputOptions, type PaperSize } from "@/lib/puzzle/output-options";
import type { PuzzleResult } from "@/lib/puzzle/types";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { puzzlePlayUrl } from "@/lib/share-state/state";

export interface PuzzlePack {
  id: string;
  name: string;
  puzzles: Array<{ id: string; puzzle: PuzzleResult }>;
}

export interface PuzzlePackOptions {
  paperSize: PaperSize;
  order: "answers-last" | "interleaved";
  layoutProfile?: "legacy" | "pack";
  pages?: "both" | "students" | "answers";
}

/** Verify seeded replay, then compose the existing single-puzzle pages. */
export async function createPuzzlePackPdf(pack: PuzzlePack, options: PuzzlePackOptions) {
  const validId = (id: unknown) => typeof id === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && id.length <= 80;
  if (!pack || !validId(pack.id) || typeof pack.name !== "string" || !pack.name.trim() || pack.name.length > 100) throw new Error("Invalid pack identity.");
  if (!options || !["letter", "a4"].includes(options.paperSize) || !["answers-last", "interleaved"].includes(options.order) || (options.layoutProfile !== undefined && !["legacy", "pack"].includes(options.layoutProfile))) throw new Error("Invalid pack options.");
  if (options.pages !== undefined && !["both", "students", "answers"].includes(options.pages)) throw new Error("Invalid page selection.");
  if (!Array.isArray(pack.puzzles) || ![5, 10, 20].includes(pack.puzzles.length)) throw new Error("A pack must contain exactly 5, 10 or 20 puzzles.");
  const ids = new Set<string>();
  const grids = new Set<string>();
  for (const entry of pack.puzzles) {
    if (!entry || !validId(entry.id) || ids.has(entry.id) || !validatePuzzleForPdf(entry.puzzle)) throw new Error("Invalid or duplicate pack puzzle.");
    if (entry.puzzle.rows > 20 || entry.puzzle.cols > 20 || entry.puzzle.placed.length > 30 || !entry.puzzle.placed.length || entry.puzzle.request.wordsText.length > 2000) throw new Error("Pack puzzle exceeds the supported workload.");
    const replay = generatePuzzle(entry.puzzle.request);
    if (replay.words.some((word) => word.duplicateOf)) throw new Error("Pack puzzle contains duplicate words; remove duplicates before export.");
    if (replay.excluded.length || replay.placed.length !== replay.words.length) throw new Error("Pack puzzle has unplaced words; enlarge the grid or revise the word list.");
    if (replay.warnings.length) throw new Error("Pack puzzle has input warnings; resolve them before export.");
    if (JSON.stringify(replay.grid) !== JSON.stringify(entry.puzzle.grid) || JSON.stringify(replay.placed) !== JSON.stringify(entry.puzzle.placed)) throw new Error("Pack puzzle does not match its seeded request.");
    const grid = JSON.stringify(entry.puzzle.grid);
    if (grids.has(grid)) throw new Error("Pack puzzles must have distinct grids.");
    if (puzzlePlayUrl(entry.puzzle.request).length > 8192) throw new Error("Pack share URL is too long.");
    ids.add(entry.id);
    grids.add(grid);
  }
  const output = await PDFDocument.create();
  output.setTitle(pack.name);
  output.setAuthor("I Love Word Search");
  output.setSubject(`Printable word search pack: ${pack.id}`);
  const stableDate = new Date("2000-01-01T00:00:00.000Z");
  output.setCreationDate(stableDate);
  output.setModificationDate(stableDate);
  const puzzlePages = [];
  const answerPages = [];
  for (const entry of pack.puzzles) {
    const bytes = await createPuzzlePdf({
      puzzle: entry.puzzle,
      options: { ...defaultPuzzleOutputOptions, paperSize: options.paperSize, orientation: "portrait", includeAnswerKey: true, qrCode: false, inkSaving: true },
      shareUrl: puzzlePlayUrl(entry.puzzle.request),
      layoutProfile: options.layoutProfile
    });
    const source = await PDFDocument.load(bytes);
    if (source.getPageCount() !== 2) throw new Error("Single-puzzle PDF must contain exactly one puzzle and one answer page.");
    const [puzzlePage, answerPage] = await output.copyPages(source, [0, 1]);
    puzzlePages.push(puzzlePage);
    answerPages.push(answerPage);
  }
  for (let i = 0; i < puzzlePages.length; i += 1) {
    if (options.pages !== "answers") output.addPage(puzzlePages[i]);
    if (options.pages !== "students" && options.order === "interleaved") output.addPage(answerPages[i]);
  }
  if (options.pages !== "students" && options.order === "answers-last") for (const page of answerPages) output.addPage(page);
  return output.save({ useObjectStreams: false });
}
