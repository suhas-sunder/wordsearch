"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { findCollectionItems, type CollectionFinderItem, type CollectionOrder } from "@/lib/content/collection-finder";
import type { Difficulty } from "@/lib/puzzle/types";
import styles from "./CollectionFinder.module.css";

/** Enhances adjacent server-rendered cards; the listing is not a client component. */
export function CollectionFinder({ items, cardsId }: { items: CollectionFinderItem[]; cardsId: string }) {
  const identity = useId();
  const root = useRef<HTMLFieldSetElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const cards = useRef(new Map<string, HTMLElement>());
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [order, setOrder] = useState<CollectionOrder>("editorial");
  const availableDifficulties = ["easy", "medium", "hard"].filter((value) => items.some((item) => item.difficulty === value));
  const visible = useMemo(() => findCollectionItems(items, query, difficulty, order), [items, query, difficulty, order]);

  useEffect(() => {
    const container = document.getElementById(cardsId);
    if (!container || !root.current?.closest("section")?.contains(container)) return;
    const elements = [...container.children].filter((element): element is HTMLElement => element instanceof HTMLElement);
    cards.current = new Map(elements.map((element) => [element.dataset.collectionId ?? "", element]));
    if (!items.every(({ id }) => cards.current.has(id))) return;
    setReady(true);
    return () => {
      for (const { id } of items) {
        const element = cards.current.get(id);
        if (element) { element.hidden = false; container.appendChild(element); }
      }
      cards.current.clear();
    };
  }, [cardsId, items]);

  useEffect(() => {
    if (!ready) return;
    const container = document.getElementById(cardsId);
    if (!container) return;
    const selected = new Set(visible.map(({ id }) => id));
    for (const { id } of items) {
      const element = cards.current.get(id);
      if (element) element.hidden = !selected.has(id);
    }
    // One synchronous DOM operation batch: only these SSR cards move, never ad wrappers.
    for (const { id } of [...visible, ...items.filter(({ id }) => !selected.has(id))]) {
      const element = cards.current.get(id);
      if (element) container.appendChild(element);
    }
  }, [cardsId, items, ready, visible]);

  function reset() { setQuery(""); setDifficulty("all"); setOrder("editorial"); input.current?.focus(); }

  return <>
    <fieldset ref={root} className={styles.controls} disabled={!ready} data-collection-controls data-ready={ready}>
      <legend>Find in this collection</legend>
      <div className={styles.fields}>
        <label htmlFor={`${identity}-query`}>Title or subject
          <input ref={input} id={`${identity}-query`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-controls={cardsId} aria-describedby={`${identity}-hint`} autoComplete="off" />
        </label>
        {availableDifficulties.length > 1 && <label htmlFor={`${identity}-difficulty`}>Difficulty
          <select id={`${identity}-difficulty`} value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty | "all")} aria-controls={cardsId}>
            <option value="all">All difficulties</option>
            {availableDifficulties.map((value) => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}
          </select>
        </label>}
        <label htmlFor={`${identity}-order`}>Order
          <select id={`${identity}-order`} value={order} onChange={(event) => setOrder(event.target.value as CollectionOrder)} aria-controls={cardsId}>
            <option value="editorial">Editorial order</option><option value="title">Title A–Z</option>
          </select>
        </label>
        <button className="secondary-button" type="button" onClick={reset}>Reset filters</button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true">{visible.length} of {items.length} puzzles</p>
      <p id={`${identity}-hint`} className={styles.hint}>Find words in a puzzle title or subject. These controls stay within this collection.</p>
    </fieldset>
    <noscript><p>Finding and sorting need JavaScript. All reviewed puzzles are listed below in editorial order.</p></noscript>
    <p className={styles.empty} hidden={!ready || visible.length !== 0}>No puzzles match these filters. Try another title or subject, or reset filters.</p>
  </>;
}
