import { StaticPuzzleRoute } from "@/components/puzzle/StaticPuzzleRoute";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Embedded Word Search", "Noindex embedded word search surface.");

export default function EmbedPage() {
  return <StaticPuzzleRoute kind="embed" />;
}
