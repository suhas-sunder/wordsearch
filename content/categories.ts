export interface Category {
  slug: string;
  pathSegment: string;
  title: string;
  description: string;
  accent: string;
  notes: string[];
  related: string[];
}

export const categories: Category[] = [
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
  }
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug || category.pathSegment === slug);
}
