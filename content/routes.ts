import type { AlphabetPackId, Difficulty } from "@/lib/puzzle/types";

export interface SitePage {
  slug: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  presetWords: string[];
  difficulty: Difficulty;
  alphabetPack?: AlphabetPackId;
  modules: string[];
  faq?: Array<{ question: string; answer: string }>;
}

export const corePages: SitePage[] = [
  {
    slug: "word-search-generator",
    title: "Word Search Generator | Make Printable and Online Puzzles",
    h1: "Word Search Generator",
    description: "Make a custom word search with print, PDF, answer key, share, and online play controls.",
    intro: "Start with your own word list, choose the difficulty, and keep the exact seed so every output matches.",
    presetWords: ["classroom", "teacher", "vocabulary", "printable", "answer", "students", "worksheet", "custom", "share", "puzzle"],
    difficulty: "medium",
    modules: ["settings", "exports", "specialty", "faq"],
    faq: [
      { question: "Can I use phrases?", answer: "Yes. Phrases stay readable in the word bank while the puzzle places the tokens without spaces." },
      { question: "Why did a word not fit?", answer: "The builder lists excluded words and suggests increasing the grid, allowing overlap, or reducing the list." }
    ]
  },
  {
    slug: "free-printable-word-searches",
    title: "Free Printable Word Searches | PDF Worksheets with Answer Keys",
    h1: "Free Printable Word Searches",
    description: "Create free printable word searches with Letter/A4 layouts, answer keys, and classroom-friendly word banks.",
    intro: "This print-first hub keeps the generator above the fold and focuses on clean black-and-white worksheets.",
    presetWords: ["print", "paper", "worksheet", "answer", "letter", "a4", "teacher", "classroom", "word bank", "student"],
    difficulty: "easy",
    modules: ["printTips", "categories", "largePrint", "faq"]
  },
  {
    slug: "online-word-search",
    title: "Online Word Search | Play and Share Custom Puzzles",
    h1: "Online Word Search",
    description: "Play word searches in the browser, share a seeded puzzle, and print the same puzzle when needed.",
    intro: "Use touch or keyboard-friendly solving tools, then share or print the exact same generated grid.",
    presetWords: ["online", "timer", "solve", "touch", "mobile", "reveal", "share", "daily", "random", "play"],
    difficulty: "medium",
    modules: ["play", "mobile", "daily", "faq"]
  },
  {
    slug: "word-search-pdf",
    title: "Word Search PDF Maker | Printable Puzzle and Solution Pages",
    h1: "Word Search PDF Maker",
    description: "Build PDF-ready word searches with Letter/A4, portrait/landscape, answer keys, QR links, and ink-saving output.",
    intro: "The PDF workflow uses the same generated SVG grid as the live preview and print surface.",
    presetWords: ["pdf", "download", "letter", "a4", "portrait", "landscape", "margins", "solution", "ink", "print"],
    difficulty: "medium",
    modules: ["pdf", "answerKey", "margins", "faq"]
  },
  {
    slug: "word-search-worksheets",
    title: "Word Search Worksheets | Classroom and Homeschool Printables",
    h1: "Word Search Worksheets",
    description: "Create worksheet-ready word searches with title, instructions, name/date line, word bank, and answer key.",
    intro: "This page is tuned for teachers, homeschoolers, tutors, and substitute plans.",
    presetWords: ["spelling", "vocabulary", "warm up", "homework", "lesson", "review", "name", "date", "teacher", "student"],
    difficulty: "easy",
    modules: ["teacherUses", "gradeBands", "subjects", "faq"]
  },
  {
    slug: "word-search-with-answer-key",
    title: "Word Search with Answer Key | Printable Solution Pages",
    h1: "Word Search with Answer Key",
    description: "Generate a student word search and a matching answer key from the same seed.",
    intro: "Answer keys are generated from the same placements as the puzzle so preview, print, and solution pages agree.",
    presetWords: ["answer", "solution", "key", "teacher", "check", "highlight", "grade", "student", "copy", "print"],
    difficulty: "medium",
    modules: ["answerKey", "printTips", "faq"]
  },
  {
    slug: "easy-word-searches",
    title: "Easy Word Searches | Simple Printable and Online Puzzles",
    h1: "Easy Word Searches",
    description: "Build easy word searches with fewer directions, readable grids, and shorter word lists.",
    intro: "Easy mode uses forward and downward words by default for younger learners and quick warm-ups.",
    presetWords: ["cat", "dog", "sun", "book", "tree", "fish", "home", "smile", "game", "read"],
    difficulty: "easy",
    modules: ["kids", "printTips", "related"]
  },
  {
    slug: "hard-word-searches",
    title: "Hard Word Searches | Challenging Printable Puzzles",
    h1: "Hard Word Searches",
    description: "Create hard word searches with backward, upward, and diagonal directions for experienced solvers.",
    intro: "Hard mode increases direction variety and works best with larger grids and richer vocabulary.",
    presetWords: ["labyrinth", "strategy", "diagonal", "backward", "cryptic", "challenge", "pattern", "analysis", "precision", "focus"],
    difficulty: "hard",
    modules: ["difficulty", "adults", "faq"]
  },
  {
    slug: "large-print-word-searches",
    title: "Large Print Word Searches | Readable Printable Puzzles",
    h1: "Large Print Word Searches",
    description: "Make large-print word searches with bigger cells, high contrast, and clean print surfaces.",
    intro: "Large-print mode favors readable grids, fewer words, and print-first spacing.",
    presetWords: ["garden", "travel", "music", "cooking", "birds", "holiday", "family", "memory", "reading", "nature"],
    difficulty: "easy",
    modules: ["largePrint", "seniors", "printTips"]
  },
  {
    slug: "word-searches-for-kids",
    title: "Word Searches for Kids | Easy Printable Puzzles",
    h1: "Word Searches for Kids",
    description: "Kid-friendly word searches with simple themes, easy directions, and printable answer keys.",
    intro: "Choose age-appropriate word lists and keep the grid readable without turning the page into classroom clutter.",
    presetWords: ["animal", "color", "school", "friend", "apple", "story", "music", "flower", "planet", "happy"],
    difficulty: "easy",
    modules: ["ageBands", "topics", "faq"]
  },
  {
    slug: "word-searches-for-adults",
    title: "Word Searches for Adults | Printable and Online Puzzles",
    h1: "Word Searches for Adults",
    description: "Adult-friendly word searches with richer vocabulary, clean design, large-print options, and printable PDFs.",
    intro: "No childish styling, no clutter: just a focused puzzle workflow and calm topic browsing.",
    presetWords: ["gardening", "literature", "architecture", "cuisine", "passport", "symphony", "gallery", "history", "landmark", "photography"],
    difficulty: "hard",
    modules: ["adults", "hobbies", "largePrint"]
  },
  {
    slug: "word-searches-for-seniors",
    title: "Word Searches for Seniors | Calm Large-Print Puzzles",
    h1: "Word Searches for Seniors",
    description: "Calm, adult word searches with large-print presets and print-first layouts.",
    intro: "This page focuses on clear instructions, adult themes, and readable printouts without making health claims.",
    presetWords: ["garden", "birds", "cooking", "travel", "family", "flowers", "history", "music", "holiday", "books"],
    difficulty: "easy",
    modules: ["seniors", "largePrint", "topics"]
  },
  {
    slug: "word-searches-for-teachers",
    title: "Word Searches for Teachers | Classroom Worksheet Generator",
    h1: "Word Searches for Teachers",
    description: "Teacher-ready word searches with vocabulary lists, clue mode, answer keys, grade bands, and print controls.",
    intro: "Use the builder for warm-ups, sub plans, spelling review, vocabulary reinforcement, and early finishers.",
    presetWords: ["vocabulary", "spelling", "lesson", "subject", "review", "clue", "answer", "grade", "classroom", "worksheet"],
    difficulty: "medium",
    modules: ["teacherUses", "subjects", "answerKey", "faq"]
  },
  {
    slug: "homeschool-word-searches",
    title: "Homeschool Word Searches | Flexible Printable Activities",
    h1: "Homeschool Word Searches",
    description: "Homeschool word searches for subject bundles, seasonal work, road trips, and flexible review.",
    intro: "Build a worksheet around the exact words you are studying, then print the student copy and answer key.",
    presetWords: ["homeschool", "lesson", "science", "history", "reading", "travel", "season", "review", "family", "activity"],
    difficulty: "medium",
    modules: ["homeschool", "subjects", "collections"]
  },
  {
    slug: "esl-word-searches",
    title: "ESL Word Searches | Vocabulary Practice Worksheets",
    h1: "ESL Word Searches",
    description: "Vocabulary-focused word searches for ESL topics like food, weather, travel, family, and school.",
    intro: "Keep direction settings simple while learners focus on recognizing and spelling new words.",
    presetWords: ["family", "weather", "school", "travel", "market", "breakfast", "friend", "city", "question", "answer"],
    difficulty: "easy",
    modules: ["esl", "topics", "printTips"]
  },
  {
    slug: "daily-word-search",
    title: "Daily Word Search | New Seeded Puzzle Every Day",
    h1: "Daily Word Search",
    description: "Play or print a daily seeded word search puzzle with reproducible difficulty options.",
    intro: "The daily page uses a stable date-based seed so the same day produces the same puzzle.",
    presetWords: ["daily", "morning", "focus", "solve", "print", "share", "today", "challenge", "puzzle", "routine"],
    difficulty: "medium",
    modules: ["daily", "play", "share"]
  },
  {
    slug: "categories",
    title: "Word Search Categories | Browse Printable Puzzle Hubs",
    h1: "Word Search Categories",
    description: "Browse canonical word search category hubs for animals, holidays, science, math, geography, and more.",
    intro: "Categories organize broad search intent without creating thin pages for every modifier combination.",
    presetWords: ["animals", "holidays", "science", "math", "reading", "geography", "history", "sports", "travel", "music"],
    difficulty: "medium",
    modules: ["categories", "related"]
  },
  {
    slug: "topics",
    title: "Word Search Topics | Curated Printable Puzzle Pages",
    h1: "Word Search Topics",
    description: "Browse curated word search topic pages with real word lists, print controls, and related links.",
    intro: "Each topic page is canonical and exposes difficulty, printable, PDF, large-print, and answer-key modes in one place.",
    presetWords: ["halloween", "planets", "dogs", "fractions", "countries", "weather", "soccer", "cooking", "gardening", "books"],
    difficulty: "medium",
    modules: ["topics", "categories"]
  },
  {
    slug: "specialty-word-search-generators",
    title: "Specialty Word Search Generators | Morse, Braille, Binary and More",
    h1: "Specialty Word Search Generators",
    description: "Explore symbol-based word search generators built on alphabet packs for Morse, Braille, binary, hex, Greek, kana, and hidden messages.",
    intro: "Specialty modes use token-based generation so the engine is not limited to A-Z letters.",
    presetWords: ["signal", "code", "symbol", "braille", "morse", "binary", "hex", "greek", "kana", "message"],
    difficulty: "medium",
    modules: ["specialty", "alphabetPacks", "faq"]
  },
  {
    slug: "guides",
    title: "Word Search Guides | Printing, Difficulty, Lists, and Classroom Ideas",
    h1: "Word Search Guides",
    description: "Practical word search guides for creating, printing, teaching, solving, and building better word lists.",
    intro: "Guides support the generator workflow without bloating core puzzle pages.",
    presetWords: ["guide", "print", "difficulty", "classroom", "homeschool", "tips", "word list", "large print", "hidden", "activity"],
    difficulty: "medium",
    modules: ["guides", "related"]
  }
];

