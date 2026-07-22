import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/layout/AdSlot";
import { DiscoveryCards } from "@/components/page/DiscoveryCards";
import {
  adultPicks,
  categoryPicks,
  kidsPicks,
  largePrintPicks,
  onlinePicks,
  pdfGuides,
  printablePicks,
  teacherCollections,
  worksheetCategories,
  type DiscoveryLink
} from "@/content/discovery";
import type { SitePage } from "@/content/routes";
import { defaultPuzzleRequest } from "@/lib/puzzle/generate";
import { stateId } from "@/lib/share-state/state";

interface HubConfig {
  eyebrow: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  points: string[];
  firstHeading: string;
  firstDescription: string;
  firstItems: DiscoveryLink[];
  secondHeading: string;
  secondDescription: string;
  secondItems: DiscoveryLink[];
  editorialHeading: string;
  editorial: string[];
}

const featuredPlayState = stateId({
  ...defaultPuzzleRequest,
  title: "Ocean Animals Word Search",
  wordsText: "dolphin\nwhale\ncoral\nshark\noctopus\nturtle\nseahorse\nseal",
  seed: "ilws-online-featured-ocean-animals",
  difficulty: "easy"
});

const hubConfigs: Record<string, HubConfig> = {
  "free-printable-word-searches": {
    eyebrow: "Print-ready collection",
    primary: { href: printablePicks[0].href, label: "Choose a printable puzzle" },
    secondary: { href: "/categories", label: "Browse all categories" },
    points: ["Clean student pages", "Matching answer keys", "Letter and A4 friendly"],
    firstHeading: "Featured printable word searches",
    firstDescription: "Open a real curated puzzle, adjust its word list if needed, then use the matching print or answer-key view.",
    firstItems: printablePicks,
    secondHeading: "Browse printable puzzles by category",
    secondDescription: "Start with a subject or theme when you do not already have a specific puzzle in mind.",
    secondItems: categoryPicks.slice(0, 4),
    editorialHeading: "Choose a puzzle that prints cleanly",
    editorial: [
      "For quick home or classroom use, start with an existing topic and keep the supplied word list. Each topic can be reproduced from the same seed across its preview and answer key.",
      "If you need a spelling list, party theme, or lesson-specific vocabulary, use the generator instead. It keeps custom creation separate from this browse-first collection."
    ]
  },
  "online-word-search": {
    eyebrow: "Play in your browser",
    primary: { href: `/play/${featuredPlayState}`, label: "Play the featured puzzle" },
    secondary: { href: onlinePicks[0].href, label: "Browse online puzzle topics" },
    points: ["Same seeded grid", "Touch and keyboard access", "Print the same puzzle"],
    firstHeading: "Online word searches to try",
    firstDescription: "Choose a curated topic, then play the exact same seeded grid used by its printable version.",
    firstItems: onlinePicks,
    secondHeading: "Find another online puzzle",
    secondDescription: "These broad categories lead to real topic pages with online and printable options.",
    secondItems: categoryPicks.slice(0, 4),
    editorialHeading: "Online play or paper puzzle?",
    editorial: [
      "Online puzzles are useful when you want to start immediately on a phone, tablet, or computer. Printable puzzles are better when you need handouts, offline use, or a separate answer key.",
      "Both formats use the same deterministic puzzle data, so moving between play and print does not silently rearrange the grid."
    ]
  },
  "word-search-pdf": {
    eyebrow: "PDF and print workflow",
    primary: { href: "/word-search-generator", label: "Make a PDF-ready puzzle" },
    secondary: { href: "/guides/how-to-print-word-searches", label: "Read the printing guide" },
    points: ["Browser PDF export", "Matching solution page", "Ink-conscious layout"],
    firstHeading: "Start from a printable puzzle",
    firstDescription: "Pick a topic first, then use its PDF-ready view to save the seeded puzzle from your browser.",
    firstItems: printablePicks,
    secondHeading: "PDF and printing guides",
    secondDescription: "Use the existing guides for paper size, margins, large print, and cleaner classroom copies.",
    secondItems: pdfGuides,
    editorialHeading: "How the PDF route works",
    editorial: [
      "The PDF tool prepares the same SVG puzzle grid used in preview and print. Your browser's print dialog can save that page as a PDF without placing advertisements on the worksheet.",
      "Answer keys remain a separate noindex utility view, which makes it easier to save or print student and solution pages independently."
    ]
  },
  "large-print-word-searches": {
    eyebrow: "Readable print collection",
    primary: { href: largePrintPicks[0].href, label: "Choose a large-print topic" },
    secondary: { href: "/word-search-generator", label: "Create a custom large-print puzzle" },
    points: ["Larger puzzle cells", "High-contrast grid", "Shorter, readable lists"],
    firstHeading: "Large-print puzzle topics",
    firstDescription: "These adult-friendly themes work well with the existing large-print setting and a focused word list.",
    firstItems: largePrintPicks,
    secondHeading: "More calm puzzle categories",
    secondDescription: "Browse themes that translate well to uncluttered, readable paper layouts.",
    secondItems: [categoryPicks[0], categoryPicks[5], categoryPicks[7], categoryPicks[6]],
    editorialHeading: "What makes a useful large-print puzzle",
    editorial: [
      "Large print is more than a bigger page title. A readable puzzle needs larger cells, strong contrast, enough spacing in the word bank, and a word list that does not force the grid to become crowded.",
      "The custom generator exposes a large-print setting when you need to use your own words; the curated links above offer a faster starting point."
    ]
  },
  "word-searches-for-kids": {
    eyebrow: "Kid-friendly collection",
    primary: { href: kidsPicks[0].href, label: "Choose an easy puzzle" },
    secondary: { href: "/word-search-worksheets", label: "Browse worksheets" },
    points: ["Simple themes", "Easy direction options", "Printable answer keys"],
    firstHeading: "Word searches for kids",
    firstDescription: "Start with familiar themes and shorter vocabulary, then adjust difficulty on the topic page if needed.",
    firstItems: kidsPicks,
    secondHeading: "School-friendly categories",
    secondDescription: "Use these real subject directories for classroom, homeschool, or at-home practice.",
    secondItems: [categoryPicks[0], categoryPicks[2], categoryPicks[3], categoryPicks[4]],
    editorialHeading: "Choosing a children's word search",
    editorial: [
      "Match the puzzle to the reader's vocabulary before increasing the grid difficulty. Familiar words and a shorter list usually make a better starting point than a dense grid.",
      "Parents and teachers can print a student copy and keep the matching answer key separate. Custom vocabulary belongs in the generator, where the word list stays editable."
    ]
  },
  "word-searches-for-adults": {
    eyebrow: "Adult puzzle collection",
    primary: { href: adultPicks[0].href, label: "Choose an adult puzzle" },
    secondary: { href: "/large-print-word-searches", label: "Browse large print" },
    points: ["Adult-oriented themes", "Easy through hard options", "Online and printable"],
    firstHeading: "Word searches for adults",
    firstDescription: "Browse richer themes without childish styling or unsupported wellness claims.",
    firstItems: adultPicks,
    secondHeading: "Explore more adult-friendly topics",
    secondDescription: "These categories include travel, history, nature, books, music, and other established puzzle pages.",
    secondItems: [categoryPicks[5], categoryPicks[6], categoryPicks[7], categoryPicks[0]],
    editorialHeading: "Choose by theme, format, and difficulty",
    editorial: [
      "Pick a familiar theme for a relaxed puzzle or switch to harder directions for more challenge. Large-print options keep the layout readable without changing the subject matter.",
      "Every curated topic can lead to online play, print, PDF, and answer-key utilities using the same puzzle seed."
    ]
  },
  "word-searches-for-teachers": {
    eyebrow: "Classroom resource hub",
    primary: { href: teacherCollections[2].href, label: "Browse classroom puzzles" },
    secondary: { href: "/word-search-generator", label: "Build from a vocabulary list" },
    points: ["Subject collections", "Name and date line", "Separate answer keys"],
    firstHeading: "Teacher-ready collections",
    firstDescription: "Use existing classroom, science, and substitute-teacher collections when you need a quick handout.",
    firstItems: teacherCollections,
    secondHeading: "Browse by classroom subject",
    secondDescription: "Subject directories provide real topic pages for vocabulary previews, review, and early-finisher work.",
    secondItems: worksheetCategories,
    editorialHeading: "Use ready-made or custom classroom puzzles",
    editorial: [
      "Ready-made topics are fastest when the supplied vocabulary matches your lesson. The generator is the better route for weekly spelling, a textbook list, or clue-based review.",
      "Print and answer-key views are kept separate, and deterministic seeds keep every student copy aligned with the teacher's solution."
    ]
  },
  "word-search-worksheets": {
    eyebrow: "Printable worksheet collection",
    primary: { href: teacherCollections[0].href, label: "Open a worksheet collection" },
    secondary: { href: "/word-search-generator", label: "Create a custom worksheet" },
    points: ["Subject-based topics", "Editable word lists", "Answer-key workflow"],
    firstHeading: "Word search worksheet collections",
    firstDescription: "Start with an established classroom collection or subject and keep the page focused on printable use.",
    firstItems: teacherCollections,
    secondHeading: "Worksheets by subject",
    secondDescription: "Choose a subject directory to find existing puzzles before creating a new word list.",
    secondItems: worksheetCategories,
    editorialHeading: "Build a useful word search worksheet",
    editorial: [
      "A practical worksheet has a clear title, short instructions, readable grid, word bank, and room for a name and date when needed. The answer key should remain on its own page.",
      "Use an existing subject puzzle for speed or send a lesson-specific word list to the generator. Both paths preserve the same seeded output across preview and print."
    ]
  }
};

