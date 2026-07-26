import { StaticPuzzleRoute } from "@/components/puzzle/StaticPuzzleRoute";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Custom Word Search", "Noindex custom share surface.");

export default function CustomSharePage() {
  return <StaticPuzzleRoute kind="custom" />;
}
