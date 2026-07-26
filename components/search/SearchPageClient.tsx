"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PuzzleSearch } from "@/components/search/PuzzleSearch";
import { searchStaticCatalog } from "@/lib/search/browser-catalog";
import type { SearchCatalogItem } from "@/lib/search/search";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().slice(0, 160);
  const [results, setResults] = useState<SearchCatalogItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("idle");
      return;
    }
    let active = true;
    setStatus("loading");
    searchStaticCatalog(query, 40)
      .then((nextResults) => {
        if (!active) return;
        setResults(nextResults);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setResults([]);
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <>
      <PuzzleSearch key={query} initialQuery={query} compact />

      {query ? (
        status === "loading" ? (
          <section className="search-no-results" aria-live="polite">
            <h2>Searching reviewed puzzles…</h2>
          </section>
        ) : status === "error" ? (
          <section className="search-no-results" role="alert">
            <h2>Search could not be loaded</h2>
            <p>The static catalog is still available through the topic and category directories.</p>
            <div className="hero-actions"><Link className="primary-button" href="/topics">Browse topics</Link><Link className="secondary-button" href="/categories">Browse categories</Link></div>
          </section>
        ) : results.length ? (
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
    </>
  );
}
