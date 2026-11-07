"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PuzzleSearch } from "@/components/search/PuzzleSearch";
import { CategoryIcon } from "@/components/page/CategoryIcon";
import { searchStaticCatalog } from "@/lib/search/browser-catalog";
import type { SearchCatalogItem } from "@/lib/search/search";
import { boundSearchQuery } from "@/lib/search/query";

function BrowseCards() {
  return <div className="search-result-list">
    {[
      ["/topics", "Topics", "Browse every published puzzle alphabetically."],
      ["/categories", "Categories", "Choose a subject and find related puzzles."],
      ["/guides", "Guides", "Get help with printing, creating and using puzzles."]
    ].map(([href, title, description]) => <Link key={href} href={href}><span className="result-type">Browse</span><span><strong>{title}</strong><span>{description}</span></span><span aria-hidden="true">→</span></Link>)}
  </div>;
}

function LoadingResults() {
  return <section className="search-results" aria-busy="true" aria-live="polite">
    <h2>Searching reviewed puzzles…</h2>
    <div className="search-result-list" aria-hidden="true">
      {[0, 1, 2].map((index) => <div key={index} className="search-result-skeleton"><span /><span /></div>)}
    </div>
  </section>;
}

function StartResults() {
  return <section className="search-no-results">
    <h2>Start with a topic or use</h2>
    <p>Try animals, planets, multiplication, summer, kids, teachers, PDF, or large print.</p>
    <BrowseCards />
  </section>;
}

function SearchResults({ onQueryChange }: { onQueryChange: (query: string) => void }) {
  const searchParams = useSearchParams();
  const query = boundSearchQuery((searchParams.get("q") ?? "").trim());
  const [results, setResults] = useState<SearchCatalogItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("loading");
  const [resultQuery, setResultQuery] = useState("");

  useEffect(() => { onQueryChange(query); }, [query, onQueryChange]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("idle");
      setResultQuery("");
      return;
    }
    let active = true;
    setStatus("loading");
    searchStaticCatalog(query, 40)
      .then((nextResults) => {
        if (!active) return;
        setResults(nextResults);
        setResultQuery(query);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setResults([]);
        setResultQuery(query);
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <>
      {query ? (
        status === "loading" || resultQuery !== query ? <LoadingResults /> : status === "error" ? (
          <section className="search-no-results" role="alert">
            <h2>Search could not be loaded</h2>
            <p>The static catalog is still available through the topic and category directories.</p>
            <div className="hero-actions"><Link className="primary-button" href="/topics">Browse topics</Link><Link className="secondary-button" href="/categories">Browse categories</Link></div>
            <BrowseCards />
          </section>
        ) : results.length ? (
          <section className="search-results" aria-labelledby="search-results-heading">
            <h2 id="search-results-heading">Results for “{query}”</h2>
            <div className="search-result-list">
              {results.map((item) => (
                <Link key={item.id} href={item.href}>
                  <span className="result-type">{item.type}</span>
                  <span><strong className={item.category ? "category-title" : undefined}>{item.category && <CategoryIcon slug={item.type === "Category" ? item.href.split("/").filter(Boolean).at(-1) : undefined} label={item.category} />}{item.title}</strong><small>{[item.category, item.difficulty, item.format, item.audience].filter(Boolean).join(" · ")}</small><span>{item.description}</span></span>
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
            <BrowseCards />
          </section>
        )
      ) : (
        <StartResults />
      )}
    </>
  );
}

export function SearchPageClient() {
  const [query, setQuery] = useState("");
  return <>
    <PuzzleSearch key={query} initialQuery={query} compact />
    <Suspense fallback={<StartResults />}><SearchResults onQueryChange={setQuery} /></Suspense>
  </>;
}
