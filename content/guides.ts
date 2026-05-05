export interface Guide {
  slug: string;
  title: string;
  description: string;
  words: string[];
  sections: Array<{ heading: string; body: string }>;
}

export const guides: Guide[] = [
  ["how-to-make-a-word-search", "How to Make a Word Search", "A practical guide to building word lists, choosing grid size, setting difficulty, and printing a clean word search.", ["make", "words", "grid", "seed", "print", "answer", "share", "difficulty"]],
  ["how-to-print-word-searches", "How to Print Word Searches", "How to choose paper size, margins, answer keys, large print, and ink-saving settings for word searches.", ["print", "paper", "letter", "a4", "margin", "ink", "answer", "footer"]],
  ["how-to-make-large-print-word-searches", "How to Make Large Print Word Searches", "Readable large-print settings for word searches with bigger cells, fewer words, and high contrast.", ["large", "print", "contrast", "spacing", "grid", "readable", "senior", "paper"]],
  ["word-search-difficulty-by-age", "Word Search Difficulty by Age", "How to choose word count, grid size, directions, and vocabulary for different ages without overcomplicating the puzzle.", ["age", "easy", "medium", "hard", "kids", "adult", "grid", "directions"]],
  ["classroom-word-search-ideas", "Classroom Word Search Ideas", "Classroom uses for word searches: warm-ups, sub plans, spelling review, vocabulary reinforcement, and early finishers.", ["classroom", "warmup", "substitute", "spelling", "vocabulary", "review", "teacher", "answer"]],
  ["homeschool-word-search-ideas", "Homeschool Word Search Ideas", "Flexible homeschool word search ideas for subject bundles, seasonal units, and travel days.", ["homeschool", "subject", "season", "travel", "lesson", "family", "print", "review"]],
  ["esl-word-search-activities", "ESL Word Search Activities", "ESL word search activities for vocabulary recognition, spelling, conversation starters, and themed review.", ["esl", "vocabulary", "family", "food", "weather", "travel", "school", "practice"]],
  ["word-search-solving-tips", "Word Search Solving Tips", "Simple solving tips for scanning rows, spotting uncommon letters, and checking answers.", ["solve", "scan", "letter", "pattern", "focus", "answer", "search", "tip"]],
  ["how-hidden-message-word-searches-work", "How Hidden Message Word Searches Work", "How leftover cells can reveal a message and what constraints matter for printing and answer keys.", ["hidden", "message", "leftover", "cells", "answer", "seed", "print", "validation"]],
  ["how-to-build-custom-word-lists", "How to Build Custom Word Lists", "How to make useful word lists for classrooms, parties, hobbies, and topic pages.", ["custom", "word", "list", "topic", "clue", "phrase", "duplicate", "import"]],
  ["word-search-benefits-for-vocabulary-practice", "Word Search Benefits for Vocabulary Practice", "How word searches can support vocabulary exposure, spelling attention, and topic review without exaggerated claims.", ["vocabulary", "practice", "spelling", "reading", "review", "terms", "lesson", "word"]],
  ["word-search-ideas-for-parties", "Word Search Ideas for Parties", "Party word search ideas for baby showers, bridal showers, holidays, road trips, and rainy days.", ["party", "shower", "holiday", "guest", "print", "game", "family", "answer"]]
].map(([slug, title, description, words]) => ({
  slug: slug as string,
  title: title as string,
  description: description as string,
  words: words as string[],
  sections: [
    { heading: "Start with the use case", body: "Choose the word list and grid settings around the person solving the puzzle, not around a generic template." },
    { heading: "Keep print output predictable", body: "Use Letter or A4, leave room for the word bank, and keep the answer key on its own clean surface." },
    { heading: "Reuse the same seed", body: "When preview, print, PDF, and share links use one seed, the puzzle and answer key stay aligned." }
  ]
}));

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
