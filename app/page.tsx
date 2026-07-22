import Link from "next/link";
import { AdSlot } from "@/components/layout/AdSlot";
import { DiscoveryCards } from "@/components/page/DiscoveryCards";
import { PuzzleSearch } from "@/components/search/PuzzleSearch";
import {
  categoryPicks,
  featuredPuzzles,
  printablePicks,
  seasonalPicks
} from "@/content/discovery";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Free Printable and Online Word Search Puzzles",
  "Find curated word search puzzles to print, play online, download as PDFs, or customize with the free word search generator.",
  "/"
);

const audiences = [
  { href: "/word-searches-for-kids", title: "Kids", description: "Easy themes, simple directions, and printable answer keys." },
  { href: "/word-searches-for-teachers", title: "Teachers", description: "Subject collections, classroom worksheets, and custom vocabulary tools." },
  { href: "/word-searches-for-adults", title: "Adults", description: "Adult-friendly themes with online, print, and harder options." },
  { href: "/large-print-word-searches", title: "Large Print", description: "Readable grids, larger cells, and calm adult themes." }
];

const allTools = [
  ["/word-search-generator", "Word Search Generator", "Make a custom seeded puzzle from your own word list."],
  ["/free-printable-word-searches", "Printable Word Searches", "Browse real topics and prepare clean student copies."],
  ["/online-word-search", "Online Word Search", "Choose a curated puzzle and play it in your browser."],
  ["/word-search-pdf", "Word Search PDFs", "Prepare puzzle and solution pages for PDF export."],
  ["/large-print-word-searches", "Large Print Word Searches", "Find themes and settings designed for more readable output."],
  ["/word-search-worksheets", "Word Search Worksheets", "Browse subject-based printables and teacher-ready collections."]
] as const;

const faq = [
  ["Are the word search puzzles free?", "Yes. The existing puzzles and core generator can be used without a signup for personal, classroom, homeschool, and casual puzzle use."],
  ["Can I print the puzzles?", "Yes. Curated topics and custom puzzles include a clean print view with the puzzle and word list kept together."],
  ["Are answer keys included?", "Yes. Answer-key views use the same seed and placements as the corresponding puzzle."],
  ["Can I make my own word search?", "Yes. The word search generator accepts your own list and keeps preview, print, PDF, play, share, and answer-key output aligned."],
  ["Can the puzzles be played online?", "Yes. Use the online collection or open the Play control on a curated or custom puzzle."]
] as const;

