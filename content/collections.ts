import { topics } from "@/content/topics";

export interface Collection {
  slug: string;
  title: string;
  description: string;
  words: string[];
  angle: string;
  relatedTopics: string[];
  publicationStatus?: "draft" | "published";
  metaTitle?: string;
  metaDescription?: string;
  selectionGuidance?: string;
  relatedCollections?: string[];
  categorySlugs?: string[];
  reviewedOn?: string;
}

const reviewedOn = "2026-07-25";
const publishedTopics = topics.filter((topic) => topic.publicationStatus === "published");
const all = publishedTopics.map((topic) => topic.slug);
const byDifficulty = (difficulty: "easy" | "medium" | "hard") =>
  publishedTopics.filter((topic) => topic.difficulty === difficulty).map((topic) => topic.slug);
const bySegment = (segment: string) =>
  publishedTopics.filter((topic) => topic.categorySegment === segment).map((topic) => topic.slug);
const routesFor = (...slugs: string[]) =>
  publishedTopics.filter((topic) => slugs.includes(topic.topicSlug)).map((topic) => topic.slug);

const publishedCollections = [
  {
    slug: "easy-printable-word-searches",
    title: "Easy Printable Word Searches",
    description: "Compact, familiar word searches with printable pages, PDF downloads, and matching answer keys.",
    words: [],
    angle: "Choose a reviewed easy puzzle when you want a compact grid without reverse spelling.",
    relatedTopics: byDifficulty("easy"),
    publicationStatus: "published",
    metaTitle: "Easy Printable Word Searches | Free PDFs and Answers",
    metaDescription: "Browse easy printable word searches with compact grids, familiar vocabulary, PDF downloads, and matching answer keys.",
    selectionGuidance: "The Easy preset uses a 12 × 12 grid, twelve terms, and forward horizontal, vertical, or diagonal paths. Print on Letter or A4 paper, or select large print when larger cells are more useful; no fixed age range is implied.",
    relatedCollections: ["medium-word-searches", "word-searches-with-answer-keys"],
    categorySlugs: ["animals-word-searches", "food-and-drink-word-searches", "classroom-and-values-word-searches"],
    reviewedOn
  },
  {
    slug: "medium-word-searches",
    title: "Medium Word Searches to Print",
    description: "Sixteen-word puzzles with mixed directions, online play, printable PDFs, and answer keys.",
    words: [],
    angle: "This collection is for solvers who want more directional variety than the Easy preset.",
    relatedTopics: byDifficulty("medium"),
    publicationStatus: "published",
    metaTitle: "Medium Word Searches to Print | Free PDFs",
    metaDescription: "Browse medium word searches with sixteen-word lists, mixed directions, printable PDFs, online play, and answer keys.",
    selectionGuidance: "Each Medium puzzle uses a 15 × 15 grid, sixteen terms, and all eight straight directions. Reverse and diagonal placements make these grids a clear step up from the forward-only Easy collection.",
    relatedCollections: ["easy-printable-word-searches", "hard-printable-word-searches"],
    categorySlugs: ["nature-and-weather-word-searches", "geography-word-searches", "sports-word-searches"],
    reviewedOn
  },
  {
    slug: "hard-printable-word-searches",
    title: "Hard Printable Word Searches",
    description: "A focused set of larger, denser puzzles with twenty terms, reverse paths, diagonals, and solutions.",
    words: [],
    angle: "Every fully reviewed Hard puzzle is included; unfinished drafts are excluded.",
    relatedTopics: byDifficulty("hard"),
    publicationStatus: "published",
    metaTitle: "Hard Printable Word Searches | Challenging Free PDFs",
    metaDescription: "Print challenging word searches with larger grids, twenty-word lists, reverse and diagonal placements, and answer keys.",
    selectionGuidance: "Hard puzzles use an 18 × 18 grid, twenty terms, overlap, and every straight direction. The inventory is deliberately smaller because no unfinished hard draft is included.",
    relatedCollections: ["medium-word-searches", "word-searches-with-answer-keys"],
    categorySlugs: ["science-word-searches", "geography-word-searches"],
    reviewedOn
  },
  {
    slug: "word-searches-with-answer-keys",
    title: "Printable Word Searches with Answer Keys",
    description: "All reviewed printable puzzles with solution pages generated from the same stable seed and settings.",
    words: [],
    angle: "Choose by topic or difficulty, then print the puzzle alone or include the matching solution page.",
    relatedTopics: all,
    publicationStatus: "published",
    metaTitle: "Printable Word Searches with Answer Keys | Free PDFs",
    metaDescription: "Browse printable word searches with matching solution pages. Choose a puzzle, print it, or download a PDF with the answer key included.",
    selectionGuidance: "Every listing opens one canonical puzzle page. Answer views are utilities rather than separate sitemap entries, so the unsolved grid and its solution remain one reproducible puzzle.",
    relatedCollections: ["easy-printable-word-searches", "medium-word-searches", "hard-printable-word-searches"],
    categorySlugs: ["animals-word-searches", "science-word-searches", "language-arts-word-searches"],
    reviewedOn
  },
  {
    slug: "classroom-word-search-worksheets",
    title: "Classroom Word Search Worksheets",
    description: "Reviewed vocabulary worksheets for language arts, math, science, geography, school routines, and values topics.",
    words: [],
    angle: "A parent- and teacher-facing inventory for lesson vocabulary, activity stations, and independent review.",
    relatedTopics: publishedTopics
      .filter((topic) => ["language-arts", "math", "science", "geography", "classroom-values"].includes(topic.categorySegment))
      .map((topic) => topic.slug),
    publicationStatus: "published",
    metaTitle: "Classroom Word Search Worksheets | Free Printables",
    metaDescription: "Find printable classroom word search worksheets for language arts, math, science, geography, school routines, and vocabulary review.",
    selectionGuidance: "Start with the subject that matches the current unit, then compare the visible difficulty labels. The puzzle, printable worksheet, PDF, and answer key all use the same reviewed definition.",
    relatedCollections: ["science-word-search-worksheets", "word-searches-with-answer-keys"],
    categorySlugs: ["language-arts-word-searches", "math-word-searches", "science-word-searches", "geography-word-searches", "classroom-and-values-word-searches"],
    reviewedOn
  },
  {
    slug: "animal-word-search-printables",
    title: "Animal Word Search Printables",
    description: "Reviewed animal puzzles about pets, farms, zoos, birds, insects, reptiles, wild cats, and habitats.",
    words: [],
    angle: "Browse the complete reviewed Animal inventory by familiar subject and difficulty.",
    relatedTopics: bySegment("animals"),
    publicationStatus: "published",
    metaTitle: "Animal Word Search Printables | Free PDFs and Answers",
    metaDescription: "Browse printable animal word searches about pets, farms, zoos, birds, insects, reptiles, and ocean animals.",
    selectionGuidance: "Dog, Cat, and Farm Animals use the Easy preset; the remaining animal topics use Medium grids with reverse and diagonal paths.",
    relatedCollections: ["easy-printable-word-searches", "word-searches-with-answer-keys"],
    categorySlugs: ["animals-word-searches", "nature-and-weather-word-searches"],
    reviewedOn
  },
  {
    slug: "science-word-search-worksheets",
    title: "Science Word Search Worksheets",
    description: "Science vocabulary worksheets covering space, the solar system, biology, chemistry, physics, geology, and weather.",
    words: [],
    angle: "Use the introductory or advanced topic that best matches the vocabulary being reviewed.",
    relatedTopics: routesFor("space-word-search", "solar-system-word-search", "biology-word-search", "chemistry-word-search", "physics-word-search", "geology-word-search", "weather-word-search"),
    publicationStatus: "published",
    metaTitle: "Science Word Search Worksheets | Printable with Answers",
    metaDescription: "Print science word search worksheets covering space, the solar system, biology, chemistry, physics, geology, and weather.",
    selectionGuidance: "Space, the Solar System, Geology, and Weather use Medium grids. Biology, Chemistry, and Physics use larger Hard grids with twenty terms.",
    relatedCollections: ["classroom-word-search-worksheets", "hard-printable-word-searches"],
    categorySlugs: ["science-word-searches", "nature-and-weather-word-searches"],
    reviewedOn
  },
  {
    slug: "seasonal-word-searches",
    title: "Seasonal Word Searches",
    description: "Printable spring, summer, fall, winter, Halloween, and Christmas puzzles with online and answer-key options.",
    words: [],
    angle: "The complete seasonal batch remains available year-round for advance planning and off-season use.",
    relatedTopics: bySegment("holidays"),
    publicationStatus: "published",
    metaTitle: "Seasonal Word Searches | Free Printable Puzzles",
    metaDescription: "Browse printable seasonal word searches for spring, summer, fall, winter, Halloween, and Christmas.",
    selectionGuidance: "The four seasons use compact Easy grids. Halloween and Christmas use Medium grids with mixed directions and longer word lists.",
    relatedCollections: ["easy-printable-word-searches", "medium-word-searches"],
    categorySlugs: ["holiday-word-searches", "nature-and-weather-word-searches"],
    reviewedOn
  },
  {
    slug: "geography-word-search-worksheets",
    title: "Geography Word Search Worksheets",
    description: "Printable geography puzzles covering maps, regions, waterways, landforms, countries, and capitals.",
    words: [],
    angle: "Choose a reviewed geography worksheet by region or physical-geography topic.",
    relatedTopics: routesFor("continents-word-search", "oceans-word-search", "world-capitals-word-search", "us-states-word-search", "canada-word-search", "map-vocabulary-word-search", "landforms-word-search", "europe-word-search", "asia-word-search", "africa-word-search", "north-america-word-search", "south-america-word-search", "mountains-word-search", "rivers-word-search"),
    publicationStatus: "published",
    metaTitle: "Geography Word Search Worksheets | Free Printables",
    metaDescription: "Print geography word searches covering continents, countries, capitals, maps, landforms, oceans, and regional vocabulary.",
    selectionGuidance: "Use regional puzzles for place vocabulary and landform, mountain, river, ocean, or map puzzles for physical and map-reading terms. Difficulty labels describe the grid, not a grade level.",
    relatedCollections: ["classroom-word-search-worksheets", "travel-word-search-printables"],
    categorySlugs: ["geography-word-searches", "nature-and-weather-word-searches"],
    reviewedOn
  },
  {
    slug: "language-arts-word-search-worksheets",
    title: "Language Arts Word Search Worksheets",
    description: "Printable language-arts puzzles for grammar, vocabulary, word parts, reading, and text features.",
    words: [],
    angle: "Select a worksheet that matches the language concept or reading vocabulary being reviewed.",
    relatedTopics: routesFor("nouns-word-search", "verbs-word-search", "adjectives-word-search", "synonyms-word-search", "antonyms-word-search", "punctuation-word-search", "prefixes-word-search", "suffixes-word-search", "homophones-word-search", "compound-words-word-search", "story-elements-word-search", "poetry-word-search", "book-parts-word-search", "nonfiction-text-features-word-search"),
    publicationStatus: "published",
    metaTitle: "Language Arts Word Search Worksheets | Free PDFs",
    metaDescription: "Browse printable language arts word searches for grammar, vocabulary, word parts, story elements, poetry, and text features.",
    selectionGuidance: "Pair the puzzle with direct instruction or reading practice. The word bank is a focused review aid, and the matching answer key uses the same deterministic grid.",
    relatedCollections: ["classroom-word-search-worksheets", "word-searches-with-answer-keys"],
    categorySlugs: ["language-arts-word-searches", "books-and-reading-word-searches"],
    reviewedOn
  },
  {
    slug: "math-word-search-worksheets",
    title: "Math Word Search Worksheets",
    description: "Printable math-vocabulary puzzles covering operations, shapes, measurement, money, decimals, percentages, and algebra.",
    words: [],
    angle: "Browse all twelve reviewed math topics without treating the puzzle as a calculation exercise.",
    relatedTopics: bySegment("math"),
    publicationStatus: "published",
    metaTitle: "Math Word Search Worksheets | Printable with Answers",
    metaDescription: "Print math vocabulary word searches covering operations, shapes, measurement, money, decimals, percentages, and algebra.",
    selectionGuidance: "Choose the topic that matches the current unit, then use the visible difficulty to compare grid complexity. Each printable has a matching solution.",
    relatedCollections: ["classroom-word-search-worksheets", "language-arts-word-search-worksheets"],
    categorySlugs: ["math-word-searches"],
    reviewedOn
  },
  {
    slug: "history-word-search-worksheets",
    title: "History Word Search Worksheets",
    description: "Printable history puzzles about six broad periods from ancient civilizations through industrialization.",
    words: [],
    angle: "Use these general-history vocabulary lists as a compact review alongside fuller historical sources.",
    relatedTopics: bySegment("history"),
    publicationStatus: "published",
    metaTitle: "History Word Search Worksheets | Free Printable Puzzles",
    metaDescription: "Browse printable history word searches about ancient Egypt, Greece, Rome, medieval times, the Renaissance, and industrialization.",
    selectionGuidance: "The six pages cover Ancient Egypt, Ancient Greece, Ancient Rome, Medieval Times, the Renaissance, and the Industrial Revolution without relying on fictional franchises.",
    relatedCollections: ["classroom-word-search-worksheets", "geography-word-search-worksheets"],
    categorySlugs: ["history-word-searches"],
    reviewedOn
  },
  {
    slug: "travel-word-search-printables",
    title: "Travel Word Search Printables",
    description: "Printable travel puzzles for transportation, lodging, vacations, camping, beaches, maps, and destinations.",
    words: [],
    angle: "Choose a travel-stage puzzle for trip preparation or a general map and destination topic.",
    relatedTopics: routesFor("airport-word-search", "road-trip-word-search", "hotel-word-search", "train-travel-word-search", "cruise-travel-word-search", "vacation-word-search", "camping-word-search", "beach-word-search", "world-capitals-word-search", "map-vocabulary-word-search"),
    publicationStatus: "published",
    metaTitle: "Travel Word Search Printables | Free PDFs and Answers",
    metaDescription: "Browse printable travel word searches for airports, road trips, hotels, trains, cruises, vacations, maps, and destinations.",
    selectionGuidance: "Transportation and lodging pages focus on practical trip vocabulary; Camping, Beach, World Capitals, and Map Vocabulary broaden the set for activity packs.",
    relatedCollections: ["geography-word-search-worksheets", "word-searches-with-answer-keys"],
    categorySlugs: ["travel-word-searches", "geography-word-searches", "nature-and-weather-word-searches"],
    reviewedOn
  }
].map((collection) => ({
  ...collection,
  words: Array.from(new Set(collection.relatedTopics.flatMap((route) => publishedTopics.find((topic) => topic.slug === route)?.words ?? []))).slice(0, 18)
})) as Collection[];

