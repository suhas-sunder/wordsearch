import { categories } from "@/content/categories";
import { curatedTopicsPrompt6 } from "@/content/curated-topics-prompt6";
import { curatedTopics } from "@/content/curated-topics";
import type { Difficulty } from "@/lib/puzzle/types";

export interface Topic {
  slug: string;
  topicSlug: string;
  categorySegment: string;
  categorySlug: string;
  title: string;
  description: string;
  words: string[];
  bestFor: string;
  notes: string[];
  publicationStatus?: "draft" | "published";
  difficulty?: Difficulty;
  audience?: string[];
  seed?: string;
  introduction?: string;
  context?: string;
  difficultyNote?: string;
  printNote?: string;
  metaTitle?: string;
  metaDescription?: string;
  reviewedOn?: string;
  rows?: number;
  columns?: number;
  relatedSlugs?: string[];
}

const baseWords: Record<string, string[]> = {
  animals: ["habitat", "wild", "tracks", "species", "forest", "ocean", "nature", "animal"],
  holidays: ["celebrate", "tradition", "family", "season", "party", "music", "decor", "memory"],
  science: ["observe", "model", "energy", "matter", "system", "data", "lab", "theory"],
  math: ["number", "pattern", "value", "equal", "solve", "logic", "total", "measure"],
  "language-arts": ["reading", "writing", "sentence", "sound", "spelling", "meaning", "story", "vocabulary"],
  geography: ["map", "border", "region", "capital", "landmark", "river", "country", "travel"],
  history: ["people", "event", "timeline", "culture", "rights", "leader", "change", "community"],
  "food-and-drink": ["flavor", "kitchen", "fresh", "recipe", "meal", "market", "bake", "serve"],
  sports: ["team", "score", "coach", "field", "speed", "practice", "player", "season"],
  travel: ["route", "map", "ticket", "hotel", "camp", "beach", "city", "journey"],
  wellness: ["kindness", "feelings", "habit", "calm", "safety", "friend", "choice", "care"],
  faith: ["story", "faith", "lesson", "service", "prayer", "scripture", "promise", "peace"],
  music: ["rhythm", "melody", "tempo", "voice", "guitar", "piano", "choir", "concert"],
  "books-and-reading": ["author", "chapter", "library", "genre", "reader", "novel", "poem", "bookmark"],
  art: ["color", "canvas", "shape", "brush", "museum", "portrait", "design", "sketch"]
};

const seeds: Record<string, string[]> = {
  animals: ["animals", "pets", "dogs", "cats", "farm-animals", "ocean-animals", "safari-animals", "zoo-animals", "birds", "insects", "reptiles", "dinosaurs", "baby-animals", "rainforest-animals", "woodland-animals"],
  holidays: ["christmas", "halloween", "thanksgiving", "easter", "valentines-day", "st-patricks-day", "new-year", "fourth-of-july", "hanukkah", "kwanzaa", "earth-day", "mothers-day", "fathers-day", "back-to-school", "spring", "summer", "fall", "winter"],
  science: ["solar-system", "planets", "stars-and-galaxies", "weather", "seasons", "human-body", "bones", "muscles", "plants", "flowers", "rocks-and-minerals", "chemistry", "periodic-table", "lab-safety", "habitats", "ecosystems"],
  math: ["numbers", "counting", "shapes", "addition", "subtraction", "multiplication", "division", "fractions", "decimals", "geometry", "measurement", "money", "telling-time"],
  "language-arts": ["sight-words", "cvc-words", "blends-and-digraphs", "long-vowels", "nouns", "verbs", "adjectives", "adverbs", "synonyms", "antonyms", "prefixes", "suffixes", "homophones", "spelling-words"],
  geography: ["countries", "world-capitals", "continents", "oceans", "us-states", "state-capitals", "canada-provinces", "landmarks", "maps", "flags", "world-cities", "national-parks"],
  history: ["ancient-egypt", "ancient-greece", "roman-empire", "explorers", "inventors", "civil-rights", "colonial-america", "women-in-history", "presidents-history", "community-helpers"],
  "food-and-drink": ["fruits", "vegetables", "desserts", "breakfast-foods", "baking", "spices", "pizza-toppings", "healthy-foods", "snacks", "world-cuisines"],
  sports: ["soccer", "basketball", "baseball", "football", "hockey", "olympics", "winter-sports", "summer-sports", "exercise", "yoga"],
  travel: ["beach", "camping", "road-trip", "airport", "mountains", "city-travel", "hotels", "vacation", "theme-parks", "landmarks-travel"],
  wellness: ["emotions", "friendship", "kindness", "gratitude", "mindfulness", "coping-skills", "healthy-habits", "safety-words", "feelings", "self-care"],
  faith: ["bible-books", "old-testament", "new-testament", "noahs-ark", "moses", "nativity", "easter-story", "psalms", "fruits-of-the-spirit", "parables"],
  music: ["music-terms"],
  "books-and-reading": ["books-and-reading"],
  art: ["famous-artists", "photography", "crafts"],
  "nature-and-weather": ["gardening", "birds-for-adults", "home-and-garden"]
};

const categoryForSegment = Object.fromEntries(categories.map((category) => [category.pathSegment, category.slug]));

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part === "cvc" ? "CVC" : part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function wordsFor(segment: string, slug: string) {
  const titleWords = slug.split("-").filter((part) => !["and", "for", "of", "the"].includes(part));
  const topicWords = titleWords.map((part) => titleFromSlug(part));
  return Array.from(new Set([...topicWords, ...(baseWords[segment] ?? baseWords.animals)])).slice(0, 14);
}

