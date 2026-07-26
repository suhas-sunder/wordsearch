import { notFound } from "next/navigation";
import { noindexMetadata } from "@/lib/seo/metadata";
import { decodePuzzleShareState } from "@/lib/share-state/state";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { OnlineSolver } from "@/components/puzzle/OnlineSolver";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = noindexMetadata("Play Word Search", "Noindex online play surface.");

export default async function PlayPage({ params }: Props) {
  const { id } = await params;
  const state = decodePuzzleShareState(id);
  if (!state) notFound();
  const puzzle = generatePuzzle(state);
  return (
    <main className="utility-page site-shell">
      <h1>{puzzle.request.title}</h1>
      <p className="value-prop">Trace each hidden word from its first letter to its last. Print, PDF, answers, share, and QR all preserve this exact seed and placement set.</p>
      <OnlineSolver puzzle={puzzle} />
    </main>
  );
}
