import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { corePages } from "@/content/routes";
import { topics } from "@/content/topics";

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

const categoryBySegment = new Map(categories.map((category) => [category.pathSegment, category.title.replace(" Word Searches", "")]));
const seasonalTerms = ["christmas", "halloween", "thanksgiving", "easter", "valentines", "summer", "spring", "fall", "winter", "back to school"];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function seasonFor(value: string) {
  const normalized = normalize(value);
  return seasonalTerms.find((term) => normalized.includes(term));
}

function audienceFor(value: string) {
  const normalized = normalize(value);
  if (normalized.includes("kid") || normalized.includes("cvc") || normalized.includes("sight word")) return "Kids";
  if (normalized.includes("teacher") || normalized.includes("classroom") || normalized.includes("worksheet")) return "Teachers";
  if (normalized.includes("adult") || normalized.includes("large print")) return "Adults";
  return undefined;
}

const topicItems: SearchCatalogItem[] = topics.map((topic) => ({
  id: `topic:${topic.slug}`,
  href: `/word-searches/${topic.slug}`,
  title: topic.title,
  description: topic.description,
  type: "Puzzle",
  category: categoryBySegment.get(topic.categorySegment) ?? topic.categorySegment,
  format: "Printable and online",
  audience: audienceFor(`${topic.title} ${topic.bestFor}`),
  season: seasonFor(topic.title),
  terms: [...topic.words, topic.bestFor, ...topic.notes, topic.categorySegment]
}));

const categoryItems: SearchCatalogItem[] = categories.map((category) => ({
  id: `category:${category.slug}`,
  href: `/categories/${category.slug}`,
  title: category.title,
  description: category.description,
  type: "Category",
  category: category.accent,
  terms: [category.pathSegment, category.accent, ...category.notes, ...category.related]
}));

const collectionItems: SearchCatalogItem[] = collections.map((collection) => ({
  id: `collection:${collection.slug}`,
  href: `/collections/${collection.slug}`,
  title: collection.title,
  description: collection.description,
  type: "Collection",
  audience: audienceFor(`${collection.title} ${collection.angle}`),
  season: seasonFor(collection.title),
  format: collection.description.toLowerCase().includes("online") ? "Printable and online" : "Printable",
  terms: [...collection.words, collection.angle, ...collection.relatedTopics]
}));

const guideItems: SearchCatalogItem[] = guides.map((guide) => ({
  id: `guide:${guide.slug}`,
  href: `/guides/${guide.slug}`,
  title: guide.title,
  description: guide.description,
  type: "Guide",
  audience: audienceFor(guide.title),
  terms: [...guide.words, ...guide.sections.flatMap((section) => [section.heading, section.body])]
}));

const toolItems: SearchCatalogItem[] = corePages.map((page) => ({
  id: `tool:${page.slug}`,
  href: `/${page.slug}`,
  title: page.h1,
  description: page.description,
  type: "Tool",
  difficulty: page.difficulty,
  audience: audienceFor(`${page.h1} ${page.description}`),
  format: page.slug.includes("pdf") ? "PDF" : page.slug.includes("online") ? "Online" : page.slug.includes("print") || page.slug.includes("worksheet") ? "Printable" : undefined,
  terms: [...page.presetWords, page.intro, ...page.modules]
}));

export const searchCatalog: SearchCatalogItem[] = [
  ...topicItems,
  ...categoryItems,
  ...collectionItems,
  ...guideItems,
  ...toolItems
];

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

export function findSearchResults(query: string, limit = 24) {
  return searchCatalog
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((entry) => entry.item);
}
