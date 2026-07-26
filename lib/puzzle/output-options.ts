import type { PuzzleRequest } from "@/lib/puzzle/types";

export type PaperSize = "letter" | "a4";
export type PageOrientation = "portrait" | "landscape";
export type PrintScale = "standard" | "large";
export type WordBankPlacement = "below" | "beside";

export interface PuzzleOutputOptions {
  paperSize: PaperSize;
  orientation: PageOrientation;
  printScale: PrintScale;
  includeAnswerKey: boolean;
  nameDateLine: boolean;
  instructions: boolean;
  wordBankPlacement: WordBankPlacement;
  qrCode: boolean;
  coordinates: boolean;
  inkSaving: boolean;
}

export interface PdfPageSpec {
  width: number;
  height: number;
  cssPageName: "letter-portrait" | "letter-landscape" | "a4-portrait" | "a4-landscape";
}

export const defaultPuzzleOutputOptions: PuzzleOutputOptions = {
  paperSize: "letter",
  orientation: "portrait",
  printScale: "standard",
  includeAnswerKey: false,
  nameDateLine: true,
  instructions: true,
  wordBankPlacement: "below",
  qrCode: true,
  coordinates: false,
  inkSaving: false
};

const booleanKeys = [
  "includeAnswerKey",
  "nameDateLine",
  "instructions",
  "qrCode",
  "coordinates",
  "inkSaving"
] as const;

function savedBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function outputOptionsForRequest(request: Partial<PuzzleRequest>): PuzzleOutputOptions {
  return {
    ...defaultPuzzleOutputOptions,
    printScale: request.largePrint ? "large" : "standard",
    nameDateLine: request.nameDateLine !== false,
    coordinates: request.showCoordinates === true
  };
}

export function normalizePuzzleOutputOptions(
  value: unknown,
  fallback: PuzzleOutputOptions = defaultPuzzleOutputOptions
): PuzzleOutputOptions {
  if (!value || typeof value !== "object") return { ...fallback };
  const saved = value as Partial<PuzzleOutputOptions>;
  return {
    paperSize: saved.paperSize === "a4" || saved.paperSize === "letter" ? saved.paperSize : fallback.paperSize,
    orientation: saved.orientation === "landscape" || saved.orientation === "portrait" ? saved.orientation : fallback.orientation,
    printScale: saved.printScale === "large" || saved.printScale === "standard" ? saved.printScale : fallback.printScale,
    includeAnswerKey: savedBoolean(saved.includeAnswerKey, fallback.includeAnswerKey),
    nameDateLine: savedBoolean(saved.nameDateLine, fallback.nameDateLine),
    instructions: savedBoolean(saved.instructions, fallback.instructions),
    wordBankPlacement: saved.wordBankPlacement === "beside" || saved.wordBankPlacement === "below"
      ? saved.wordBankPlacement
      : fallback.wordBankPlacement,
    qrCode: savedBoolean(saved.qrCode, fallback.qrCode),
    coordinates: savedBoolean(saved.coordinates, fallback.coordinates),
    inkSaving: savedBoolean(saved.inkSaving, fallback.inkSaving)
  };
}

export function isPuzzleOutputOptions(value: unknown): value is PuzzleOutputOptions {
  if (!value || typeof value !== "object") return false;
  const options = value as Partial<PuzzleOutputOptions>;
  return (options.paperSize === "letter" || options.paperSize === "a4")
    && (options.orientation === "portrait" || options.orientation === "landscape")
    && (options.printScale === "standard" || options.printScale === "large")
    && (options.wordBankPlacement === "below" || options.wordBankPlacement === "beside")
    && booleanKeys.every((key) => typeof options[key] === "boolean");
}

export function serializePuzzleOutputOptions(options: PuzzleOutputOptions) {
  const params = new URLSearchParams({
    paper: options.paperSize,
    orientation: options.orientation,
    scale: options.printScale,
    answers: options.includeAnswerKey ? "1" : "0",
    nameDate: options.nameDateLine ? "1" : "0",
    instructions: options.instructions ? "1" : "0",
    wordBank: options.wordBankPlacement,
    qr: options.qrCode ? "1" : "0",
    coordinates: options.coordinates ? "1" : "0",
    ink: options.inkSaving ? "1" : "0"
  });
  return params.toString();
}

function parsedBoolean(value: string | null, fallback: boolean) {
  if (value === "1" || value === "true" || value === "on") return true;
  if (value === "0" || value === "false" || value === "off") return false;
  return fallback;
}

export function parsePuzzleOutputOptions(
  input: string | URLSearchParams | Record<string, string | string[] | undefined> | null | undefined,
  fallback: PuzzleOutputOptions = defaultPuzzleOutputOptions
) {
  if (!input) return { ...fallback };
  const params = typeof input === "string"
    ? new URLSearchParams(input.startsWith("?") ? input.slice(1) : input)
    : input instanceof URLSearchParams
      ? input
      : new URLSearchParams(Object.entries(input).flatMap(([key, value]) => value === undefined ? [] : Array.isArray(value) ? value.map((item) => [key, item]) : [[key, value]]));
  const paperSize = (params.get("paper") ?? params.get("paperSize"))?.toLowerCase();
  const orientation = params.get("orientation")?.toLowerCase();
  const scale = params.get("scale")?.toLowerCase();
  const wordBankPlacement = (params.get("wordBank") ?? params.get("wordBankPlacement"))?.toLowerCase();
  return normalizePuzzleOutputOptions({
    paperSize,
    orientation,
    printScale: scale ?? (parsedBoolean(params.get("largePrint"), false) ? "large" : undefined),
    includeAnswerKey: parsedBoolean(params.get("answers") ?? params.get("answerKey"), fallback.includeAnswerKey),
    nameDateLine: parsedBoolean(params.get("nameDate") ?? params.get("nameDateLine"), fallback.nameDateLine),
    instructions: parsedBoolean(params.get("instructions"), fallback.instructions),
    wordBankPlacement,
    qrCode: parsedBoolean(params.get("qr") ?? params.get("qrCode"), fallback.qrCode),
    coordinates: parsedBoolean(params.get("coordinates"), fallback.coordinates),
    inkSaving: parsedBoolean(params.get("ink") ?? params.get("inkSaving"), fallback.inkSaving)
  }, fallback);
}

export function pdfPageSpec(paperSize: PaperSize, orientation: PageOrientation): PdfPageSpec {
  const portrait = paperSize === "letter"
    ? { width: 612, height: 792 }
    : { width: 595.28, height: 841.89 };
  const dimensions = orientation === "portrait"
    ? portrait
    : { width: portrait.height, height: portrait.width };
  return {
    ...dimensions,
    cssPageName: `${paperSize}-${orientation}`
  };
}

export function pdfPagePlan(options: PuzzleOutputOptions): Array<"puzzle" | "answer-key"> {
  return options.includeAnswerKey ? ["puzzle", "answer-key"] : ["puzzle"];
}

export function sanitizePuzzleFilename(title: string) {
  const safeTitle = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split("")
    .filter((character) => character.charCodeAt(0) >= 32)
    .join("")
    .replace(/[<>:"/\\|?*]/g, " ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 80);
  return `${safeTitle || "puzzle"}-word-search.pdf`;
}
