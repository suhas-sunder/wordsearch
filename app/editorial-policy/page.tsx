import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Editorial and Puzzle Standards | I Love Word Search", "Review the topic, word-list, originality, corrections, advertising, and accessibility standards used by I Love Word Search.", "/editorial-policy");

export default function EditorialPolicyPage() {
  return <TrustPage eyebrow="Publishing standards" h1="Editorial and Puzzle Standards" path="/editorial-policy" lede="I Love Word Search exists to provide useful free online and printable word search resources." sections={[
    { heading: "Originality", paragraphs: ["An indexable curated puzzle page should have a distinct purpose, topic-specific word list, stable puzzle definition, unique supporting copy, accurate metadata, and useful related links. Arbitrary user-generated states, search results, and thin variants are not indexed by default."] },
    { heading: "Topic standards", paragraphs: ["Suitable subjects include evergreen general interest, classroom subjects, vocabulary, nature, geography, science, math, language arts, generic holidays, seasons, sports vocabulary, hobbies, food, and animals."], items: ["Copyrighted characters, celebrity-focused topics, entertainment franchises, and brand-dependent topics require deliberate review.", "Explicit or hateful content, dangerous instructions, and misleading health claims are not suitable for the general library."] },
    { heading: "Word-list standards", items: ["Review spelling and topic relevance.", "Remove duplicates and choose an appropriate difficulty.", "Check grid fit and audience suitability.", "Do not add filler terms solely to increase the word count."] },
    { heading: "Description standards", items: ["Write unique, useful copy rather than lightly spun templates.", "Avoid keyword stuffing, fake counts, fabricated popularity claims, and unsupported educational or health outcomes."] },
    { heading: "Corrections", paragraphs: [<>Visitors can <Link href="/contact">report</Link> spelling errors, broken puzzles, print or PDF problems, accessibility issues, unsuitable content, or duplicate pages.</>] },
    { heading: "Advertising separation", paragraphs: ["If advertising is enabled later, it must remain separate from puzzle controls, never imitate download or navigation buttons, stay out of print and PDF output, avoid obstructing play, and never determine editorial topic selection. The current ad-labelled areas are layout placeholders, not active advertising."] },
    { heading: "Automation and review", paragraphs: ["Software and automation assist with puzzle generation, validation, formatting, and parts of the publishing workflow. Indexable puzzle topics, word lists, and supporting page content are subject to editorial review before they are treated as finished resources."] }
  ]} />;
}
