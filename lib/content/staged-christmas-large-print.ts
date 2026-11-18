// Offline review tooling only; no public component or route imports this module.
import { christmasCandidates } from "@/content/staged/christmas";
import { christmasLargePrintArtifact } from "@/content/staged/christmas-large-print";
import { validateStaged } from "@/lib/content/staged-validation";
import { createPuzzlePdf } from "@/lib/pdf/create-puzzle-pdf";
import { measuredLargePrintOptions } from "@/lib/pdf/browser-download";
import { defaultPuzzleOutputOptions, type PaperSize } from "@/lib/puzzle/output-options";
import { puzzlePlayUrl } from "@/lib/share-state/state";

/** Keep the canonical candidate's complete request/grid/answers unchanged. */
export function resolveChristmasLargePrintArtifact() {
  const reference = christmasLargePrintArtifact.source;
  const candidate = christmasCandidates.find(({ id }) => id === reference.id);
  if (!candidate || candidate.proposedPath !== reference.canonicalPath) throw new Error("X03 requires the reviewed X02 canonical source.");
  const validation = validateStaged([candidate]);
  const freeze = validation.freezes[0];
  if (validation.issues.length || !freeze || freeze.requestSha256 !== reference.requestSha256 || freeze.gridSha256 !== reference.gridSha256 || freeze.answerSha256 !== reference.answerSha256) {
    throw new Error("X02 changed or failed validation. Review X03's exact source mapping before exporting.");
  }
  return freeze;
}

/** Real measured student/teacher PDF; an ordinary larger-grid flag is insufficient. */
export async function createChristmasLargePrintReviewPdf(paperSize: PaperSize) {
  if (!christmasLargePrintArtifact.paperSizes.includes(paperSize)) throw new Error("X03 review output supports only Letter or A4.");
  const freeze = resolveChristmasLargePrintArtifact();
  const options = measuredLargePrintOptions({ ...defaultPuzzleOutputOptions, paperSize, includeAnswerKey: true, inkSaving: true });
  const bytes = await createPuzzlePdf({ puzzle: freeze.result, options, shareUrl: puzzlePlayUrl(freeze.result.request), layoutProfile: christmasLargePrintArtifact.layoutProfile });
  return { artifactId: christmasLargePrintArtifact.id, sourceCandidateId: freeze.id, canonicalPath: freeze.path, options, puzzle: freeze.result, bytes };
}
