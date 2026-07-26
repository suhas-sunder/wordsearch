import { StaticPuzzleRoute } from "@/components/puzzle/StaticPuzzleRoute";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Play Word Search", "Noindex online play surface.");

export default function PlayPage() {
  return <StaticPuzzleRoute kind="play" />;
}
