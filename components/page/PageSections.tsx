import Link from "next/link";
import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { specialtyRoutes } from "@/content/specialty";
import { topics } from "@/content/topics";
import { SeoSectionAd, type AdTemplate } from "@/components/layout/AdSlot";
import { CategoryIcon } from "@/components/page/CategoryIcon";
import { PuzzleSearch } from "@/components/search/PuzzleSearch";
import { generalPuzzleFaq } from "@/content/routes";

export function QuickLinks() {
  const links = [
    ["/free-printable-word-searches", "Free printable"],
    ["/online-word-search", "Online play"],
    ["/large-print-word-searches", "Large print"],
    ["/word-searches-for-kids", "Kids"],
    ["/word-searches-for-adults", "Adults"],
    ["/word-searches-for-teachers", "Teachers"],
    ["/word-search-generator", "Generator"]
  ];
  return (
    <div className="quick-links" aria-label="Quick intent links">
      {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
    </div>
  );
}

export function CategoryGrid() {
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>Browse by Category</h2>
        <p>Start with a broad subject, then choose an existing puzzle topic that fits.</p>
      </div>
      <div className="link-grid">
        {categories.filter((category) => category.publicationStatus === "published").map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <strong className="category-title"><CategoryIcon slug={category.slug} />{category.title}</strong>
            <span>{category.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TopicStrip({ categorySegment }: { categorySegment?: string }) {
  const published = topics.filter((topic) => topic.publicationStatus === "published");
  const source = categorySegment ? published.filter((topic) => topic.categorySegment === categorySegment) : published.slice(0, 18);
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>Featured Topics</h2>
        <p>Open a curated topic with printable, PDF, answer-key, large-print, and online options.</p>
      </div>
      <div className="topic-list">
        {source.slice(0, 24).map((topic) => (
          <Link key={topic.slug} href={`/word-searches/${topic.slug}`}>{topic.title}</Link>
        ))}
      </div>
    </section>
  );
}

export function CollectionGrid() {
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>Curated Collections</h2>
        <p>Browse focused groups for classrooms, holidays, travel, parties, and quiet puzzle time.</p>
      </div>
      <div className="link-grid compact">
        {collections.filter((collection) => collection.publicationStatus === "published").map((collection) => (
          <Link key={collection.slug} href={`/collections/${collection.slug}`}>
            <strong>{collection.title}</strong>
            <span>{collection.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SpecialtyGrid() {
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>Experimental specialty formats</h2>
        <p>These draft formats include limited mappings and unfinished scaffolds. Read the current limitations before using them.</p>
      </div>
      <div className="link-grid compact">
        {specialtyRoutes.map((route) => (
          <Link key={route.slug} href={`/specialty/${route.slug}`} data-specialty-readiness={route.implementation}>
            <strong>{route.title}</strong>
            <span>{route.implementation === "scaffold" ? "Scaffold — format not implemented" : "Experimental — review limitations"}</span>
            <span>{route.status}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GuideGrid() {
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>Practical Guides</h2>
        <p>Short, useful guides support the generator workflow without bloating puzzle pages.</p>
      </div>
      <div className="link-grid compact">
        {guides.filter((guide) => guide.publicationStatus === "published").map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`}>
            <strong>{guide.title}</strong>
            <span>{guide.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="content-section site-shell two-col">
      <div>
        <h2>Make, Check, Print</h2>
        <p>Paste words, choose difficulty, and regenerate from a saved seed. The same placements drive the preview, printable student page, answer key, and share link.</p>
      </div>
      <ol className="steps">
        <li><strong>Enter words.</strong><span>Paste lines, comma-separated lists, or clue-mode answers.</span></li>
        <li><strong>Generate.</strong><span>Validate fit, adjust grid size, and keep the seed.</span></li>
        <li><strong>Use it.</strong><span>Print, open the PDF-ready view, share, or play online.</span></li>
      </ol>
    </section>
  );
}

export function FaqBlock({ items }: { items?: Array<{ question: string; answer: string }> }) {
  if (!items?.length) return null;
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>FAQ</h2>
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function SearchTools() {
  return <section className="content-section site-shell tools-section">
    <PuzzleSearch label="Search the puzzle catalog" />
    <div className="section-heading"><h2>All tools</h2></div>
    <div className="topic-list">
      <Link href="/word-search-generator">Word Search Generator</Link>
      <Link href="/free-printable-word-searches">Printable Word Searches</Link>
      <Link href="/online-word-search">Online Word Search</Link>
      <Link href="/word-search-pdf">Word Search PDFs</Link>
      <Link href="/pack-builder">Worksheet pack builder</Link>
    </div>
  </section>;
}

export function EditorialModules({ modules, faq, adTemplate }: { modules: string[]; faq?: Array<{ question: string; answer: string }>; adTemplate: AdTemplate }) {
  return (
    <>
      {modules.includes("categories") && <CategoryGrid />}
      {modules.includes("topics") && <TopicStrip />}
      {modules.includes("collections") && <CollectionGrid />}
      {modules.includes("specialty") && <SpecialtyGrid />}
      {modules.includes("guides") && <GuideGrid />}
      <HowItWorks />
      <SeoSectionAd template={adTemplate} />
      {(!!faq?.length || modules.includes("faq")) && <FaqBlock items={faq?.length ? faq : generalPuzzleFaq} />}
    </>
  );
}
