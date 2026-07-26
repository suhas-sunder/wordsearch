export interface Category {
  slug: string;
  pathSegment: string;
  title: string;
  description: string;
  accent: string;
  notes: string[];
  related: string[];
  publicationStatus?: "draft" | "published";
  introduction?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const categoryDrafts: Category[] = [
  {
    slug: "animals-word-searches",
    pathSegment: "animals",
    title: "Animals Word Searches",
    description: "Animal puzzles for pets, habitats, biology vocabulary, rainy days, and classroom warm-ups.",
    accent: "Animal habitats",
    notes: ["Use easier directions for young animal fans.", "Group topics by habitat when teaching ecosystems."],
    related: ["nature-and-weather-word-searches", "science-word-searches", "word-searches-for-kids"]
  },
  {
    slug: "holiday-word-searches",
    pathSegment: "holidays",
    title: "Holiday Word Searches",
    description: "Seasonal puzzles for classroom parties, family gatherings, early finishers, and quiet celebration activities.",
    accent: "Seasonal printables",
    notes: ["Keep seasonal puzzles print-friendly for quick handouts.", "Use answer keys for party hosts and substitute plans."],
    related: ["word-searches-for-kids", "collections/halloween-word-searches-for-kids", "collections/christmas-word-searches-for-kids"]
  },
  {
    slug: "science-word-searches",
    pathSegment: "science",
    title: "Science Word Searches",
    description: "Printable and online science vocabulary puzzles for astronomy, life science, Earth science, and lab terms.",
    accent: "STEM vocabulary",
    notes: ["Use word banks as vocabulary previews.", "Hard mode works well after a unit review."],
    related: ["math-word-searches", "nature-and-weather-word-searches", "collections/science-word-search-worksheets"]
  },
  {
    slug: "math-word-searches",
    pathSegment: "math",
    title: "Math Word Searches",
    description: "Math vocabulary puzzles for operations, shapes, measurement, money, time, and number sense.",
    accent: "Math language",
    notes: ["Pair with definitions for clue mode.", "Large print helps keep symbols and terms readable."],
    related: ["science-word-searches", "word-searches-for-teachers", "word-search-worksheets"]
  },
  {
    slug: "language-arts-word-searches",
    pathSegment: "language-arts",
    title: "Language Arts Word Searches",
    description: "Spelling, phonics, grammar, and vocabulary word searches for reading practice and review.",
    accent: "Reading practice",
    notes: ["Use easy mode for sight words and CVC words.", "Sort by length for spelling list practice."],
    related: ["esl-word-searches", "word-searches-for-kids", "word-searches-for-teachers"]
  },
  {
    slug: "geography-word-searches",
    pathSegment: "geography",
    title: "Geography Word Searches",
    description: "World places, maps, capitals, landmarks, states, provinces, and travel vocabulary puzzles.",
    accent: "Places and maps",
    notes: ["Use topic notes to connect map skills and vocabulary.", "Longer place names benefit from a rectangular grid."],
    related: ["travel-word-searches", "history-word-searches", "word-searches-for-adults"]
  },
  {
    slug: "history-word-searches",
    pathSegment: "history",
    title: "History Word Searches",
    description: "History and social studies puzzles for people, periods, communities, and civics vocabulary.",
    accent: "Social studies",
    notes: ["Clue mode turns names and places into quick review prompts.", "Answer keys help with substitute lessons."],
    related: ["geography-word-searches", "word-searches-for-teachers", "word-search-worksheets"]
  },
  {
    slug: "food-and-drink-word-searches",
    pathSegment: "food-and-drink",
    title: "Food and Drink Word Searches",
    description: "Food vocabulary puzzles for ESL, parties, cooking, nutrition units, and world cuisine themes.",
    accent: "Food vocabulary",
    notes: ["Food topics work well for ESL conversation starters.", "Use custom word lists for menus and parties."],
    related: ["esl-word-searches", "word-searches-for-adults", "collections/baby-shower-word-searches"]
  },
  {
    slug: "sports-word-searches",
    pathSegment: "sports",
    title: "Sports Word Searches",
    description: "Sports, fitness, Olympics, and movement vocabulary for teams, PE, camps, and hobby solvers.",
    accent: "Games and movement",
    notes: ["Hard mode fits older sports fans.", "Easy mode works for camp and PE warm-ups."],
    related: ["word-searches-for-kids", "word-searches-for-adults", "wellness-word-searches"]
  },
  {
    slug: "travel-word-searches",
    pathSegment: "travel",
    title: "Travel Word Searches",
    description: "Travel and place puzzles for road trips, vacations, airports, landmarks, and geography practice.",
    accent: "Road trip ready",
    notes: ["Use print mode for car and airport activities.", "Large print helps mixed-age family groups."],
    related: ["geography-word-searches", "collections/road-trip-word-searches", "word-searches-for-adults"]
  },
  {
    slug: "health-and-wellness-word-searches",
    pathSegment: "wellness",
    title: "Health and Wellness Word Searches",
    description: "Wellness, feelings, safety, kindness, and healthy habit vocabulary puzzles with a calm tone.",
    accent: "Helpful vocabulary",
    notes: ["Keep wording practical and non-medical.", "Use as vocabulary reinforcement, not health advice."],
    related: ["word-searches-for-kids", "word-searches-for-seniors", "word-searches-for-adults"]
  },
  {
    slug: "music-word-searches",
    pathSegment: "music",
    title: "Music Word Searches",
    description: "Music vocabulary puzzles for instruments, terms, artists, rhythm, listening, and hobby themes.",
    accent: "Music terms",
    notes: ["Clue mode is useful for definitions of terms.", "Adult collections can use richer music vocabulary."],
    related: ["art-word-searches", "books-and-reading-word-searches", "word-searches-for-adults"]
  },
  {
    slug: "books-and-reading-word-searches",
    pathSegment: "books-and-reading",
    title: "Books and Reading Word Searches",
    description: "Book, reading, library, genre, and author-themed word searches for reading corners and calm breaks.",
    accent: "Reading corners",
    notes: ["Add classroom book titles with the custom generator.", "Use printable mode for library activities."],
    related: ["language-arts-word-searches", "word-searches-for-kids", "word-searches-for-adults"]
  },
  {
    slug: "art-word-searches",
    pathSegment: "art",
    title: "Art Word Searches",
    description: "Art vocabulary puzzles for artists, materials, techniques, colors, museums, and creative classrooms.",
    accent: "Creative terms",
    notes: ["Use art terms as vocabulary before studio time.", "Keep answer keys separate for self-checking."],
    related: ["music-word-searches", "books-and-reading-word-searches", "word-searches-for-teachers"]
  },
  {
    slug: "nature-and-weather-word-searches",
    pathSegment: "nature-and-weather",
    title: "Nature and Weather Word Searches",
    description: "Nature, seasons, weather, plants, habitats, and outdoor vocabulary puzzles.",
    accent: "Outdoor vocabulary",
    notes: ["Weather terms pair well with science observations.", "Seasonal topics make quick monthly printables."],
    related: ["science-word-searches", "animals-word-searches", "holiday-word-searches"]
  },
  {
    slug: "faith-word-searches",
    pathSegment: "faith",
    title: "Faith Word Searches",
    description: "Faith-based puzzles for Bible books, stories, scripture themes, and church classroom handouts.",
    accent: "Faith themes",
    notes: ["Keep wording respectful and activity-focused.", "Use answer keys for group leaders and homeschool review."],
    related: ["word-searches-for-kids", "homeschool-word-searches", "word-search-worksheets"]
  },
  {
    slug: "classroom-and-values-word-searches",
    pathSegment: "classroom-values",
    title: "Classroom and Values Word Searches",
    description: "Printable and online school, spelling, kindness, and friendship vocabulary puzzles.",
    accent: "School and community vocabulary",
    notes: ["Choose school themes for routines and supplies.", "Use values topics as discussion starters rather than outcome claims."],
    related: ["language-arts-word-searches", "math-word-searches", "science-word-searches"]
  }
];

const publishedDetails: Record<string, Pick<Category, "introduction" | "metaTitle" | "metaDescription">> = {
  "animals-word-searches": {
    introduction: "Browse animal word searches covering pets, farm animals, zoo animals, birds, insects, reptiles, and ocean life. Each puzzle can be played online or used as a printable activity with PDF and answer-key options.",
    metaTitle: "Animal Word Searches | Free Printables and PDFs",
    metaDescription: "Browse animal word searches about pets, farms, zoos, birds, insects, reptiles, and ocean life. Play online or print with answers."
  },
  "food-and-drink-word-searches": {
    introduction: "Explore food word searches built around fruits, vegetables, meals, baking, desserts, and familiar treats. The collection includes easy vocabulary puzzles and more detailed cooking-themed activities.",
    metaTitle: "Food Word Searches | Free Printable Puzzles",
    metaDescription: "Explore printable food word searches for fruits, vegetables, breakfast, baking, desserts, and ice cream, with PDFs and answers."
  },
  "nature-and-weather-word-searches": {
    introduction: "Find nature word searches about flowers, trees, gardens, forests, beaches, and weather. These puzzles work as general-interest printables or as supporting vocabulary activities.",
    metaTitle: "Nature Word Searches | Printable Puzzles with Answers",
    metaDescription: "Find nature word searches about flowers, trees, gardens, forests, beaches, and weather. Play online or print the matching PDF."
  },
  "science-word-searches": {
    introduction: "Review broad science vocabulary through puzzles about space, the solar system, biology, chemistry, physics, and geology. Each page provides a deterministic puzzle with matching printable and answer-key output.",
    metaTitle: "Science Word Searches | Printable Worksheets",
    metaDescription: "Browse science word searches for space, biology, chemistry, physics, and geology. Print worksheets, download PDFs, or play online."
  },
  "geography-word-searches": {
    introduction: "Browse geography word searches covering continents, oceans, capitals, US states, Canada, and map-reading vocabulary. The collection includes both introductory and more challenging grids.",
    metaTitle: "Geography Word Searches | Free Printable PDFs",
    metaDescription: "Browse geography word searches for continents, oceans, capitals, US states, Canada, and maps, with printable answers."
  },
  "language-arts-word-searches": {
    introduction: "Find printable language-arts word searches for nouns, verbs, adjectives, synonyms, antonyms, and punctuation. The puzzles can support vocabulary and grammar review without replacing direct instruction.",
    metaTitle: "Language Arts Word Searches | Printable Worksheets",
    metaDescription: "Find printable language arts word searches for nouns, verbs, adjectives, synonyms, antonyms, and punctuation with answer keys."
  },
  "math-word-searches": {
    introduction: "Explore math-vocabulary word searches for addition, subtraction, multiplication, division, fractions, and geometry. These pages focus on mathematical language rather than calculation drills.",
    metaTitle: "Math Word Searches | Free Printable Worksheets",
    metaDescription: "Explore math vocabulary word searches for operations, fractions, and geometry. Print free worksheets or play online with answers."
  },
  "sports-word-searches": {
    introduction: "Browse sports word searches covering soccer, basketball, baseball, and hockey. The vocabulary focuses on positions, equipment, skills, and game terms rather than teams or professional athletes.",
    metaTitle: "Sports Word Searches | Free Printable Puzzles",
    metaDescription: "Browse soccer, basketball, baseball, and hockey word searches with printable PDFs, online play, and answer keys."
  },
  "classroom-and-values-word-searches": {
    introduction: "Find classroom word searches about school supplies, school routines, spelling, kindness, and friendship. These activities are designed for parents and teachers looking for simple printable or online resources.",
    metaTitle: "Classroom Word Searches | Printable School Activities",
    metaDescription: "Find school supplies, classroom, spelling, kindness, and friendship word searches for parents and teachers."
  },
  "holiday-word-searches": {
    introduction: "Browse seasonal word searches for spring, summer, fall, winter, Halloween, and Christmas. The topics use generic seasonal vocabulary without copyrighted characters or commercial franchises.",
    metaTitle: "Seasonal and Holiday Word Searches | Free Printables",
    metaDescription: "Browse spring, summer, fall, winter, Halloween, and Christmas word searches to print, download as PDFs, or play online."
  },
  "history-word-searches": {
    introduction: "Browse history word searches covering ancient Egypt, ancient Greece, ancient Rome, medieval life, the Renaissance, and the Industrial Revolution. Each puzzle uses a reviewed vocabulary list with online, printable, PDF, and answer-key options.",
    metaTitle: "History Word Searches | Free Printable Worksheets",
    metaDescription: "Browse history word searches about ancient civilizations, medieval life, the Renaissance, and industrialization with printable answers."
  },
  "travel-word-searches": {
    introduction: "Find travel word searches about airports, road trips, hotels, trains, cruises, and vacations. These puzzles use general travel vocabulary and can be played online or printed for trips and quiet activities.",
    metaTitle: "Travel Word Searches | Free Printable Puzzles",
    metaDescription: "Find travel word searches about airports, road trips, hotels, trains, cruises, and vacations, with PDFs and answer keys."
  },
  "music-word-searches": {
    introduction: "Explore music word searches about instruments, orchestras, piano, guitar, music theory, and singing. The collection focuses on general musical vocabulary rather than performers, songs, or commercial brands.",
    metaTitle: "Music Word Searches | Printable Puzzles with Answers",
    metaDescription: "Explore music word searches for instruments, orchestras, piano, guitar, theory, and singing without performer or song topics."
  },
  "books-and-reading-word-searches": {
    introduction: "Browse word searches about reading, libraries, book genres, book parts, nonfiction text features, and storytelling. These puzzles are designed as general reading and language resources without using copyrighted books or characters.",
    metaTitle: "Reading Word Searches | Free Printable Worksheets",
    metaDescription: "Browse reading word searches about libraries, genres, book parts, nonfiction text features, and storytelling with answers."
  },
  "art-word-searches": {
    introduction: "Find art word searches covering colors, painting, drawing, sculpture, photography, and crafts. Each page provides topic-specific vocabulary, online play, printable output, and a matching answer key.",
    metaTitle: "Art Word Searches | Free Printable Puzzles",
    metaDescription: "Find art word searches about colors, painting, drawing, sculpture, photography, and crafts, with PDFs and answer keys."
  }
};

export const categories: Category[] = categoryDrafts.map((category) => {
  const published = publishedDetails[category.slug];
  return {
    ...category,
    publicationStatus: published ? "published" : "draft",
    ...published
  };
});

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug || category.pathSegment === slug);
}
