export interface Collection {
  slug: string;
  title: string;
  description: string;
  words: string[];
  angle: string;
  relatedTopics: string[];
}

export const collections: Collection[] = [
  ["halloween-word-searches-for-kids", "Halloween Word Searches for Kids", "Kid-friendly Halloween puzzles for classroom parties and October printables.", ["pumpkin", "costume", "candy", "ghost", "bat", "moon", "spider", "treat", "mask", "party"], "A seasonal collection with easy mode defaults and printable answer keys."],
  ["christmas-word-searches-for-kids", "Christmas Word Searches for Kids", "Christmas word searches with simple seasonal vocabulary and clean worksheet output.", ["christmas", "tree", "carol", "gift", "snow", "cookie", "star", "winter", "family", "stocking"], "Built for quick December classroom and home printables."],
  ["science-word-search-worksheets", "Science Word Search Worksheets", "Science worksheet collections for astronomy, weather, plants, lab safety, and ecosystems.", ["science", "planet", "weather", "plant", "energy", "matter", "lab", "system", "data", "observe"], "A subject-first collection for teachers and homeschool science review."],
  ["road-trip-word-searches", "Road Trip Word Searches", "Travel-friendly printable word searches for cars, airports, camps, and vacations.", ["road", "map", "snack", "hotel", "music", "mile", "ticket", "camp", "beach", "city"], "A print-first family travel set with large readable grids."],
  ["substitute-teacher-word-searches", "Substitute Teacher Word Searches", "No-prep word searches with answer keys for substitute folders and early finishers.", ["substitute", "classroom", "review", "directions", "quiet", "answer", "lesson", "student", "paper", "finish"], "Designed around fast handouts and easy checking."],
  ["brain-training-word-searches", "Brain Training Word Searches", "Adult-friendly challenging word searches without medical claims or gimmicky promises.", ["focus", "pattern", "logic", "memory", "strategy", "detail", "search", "solve", "challenge", "attention"], "A calm adult collection centered on satisfying challenge."],
  ["baby-shower-word-searches", "Baby Shower Word Searches", "Printable baby shower word searches for simple party tables and guest activities.", ["baby", "shower", "gift", "bottle", "blanket", "family", "name", "crib", "rattle", "guest"], "A party-specific set with easy print and answer key access."],
  ["bridal-shower-word-searches", "Bridal Shower Word Searches", "Printable bridal shower word searches for party games and low-pressure group activities.", ["bride", "shower", "bouquet", "toast", "ring", "family", "guest", "dress", "music", "party"], "A social event collection that stays clean and printable."],
  ["classroom-word-searches", "Classroom Word Searches", "Classroom word searches for warm-ups, spelling review, vocabulary practice, and early finishers.", ["classroom", "teacher", "student", "lesson", "spelling", "review", "answer", "subject", "quiet", "paper"], "A broad teacher collection with practical workflow notes."],
  ["rainy-day-word-searches", "Rainy Day Word Searches", "Printable and online word searches for quiet indoor days, libraries, and family tables.", ["rain", "cloud", "book", "game", "cozy", "puzzle", "family", "window", "story", "tea"], "A casual collection for screen-light, low-prep activity time."]
].map(([slug, title, description, words, angle]) => ({
  slug: slug as string,
  title: title as string,
  description: description as string,
  words: words as string[],
  angle: angle as string,
  relatedTopics: ["animals/ocean-animals-word-search", "science/weather-word-search", "holidays/halloween-word-search"]
}));

export function getCollection(slug: string) {
  return collections.find((collection) => collection.slug === slug);
}
