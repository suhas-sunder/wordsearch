import { StaticPuzzleRoute } from "@/components/puzzle/StaticPuzzleRoute";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Printable Word Search", "Printable noindex word search surface.");

export default function PrintPage() {
  return <StaticPuzzleRoute kind="print" />;
}
