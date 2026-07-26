import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { noindexMetadata } from "@/lib/seo/metadata";
import { decodePuzzleShareState, puzzlePlayUrl } from "@/lib/share-state/state";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { outputOptionsForRequest, parsePuzzleOutputOptions } from "@/lib/puzzle/output-options";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata = noindexMetadata("PDF-Ready Word Search", "PDF-ready noindex word search surface.");

export default async function PdfPage({ params, searchParams }: Props) {
  const { id } = await params;
  const state = decodePuzzleShareState(id);
  if (!state) notFound();
  const puzzle = generatePuzzle(state);
  const target = puzzlePlayUrl(puzzle.request);
  const options = parsePuzzleOutputOptions(await searchParams, outputOptionsForRequest(puzzle.request));
  const qrDataUrl = options.qrCode ? await QRCode.toDataURL(target, { margin: 4, width: 160 }) : undefined;
  return (
    <main className="utility-page site-shell">
      <p className="control-help">Use your browser print dialog and choose Save as PDF. This page has print-only CSS and no ads.</p>
      <PrintablePuzzle puzzle={puzzle} qrDataUrl={qrDataUrl} utilityLabel="PDF-ready puzzle" options={options} shareTarget={target} />
    </main>
  );
}
