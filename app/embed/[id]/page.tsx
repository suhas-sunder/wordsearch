import { notFound } from "next/navigation";
import { noindexMetadata } from "@/lib/seo/metadata";
import { decodePuzzleShareState } from "@/lib/share-state/state";
import { generatePuzzle } from "@/lib/puzzle/generate";
import { PuzzleSvg } from "@/components/puzzle/PuzzleSvg";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = noindexMetadata("Embedded Word Search", "Noindex embedded word search surface.");

export default async function EmbedPage({ params }: Props) {
  const { id } = await params;
  const state = decodePuzzleShareState(id);
  if (!state) notFound();
  const puzzle = generatePuzzle(state);
  return (
    <main className="utility-page site-shell">
      <PuzzleSvg puzzle={puzzle} compact />
    </main>
  );
}
