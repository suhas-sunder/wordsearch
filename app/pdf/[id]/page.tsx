import QRCode from "qrcode";
import { noindexMetadata } from "@/lib/seo/metadata";
import { decodeShareState, shareUrl } from "@/lib/share-state/state";
import { generatePuzzle, defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = noindexMetadata("PDF-Ready Word Search", "PDF-ready noindex word search surface.");

export default async function PdfPage({ params }: Props) {
  const { id } = await params;
  const state = decodeShareState(id) ?? defaultPuzzleRequest;
  const puzzle = generatePuzzle(state);
  const qrDataUrl = await QRCode.toDataURL(shareUrl(puzzle.sharePath), { margin: 1, width: 112 });
  return (
    <main className="utility-page site-shell">
      <p className="control-help">Use your browser print dialog and choose Save as PDF. This page has print-only CSS and no ads.</p>
      <PrintablePuzzle puzzle={puzzle} qrDataUrl={qrDataUrl} utilityLabel="PDF-ready puzzle" />
    </main>
  );
}