const remainingDrafts: Collection[] = [
  ["halloween-word-searches-for-kids", "Halloween Word Searches for Kids", "Kid-friendly Halloween puzzle collection draft.", ["pumpkin", "costume"], "Scheduled for later editorial review."],
  ["christmas-word-searches-for-kids", "Christmas Word Searches for Kids", "Christmas puzzle collection draft.", ["tree", "carol"], "Scheduled for later editorial review."],
  ["road-trip-word-searches", "Road Trip Word Searches", "Travel-friendly printable collection draft.", ["road", "map"], "Scheduled for later editorial review."],
  ["substitute-teacher-word-searches", "Substitute Teacher Word Searches", "Substitute-folder collection draft.", ["teacher", "lesson"], "Scheduled for later editorial review."],
  ["brain-training-word-searches", "Brain Training Word Searches", "Adult challenge collection draft without health claims.", ["pattern", "logic"], "Scheduled for later editorial review."],
  ["baby-shower-word-searches", "Baby Shower Word Searches", "Baby shower activity collection draft.", ["baby", "gift"], "Scheduled for later editorial review."],
  ["bridal-shower-word-searches", "Bridal Shower Word Searches", "Bridal shower activity collection draft.", ["bride", "bouquet"], "Scheduled for later editorial review."],
  ["rainy-day-word-searches", "Rainy Day Word Searches", "Quiet indoor puzzle collection draft.", ["rain", "book"], "Scheduled for later editorial review."]
].map(([slug, title, description, words, angle]) => ({
  slug: slug as string,
  title: title as string,
  description: description as string,
  words: words as string[],
  angle: angle as string,
  relatedTopics: [],
  publicationStatus: "draft"
}));

export const collections: Collection[] = [...publishedCollections, ...remainingDrafts];

export const collectionRedirects: Record<string, string> = {
  "classroom-word-searches": "classroom-word-search-worksheets"
};

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
