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
  const topic = topics.find((item) => item.slug === slug && item.publicationStatus === "published");
  if (!topic) throw new Error(`Unknown published discovery topic: ${slug}`);
  return {
    href: `/word-searches/${topic.slug}`,
    title: topic.title,
    description: topic.description,
    meta: `${topic.difficulty} · Printable · Online`
  };
}

function categoryLink(slug: string): DiscoveryLink {
  const category = categories.find((item) => item.slug === slug && item.publicationStatus === "published");
  if (!category) throw new Error(`Unknown published discovery category: ${slug}`);
  return {
    href: `/categories/${category.slug}`,
    title: category.title,
    description: category.description,
    meta: "Category"
  };
}

function collectionLink(slug: string): DiscoveryLink {
  const collection = collections.find((item) => item.slug === slug && item.publicationStatus === "published");
  if (!collection) throw new Error(`Unknown published discovery collection: ${slug}`);
  return {
    href: `/collections/${collection.slug}`,
    title: collection.title,
    description: collection.description,
    meta: `${collection.relatedTopics.length} puzzles`
  };
}

function guideLink(slug: string): DiscoveryLink {
  const guide = guides.find((item) => item.slug === slug && item.publicationStatus === "published");
  if (!guide) throw new Error(`Unknown published discovery guide: ${slug}`);
  return {
    href: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.description,
    meta: "Reviewed guide"
  };
}

export const featuredPuzzles = [
  "animals/dog-word-search",
  "animals/wild-cats-word-search",
  "science/biology-word-search",
  "geography/world-capitals-word-search",
  "history/ancient-egypt-word-search",
  "travel/road-trip-word-search",
  "music/musical-instruments-word-search",
  "books-and-reading/reading-word-search",
  "art/painting-word-search",
  "math/fractions-word-search",
  "sports/swimming-word-search"
].map(topicLink);

export const printablePicks = [
  "animals/farm-animals-word-search",
  "food-and-drink/fruits-word-search",
  "nature-and-weather/flowers-word-search",
  "language-arts/nouns-word-search",
  "classroom-values/school-supplies-word-search",
  "holidays/spring-word-search"
].map(topicLink);

export const onlinePicks = [
  "animals/ocean-animals-word-search",
  "science/solar-system-word-search",
  "geography/world-capitals-word-search",
  "language-arts/synonyms-word-search",
  "sports/soccer-word-search",
  "holidays/halloween-word-search"
].map(topicLink);

export const seasonalPicks = [
  "holidays/spring-word-search",
  "holidays/summer-word-search",
  "holidays/fall-word-search",
  "holidays/winter-word-search",
  "holidays/halloween-word-search",
  "holidays/christmas-word-search"
].map(topicLink);

export const categoryPicks = [
  "animals-word-searches",
  "food-and-drink-word-searches",
  "nature-and-weather-word-searches",
  "science-word-searches",
  "geography-word-searches",
  "language-arts-word-searches",
  "math-word-searches",
  "sports-word-searches",
  "classroom-and-values-word-searches",
  "holiday-word-searches",
  "history-word-searches",
  "travel-word-searches",
  "music-word-searches",
  "books-and-reading-word-searches",
  "art-word-searches"
].map(categoryLink);

export const kidsPicks = [
  "animals/dog-word-search",
  "food-and-drink/fruits-word-search",
  "nature-and-weather/flowers-word-search",
  "classroom-values/school-supplies-word-search",
  "holidays/summer-word-search"
].map(topicLink);

export const adultPicks = [
  "food-and-drink/desserts-word-search",
  "nature-and-weather/weather-word-search",
  "geography/world-capitals-word-search",
  "science/biology-word-search",
  "sports/soccer-word-search"
].map(topicLink);

export const easyPicks = [
  "animals/dog-word-search",
  "animals/baby-animals-word-search",
  "food-and-drink/pizza-word-search",
  "math/shapes-word-search",
  "classroom-values/respect-word-search",
  "books-and-reading/reading-word-search"
].map(topicLink);

export const hardPicks = [
  "science/biology-word-search",
  "science/scientific-method-word-search",
  "geography/us-states-word-search",
  "geography/asia-word-search",
  "math/algebra-word-search",
  "history/industrial-revolution-word-search"
].map(topicLink);

export const seniorPicks = [
  "nature-and-weather/garden-word-search",
  "animals/birds-word-search",
  "food-and-drink/cooking-word-search",
  "travel/train-travel-word-search",
  "music/orchestra-word-search",
  "books-and-reading/library-word-search"
].map(topicLink);

export const homeschoolPicks = [
  "science/earth-science-word-search",
  "geography/landforms-word-search",
  "language-arts/story-elements-word-search",
  "math/measurement-word-search",
  "history/ancient-greece-word-search",
  "art/colors-word-search"
].map(topicLink);

export const eslPicks = [
  "food-and-drink/everyday-foods-word-search",
  "travel/airport-word-search",
  "classroom-values/school-subjects-word-search",
  "nature-and-weather/plants-word-search",
  "books-and-reading/book-parts-word-search",
  "sports/swimming-word-search"
].map(topicLink);

export const answerKeyCollections = [
  "word-searches-with-answer-keys",
  "easy-printable-word-searches",
  "hard-printable-word-searches"
].map(collectionLink);

export const largePrintPicks = [
  "nature-and-weather/flowers-word-search",
  "nature-and-weather/garden-word-search",
  "geography/world-capitals-word-search",
  "food-and-drink/desserts-word-search"
].map(topicLink);

export const teacherCollections = [
  "classroom-word-search-worksheets",
  "science-word-search-worksheets",
  "word-searches-with-answer-keys"
].map(collectionLink);

export const worksheetCategories = [
  "language-arts-word-searches",
  "math-word-searches",
  "science-word-searches",
  "geography-word-searches",
  "classroom-and-values-word-searches"
].map(categoryLink);

export const pdfGuides = [
  "how-to-print-a-word-search",
  "how-to-make-a-word-search-with-answer-key",
  "how-to-make-a-word-search"
].map(guideLink);
