import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { getRouteRecord } from "@/content/registry";
import { corePages } from "@/content/routes";
import { topics } from "@/content/topics";
import { rankSearchCatalog, type SearchCatalogItem } from "@/lib/search/search";

export type { SearchCatalogItem, SearchResultType } from "@/lib/search/search";

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

const topicItems: SearchCatalogItem[] = topics.filter((topic) => topic.publicationStatus === "published").map((topic) => ({
  id: `topic:${topic.slug}`,
  href: `/word-searches/${topic.slug}`,
  title: topic.title,
  description: topic.description,
  type: "Puzzle",
  category: categoryBySegment.get(topic.categorySegment) ?? topic.categorySegment,
  difficulty: topic.difficulty,
  format: "Printable, online, PDF, answer key, large print, share, QR",
  audience: topic.audience?.join(", ") ?? audienceFor(`${topic.title} ${topic.bestFor}`),
  season: seasonFor(topic.title),
  terms: [...topic.words, topic.bestFor, ...topic.notes, topic.categorySegment]
}));

const categoryItems: SearchCatalogItem[] = categories.filter((category) => category.publicationStatus === "published").map((category) => ({
  id: `category:${category.slug}`,
  href: `/categories/${category.slug}`,
  title: category.title,
  description: category.description,
  type: "Category",
  category: category.accent,
  terms: [category.pathSegment, category.accent, ...category.notes, ...category.related]
}));

const collectionItems: SearchCatalogItem[] = collections.filter((collection) => collection.publicationStatus === "published").map((collection) => ({
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

const guideItems: SearchCatalogItem[] = guides.filter((guide) => guide.publicationStatus === "published").map((guide) => ({
  id: `guide:${guide.slug}`,
  href: `/guides/${guide.slug}`,
  title: guide.title,
  description: guide.description,
  type: "Guide",
  audience: audienceFor(guide.title),
  terms: [...guide.words, ...guide.sections.flatMap((section) => [section.heading, section.body])]
}));

const toolItems: SearchCatalogItem[] = corePages.filter((page) => getRouteRecord(`/${page.slug}`)?.indexable).map((page) => ({
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

export function findSearchResults(query: string, limit = 24) {
  return rankSearchCatalog(searchCatalog, query, limit);
}
