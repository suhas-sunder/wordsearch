import type { StagedPuzzleCandidate } from "@/content/staged/model";

/** Authored review inventory, deliberately never imported by the runtime registry. */
export const seasonalClassroomStatus = {
  publicationStatus: "draft", editorialStatus: "unreviewed",
  runtimeImportAllowed: false, humanEditorialApprovalRequired: true
} as const;

interface Brief {
  id: string;
  slug: string;
  title: string;
  season: string;
  words: string[];
  intent: string;
  context: string;
  easy?: boolean;
}

// These individually authored lists are activity vocabulary, not claims about
// religious practice, national customs, curriculum levels or learning outcomes.
const briefs: Brief[] = [
  {
    id: "X08-A", slug: "christmas-classroom-actions", title: "Christmas Classroom Actions", season: "winter", easy: true,
    words: ["CUT", "FOLD", "PASTE", "DRAW", "COLOR", "WRITE", "READ", "SING", "SHARE", "HELP", "GIVE", "MAKE"],
    intent: "An activity-verb worksheet for a Christmas classroom craft station, unlike the existing Christmas object lists. Teacher selection remains necessary for classroom context.",
    context: "Search for twelve verbs that can be used while making cards or decorations. Teachers can select an action and supply their own activity instructions. The puzzle does not prescribe a lesson or certify a reading level."
  },
  {
    id: "X14-A", slug: "calendar-and-countdown", title: "Calendar and Countdown", season: "winter",
    words: ["JANUARY", "DECEMBER", "MIDNIGHT", "SECOND", "MINUTE", "HOUR", "WEEK", "MONTH", "CALENDAR", "COUNTDOWN", "DECADE", "CENTURY", "TOMORROW", "YESTERDAY", "TODAY", "YEAR"],
    intent: "A time-and-calendar vocabulary companion for the existing New Year puzzle, rather than a second generic celebration list.",
    context: "The word bank combines time units, calendar terms and relative-day words. It does not explain calendar systems or claim that every culture observes the same new year."
  },
  {
    id: "X14-B", slug: "party-planning", title: "Party Planning", season: "year-round",
    words: ["INVITATION", "GUEST", "HOST", "VENUE", "BANNER", "CONFETTI", "STREAMER", "PLAYLIST", "SNACK", "NAPKIN", "CUP", "PLATE", "GAME", "DECORATION", "BALLOON", "RSVP"],
    intent: "An all-year event-planning vocabulary puzzle reusable in a New Year packet, separate from a holiday-specific traditions page.",
    context: "Search for invitation, hosting, decoration and table-setting vocabulary. The list is a planning theme, not event-safety or dietary advice."
  },
  {
    id: "X14-C", slug: "project-planning", title: "Project Planning", season: "year-round",
    words: ["PLANNER", "CHECKLIST", "TASK", "PROJECT", "DRAFT", "REVISE", "FINISH", "DEADLINE", "SCHEDULE", "NOTES", "FOLDER", "PAGE", "PRIORITY", "MATERIALS", "SUPPLIES", "PLAN"],
    intent: "Practical planner and project vocabulary for a new-year activity packet, separate from celebration objects and calendar units.",
    context: "The word bank names planning tools and project steps. It makes no productivity, behavior-change or wellbeing promise."
  },
  {
    id: "X14-D", slug: "celebration-cleanup", title: "Celebration Cleanup", season: "year-round", easy: true,
    words: ["CLEAR", "STACK", "WASH", "DRY", "WIPE", "SWEEP", "SORT", "FOLD", "STORE", "REUSE", "BIN", "BAG"],
    intent: "A short action-word puzzle about tidying after a celebration, distinct from the planning and countdown companions in the New Year draft pack.",
    context: "Search for everyday cleanup verbs and objects. Adults select suitable activities; the puzzle gives no cleaning-product, recycling-rule or hygiene instructions."
  },
  {
    id: "S27-VAL", slug: "valentine-card-making", title: "Valentine Card Making", season: "winter",
    words: ["CARDSTOCK", "STENCIL", "ENVELOPE", "STICKER", "DOILY", "GLITTER", "RIBBON", "MARKER", "CRAYON", "SCISSORS", "GLUE", "FOLD", "MESSAGE", "SIGNATURE", "POSTCARD", "COLLAGE"],
    intent: "A Valentine craft-materials puzzle focused on making cards, distinct from the published general Valentine, Friendship and Kindness puzzles.",
    context: "This word bank names craft supplies, card parts and making techniques. It can be reused for other card-making occasions without a new indexed format variant."
  },
  {
    id: "S27-SPR", slug: "rainy-day-games", title: "Rainy Day Games", season: "spring",
    words: ["CHARADES", "DOMINOES", "CHECKERS", "CHESS", "MARBLES", "JACKS", "BINGO", "RIDDLE", "MAZE", "JIGSAW", "PUPPET", "DICE", "CARD GAME", "WORD GAME", "MEMORY GAME", "SCAVENGER HUNT"],
    intent: "Indoor rainy-day game vocabulary for a spring packet, rather than another weather or spring-nature puzzle.",
    context: "The list mixes named games, puzzle types and play materials. No game instructions, commercial game brands or developmental benefits are claimed."
  },
  {
    id: "S27-EGG", slug: "egg-hunt-actions", title: "Egg Hunt Actions", season: "spring", easy: true,
    words: ["HIDE", "SEEK", "LOOK", "FIND", "WALK", "SEARCH", "COUNT", "SORT", "MATCH", "OPEN", "CARRY", "COLLECT"],
    intent: "An action-word companion to an optional Easter egg-hunt activity, separate from generic Easter objects or religious vocabulary.",
    context: "Twelve verbs describe an optional search-and-sort game. The vocabulary does not represent religious teaching or a tradition shared by every family. Teachers decide whether this context fits their group."
  },
  {
    id: "S27-MOM", slug: "family-card-messages", title: "Family Card Messages", season: "spring", easy: true,
    words: ["THANKS", "LOVE", "KIND", "CARE", "HELP", "SMILE", "HUG", "CHEER", "NOTE", "CARD", "WISH", "GIFT"],
    intent: "Short message vocabulary for an optional family thank-you card, usable near Mother's Day without assuming a particular family structure.",
    context: "Solvers can choose a word for a thank-you note to someone they value. This is an activity vocabulary list, not a claim about relationships, wellbeing or emotional development."
  },
  {
    id: "S27-DAD", slug: "workshop-hobbies", title: "Workshop Hobbies", season: "year-round",
    words: ["WORKBENCH", "CLAMP", "VISE", "CHISEL", "MALLET", "SANDPAPER", "SCREWDRIVER", "DRILL", "LEVEL", "RULER", "SAW", "PLIERS", "WRENCH", "HAMMER", "SCREW", "NAIL"],
    intent: "A workshop-tool hobby vocabulary puzzle usable in an optional Father's Day packet without implying tools or hobbies belong to one gender.",
    context: "The bank names common tools and workshop objects. It is vocabulary only, not instructions for using tools or a safety lesson. VISE uses the U.S. spelling of the holding tool."
  },
  {
    id: "S27-GRAD", slug: "classroom-farewell", title: "Classroom Farewell", season: "summer",
    words: ["YEARBOOK", "AUTOGRAPH", "MEMORY", "PHOTO", "ASSEMBLY", "CERTIFICATE", "FAREWELL", "CELEBRATE", "CLASSMATE", "TEACHER", "HOLIDAY", "SUMMER", "SCRAPBOOK", "REFLECTION", "MILESTONE", "APPLAUSE"],
    intent: "End-of-school activity vocabulary for a farewell packet, separate from existing classroom supplies or back-to-school content.",
    context: "Search for words associated with remembering and marking the end of a school period. Activities vary by school; this list does not prescribe a ceremony or grade level."
  },
  {
    id: "S27-CAMP", slug: "summer-camp-activities", title: "Summer Camp Activities", season: "summer",
    words: ["CANOEING", "ARCHERY", "HIKING", "ORIENTEERING", "WEAVING", "POTTERY", "SINGING", "STORYTELLING", "STARGAZING", "SKETCHING", "SWIMMING", "CRAFTS", "RELAY", "CAMPFIRE", "PICNIC", "TRAIL"],
    intent: "A selected summer-camp activity list, different from the equipment focus of the existing Camping puzzle.",
    context: "The word bank includes outdoor and craft activities that some camps offer. It is not a recommendation to attempt an activity without suitable supervision or instruction."
  },
  {
    id: "S27-SCHOOL", slug: "first-week-classroom-routines", title: "First Week Classroom Routines", season: "fall", easy: true,
    words: ["ARRIVE", "GREET", "LISTEN", "ASK", "LINE UP", "UNPACK", "READ", "WRITE", "TIDY", "RETURN", "PACK", "LEAVE"],
    intent: "A classroom-routine action list for the first week of school, separate from the existing school supplies and teamwork word banks.",
    context: "Teachers can choose relevant routine words and explain their own classroom expectations. This list is not a behavior assessment or age-specific curriculum."
  },
  {
    id: "S27-HARV", slug: "harvest-farm-equipment", title: "Harvest Farm Equipment", season: "fall",
    words: ["TRACTOR", "COMBINE", "HARVESTER", "BALER", "THRESHER", "SILO", "GRANARY", "AUGER", "WAGON", "TRAILER", "SICKLE", "SCYTHE", "PITCHFORK", "RAKE", "CRATE", "BASKET"],
    intent: "A harvest tools-and-storage vocabulary puzzle reusable in autumn packets, distinct from Thanksgiving food or history claims.",
    context: "Search for selected harvesting, transport and storage terms. Equipment varies by crop and region; this puzzle gives no operating instructions."
  },
  {
    id: "S27-HALLOW", slug: "costume-making", title: "Costume Making", season: "fall",
    words: ["FABRIC", "THREAD", "NEEDLE", "PATTERN", "SEAM", "HEM", "BUTTON", "ZIPPER", "ELASTIC", "FELT", "VELVET", "CAPE", "MASK", "HAT", "WIG", "STITCH"],
    intent: "A sewing-and-costume craft companion to Halloween, using making vocabulary instead of repeating generic spooky objects.",
    context: "The list combines sewing terms, materials and costume pieces. No protected character, brand or costume-making instructions are included."
  },
  {
    id: "S27-THANK", slug: "shared-table-preparations", title: "Shared Table Preparations", season: "fall",
    words: ["TABLECLOTH", "PLACEMAT", "NAPKIN", "CUTLERY", "PLATTER", "TUREEN", "PITCHER", "TRIVET", "COASTER", "LADLE", "SERVING SPOON", "BREAD BASKET", "CENTERPIECE", "PLACE CARD", "SIDEBOARD", "DISHWASHER"],
    intent: "A table-preparation word bank usable at either Canadian or U.S. Thanksgiving without conflating dates, national histories or traditions.",
    context: "The puzzle focuses on shared-table objects. It avoids assigning foods or customs to a whole country and can also be used for an ordinary family meal."
  }
];

