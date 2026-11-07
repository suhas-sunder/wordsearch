import type { StagedPuzzleCandidate } from "@/content/staged/model";

export const teacherSubjectStatus = { publicationStatus: "draft", editorialStatus: "unreviewed", runtimeImportAllowed: false, humanEditorialApprovalRequired: true } as const;
const dictionary = { title: "Merriam-Webster — remaining human spelling reference", url: "https://www.merriam-webster.com/", note: "Available for required human usage review; this is not evidence that each draft entry was dictionary-verified. No definitions or source prose are copied." };

const briefs = [
  {
    id: "T06-A", slug: "ake-word-family", title: "AKE Word Family", segment: "language-arts", category: "language-arts-word-searches", easy: true,
    words: ["BAKE", "CAKE", "FAKE", "LAKE", "MAKE", "RAKE", "SAKE", "TAKE", "WAKE", "SHAKE", "SNAKE", "FLAKE"],
    intent: "A selected AKE spelling-pattern bank for teacher-led word-family work, distinct from broad CVC and long-vowel draft lists.",
    context: "The entries share the final AKE letter pattern. Teachers explain pronunciation and select audience-appropriate words; this is not a phonics assessment, certified reading level or claim about learning outcomes.", sources: [dictionary]
  },
  {
    id: "T07-A", slug: "irregular-past-verb-forms", title: "Irregular Past Verb Forms", segment: "language-arts", category: "language-arts-word-searches", easy: false,
    words: ["WENT", "SAW", "ATE", "DRANK", "WROTE", "SPOKE", "TOOK", "GAVE", "MADE", "FOUND", "THOUGHT", "BOUGHT", "BROUGHT", "TAUGHT", "CAUGHT", "RAN"],
    intent: "A past-tense-form bank for teacher comparison with base verbs, separate from the existing generic Verbs puzzle.",
    context: "Teachers can supply base forms and sentence context for these selected irregular past forms. The worksheet does not supply definitions, tense explanations or a complete grammar lesson.", sources: [dictionary]
  },
  {
    id: "T08-A", slug: "probability-language", title: "Probability Language", segment: "math", category: "math-word-searches", easy: false,
    words: ["OUTCOME", "EVENT", "TRIAL", "EXPERIMENT", "SAMPLE SPACE", "RANDOM", "CERTAIN", "IMPOSSIBLE", "LIKELY", "UNLIKELY", "FREQUENCY", "FAIR", "BIASED", "COMPLEMENT", "INDEPENDENT", "DEPENDENT"],
    intent: "A probability-vocabulary companion beyond arithmetic and fractions, without replacing the existing generic math canonicals.",
    context: "The list mixes formal probability labels and everyday likelihood words. A teacher must explain their meanings and distinctions in a chosen mathematical example; no numerical probability rule is stated.",
    sources: [{ title: "NIST — Probability glossary term", url: "https://www.nist.gov/glossary-term/29856", note: "Checked probability as a mathematical/statistical topic. This supports scope only, not an entry-by-entry verification of the authored bank. No definition is copied." }, dictionary]
  },
  {
    id: "T08-B", slug: "charts-and-data-language", title: "Charts and Data Language", segment: "math", category: "math-word-searches", easy: false,
    words: ["AXIS", "SCALE", "LEGEND", "LABEL", "TITLE", "CATEGORY", "INTERVAL", "FREQUENCY", "TALLY", "SURVEY", "SAMPLE", "DATA", "BAR CHART", "LINE GRAPH", "PIE CHART", "PICTOGRAPH"],
    intent: "A data-display terminology sheet distinct from shapes, operations and money vocabulary.",
    context: "Selected graph parts, chart forms and data-collection words are included. This is vocabulary for a teacher-selected example, not instructions to infer conclusions from a chart.", sources: [dictionary]
  },
  {
    id: "T09-A", slug: "weather-observation-tools", title: "Weather Observation Tools", segment: "science", category: "science-word-searches", easy: false,
    words: ["THERMOMETER", "BAROMETER", "ANEMOMETER", "HYGROMETER", "RAIN GAUGE", "WIND VANE", "RADAR", "SATELLITE", "WEATHER BALLOON", "RADIOSONDE", "OBSERVATION", "TEMPERATURE", "PRESSURE", "HUMIDITY", "WIND SPEED", "RAINFALL"],
    intent: "An observing-tools-and-measurements bank rather than another general Weather word search.",
    context: "The bank distinguishes instruments from quantities or observations. It supplies no operating instructions or claim that a tool alone predicts weather.",
    sources: [{ title: "NOAA — Weather observations", url: "https://www.noaa.gov/education/resource-collections/weather-atmosphere/weather-observations", note: "Checked thermometer, rain gauge, barometer and anemometer terminology in NOAA's instrument overview. Remaining labels and classroom context need human review; no lesson or measurement instructions are copied." }, dictionary]
  },
  {
    id: "T09-B", slug: "cell-structure-vocabulary", title: "Cell Structure Vocabulary", segment: "science", category: "science-word-searches", easy: false,
    words: ["ORGANELLE", "NUCLEUS", "NUCLEOLUS", "CYTOPLASM", "MEMBRANE", "RIBOSOME", "MITOCHONDRION", "CHLOROPLAST", "VACUOLE", "CELL WALL", "VESICLE", "LYSOSOME", "CYTOSKELETON", "CENTRIOLE", "CHROMATIN", "GOLGI APPARATUS"],
    intent: "A focused cell-structure bank beyond the published broad Biology puzzle and separate from the root workspace's Genetics candidate.",
    context: "The list includes structures from different cell types. It does not claim every cell has every structure, and it provides no biological or medical outcome advice.",
    sources: [{ title: "NHGRI — Organelle", url: "https://www.genome.gov/genetics-glossary/Organelle", note: "Checked organelle scope and selected names including nuclei, mitochondria and ribosomes. The full plant/animal cell selection needs human biology review; no glossary definition or diagram is reused." }, dictionary]
  },
  {
    id: "T10-A", slug: "primary-source-investigation", title: "Primary Source Investigation", segment: "history", category: "history-word-searches", easy: false,
    words: ["OBSERVE", "REFLECT", "QUESTION", "EVIDENCE", "CONTEXT", "AUTHOR", "AUDIENCE", "PURPOSE", "DATE", "ARCHIVE", "DIARY", "LETTER", "PHOTOGRAPH", "MANUSCRIPT", "ORAL HISTORY", "ARTIFACT"],
    intent: "Vocabulary for investigating historical sources, differentiated from a period, famous-person or invented historical-facts puzzle.",
    context: "Teachers choose suitable sources and explain why evidence and context matter. The puzzle supplies no historical document, quotation or automatic inference about reliability.",
    sources: [{ title: "Library of Congress — Teacher's Guides and Analysis Tool", url: "https://www.loc.gov/programs/teachers/getting-started-with-primary-sources/guides/", note: "Checked observe/reflect/question as analysis language and the availability of source-type guides. No instructional questions, worksheets or images are reproduced." }, dictionary]
  },
  {
    id: "T11-A", slug: "cooking-action-words", title: "Cooking Action Words", segment: "food-and-drink", category: "food-and-drink-word-searches", easy: true,
    words: ["STIR", "MIX", "POUR", "PEEL", "SLICE", "CHOP", "DICE", "MASH", "BEAT", "KNEAD", "ROLL", "BAKE"],
    intent: "A short cooking-verb bank for English-language activity vocabulary, not a second kitchen-tools or baking-ingredients grid.",
    context: "These are vocabulary labels, not cooking, knife-handling or food-safety instructions. Teachers choose examples suitable for their learners; no ESL proficiency level is certified.", sources: [dictionary]
  },
  {
    id: "T11-B", slug: "public-transit-journey", title: "Public Transit Journey", segment: "travel", category: "travel-word-searches", easy: true,
    words: ["STOP", "ROUTE", "FARE", "PASS", "TICKET", "BUS", "TRAIN", "TRAM", "METRO", "PLATFORM", "TRANSFER", "MAP"],
    intent: "Short public-transit journey vocabulary beyond the existing airport and holiday-travel lists.",
    context: "Transit terminology varies by region. This selection is not a promise that each service exists locally, and it provides no transport-fare or journey advice.", sources: [dictionary]
  },
  {
    id: "T11-C", slug: "classroom-direction-words", title: "Classroom Direction Words", segment: "classroom-values", category: "classroom-and-values-word-searches", easy: true,
    words: ["CIRCLE", "TICK", "CROSS", "MATCH", "SORT", "LABEL", "COPY", "POINT", "CHOOSE", "DRAW", "READ", "WRITE"],
    intent: "Task-direction verbs for teacher-led English-language worksheets rather than classroom object names or first-week routines.",
    context: "Teachers can show what each direction means in their own worksheet. TICK uses a common check-mark instruction; regional wording and intended audience require review.", sources: [dictionary]
  }
];

