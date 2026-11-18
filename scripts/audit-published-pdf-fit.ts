import QRCode from "qrcode";
import { createHash } from "node:crypto";
import { PDFDocument } from "pdf-lib";
import { routeInventory } from "@/content/registry";
import { generatedPuzzleFingerprints } from "@/lib/content/fingerprint";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { measurePdfBytes } from "@/lib/pdf/measure-pdf";
import { defaultPuzzleOutputOptions } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

const allLayouts = process.argv.includes("--all-layouts");
const qrCode = !process.argv.includes("--no-qr");
const records = routeInventory.filter((record) => record.contentType === "puzzle" && record.publicationStatus === "published");
if (records.length !== 150) throw new Error("Expected the reviewed150 published puzzle baseline.");
const reports = [];
for (const record of records) {
  if (record.contentType !== "puzzle") continue;
  const p = record.puzzle;
  const puzzle = generatePuzzle({ title: p.puzzleTitle, wordsText: p.words.join("\n"), seed: p.seed, rows: p.rows, cols: p.columns, autoSize: !p.rows || !p.columns, directions: p.directions, allowOverlap: p.allowOverlap, alphabetPack: p.alphabetPack, difficulty: p.difficulty });
  const shareUrl = puzzlePlayUrl(puzzle.request);
  const qrDataUrl = qrCode ? await QRCode.toDataURL(shareUrl, { margin: 4, width: 256, errorCorrectionLevel: "M" }) : undefined;
  for (const paperSize of ["letter", "a4"] as const) for (const printScale of ["standard", "large"] as const) for (const orientation of allLayouts ? ["portrait", "landscape"] as const : ["portrait"] as const) {
    const options = { ...defaultPuzzleOutputOptions, paperSize, printScale, orientation, qrCode, includeAnswerKey: true };
    try {
      const bytes = await createPuzzlePdf({ puzzle, options, shareUrl, qrDataUrl });
      const measurement = await measurePdfBytes(bytes, puzzle, options);
      reports.push({ path: record.canonicalPath, paperSize, printScale, orientation, fingerprints: generatedPuzzleFingerprints(record), pdfSha256: createHash("sha256").update(bytes).digest("hex"), pageCount: (await PDFDocument.load(bytes)).getPageCount(), minGridPt: measurement.grid.minFontPt, minBankPt: Math.min(...measurement.wordBank.map(({ fontPt }) => fontPt)), findings: measurement.findings });
    } catch (error) {
      reports.push({ path: record.canonicalPath, paperSize, printScale, orientation, error: error instanceof Error ? error.message : String(error) });
    }
  }
}
const failures = reports.filter((report) => "error" in report || report.findings.length || report.pageCount !== 2);
console.log(JSON.stringify({ publishedCount: records.length, pdfCount: reports.length, qrCode, allLayouts, failureCount: failures.length, failures, reports }, null, 2));
if (failures.length) process.exitCode = 1;
