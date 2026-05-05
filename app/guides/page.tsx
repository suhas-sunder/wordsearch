import { IndexablePage } from "@/components/page/IndexablePage";
import { GuideGrid } from "@/components/page/PageSections";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Word Search Guides | Printing, Difficulty, Lists, and Classroom Ideas",
  "Practical word search guides for creating, printing, teaching, solving, and building better word lists.",
  "/guides"
);

export default function GuidesIndex() {
  return (
    <IndexablePage
      title="Word Search Guides"
      h1="Word Search Guides"
      description="Practical guides for printing, difficulty, classroom use, large print, hidden messages, solving, and custom word lists."
      intro="Guides are intentionally practical: they support the generator workflow without turning core pages into walls of SEO text."
      path="/guides"
      words={["guide", "print", "difficulty", "classroom", "homeschool", "tips", "large", "hidden", "custom", "party"]}
      modules={["faq"]}
      breadcrumbs={[{ label: "Guides" }]}
    >
      <GuideGrid />
    </IndexablePage>
  );
}
