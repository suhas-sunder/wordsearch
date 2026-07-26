import Link from "next/link";
import { TrustPage } from "@/components/page/TrustPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("How Our Word Searches Are Made | I Love Word Search", "See how I Love Word Search selects topics, reviews word lists, generates deterministic puzzles, checks answer keys, and prepares online, printable, and PDF versions.", "/how-word-searches-are-made");

export default function MethodologyPage() {
  return <TrustPage eyebrow="Publishing methodology" h1="How Our Word Searches Are Made" path="/how-word-searches-are-made" lede="Topics, words, puzzle generation, and every output format follow one reproducible publishing workflow." sections={[
    { heading: "Topic and audience selection", paragraphs: ["Topics are selected for clear user value: general-interest puzzles, classroom vocabulary, seasonal activities, age-appropriate printable activities, large-print use, and online play. The main library is not built around copyrighted characters, celebrities, or trademark-dependent topics."] },
    { heading: "Word-list preparation", paragraphs: ["A finished list should be relevant to its topic, correctly spelled, duplicate-free, suitable for the intended audience, compatible with its grid, long enough to be meaningful, and free of unrelated padding."] },
    { heading: "Puzzle generation", paragraphs: ["Each curated puzzle uses a stable seed. The same inputs produce the same deterministic grid and placements across online play, print, PDF, answer key, sharing, and QR links. A solved word must match its exact stored coordinate path; matching filler letters do not count as a valid placement."] },
    { heading: "Quality checks", paragraphs: ["Automated checks cover supported input, duplicate words, deterministic placement, exact answer paths, output consistency, metadata, and internal references. Publishing standards also call for mobile and keyboard solving checks, printable and PDF layout review, answer-key consistency, and review of word suitability. Accidental offensive filler is not currently guaranteed to be automatically filtered, so it remains an editorial review concern."] },
    { heading: "Updates and corrections", paragraphs: [<>A page may be corrected when spelling is wrong, a word is unsuitable, a puzzle or output does not render properly, information is unclear, or a visitor reports a problem. Use the <Link href="/contact">Contact page</Link> to report one.</>] },
    { heading: "Automation disclosure", paragraphs: ["Software and automation assist with puzzle generation, validation, formatting, and parts of the publishing workflow. Indexable puzzle topics, word lists, and supporting page content are subject to editorial review before they are treated as finished resources."] }
  ]} />;
}