export const supportPages: SitePage[] = [
  { slug: "about", title: "About I Love Word Search", h1: "About I Love Word Search", description: "Learn about the I Love Word Search platform.", intro: "We build calm, useful word search tools for printing, play, teaching, and repeat use.", presetWords: ["about", "puzzle", "print", "share", "teacher"], difficulty: "easy", modules: ["support"] },
  { slug: "faq", title: "Word Search FAQ", h1: "Word Search FAQ", description: "Answers to common word search generator, print, PDF, answer key, and sharing questions.", intro: "Common questions about making, printing, sharing, and solving word searches.", presetWords: ["question", "answer", "print", "share", "grid"], difficulty: "easy", modules: ["faq"] },
  { slug: "contact", title: "Contact I Love Word Search", h1: "Contact", description: "Contact and support information for I Love Word Search.", intro: "For now, use this page as the support and feedback landing page for the project.", presetWords: ["contact", "support", "feedback", "help", "message"], difficulty: "easy", modules: ["support"] },
  { slug: "accessibility", title: "Accessibility", h1: "Accessibility", description: "Accessibility approach for I Love Word Search.", intro: "The generator prioritizes readable controls, keyboard operation, high contrast, and large-print output.", presetWords: ["access", "focus", "keyboard", "contrast", "print"], difficulty: "easy", modules: ["accessibility"] },
  { slug: "privacy", title: "Privacy Policy", h1: "Privacy Policy", description: "Privacy policy and local puzzle-state notes for I Love Word Search.", intro: "Generated puzzle state is encoded in links and recent puzzle state is stored locally in the browser.", presetWords: ["privacy", "local", "state", "browser", "share"], difficulty: "easy", modules: ["legal"] },
  { slug: "terms", title: "Terms of Use", h1: "Terms of Use", description: "Terms of use for generated and printable I Love Word Search puzzles.", intro: "These surfaces are for personal, classroom, homeschool, and reasonable educational use.", presetWords: ["terms", "print", "classroom", "share", "use"], difficulty: "easy", modules: ["legal"] },
  { slug: "copyright", title: "Copyright", h1: "Copyright", description: "Copyright information for I Love Word Search.", intro: "Respect third-party word lists, copyrighted material, and classroom resource ownership.", presetWords: ["copyright", "words", "source", "credit", "license"], difficulty: "easy", modules: ["legal"] },
  { slug: "search", title: "Search Word Searches", h1: "Search Word Searches", description: "Search topics, categories, collections, guides, and generator pages.", intro: "Search is a utility surface for finding canonical pages and should not create indexable clutter.", presetWords: ["search", "topic", "category", "guide", "collection"], difficulty: "easy", modules: ["search"] }
];

export function getSitePage(slug: string) {
  return [...corePages, ...supportPages].find((page) => page.slug === slug);
}
