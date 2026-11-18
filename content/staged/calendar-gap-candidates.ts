import type { StagedPuzzleCandidate } from "@/content/staged/model";

export const calendarGapStatus = { publicationStatus: "draft", editorialStatus: "unreviewed", runtimeImportAllowed: false, humanEditorialApprovalRequired: true } as const;
const dictionary = { title: "Merriam-Webster — human terminology reference", url: "https://www.merriam-webster.com/", note: "Available for remaining human spelling and usage checks, not proof every authored entry was independently dictionary-verified. No definitions or source prose are copied." };
interface Brief { slot: number; slug: string; title: string; segment: string; category: string; level: "easy" | "medium" | "hard"; words: string[]; intent: string; context: string; sources: StagedPuzzleCandidate["sourceReferences"] }

const briefs: Brief[] = [
  {
    slot: 9, slug: "selected-world-rivers", title: "Selected World Rivers", segment: "geography", category: "geography-word-searches", level: "hard",
    words: ["NILE", "AMAZON", "YANGTZE", "MISSISSIPPI", "YENISEI", "YELLOW RIVER", "OB", "PARANA", "CONGO", "AMUR", "LENA", "MEKONG", "MACKENZIE", "NIGER", "VOLGA", "DANUBE", "INDUS", "GANGES", "ZAMBEZI", "ORINOCO"],
    intent: "A selected proper-name river challenge rather than repeating the published Rivers landform and activity vocabulary.",
    context: "Names span several regions. This is not a longest-river ranking, boundary statement or exhaustive river inventory; English spellings and alternative names require human geographic review.",
    sources: [{ title: "Environment and Climate Change Canada — Rivers", url: "https://www.canada.ca/en/environment-climate-change/services/water-overview/sources/rivers.html", note: "Checked the world-river comparison topic and selected names including Amazon, Nile and Yangtze. No discharge, length or ranking figures are reused; the entire selection still requires human name review." }, { title: "NASA ARSET — River Basin training slides", url: "https://disasters.nasa.gov/sites/default/files/RiverBasin_WB_Session1.pdf", note: "Checked selected names in the river-basin reference list, including Amur, Danube, Ganges, Indus, Lena, Mackenzie, Mekong, Mississippi, Niger, Ob, Orinoco, Parana, Volga and Zambezi. No slide graphics or explanatory prose are reused." }]
  },
  {
    slot: 11, slug: "food-web-relationships", title: "Food Web Relationships", segment: "science", category: "science-word-searches", level: "medium",
    words: ["PRODUCER", "CONSUMER", "DECOMPOSER", "PREDATOR", "PREY", "HERBIVORE", "CARNIVORE", "OMNIVORE", "FOOD CHAIN", "FOOD WEB", "ENERGY TRANSFER", "NUTRIENT CYCLE", "POPULATION", "COMMUNITY", "ECOSYSTEM", "TROPHIC LEVEL"],
    intent: "A food-web relationship terminology worksheet, distinct from a generic habitat/species-name list or the existing Ecosystems draft.",
    context: "The bank mixes organism roles and relationship/process terms. Teachers must explain the distinctions; the worksheet supplies no invented food-chain example or universal species diet.",
    sources: [{ title: "U.S. EPA — Food Chains and Food Webs", url: "https://www.epa.gov/sites/default/files/documents/foodchainsandfoodwebs.pdf", note: "Checked producer/consumer/decomposer and food-chain/web topic coverage. No worksheet directions, definitions or source lists are copied. Human review of all terms and classroom framing remains required." }, dictionary]
  },
  {
    slot: 14, slug: "seed-and-seedling-vocabulary", title: "Seed and Seedling Vocabulary", segment: "nature-and-weather", category: "nature-and-weather-word-searches", level: "medium",
    words: ["SEED COAT", "EMBRYO", "COTYLEDON", "RADICLE", "PLUMULE", "ENDOSPERM", "GERMINATION", "IMBIBITION", "DORMANCY", "SEEDLING", "ROOT", "SHOOT", "TRUE LEAF", "HYPOCOTYL", "EPICOTYL", "ROOT HAIR"],
    intent: "A seed and early-growth terminology candidate beyond the published broad Plants, Flowers and Garden banks.",
    context: "Terms describe structures and processes that vary among plants. The bank does not claim one universal sequence or provide planting instructions or educational-outcome promises.",
    sources: [{ title: "University of Minnesota — The Science of Plants", url: "https://open.lib.umn.edu/horticulture/", note: "Checked the textbook's seed-germination coverage and its distinction between germination patterns. No prose, diagrams or activities are copied. Full botanical terminology and audience review remain open." }, dictionary]
  },
  {
    slot: 15, slug: "selected-world-deserts", title: "Selected World Deserts", segment: "geography", category: "geography-word-searches", level: "hard",
    words: ["SAHARA", "GOBI", "KALAHARI", "NAMIB", "ATACAMA", "MOJAVE", "SONORAN", "CHIHUAHUAN", "THAR", "TAKLAMAKAN", "KARAKUM", "KYZYLKUM", "DASHT E KAVIR", "DASHT E LUT", "NEGEV", "GREAT VICTORIA", "GREAT SANDY", "SIMPSON", "GIBSON", "PATAGONIAN"],
    intent: "A selected desert-name challenge, distinct from general Landforms, Continents and Desert Animals vocabulary.",
    context: "English labels and transliterations are used for a selected name bank. It is not a size ranking or claim that deserts are all hot, and each geographic label needs human source review.",
    sources: [{ title: "U.S. Geological Survey — Types of Deserts", url: "https://pubs.usgs.gov/gip/deserts/types/", note: "Checked desert-category context and selected geographic examples. No source size/temperature claims, rankings, images or paragraphs are reused. The full name bank and transliterations remain subject to human review." }, dictionary]
  },
  {
    slot: 22, slug: "context-clue-language", title: "Context Clue Language", segment: "language-arts", category: "language-arts-word-searches", level: "medium",
    words: ["CONTEXT", "CLUE", "DEFINITION", "EXAMPLE", "CONTRAST", "SYNONYM", "ANTONYM", "INFERENCE", "EXPLANATION", "RESTATEMENT", "APPOSITIVE", "COMPARISON", "SIGNAL WORD", "PHRASE", "SENTENCE", "PARAGRAPH"],
    intent: "A contextual-reading strategy terminology worksheet rather than another list of synonyms or antonyms.",
    context: "The bank names kinds of clues and textual units. It gives no copied definitions or sample passages and requires a teacher to supply and explain suitable examples.", sources: [dictionary]
  },
  {
    slot: 29, slug: "deep-sea-animal-groups", title: "Deep Sea Animal Groups", segment: "animals", category: "animals-word-searches", level: "hard",
    words: ["ANGLERFISH", "VAMPIRE SQUID", "DUMBO OCTOPUS", "GULPER EEL", "FANGTOOTH", "VIPERFISH", "GIANT ISOPOD", "TUBE WORM", "SEA PIG", "SNAILFISH", "TRIPOD FISH", "BARRELEYE", "GLASS SPONGE", "BASKET STAR", "BRITTLE STAR", "SEA PEN", "COMB JELLY", "SIPHONOPHORE", "BRISTLEMOUTH", "HATCHETFISH"],
    intent: "A selected deep-sea animal-group vocabulary challenge, differentiated from the generic Ocean Animals puzzle.",
    context: "These common labels are not a single taxonomic rank; some groups also include shallow-water species. No depth range, universal habitat or fictional creature claim is made.",
    sources: [{ title: "NOAA National Marine Sanctuaries — Deep-Sea Ecosystems", url: "https://sanctuaries.noaa.gov/visit/ecosystems/deep-sea.html", note: "Checked topical examples including dumbo octopus, brittle stars and sponges. No images or explanatory prose are reused; all common labels still require human zoological review." }, { title: "National Oceanography Centre — Deep-Sea Creatures", url: "https://www.noc.ac.uk/discover-the-ocean/life-in-the-ocean/deep-sea-creatures", note: "Checked selected deep-sea examples including anglerfish and dumbo octopus. No behavior statements or source prose are copied." }]
  },
  {
    slot: 33, slug: "short-i-cvc-families", title: "Short I CVC Families", segment: "language-arts", category: "language-arts-word-searches", level: "easy",
    words: ["BIG", "DIG", "FIG", "JIG", "PIG", "RIG", "BIN", "FIN", "PIN", "TIN", "KID", "LID"],
    intent: "A selected short-I spelling-family comparison, separate from the AKE long-vowel sheet and the broader existing CVC draft.",
    context: "The list groups IG, IN and ID endings. Teachers explain sounds and examples and assess learner suitability; no reading level, age bracket or phonics outcome is certified.", sources: [dictionary]
  },
  {
    slot: 36, slug: "electric-circuit-vocabulary", title: "Electric Circuit Vocabulary", segment: "science", category: "science-word-searches", level: "medium",
    words: ["BATTERY", "CELL", "WIRE", "BULB", "SWITCH", "RESISTOR", "CONDUCTOR", "INSULATOR", "TERMINAL", "CONTACT", "SERIES", "PARALLEL", "OPEN CIRCUIT", "CLOSED CIRCUIT", "VOLTMETER", "AMMETER"],
    intent: "Selected circuit vocabulary with seven answer words shared by the published Electricity bank. A separate page needs a human merge-or-differentiate decision rather than assuming narrower terminology establishes new intent.",
    context: "The bank mixes physical components, materials, instruments and circuit arrangements. Seven of sixteen entries also occur in the published Electricity bank, so review reuse before proposing another URL. It provides no wiring, battery-handling or electrical-safety instructions.", sources: [dictionary]
  },
  {
    slot: 40, slug: "canadian-autumn-wildlife-selection", title: "Canadian Autumn Wildlife Selection", segment: "animals", category: "animals-word-searches", level: "hard",
    words: ["ELK", "MOOSE", "MULE DEER", "WHITE TAILED DEER", "BLACK BEAR", "GRIZZLY BEAR", "BEAVER", "RED SQUIRREL", "GRAY SQUIRREL", "CHIPMUNK", "WOOD FROG", "GARTER SNAKE", "CANADA GOOSE", "SNOW GOOSE", "SANDHILL CRANE", "MONARCH", "COMMON LOON", "ARCTIC TERN", "SNOWSHOE HARE", "PTARMIGAN"],
    intent: "A selected Canadian wildlife-name activity for autumn review, distinct from winter adaptation terms and Arctic Animals. It is not a Canadian Thanksgiving variant.",
    context: "Species/group labels are drawn from different Canadian regions. They are not a local sighting checklist or a claim of one shared autumn behavior; every range and name needs human zoological review.",
    sources: [{ title: "Parks Canada — Bear family, Banff", url: "https://www.parcs.canada.ca/pn-np/ab/banff/nature/faune-wildlife/mammal/carnivores/ours-bears", note: "Checked Canadian black/grizzly bear context and seasonal denning discussion. No safety advice, behavioral generalizations or prose are reused." }, { title: "British Columbia Parks — Tatshenshini-Alsek", url: "https://bcparks.ca/explore/parkpgs/tatshens/", note: "Checked examples of regional wildlife and sandhill-crane migration. This does not independently validate the full draft name/range bank, which remains human-review work." }, dictionary]
  },
  {
    slot: 42, slug: "halloween-night-challenge", title: "Halloween Night Challenge", segment: "holidays", category: "holiday-word-searches", level: "hard",
    words: ["JACK O LANTERN", "APPARITION", "PHANTASM", "MAUSOLEUM", "CATACOMB", "SPECTER", "POLTERGEIST", "TRANSLUCENT", "MOONBEAM", "COBWEB", "TOMBSTONE", "CRYPT", "CAULDRON", "SHADOW PLAY", "MASQUERADE", "SCARECROW", "WHISPER", "MIDNIGHT", "CANDLELIGHT", "GRAVESTONE"],
    intent: "A larger all-direction Halloween vocabulary challenge with a different bank from the existing medium Halloween puzzle.",
    context: "Fictional spooky imagery and atmospheric words form a general-interest challenge; no paranormal event is asserted as fact. Human review must assess audience suitability before publication.", sources: [dictionary]
  },
  {
    slot: 43, slug: "halloween-dress-up-words", title: "Halloween Dress Up Words", segment: "holidays", category: "holiday-word-searches", level: "easy",
    words: ["BAT", "CAT", "HAT", "BAG", "MASK", "CAPE", "MOON", "STAR", "OWL", "WEB", "LEAF", "BOOT"],
    intent: "Short dress-up and decoration vocabulary with forward-only search, distinct from the harder night challenge and the published medium puzzle.",
    context: "Twelve ordinary words describe optional decorations and dressing up. The sheet has no certified age/grade or reading level and requires family/classroom audience review.", sources: [dictionary]
  },
  {
    slot: 45, slug: "historic-trade-networks", title: "Historic Trade Networks", segment: "history", category: "history-word-searches", level: "hard",
    words: ["CARAVAN", "CAMEL", "OASIS", "MERCHANT", "BAZAAR", "TEXTILE", "SILK", "SPICE", "INCENSE", "GLASSWARE", "CERAMIC", "COINAGE", "PORT", "HARBOR", "MONSOON", "PACK ANIMAL", "WAYSTATION", "TRADE ROUTE", "MARKET", "TARIFF"],
    intent: "Vocabulary spanning overland and maritime historical exchange rather than another generic ancient-civilization or inventor puzzle.",
    context: "Terms span different places and periods. The bank is not a chronology, a claim of one ancient route, or proof every commodity traveled every network.",
    sources: [{ title: "UNESCO — About the Silk Roads", url: "https://www.unesco.org/en/silk-roads/about-silk-roads?hub=196704", note: "Checked the distinction between land/maritime networks and selected trade/caravan context. No historical dates, origin claims, source paragraphs or illustrations are reused. Human review of all terms and framing remains required." }, dictionary]
  },
  {
    slot: 46, slug: "harvest-dinner-preparations", title: "Harvest Dinner Preparations", segment: "food-and-drink", category: "food-and-drink-word-searches", level: "medium",
    words: ["ROASTING", "BASTING", "CARVING", "SIMMERING", "GRAVY", "STOCK", "STUFFING", "CORNBREAD", "CRANBERRY", "TURNIP", "PARSNIP", "SWEET POTATO", "GREEN BEAN", "PECAN", "PLATTER", "LADLE"],
    intent: "A focused preparation-and-serving bank for an optional U.S. Thanksgiving companion, differentiated from the general Thanksgiving and shared-table object puzzles.",
    context: "The list names selected foods, techniques and serving objects. It does not prescribe a national menu, cooking temperatures, health outcomes or food-safety practice.", sources: [dictionary]
  },
  {
    slot: 48, slug: "christmas-paper-decorations", title: "Christmas Paper Decorations", segment: "holidays", category: "holiday-word-searches", level: "medium",
    words: ["PAPER CHAIN", "PAPER STAR", "SNOWFLAKE", "CUTOUT", "TEMPLATE", "STENCIL", "CARDSTOCK", "TISSUE PAPER", "GLUE STICK", "HOLE PUNCH", "SCISSORS", "RIBBON", "CREASE", "FOLD", "LANTERN", "CONCERTINA"],
    intent: "A specific paper-decoration activity bank rather than a broad claim about Christmas customs across cultures or a duplicate gift-wrapping sheet.",
    context: "The words describe optional paper-craft objects and materials. This candidate makes no cultural-origin, universal-tradition or craft-safety claim; a customs-focused editorial release would require separate factual evidence.", sources: [dictionary]
  },
  {
    slot: 49, slug: "christmas-music-making", title: "Christmas Music Making", segment: "music", category: "music-word-searches", level: "hard",
    words: ["HANDBELL", "SLEIGH BELL", "CHIME", "CARILLON", "ORGAN", "CHOIR", "CAROL", "REFRAIN", "HARMONY", "MELODY", "CHORUS", "VERSE", "UNISON", "DESCANT", "ACCOMPANIMENT", "CHORISTER", "CONDUCTOR", "CANTATA", "NOEL", "WASSAIL"],
    intent: "A seasonal music-making terminology challenge, distinct from generic Christmas objects and the existing instrument-name bank.",
    context: "Some terms are seasonal and others are general music vocabulary. No song lyrics, branded music, religious universality or historical-origin claim is included; human music/cultural review remains necessary.", sources: [dictionary]
  }
];

