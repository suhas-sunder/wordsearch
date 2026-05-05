import QRCode from "qrcode";
import { noindexMetadata } from "@/lib/seo/metadata";
import { decodeShareState, shareUrl } from "@/lib/share-state/state";
import { generatePuzzle, defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = noindexMetadata("Word Search Answer Key", "Noindex word search answer key surface.");

export default async function AnswerKeyPage({ params }: Props) {
  const { id } = await params;
  const state = decodeShareState(id) ?? defaultPuzzleRequest;
  const puzzle = generatePuzzle(state);
  const qrDataUrl = await QRCode.toDataURL(shareUrl(puzzle.sharePath), { margin: 1, width: 112 });
  return (
    <main className="utility-page site-shell">
      <PrintablePuzzle puzzle={puzzle} answerKey qrDataUrl={qrDataUrl} />
    </main>
  );
}
