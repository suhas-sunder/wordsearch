import { categories } from "@/content/categories";

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

export const topics: Topic[] = Object.entries(seeds).flatMap(([segment, slugs]) =>
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

export function getTopic(categorySegment: string, topicSlug: string) {
  return topics.find((topic) => topic.categorySegment === categorySegment && topic.topicSlug === topicSlug);
}

export function getTopicsForCategory(categorySegment: string) {
  return topics.filter((topic) => topic.categorySegment === categorySegment);
}
