import { IndexablePage } from "@/components/page/IndexablePage";
import { getSitePage } from "@/content/routes";
import { decodeShareState } from "@/lib/share-state/state";
import { pageMetadata } from "@/lib/seo/metadata";

const generatorPage = getSitePage("word-search-generator")!;

export const metadata = pageMetadata(
  "Word Search Generator - Make a Custom Puzzle",
  "Create a custom word search with deterministic preview, print, PDF, answer key, online play, sharing, and QR output.",
  "/word-search-generator"
);

export default async function WordSearchGeneratorPage({ searchParams }: { searchParams?: Promise<{ state?: string }> }) {
  const query = searchParams ? await searchParams : {};
  const state = decodeShareState(query.state);
  return (
    <IndexablePage
      title={generatorPage.title}
      h1={generatorPage.h1}
      description={generatorPage.description}
      intro="Add your own words, choose the puzzle settings, and use the same seed across preview, print, PDF, answer key, online play, share, and QR output."
      path="/word-search-generator"
      words={generatorPage.presetWords}
      difficulty={generatorPage.difficulty}
      alphabetPack={generatorPage.alphabetPack}
      modules={["specialty", "faq"]}
      faq={generatorPage.faq}
      requestOverride={state}
      breadcrumbs={[{ label: "Word Search Generator" }]}
    />
  );
}
