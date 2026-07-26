import { StaticPuzzleRoute } from "@/components/puzzle/StaticPuzzleRoute";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Word Search Answer Key", "Noindex word search answer key surface.");

export default function AnswerKeyPage() {
  return <StaticPuzzleRoute kind="answer-key" />;
}