export const seasonalClassroomCandidates: StagedPuzzleCandidate[] = briefs.map((brief) => ({
  id: brief.id,
  proposedPath: `/word-searches/holidays/${brief.slug}-word-search`,
  title: `${brief.title} Word Search`,
  intent: brief.intent,
  status: "drafted",
  sourceReferences: [{
    title: "Merriam-Webster Dictionary — editorial spelling reference",
    url: "https://www.merriam-webster.com/",
    note: "General reference available for the required human spelling and usage review. This citation does not claim each draft entry was independently dictionary-verified. Lists and commentary were authored for this inventory; no definitions, source prose or images are copied."
  }],
  puzzle: {
    puzzleTitle: `${brief.title} Word Search`, words: brief.words,
    seed: `staged-${brief.id.toLowerCase()}-v1`, rows: brief.easy ? 12 : 18, columns: brief.easy ? 12 : 18,
    directions: brief.easy ? ["E", "S"] : ["E", "S", "SE", "NE"], allowOverlap: true,
    alphabetPack: "latin", difficulty: brief.easy ? "easy" : "medium",
    answerKeyAvailable: true, onlinePlayAvailable: true, printableAvailable: true, pdfAvailable: true, largePrintSuitable: false
  },
  editorial: {
    puzzleNote: brief.intent,
    wordListContext: brief.context,
    difficultyExplanation: brief.easy ? "Twelve entries in a 12×12 grid, with forward horizontal and vertical placements only. No reading-level certification is claimed." : "Sixteen entries in an 18×18 grid, with forward horizontal, vertical and diagonal directions. Configuration is described without a solve-time promise.",
    classroomNote: "Teacher selection and human editorial review are required. Optional activity context is not a grade-level or learning-outcome claim.",
    printNote: "Letter/A4 technical PDF checks do not replace physical-sheet review. No large-print point-size or accessibility certification is claimed."
  },
  taxonomy: {
    primaryCategory: "holiday-word-searches", secondaryCategories: ["classroom-activities"], audience: ["general"],
    format: ["printable", "pdf", "answer-key", "online-play"], season: brief.season
  }
}));
