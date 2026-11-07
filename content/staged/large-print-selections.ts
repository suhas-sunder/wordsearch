import type { PuzzleDefinition } from "@/content/model";

export interface LargePrintDraftSelection {
  id: string;
  title: string;
  purpose: string;
  puzzle: PuzzleDefinition;
}

export const largePrintSelectionStatus = {
  publicationStatus: "draft", editorialStatus: "unreviewed", runtimeImportAllowed: false,
  humanEditorialApprovalRequired: true,
  createsIndexableVariants: false
} as const;

// These are short-list utility selections, not proposed new canonical pages.
// They do not modify or relabel the existing published themed puzzle grids.
const briefs = [
  { id: "L01", title: "Garden Flowers", purpose: "Short flower names for a measured larger-type utility sheet; distinct output only, no new flower SEO page.", words: ["ROSE", "LILY", "IRIS", "DAISY", "ASTER", "PANSY", "TULIP", "POPPY", "PEONY", "VIOLET", "ZINNIA", "DAHLIA"] },
  { id: "L02", title: "Baking Shelf", purpose: "Common baking objects and ingredients rather than long compound labels, for photocopy review.", words: ["FLOUR", "SUGAR", "BUTTER", "DOUGH", "YEAST", "OVEN", "BOWL", "WHISK", "SPOON", "TRAY", "APRON", "ICING"] },
  { id: "L03", title: "Birdwatching Kit", purpose: "Observation-kit words rather than a species taxonomy or a claim that all equipment is necessary.", words: ["LENS", "SCOPE", "GUIDE", "NOTES", "PENCIL", "HAT", "BOOTS", "COAT", "MAP", "FLASK", "PACK", "CAMERA"] },
  { id: "L04", title: "Travel Keepsakes", purpose: "Everyday journey-memory objects, without repeating the published Vacation definition.", words: ["PHOTO", "ALBUM", "TICKET", "MAP", "STAMP", "COIN", "CARD", "SHELL", "PIN", "PATCH", "JOURNAL", "MAGNET"] },
  { id: "L05", title: "Music at Home", purpose: "Short music-making words for a utility sheet; no promises about mood, cognition or therapy.", words: ["SONG", "TUNE", "BEAT", "NOTE", "REST", "PIANO", "FLUTE", "DRUM", "HARP", "BELL", "VOICE", "CHOIR"] },
  { id: "L06", title: "Hobby Table", purpose: "A short selection of making and puzzle hobbies for general-interest use, without age assumptions.", words: ["CHESS", "CARDS", "CRAFT", "PAINT", "SKETCH", "KNIT", "SEW", "WEAVE", "BEADS", "CLAY", "MODEL", "JIGSAW"] },
  { id: "L07", title: "Cozy Winter", purpose: "Indoor winter objects selected for short labels, not an indexed variant of the winter canonical.", words: ["QUILT", "RUG", "SOCKS", "WOOL", "MUG", "TEA", "BOOK", "LAMP", "CHAIR", "SHAWL", "SLIPPERS", "CUSHION"] },
  { id: "L08", title: "Christmas Objects", purpose: "A larger-type Christmas utility selection; separate review grid, not a changed seed for published Christmas.", words: ["STAR", "TREE", "GIFT", "BELL", "BOW", "CARD", "WREATH", "CANDLE", "RIBBON", "TINSEL", "SLEIGH", "GARLAND"] },
  { id: "L09", title: "Spring Garden", purpose: "Spring garden observations and objects rather than seasonal-history or plant-care claims.", words: ["BUD", "BLOOM", "LEAF", "STEM", "SEED", "SOIL", "RAIN", "ROOT", "PATH", "POT", "TROWEL", "SPADE"] },
  { id: "L10", title: "Beach Bag", purpose: "Short beach-item vocabulary, without implying safety equipment or supplying travel advice.", words: ["TOWEL", "HAT", "BOOK", "SAND", "SHELL", "BUCKET", "SPADE", "BALL", "KITE", "CHAIR", "SHADES", "PICNIC"] },
  { id: "L11", title: "Harvest Basket", purpose: "Autumn produce labels rather than a generalized Canadian or U.S. Thanksgiving tradition.", words: ["APPLE", "PEAR", "PLUM", "GRAPE", "CORN", "SQUASH", "PUMPKIN", "BEAN", "BEET", "CARROT", "ONION", "POTATO"] },
  { id: "L12", title: "Farmyard", purpose: "Short animal and farm-object labels for an optional family utility packet.", words: ["COW", "PIG", "HEN", "DUCK", "GOAT", "SHEEP", "HORSE", "BARN", "GATE", "HAY", "PEN", "COOP"] },
  { id: "L13", title: "Around the Home", purpose: "Everyday household-object vocabulary with short labels and no medical or developmental claims.", words: ["TABLE", "CHAIR", "SOFA", "LAMP", "CLOCK", "SHELF", "RUG", "VASE", "MIRROR", "DOOR", "CURTAIN", "DRAWER"] },
  { id: "L14", title: "Community Places", purpose: "Common place names that can be discussed in local context; not every community contains all facilities.", words: ["PARK", "SHOP", "SCHOOL", "LIBRARY", "STATION", "MARKET", "MUSEUM", "CAFE", "POOL", "HALL", "BANK", "BAKERY"] },
  { id: "L15", title: "Family Picnic", purpose: "An ordinary shared-meal activity list without assumptions about family structure or dietary advice.", words: ["BASKET", "BLANKET", "CUP", "PLATE", "SPOON", "FORK", "NAPKIN", "BREAD", "FRUIT", "FLASK", "JUICE", "SANDWICH"] },
  { id: "L16", title: "Craft Challenge", purpose: "A small-grid larger-type search with all eight directions; difficulty is described without an expert or age label.", words: ["WEAVING", "KNITTING", "QUILTING", "CROCHET", "POTTERY", "MOSAIC", "COLLAGE", "CARVING", "FOLDING", "BEADING", "STITCHING", "SKETCHING"] }
];

export const largePrintDraftSelections: LargePrintDraftSelection[] = briefs.map(({ id, title, purpose, words }) => ({
  id, title, purpose,
  puzzle: {
    puzzleTitle: `${title} Word Search`, words, seed: `staged-${id.toLowerCase()}-utility-v1`,
    rows: 12, columns: 12, directions: id === "L16" ? ["E", "W", "S", "N", "SE", "SW", "NE", "NW"] : ["E", "S"],
    difficulty: id === "L16" ? "medium" : "easy", alphabetPack: "latin", allowOverlap: true,
    answerKeyAvailable: true, onlinePlayAvailable: false, printableAvailable: true, pdfAvailable: true,
    largePrintSuitable: false
  }
}));

export const largePrintDraftPackSelections = [
  { id: "garden-kitchen-hobbies", name: "Garden Kitchen Hobbies", children: ["L01", "L02", "L03", "L04", "L05"] },
  { id: "seasonal-larger-type", name: "Seasonal Larger Type", children: ["L06", "L07", "L08", "L09", "L10"] },
  { id: "everyday-larger-type", name: "Everyday Larger Type", children: ["L11", "L12", "L13", "L14", "L15"] },
  { id: "mixed-larger-type-10", name: "Mixed Larger Type", children: ["L01", "L02", "L03", "L05", "L06", "L07", "L09", "L12", "L14", "L16"] }
] as const;
