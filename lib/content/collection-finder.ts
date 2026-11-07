import type { Difficulty } from "@/lib/puzzle/types";

export interface CollectionFinderItem {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
}

export const collectionFinderSlugs = ["hard-printable-word-searches", "word-searches-with-answer-keys"] as const;
export type CollectionOrder = "editorial" | "title";
const searchable = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en");
const titles = new Intl.Collator("en", { sensitivity: "base", numeric: true });

export function findCollectionItems(items: readonly CollectionFinderItem[], query: string, difficulty: Difficulty | "all", order: CollectionOrder) {
  const terms = searchable(query).trim().split(/\s+/).filter(Boolean);
  const results = items.map((item, editorialIndex) => ({ item, editorialIndex })).filter(({ item }) => {
    const text = searchable(`${item.title} ${item.subject}`);
    return (difficulty === "all" || item.difficulty === difficulty) && terms.every((term) => text.includes(term));
  });
  if (order === "title") results.sort((left, right) => titles.compare(left.item.title, right.item.title) || left.editorialIndex - right.editorialIndex);
  return results.map(({ item }) => item);
}
