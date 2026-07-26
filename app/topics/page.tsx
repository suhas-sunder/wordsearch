import Link from "next/link";
import { AdSlot } from "@/components/layout/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { topics } from "@/content/topics";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

const publishedTopics = topics
  .filter((topic) => topic.publicationStatus === "published")
  .slice()
  .sort((a, b) => a.title.localeCompare(b.title, "en-US"));

export const metadata = pageMetadata(
  "Word Search Topics | 150 Curated Printable Puzzles",
  "Browse 150 reviewed word search topics alphabetically. Every puzzle includes online play, printable, PDF, and matching answer-key options.",
  "/topics"
);

export default function TopicsPage() {
  const breadcrumbs = [{ label: "Word Search Topics" }];
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Reviewed word search topics",
    numberOfItems: publishedTopics.length,
    itemListElement: publishedTopics.map((topic, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: topic.title,
      url: `https://www.ilovewordsearch.com/word-searches/${topic.slug}`
    }))
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(breadcrumbs, "/topics"), itemList]} />
      <main>
        <Breadcrumbs items={breadcrumbs} />
        <header className="hub-hero site-shell">
          <div>
            <span className="eyebrow">{publishedTopics.length} reviewed puzzles</span>
            <h1>Word Search Topics</h1>
            <p className="value-prop">Browse every published topic alphabetically. Each canonical page uses one reviewed word list and stable seed across online play, print, PDF, and its answer key.</p>
          </div>
          <aside className="intent-panel" aria-label="Topic directory details">
            <strong>Every listing includes</strong>
            <ul>
              <li>A visible difficulty and word list</li>
              <li>Printable and PDF-ready output</li>
              <li>A matching deterministic solution</li>
            </ul>
          </aside>
        </header>

        <AdSlot placement="utility-banner" template="topics" />

        <section className="content-section site-shell">
          <div className="section-heading">
            <h2>All topics from A to Z</h2>
            <p>Use the title list for a specific subject, or <Link href="/categories">browse the category hubs</Link> for related groups.</p>
          </div>
          <div className="topic-list">
            {publishedTopics.map((topic) => (
              <Link key={topic.slug} href={`/word-searches/${topic.slug}`}>
                <strong>{topic.title}</strong>
                <span>{topic.difficulty} · {topic.words.length} words</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section site-shell route-next-step">
          <div>
            <span className="eyebrow">Need a different list?</span>
            <h2>Create a custom word search</h2>
            <p>Use your own reviewed terms when none of the published topics fits. The generator preserves one seed across its play, print, PDF, answer, share, and QR outputs.</p>
          </div>
          <Link className="primary-button" href="/word-search-generator">Open the generator</Link>
        </section>
      </main>
    </>
  );
}
