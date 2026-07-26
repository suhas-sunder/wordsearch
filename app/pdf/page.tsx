import { StaticPuzzleRoute } from "@/components/puzzle/StaticPuzzleRoute";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Download Word Search PDF", "Browser-generated noindex PDF download surface.");

export default function PdfPage() {
  return <StaticPuzzleRoute kind="pdf" />;
}
