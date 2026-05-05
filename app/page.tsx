import { IndexablePage } from "@/components/page/IndexablePage";
import { CategoryGrid, CollectionGrid, GuideGrid, TopicStrip } from "@/components/page/PageSections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "I Love Word Search | Free Printable and Online Word Search Puzzles",
  "Create, print, play, and share word search puzzles with answer keys, PDF-ready layouts, large-print modes, and curated topics.",
  "/"
);

export default function HomePage() {
  return (
    <IndexablePage
      title="I Love Word Search"
      h1="I Love Word Search"
      description="Create free printable and online word search puzzles with a clean generator, answer keys, PDF-ready layouts, and curated topic pages."
      intro="The homepage is a puzzle portal: start building immediately, then browse canonical categories, seasonal topics, collections, and practical guides."
      path="/"
      words={["word", "search", "printable", "online", "teacher", "family", "answer", "large", "topic", "puzzle"]}
      modules={["faq"]}
      breadcrumbs={[{ label: "I Love Word Search" }]}
    >
      <CategoryGrid />
      <TopicStrip />
      <CollectionGrid />
      <GuideGrid />
    </IndexablePage>
  );
}