export function hasRouteHub(slug: string) {
  return slug in hubConfigs;
}

export function RouteHub({ page }: { page: SitePage }) {
  const config = hubConfigs[page.slug];
  if (!config) return null;

  return (
    <main>
      <Breadcrumbs items={[{ label: page.h1 }]} />
      <section className="hub-hero site-shell">
        <div>
          <span className="eyebrow">{config.eyebrow}</span>
          <h1>{page.h1}</h1>
          <p className="value-prop">{page.description}</p>
          <div className="hero-actions">
            <Link className="primary-button" href={config.primary.href}>{config.primary.label}</Link>
            <Link className="secondary-button" href={config.secondary.href}>{config.secondary.label}</Link>
          </div>
        </div>
        <aside className="intent-panel" aria-label={`${page.h1} features`}>
          <strong>Start here when you want</strong>
          <ul>{config.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </aside>
      </section>

      <section className="content-section site-shell">
        <div className="section-heading">
          <h2>{config.firstHeading}</h2>
          <p>{config.firstDescription}</p>
        </div>
        <DiscoveryCards items={config.firstItems} />
      </section>

      <AdSlot placement="utility-banner" />

      <section className="content-section site-shell soft-section">
        <div className="section-heading">
          <h2>{config.secondHeading}</h2>
          <p>{config.secondDescription}</p>
        </div>
        <DiscoveryCards items={config.secondItems} />
      </section>

      <section className="content-section site-shell editorial-copy">
        <div>
          <span className="eyebrow">Useful guidance</span>
          <h2>{config.editorialHeading}</h2>
        </div>
        <div>{config.editorial.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      <section className="content-section site-shell route-next-step">
        <div>
          <span className="eyebrow">Need a specific topic?</span>
          <h2>Search the curated puzzle catalog</h2>
          <p>Find a real puzzle, category, collection, or guide. If nothing matches, create a custom word search from your own list.</p>
        </div>
        <div className="hero-actions">
          <Link className="primary-button" href="/search">Search puzzles</Link>
          <Link className="secondary-button" href="/word-search-generator">Open the generator</Link>
        </div>
      </section>
    </main>
  );
}
