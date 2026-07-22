import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { topics } from "@/content/topics";

export interface DiscoveryLink {
  href: string;
  title: string;
  description: string;
  meta?: string;
}

function topicLink(slug: string): DiscoveryLink {
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) throw new Error(`Unknown discovery topic: ${slug}`);
  return {
    href: `/word-searches/${topic.slug}`,
    title: topic.title,
    description: topic.description,
    meta: "Printable · Online"
  };
}

function categoryLink(slug: string): DiscoveryLink {
  const category = categories.find((item) => item.slug === slug);
  if (!category) throw new Error(`Unknown discovery category: ${slug}`);
  return {
    href: `/categories/${category.slug}`,
    title: category.title,
    description: category.description,
    meta: "Category"
  };
}

function collectionLink(slug: string): DiscoveryLink {
  const collection = collections.find((item) => item.slug === slug);
  if (!collection) throw new Error(`Unknown discovery collection: ${slug}`);
  return {
    href: `/collections/${collection.slug}`,
    title: collection.title,
    description: collection.description,
    meta: "Collection"
  };
}

function guideLink(slug: string): DiscoveryLink {
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown discovery guide: ${slug}`);
  return {
    href: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.description,
    meta: "Guide"
  };
}

export const featuredPuzzles = [
  "animals/dogs-word-search",
  "science/solar-system-word-search",
  "geography/countries-word-search",
  "food-and-drink/fruits-word-search",
  "sports/soccer-word-search",
  "books-and-reading/books-and-reading-word-search"
].map(topicLink);

export const printablePicks = [
  "animals/pets-word-search",
  "science/weather-word-search",
  "math/multiplication-word-search",
  "language-arts/sight-words-word-search"
].map(topicLink);

export const onlinePicks = [
  "animals/ocean-animals-word-search",
  "science/planets-word-search",
  "sports/basketball-word-search",
  "travel/road-trip-word-search"
].map(topicLink);

export const seasonalPicks = [
  "holidays/summer-word-search",
  "holidays/back-to-school-word-search",
  "holidays/halloween-word-search",
  "holidays/christmas-word-search"
].map(topicLink);

export const categoryPicks = [
  "animals-word-searches",
  "holiday-word-searches",
  "science-word-searches",
  "math-word-searches",
  "language-arts-word-searches",
  "geography-word-searches",
  "history-word-searches",
  "nature-and-weather-word-searches"
].map(categoryLink);

export const kidsPicks = [
  "animals/baby-animals-word-search",
  "math/shapes-word-search",
  "language-arts/cvc-words-word-search",
  "holidays/summer-word-search"
].map(topicLink);

export const adultPicks = [
  "books-and-reading/books-and-reading-word-search",
  "art/photography-word-search",
  "nature-and-weather/gardening-word-search",
  "geography/landmarks-word-search"
].map(topicLink);

export const largePrintPicks = [
  "nature-and-weather/gardening-word-search",
  "travel/beach-word-search",
  "music/music-terms-word-search",
  "books-and-reading/books-and-reading-word-search"
].map(topicLink);

export const teacherCollections = [
  "science-word-search-worksheets",
  "substitute-teacher-word-searches",
  "classroom-word-searches"
].map(collectionLink);

export const worksheetCategories = [
  "science-word-searches",
  "math-word-searches",
  "language-arts-word-searches",
  "history-word-searches"
].map(categoryLink);

export const pdfGuides = [
  "how-to-print-word-searches",
  "how-to-make-large-print-word-searches",
  "how-to-make-a-word-search"
].map(guideLink);
