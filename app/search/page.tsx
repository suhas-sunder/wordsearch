import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PuzzleSearch } from "@/components/search/PuzzleSearch";
import { findSearchResults } from "@/lib/search/catalog";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata(
  "Search Word Search Puzzles",
  "Search curated word search puzzles, categories, collections, guides, and tools.",
  "/search"
);

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string | string[] }> }) {
  const queryData = searchParams ? await searchParams : {};
  const query = Array.isArray(queryData.q) ? queryData.q[0] ?? "" : queryData.q ?? "";
  const results = findSearchResults(query, 40);

  return (
    <main>
      <Breadcrumbs items={[{ label: "Search" }]} />
      <section className="search-page site-shell">
        <div className="section-heading">
          <span className="eyebrow">Curated catalog</span>
          <h1>Search Word Searches</h1>
          <p>Search existing puzzles, categories, collections, guides, and primary tools. Arbitrary queries do not create public puzzle pages.</p>
        </div>
        <PuzzleSearch initialQuery={query} compact />

        {query.trim() ? (
          results.length ? (
            <section className="search-results" aria-labelledby="search-results-heading">
              <h2 id="search-results-heading">Results for “{query}”</h2>
              <div className="search-result-list">
                {results.map((item) => (
                  <Link key={item.id} href={item.href}>
                    <span className="result-type">{item.type}</span>
                    <span><strong>{item.title}</strong><small>{[item.category, item.difficulty, item.format, item.audience].filter(Boolean).join(" · ")}</small><span>{item.description}</span></span>
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <section className="search-no-results" aria-live="polite">
              <h2>No results for “{query}”</h2>
              <p>Try a broader topic such as animals, science, holidays, spelling, or travel. If your idea is specific, make it from your own word list.</p>
              <div className="hero-actions"><Link className="primary-button" href="/word-search-generator">Create a custom puzzle</Link><Link className="secondary-button" href="/categories">Browse categories</Link></div>
            </section>
          )
        ) : (
          <section className="search-no-results">
            <h2>Start with a topic or use</h2>
            <p>Try animals, planets, multiplication, summer, kids, teachers, PDF, or large print.</p>
          </section>
        )}
      </section>
    </main>
  );
}
