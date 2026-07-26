import { rankSearchCatalog, type SearchCatalogItem } from "@/lib/search/search";

let catalogPromise: Promise<SearchCatalogItem[]> | undefined;

function isSearchCatalogItem(value: unknown): value is SearchCatalogItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SearchCatalogItem>;
  return typeof item.id === "string"
    && typeof item.href === "string"
    && item.href.startsWith("/")
    && typeof item.title === "string"
    && typeof item.description === "string"
    && typeof item.type === "string"
    && Array.isArray(item.terms)
    && item.terms.every((term) => typeof term === "string");
}

export function loadStaticSearchCatalog() {
  catalogPromise ??= fetch("/search-index.json", {
    headers: { Accept: "application/json" },
    cache: "force-cache"
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Static search index returned ${response.status}.`);
    const value = await response.json() as unknown;
    if (!Array.isArray(value) || !value.every(isSearchCatalogItem)) {
      throw new Error("Static search index is invalid.");
    }
    return value;
  }).catch((error) => {
    catalogPromise = undefined;
    throw error;
  });
  return catalogPromise;
}

export async function searchStaticCatalog(query: string, limit = 24) {
  return rankSearchCatalog(await loadStaticSearchCatalog(), query, limit);
}