const draftTopics: Topic[] = Object.entries(seeds).flatMap(([segment, slugs]) =>
  slugs.map((slug) => {
    const title = `${titleFromSlug(slug)} Word Search`;
    const categorySlug = categoryForSegment[segment] ?? "animals-word-searches";
    return {
      slug: `${segment}/${slug}-word-search`,
      topicSlug: `${slug}-word-search`,
      categorySegment: segment,
      categorySlug,
      title,
      description: `A focused ${title.toLowerCase()} with printable, PDF, answer key, large-print, and online play options in one canonical page.`,
      words: wordsFor(segment, slug),
      bestFor: segment === "language-arts" || segment === "math" ? "classroom vocabulary review" : segment === "travel" ? "family trips and activity packs" : "quick printable practice",
      notes: [
        `${titleFromSlug(slug)} terms work well as a short vocabulary preview before solving.`,
        "Easy mode keeps words forward and down; hard mode adds backward and diagonal directions.",
        "The printable layout keeps the word bank separate from the answer key.",
        "Use the same seed when you need every student copy to match."
      ]
    };
  })
);

const replacedDraftAliases = new Set([
  "dogs-word-search",
  "cats-word-search",
  "breakfast-foods-word-search",
  "canada-provinces-word-search",
  "maps-word-search",
  "spelling-words-word-search",
  "gardening-word-search"
]);

const publishedTopicSources = [...curatedTopics, ...curatedTopicsPrompt6];
const curatedTopicNames = new Set(publishedTopicSources.map((topic) => topic.topicSlug));

function relatedRoutesFor(routeSlug: string, categorySegment: string, difficulty?: Difficulty) {
  const sameCategory = publishedTopicSources.filter(
    (topic) => topic.categorySegment === categorySegment && topic.routeSlug !== routeSlug
  );
  const categoryIndex = publishedTopicSources
    .filter((topic) => topic.categorySegment === categorySegment)
    .findIndex((topic) => topic.routeSlug === routeSlug);
  const withinCategory = Array.from(
    { length: Math.min(5, sameCategory.length) },
    (_, offset) => sameCategory[(Math.max(categoryIndex, 0) + offset) % sameCategory.length]?.routeSlug
  ).filter((slug): slug is string => Boolean(slug));
  const crossCategory = publishedTopicSources.find(
    (topic) =>
      topic.categorySegment !== categorySegment &&
      topic.difficulty === difficulty &&
      !withinCategory.includes(topic.routeSlug)
  );
  return [...withinCategory, ...(crossCategory ? [crossCategory.routeSlug] : [])].slice(0, 6);
}

export const topics: Topic[] = [
  ...publishedTopicSources.map((topic) => ({
    slug: topic.routeSlug,
    topicSlug: topic.topicSlug,
    categorySegment: topic.categorySegment,
    categorySlug: topic.categorySlug,
    title: topic.title,
    description: topic.context,
    words: topic.words,
    bestFor: `Suitable for ${topic.audience.join(", ")}`,
    notes: [topic.context, topic.difficultyNote, topic.printNote],
    publicationStatus: "published" as const,
    difficulty: topic.difficulty,
    audience: topic.audience,
    seed: topic.seed,
    introduction: topic.introduction,
    context: topic.context,
    difficultyNote: topic.difficultyNote,
    printNote: topic.printNote,
    metaTitle: topic.metaTitle,
    metaDescription: topic.metaDescription,
    reviewedOn: topic.reviewedOn,
    rows: topic.rows,
    columns: topic.columns,
    relatedSlugs: relatedRoutesFor(topic.routeSlug, topic.categorySegment, topic.difficulty)
  })),
  ...draftTopics.filter((topic) => !curatedTopicNames.has(topic.topicSlug) && !replacedDraftAliases.has(topic.topicSlug))
];

export const topicRedirects: Record<string, string> = {
  "animals/dogs-word-search": "animals/dog-word-search",
  "animals/cats-word-search": "animals/cat-word-search",
  "food-and-drink/breakfast-foods-word-search": "food-and-drink/breakfast-word-search",
  "geography/canada-provinces-word-search": "geography/canada-word-search",
  "geography/maps-word-search": "geography/map-vocabulary-word-search",
  "language-arts/spelling-words-word-search": "classroom-values/spelling-word-search",
  "nature-and-weather/gardening-word-search": "nature-and-weather/garden-word-search",
  "science/plants-word-search": "nature-and-weather/plants-word-search",
  "holidays/earth-day-word-search": "nature-and-weather/earth-day-word-search",
  "travel/camping-word-search": "nature-and-weather/camping-word-search",
  "travel/mountains-word-search": "nature-and-weather/mountains-word-search",
  "science/flowers-word-search": "nature-and-weather/flowers-word-search",
  "science/weather-word-search": "nature-and-weather/weather-word-search",
  "travel/beach-word-search": "nature-and-weather/beach-word-search",
  "wellness/friendship-word-search": "classroom-values/friendship-word-search",
  "wellness/kindness-word-search": "classroom-values/kindness-word-search"
};

export function getTopic(categorySegment: string, topicSlug: string) {
  return topics.find((topic) => topic.categorySegment === categorySegment && topic.topicSlug === topicSlug);
}

export function getTopicsForCategory(categorySegment: string) {
  return topics.filter((topic) => topic.categorySegment === categorySegment);
}