export default function HomePage() {
  return (
    <main>
      <AdSlot placement="top-banner" />

      <section className="home-hero site-shell">
        <div className="home-hero-copy">
          <span className="eyebrow">Find your next puzzle</span>
          <h1>Free printable and online word search puzzles</h1>
          <p className="value-prop">Search real curated topics, browse by category, play online, print a worksheet, or create a custom puzzle from your own words.</p>
          <PuzzleSearch />
          <div className="hero-actions">
            <Link className="primary-button" href="/free-printable-word-searches">Browse printable puzzles</Link>
            <Link className="secondary-button" href="/online-word-search">Play online</Link>
            <Link className="text-link" href="/word-search-generator">Create a custom word search <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="hero-choice-panel" aria-label="Puzzle options">
          <span className="card-meta">QUICK START</span>
          <strong>What would you like to do?</strong>
          <Link href="/free-printable-word-searches"><span>Print a ready-made puzzle</span><span aria-hidden="true">→</span></Link>
          <Link href="/online-word-search"><span>Play a puzzle online</span><span aria-hidden="true">→</span></Link>
          <Link href="/categories"><span>Browse puzzle categories</span><span aria-hidden="true">→</span></Link>
          <Link href="/word-search-pdf"><span>Save a puzzle as PDF</span><span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="content-section site-shell">
        <div className="section-heading heading-row">
          <div><span className="eyebrow">Curated picks</span><h2>Featured Word Searches</h2></div>
          <Link className="section-link" href="/categories">Browse all categories <span aria-hidden="true">→</span></Link>
        </div>
        <DiscoveryCards items={featuredPuzzles} />
      </section>

      <section className="content-section site-shell soft-section">
        <div className="section-heading heading-row">
          <div><span className="eyebrow">Paper-ready</span><h2>Free Printable Word Searches</h2></div>
          <Link className="section-link" href="/free-printable-word-searches">View printable collection <span aria-hidden="true">→</span></Link>
        </div>
        <p className="section-intro">Choose an existing topic for a clean puzzle, word bank, and matching answer-key workflow.</p>
        <DiscoveryCards items={printablePicks} />
      </section>

      <section className="content-section site-shell split-feature">
        <div>
          <span className="eyebrow">Play in your browser</span>
          <h2>Online Word Search</h2>
          <p>Start with a curated puzzle on phone, tablet, or desktop. Online play and printable output use the same seeded grid.</p>
          <Link className="primary-button" href="/online-word-search">Choose an online puzzle</Link>
        </div>
        <div className="mini-sheet home-mini-sheet" aria-hidden="true">
          <span>WORD SEARCH</span>
          <div className="mini-grid">
            {Array.from({ length: 49 }, (_, index) => <i key={index}>{["P", "L", "A", "Y", "W", "O", "R"][index % 7]}</i>)}
          </div>
        </div>
      </section>

      <section className="content-section site-shell">
        <div className="section-heading heading-row">
          <div><span className="eyebrow">Explore themes</span><h2>Browse by Category</h2></div>
          <Link className="section-link" href="/categories">All categories <span aria-hidden="true">→</span></Link>
        </div>
        <DiscoveryCards items={categoryPicks} />
      </section>

      <section className="content-section site-shell audience-section">
        <div className="section-heading"><span className="eyebrow">Find the right format</span><h2>Puzzles for every setting</h2></div>
        <div className="audience-grid">
          {audiences.map((item) => (
            <Link key={item.href} href={item.href}>
              <strong>{item.title}</strong><span>{item.description}</span><small>Explore <span aria-hidden="true">→</span></small>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section site-shell soft-section">
        <div className="section-heading"><span className="eyebrow">Throughout the year</span><h2>Seasonal Word Searches</h2><p>Browse existing seasonal puzzles for summer, back to school, Halloween, and Christmas.</p></div>
        <DiscoveryCards items={seasonalPicks} />
      </section>

      <section className="content-section site-shell generator-promo">
        <div>
          <span className="eyebrow">Your words, one reproducible puzzle</span>
          <h2>Create your own word search</h2>
          <p>Paste a spelling list, classroom vocabulary, party theme, or personal topic. The generator keeps preview, print, PDF, answer key, share, QR, and play output on the same seed.</p>
        </div>
        <Link className="primary-button" href="/word-search-generator">Open the generator</Link>
      </section>

      <AdSlot placement="utility-banner" />

      <section className="content-section site-shell editorial-home">
        <div>
          <span className="eyebrow">Choosing a word search</span>
          <h2>Print, play, download, or customize</h2>
          <p>Printable word searches work well for classroom handouts, family tables, travel, and other offline settings. Online puzzles are the quickest way to start solving on a phone, tablet, or computer.</p>
          <p>PDF-ready pages use the same puzzle grid as the preview, and answer keys keep the exact seeded placements. That means a student copy, saved PDF, and solution page stay aligned.</p>
        </div>
        <AdSlot placement="seo-content-square" />
        <div>
          <h2>Ready-made puzzle or custom list?</h2>
          <p>Choose a curated puzzle when an existing topic already fits. Categories make it easier to narrow a broad idea such as animals, science, history, travel, or holidays without wading through unrelated pages.</p>
          <p>Use the generator for weekly spelling words, lesson vocabulary, party names, or any list that needs to be specific. For younger solvers, start with familiar words and easy directions. For more challenge, choose a richer topic or harder direction set.</p>
        </div>
      </section>

      <section className="content-section site-shell tools-section">
        <AdSlot placement="bottom-tools-banner" />
        <div className="section-heading"><span className="eyebrow">Puzzle tools</span><h2>All Tools</h2><p>Use the primary destination that matches what you want to do next.</p></div>
        <div className="tool-grid">
          {allTools.map(([href, title, description]) => (
            <Link key={href} href={href}><strong>{title}</strong><span>{description}</span><small>Open tool <span aria-hidden="true">→</span></small></Link>
          ))}
        </div>
      </section>

      <section className="content-section site-shell">
        <div className="section-heading"><span className="eyebrow">Common questions</span><h2>Word Search FAQ</h2></div>
        <div className="faq-list">
          {faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
        </div>
      </section>
    </main>
  );
}
