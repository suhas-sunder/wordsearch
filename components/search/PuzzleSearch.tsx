"use client";

import { FormEvent, KeyboardEvent, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { findSearchResults, type SearchCatalogItem } from "@/lib/search/catalog";

interface PuzzleSearchProps {
  initialQuery?: string;
  label?: string;
  compact?: boolean;
}

function resultMeta(item: SearchCatalogItem) {
  return [item.type, item.category, item.difficulty, item.audience].filter(Boolean).slice(0, 3).join(" · ");
}

export function PuzzleSearch({ initialQuery = "", label = "Search puzzles and categories", compact = false }: PuzzleSearchProps) {
  const router = useRouter();
  const listboxId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = useMemo(() => query.trim().length >= 2 ? findSearchResults(query, compact ? 6 : 8) : [], [compact, query]);
  const showPanel = open && query.trim().length >= 2;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!suggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter" && showPanel) {
      event.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) {
        setOpen(false);
        router.push(selected.href);
      }
    }
  }

  return (
    <div
      className={`puzzle-search ${compact ? "compact" : ""}`}
      ref={wrapper}
      onBlur={(event) => {
        if (!wrapper.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <form role="search" onSubmit={submit}>
        <label htmlFor={`${listboxId}-input`}>{label}</label>
        <div className="search-control">
          <Search size={20} aria-hidden="true" />
          <input
            id={`${listboxId}-input`}
            type="search"
            value={query}
            placeholder="Try animals, planets, summer, or spelling"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-activedescendant={showPanel && suggestions[activeIndex] ? `${listboxId}-${activeIndex}` : undefined}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" className="primary-button">Search</button>
        </div>
      </form>
      {showPanel && (
        <div className="search-suggestions" id={listboxId} role="listbox" aria-label="Puzzle search suggestions">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <Link
                id={`${listboxId}-${index}`}
                key={item.id}
                href={item.href}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setOpen(false)}
              >
                <span><strong>{item.title}</strong><small>{resultMeta(item)}</small></span>
                <span aria-hidden="true">→</span>
              </Link>
            ))
          ) : (
            <div className="search-empty">
              <strong>No matching puzzle or category found.</strong>
              <span>Try a broader topic, or <Link href="/word-search-generator">make a custom word search</Link>.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
