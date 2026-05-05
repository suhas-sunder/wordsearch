import QRCode from "qrcode";
import { noindexMetadata } from "@/lib/seo/metadata";
import { decodeShareState, shareUrl } from "@/lib/share-state/state";
import { generatePuzzle, defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { PrintablePuzzle } from "@/components/print/PrintablePuzzle";
import { OnlineSolver } from "@/components/puzzle/OnlineSolver";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = noindexMetadata("Play Word Search", "Noindex online play surface.");

export default async function PlayPage({ params }: Props) {
  const { id } = await params;
  const state = decodeShareState(id) ?? defaultPuzzleRequest;
  const puzzle = generatePuzzle(state);
  const qrDataUrl = await QRCode.toDataURL(shareUrl(puzzle.sharePath), { margin: 1, width: 112 });
  return (
    <main className="utility-page site-shell">
      <h1>{puzzle.request.title}</h1>
      <p className="value-prop">Tap or click any letter in a found word to mark it. The print view below uses the same seed.</p>
      <OnlineSolver puzzle={puzzle} />
      <PrintablePuzzle puzzle={puzzle} qrDataUrl={qrDataUrl} utilityLabel="Print this exact puzzle" />
    </main>
  );
}