export const calendarGapCandidates: StagedPuzzleCandidate[] = briefs.map((brief) => ({
  id: `Y27-${String(brief.slot).padStart(2, "0")}`, proposedPath: `/word-searches/${brief.segment}/${brief.slug}-word-search`, title: `${brief.title} Word Search`, intent: brief.intent, status: "drafted", sourceReferences: brief.sources,
  puzzle: { puzzleTitle: `${brief.title} Word Search`, words: brief.words, seed: `staged-y27-${brief.slot}-v1`, rows: brief.level === "easy" ? 14 : brief.level === "hard" ? 20 : 18, columns: brief.level === "easy" ? 14 : brief.level === "hard" ? 20 : 18, directions: brief.level === "easy" ? ["E", "S"] : brief.level === "hard" ? ["E", "W", "S", "N", "SE", "SW", "NE", "NW"] : ["E", "S", "SE", "NE"], allowOverlap: true, alphabetPack: "latin", difficulty: brief.level, answerKeyAvailable: true, onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: false },
  editorial: { puzzleNote: brief.intent, wordListContext: brief.context, difficultyExplanation: brief.level === "easy" ? "Twelve entries, a 14×14 grid and forward-only E/S placements. No age or grade certification." : brief.level === "hard" ? "Twenty entries, a 20×20 grid and all eight directions. No measured solve-time or expert claim." : "Sixteen entries, an 18×18 grid and E/S/SE/NE placements. Difficulty describes configuration rather than educational outcome.", printNote: "Letter/A4 layout and matching answers require technical and physical-sheet review; no large-print or visual-accessibility certification is claimed." },
  taxonomy: { primaryCategory: brief.category, secondaryCategories: ["editorial-review-inventory"], audience: ["general"], format: ["printable", "pdf", "answer-key", "online-play"], educationalSubject: brief.segment }
}));