export const teacherSubjectCandidates: StagedPuzzleCandidate[] = briefs.map((brief) => ({
  id: brief.id, proposedPath: `/word-searches/${brief.segment}/${brief.slug}-word-search`, title: `${brief.title} Word Search`,
  intent: brief.intent, status: "drafted", sourceReferences: brief.sources,
  puzzle: { puzzleTitle: `${brief.title} Word Search`, words: brief.words, seed: `staged-${brief.id.toLowerCase()}-v1`, rows: brief.easy ? 14 : 18, columns: brief.easy ? 14 : 18, directions: brief.easy ? ["E", "S"] : ["E", "S", "SE", "NE"], allowOverlap: true, alphabetPack: "latin", difficulty: brief.easy ? "easy" : "medium", answerKeyAvailable: true, onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: false },
  editorial: { puzzleNote: brief.intent, wordListContext: brief.context, difficultyExplanation: brief.easy ? "Twelve entries, a 14×14 grid and forward E/S placements. No age or reading-level certification." : "Sixteen entries, an 18×18 grid and E/S/SE/NE placements. Difficulty describes configuration, not solve time or subject mastery.", classroomNote: "Unreviewed teacher-selected vocabulary; no automatic grade assignment, assessment or curriculum claim.", printNote: "Letter/A4 technical layout checks require later physical-sheet and human editorial review." },
  taxonomy: { primaryCategory: brief.category, secondaryCategories: ["classroom-vocabulary"], audience: ["general"], format: ["printable", "pdf", "answer-key", "online-play"], educationalSubject: brief.segment }
}));
