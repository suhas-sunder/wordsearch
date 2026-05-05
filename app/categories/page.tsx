import { IndexablePage } from "@/components/page/IndexablePage";
import { CategoryGrid, TopicStrip } from "@/components/page/PageSections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Word Search Categories | Browse Printable Puzzle Hubs",
  "Browse word search category hubs for animals, holidays, science, math, geography, language arts, and more.",
  "/categories"
);

export default function CategoriesPage() {
  return (
    <IndexablePage
      title="Word Search Categories"
      h1="Word Search Categories"
      description="Browse broad word search hubs with printable, online, PDF, answer key, and large-print options in-page."
      intro="Category hubs collect useful topic pages without creating duplicate modifier pages for every possible filter."
      path="/categories"
      words={["animals", "holidays", "science", "math", "reading", "history", "travel", "sports", "music", "faith"]}
      modules={["faq"]}
      breadcrumbs={[{ label: "Categories" }]}
    >
      <CategoryGrid />
      <TopicStrip />
    </IndexablePage>
  );
}
