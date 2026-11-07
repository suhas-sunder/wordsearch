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
          <p>Search puzzles, categories, collections, guides and tools.</p>
        </div>
        <SearchPageClient />
      </section>
    </main>
  );
}
