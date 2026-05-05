import Link from "next/link";
import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { specialtyRoutes } from "@/content/specialty";
import { topics } from "@/content/topics";
import { AdSlot } from "@/components/layout/AdSlot";

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
        <p>Canonical hubs group real topic demand without multiplying thin filter pages.</p>
      </div>
      <div className="link-grid">
        {categories.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`}>
            <strong>{category.title}</strong>
            <span>{category.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TopicStrip({ categorySegment }: { categorySegment?: string }) {
  const source = categorySegment ? topics.filter((topic) => topic.categorySegment === categorySegment) : topics.slice(0, 18);
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>Featured Topics</h2>
        <p>Each topic has one canonical page with print, PDF, answer key, large-print, and play modes in-page.</p>
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
        <p>Collections exist only when the user intent is meaningfully distinct.</p>
      </div>
      <div className="link-grid compact">
        {collections.map((collection) => (
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
        <h2>Specialty Generators</h2>
        <p>Token-based alphabet packs let the generator work beyond single A-Z cells.</p>
      </div>
      <div className="link-grid compact">
        {specialtyRoutes.map((route) => (
          <Link key={route.slug} href={`/specialty/${route.slug}`}>
            <strong>{route.title}</strong>
            <span>{route.description}</span>
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
        {guides.map((guide) => (
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
  const faq = items?.length ? items : [
    { question: "Are the puzzles free to print?", answer: "Yes. The core builder is designed for no-signup personal, classroom, homeschool, and casual puzzle use." },
    { question: "Can I get an answer key?", answer: "Yes. The answer key uses the exact same seed and placements as the puzzle preview." },
    { question: "Can the same puzzle be shared?", answer: "Yes. Share links encode the settings, words, seed, and alphabet pack needed to reproduce the puzzle." }
  ];
  return (
    <section className="content-section site-shell">
      <div className="section-heading">
        <h2>FAQ</h2>
      </div>
      <div className="faq-list">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function EditorialModules({ modules, faq }: { modules: string[]; faq?: Array<{ question: string; answer: string }> }) {
  return (
    <>
      {modules.includes("categories") && <CategoryGrid />}
      {modules.includes("topics") && <TopicStrip />}
      {modules.includes("collections") && <CollectionGrid />}
      {modules.includes("specialty") && <SpecialtyGrid />}
      {modules.includes("guides") && <GuideGrid />}
      <HowItWorks />
      <AdSlot />
      {modules.includes("faq") && <FaqBlock items={faq} />}
    </>
  );
}
