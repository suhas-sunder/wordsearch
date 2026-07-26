import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/layout/AdSlot";
import { DiscoveryCards } from "@/components/page/DiscoveryCards";
import {
  adultPicks,
  answerKeyCollections,
  categoryPicks,
  easyPicks,
  eslPicks,
  hardPicks,
  homeschoolPicks,
  kidsPicks,
  largePrintPicks,
  onlinePicks,
  pdfGuides,
  printablePicks,
  seniorPicks,
  teacherCollections,
  worksheetCategories,
  type DiscoveryLink
} from "@/content/discovery";
import type { SitePage } from "@/content/routes";
import { topics } from "@/content/topics";

const reviewedPuzzleCount = topics.filter((topic) => topic.publicationStatus === "published").length;

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
    primary: { href: onlinePicks[0].href, label: "Play the featured puzzle" },
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
    secondary: { href: "/guides/how-to-print-a-word-search", label: "Read the printing guide" },
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
    primary: { href: teacherCollections[0].href, label: "Browse classroom puzzles" },
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
  },
  "easy-word-searches": {
    eyebrow: "Easy-mode topic hub",
    primary: { href: easyPicks[0].href, label: "Choose an easy puzzle" },
    secondary: { href: "/collections/easy-printable-word-searches", label: "Open the printable collection" },
    points: ["12 by 12 reviewed grids", "Forward-only directions", "Online and print options"],
    firstHeading: "Reviewed easy word searches",
    firstDescription: "Browse easy topics across animals, food, math, classroom values, reading, and more.",
    firstItems: easyPicks,
    secondHeading: "Explore easy-friendly categories",
    secondDescription: "This hub explains the Easy preset; the collection is the print-first inventory.",
    secondItems: [categoryPicks[0], categoryPicks[1], categoryPicks[6], categoryPicks[13]],
    editorialHeading: "What Easy means here",
    editorial: [
      "Reviewed Easy puzzles use a 12 by 12 grid, twelve terms, and forward horizontal, vertical, or diagonal paths. The label describes grid settings, not a fixed age or ability range.",
      "Use the printable collection when paper output is the main goal, or choose a topic here for online play, PDF, answer, share, and print options."
    ]
  },
  "hard-word-searches": {
    eyebrow: "Hard-mode topic hub",
    primary: { href: hardPicks[0].href, label: "Choose a hard puzzle" },
    secondary: { href: "/collections/hard-printable-word-searches", label: "Open the printable collection" },
    points: ["18 by 18 reviewed grids", "Twenty-word lists", "All eight directions"],
    firstHeading: "Reviewed hard word searches",
    firstDescription: "Choose a larger, denser grid from science, geography, math, history, and other reviewed topics.",
    firstItems: hardPicks,
    secondHeading: "Categories with challenging puzzles",
    secondDescription: "Browse subjects first when the topic matters as much as the grid difficulty.",
    secondItems: [categoryPicks[3], categoryPicks[4], categoryPicks[6], categoryPicks[10]],
    editorialHeading: "How the Hard preset differs",
    editorial: [
      "Hard puzzles use an 18 by 18 grid, twenty terms, overlap, reverse paths, and diagonals. Vocabulary familiarity can still make one Hard topic feel different from another.",
      "This hub explains and browses the difficulty. The Hard Printable collection is the print-first route to the same reviewed pages."
    ]
  },
  "word-search-with-answer-key": {
    eyebrow: "Answer-key workflow",
    primary: { href: answerKeyCollections[0].href, label: "Browse puzzles with answers" },
    secondary: { href: "/guides/how-to-make-a-word-search-with-answer-key", label: "Read the answer-key guide" },
    points: ["One stable puzzle seed", "Separate solution view", "Matching print and PDF"],
    firstHeading: "Answer-key puzzle collections",
    firstDescription: "Browse reviewed inventories whose puzzle and solution come from one stored set of placements.",
    firstItems: answerKeyCollections,
    secondHeading: "Choose a subject",
    secondDescription: "Every reviewed topic in these categories includes the same answer-key workflow.",
    secondItems: [categoryPicks[3], categoryPicks[5], categoryPicks[10], categoryPicks[13]],
    editorialHeading: "Why the answer key stays matched",
    editorial: [
      "The answer view reads coordinates from the generated puzzle instead of placing the words again. Online, print, PDF, and solution output therefore remain aligned.",
      "This page explains the workflow. The Printable Word Searches with Answer Keys collection is the browse-first inventory."
    ]
  },
  "word-searches-for-seniors": {
    eyebrow: "Adult large-print browsing",
    primary: { href: seniorPicks[0].href, label: "Choose an adult-friendly topic" },
    secondary: { href: "/guides/large-print-word-searches", label: "Read the large-print guide" },
    points: ["Adult-oriented topics", "Optional larger cells", "No health claims"],
    firstHeading: "Word searches for seniors",
    firstDescription: "Browse calm general-interest topics with online, print, PDF, answer-key, and large-print options.",
    firstItems: seniorPicks,
    secondHeading: "More general-interest categories",
    secondDescription: "Choose by interest first, then select the print size and difficulty that fit the situation.",
    secondItems: [categoryPicks[2], categoryPicks[10], categoryPicks[12], categoryPicks[13]],
    editorialHeading: "Audience page versus large-print page",
    editorial: [
      "This hub emphasizes adult themes and straightforward browsing. The Large Print hub focuses on layout, cell size, contrast, paper, and custom settings.",
      "Neither page makes medical, therapeutic, vision, memory, or cognitive claims. Preview the actual grid and bank before printing."
    ]
  },
  "homeschool-word-searches": {
    eyebrow: "Flexible home-learning resources",
    primary: { href: homeschoolPicks[0].href, label: "Choose a subject puzzle" },
    secondary: { href: "/guides/homeschool-word-search-ideas", label: "Read the homeschool guide" },
    points: ["Subject-based topics", "Print or play online", "Custom list generator"],
    firstHeading: "Homeschool word-search topics",
    firstDescription: "Browse reviewed science, geography, language arts, math, history, and art vocabulary.",
    firstItems: homeschoolPicks,
    secondHeading: "Worksheet collections by subject",
    secondDescription: "Use a prepared collection when its vocabulary matches the current topic.",
    secondItems: teacherCollections,
    editorialHeading: "Use a prepared topic or your own list",
    editorial: [
      "A reviewed page is quickest when its word list matches current material. The generator is available for a family-selected list.",
      "These resources do not prescribe a method or curriculum. The guide describes bounded, optional uses and checks before printing."
    ]
  },
  "esl-word-searches": {
    eyebrow: "English-vocabulary activity hub",
    primary: { href: eslPicks[0].href, label: "Choose a vocabulary topic" },
    secondary: { href: "/guides/esl-word-search-activities", label: "Read the ESL activity guide" },
    points: ["Concrete topic lists", "Easy direction option", "Definitions handled separately"],
    firstHeading: "ESL word-search topics",
    firstDescription: "Start with familiar food, travel, school, nature, reading, or activity vocabulary.",
    firstItems: eslPicks,
    secondHeading: "Browse related categories",
    secondDescription: "Review the complete list and cultural context before choosing a particular activity.",
    secondItems: [categoryPicks[1], categoryPicks[2], categoryPicks[9], categoryPicks[11]],
    editorialHeading: "Keep the puzzle's role specific",
    editorial: [
      "A word search provides one encounter with written forms. Definitions, images, pronunciation, sentence use, conversation, and feedback remain separate activities.",
      "The guide covers shorter lists, spelling checks, cultural clarity, and answer keys without promising language outcomes."
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
          <span className="eyebrow">{config.eyebrow} · {reviewedPuzzleCount} reviewed puzzles</span>
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

      <AdSlot placement="utility-banner" template="major-hub" />

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
