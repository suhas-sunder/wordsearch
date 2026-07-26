export type SearchResultType = "Puzzle" | "Category" | "Collection" | "Guide" | "Tool";

export interface SearchCatalogItem {
  id: string;
  href: string;
  title: string;
  description: string;
  type: SearchResultType;
  category?: string;
  difficulty?: string;
  format?: string;
  audience?: string;
  season?: string;
  terms: string[];
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreItem(item: SearchCatalogItem, query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  const title = normalize(item.title);
  const category = normalize(item.category ?? "");
  const haystack = normalize([
    item.title,
    item.description,
    item.category,
    item.difficulty,
    item.format,
    item.audience,
    item.season,
    ...item.terms
  ].filter(Boolean).join(" "));

  if (!tokens.every((token) => haystack.includes(token))) return 0;
  let score = tokens.length * 5;
  if (title === normalizedQuery) score += 100;
  else if (title.startsWith(normalizedQuery)) score += 55;
  else if (title.includes(normalizedQuery)) score += 35;
  score += tokens.filter((token) => title.includes(token)).length * 12;
  score += tokens.filter((token) => category.includes(token)).length * 6;
  if (item.type === "Puzzle") score += 2;
  return score;
}

export function rankSearchCatalog(catalog: SearchCatalogItem[], query: string, limit = 24) {
  return catalog
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((entry) => entry.item);
}
