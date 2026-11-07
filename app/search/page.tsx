import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata(
  "Search Word Search Puzzles",
  "Search curated word search puzzles, categories, collections, guides, and tools.",
  "/search"
);

export default function SearchPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Search" }]} />
      <section className="search-page site-shell">
        <div className="section-heading">
          <span className="eyebrow">Curated catalog</span>
          <h1>Search Word Searches</h1>
          <p>Search existing puzzles, categories, collections, guides, and primary tools. Arbitrary queries do not create public puzzle pages.</p>
        </div>
        <noscript><p className="control-help">Search results need JavaScript. Without it, your query stays in the address bar but isn&apos;t shown in the search box. Browse topics, categories or guides below.</p></noscript>
        <SearchPageClient />
      </section>
    </main>
  );
}
