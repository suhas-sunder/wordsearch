import { categories } from "@/content/categories";
import { collectionRedirects, collections } from "@/content/collections";
import { guideRedirects, guides } from "@/content/guides";
import type { ContentRecord, HubContentRecord, TrustContentRecord, UtilityContentRecord } from "@/content/model";
import { corePages, supportPages } from "@/content/routes";
import { specialtyRoutes } from "@/content/specialty";
import { topicRedirects, topics } from "@/content/topics";
import { directionsByDifficulty } from "@/lib/puzzle/generate";

export const SITE_NAME = "I Love Word Search";
export const SITE_URL = "https://www.ilovewordsearch.com";

const reviewedCoreSlugs = new Set([
  "word-search-generator",
  "free-printable-word-searches",
  "online-word-search",
  "word-search-pdf",
  "large-print-word-searches",
  "word-searches-for-kids",
  "word-searches-for-adults",
  "word-searches-for-teachers",
  "word-search-worksheets",
  "easy-word-searches",
  "hard-word-searches",
  "word-search-with-answer-key",
  "word-searches-for-seniors",
  "homeschool-word-searches",
  "esl-word-searches",
  "topics",
  "categories",
  "guides"
]);

const reviewedTrustSlugs = new Set(["about", "contact", "accessibility", "privacy", "terms", "copyright"]);

function metadata(title: string, description: string, canonical: string, indexable: boolean) {
  return {
    title,
    description,
    canonical,
    openGraphTitle: title,
    openGraphDescription: description,
    noindex: !indexable,
    includeInSitemap: indexable
  };
}

const home: HubContentRecord = {
  id: "hub-home",
  slug: "home",
  canonicalPath: "/",
  contentType: "hub",
  publicationStatus: "published",
  indexable: true,
  title: "Free Printable and Online Word Search Puzzles",
  h1: "Free printable and online word search puzzles",
  introduction: "Find curated word search puzzles to print or play, or make a reproducible puzzle from your own words.",
  description: "Browse the main puzzle formats, audiences, categories, and tools available from I Love Word Search.",
  metadata: metadata("Free Printable and Online Word Search Puzzles | I Love Word Search", "Find curated word search puzzles to print, play online, download as PDFs, or customize with the free word search generator.", "/", true),
  breadcrumbs: [],
  editorialStatus: "reviewed",
  contentOwnerId: "suhas-sunder"
};

const coreRecords: ContentRecord[] = corePages.map((page) => {
  const indexable = reviewedCoreSlugs.has(page.slug);
  const type = page.slug === "word-search-generator" ? "tool" : "hub";
  const base = {
    id: `${type}-${page.slug}`,
    slug: page.slug,
    canonicalPath: `/${page.slug}`,
    contentType: type,
    publicationStatus: indexable ? "published" as const : "draft" as const,
    indexable,
    title: page.title,
    h1: page.h1,
    introduction: page.intro,
    description: page.description,
    metadata: metadata(page.title, page.description, `/${page.slug}`, indexable),
    breadcrumbs: [{ label: page.h1 }],
    editorialStatus: indexable ? "reviewed" as const : "unreviewed" as const,
    contentOwnerId: "suhas-sunder"
  };
  return type === "tool"
    ? { ...base, contentType: "tool" as const, capabilities: ["generate", "print", "PDF", "answer key", "share", "online play"] }
    : { ...base, contentType: "hub" as const };
});

const supportRecords: ContentRecord[] = supportPages.map((page) => {
  const indexable = reviewedTrustSlugs.has(page.slug);
  const contentType = page.slug === "search" ? "utility" as const : "trust" as const;
  return {
    id: `${contentType}-${page.slug}`,
    slug: page.slug,
    canonicalPath: `/${page.slug}`,
    contentType,
    publicationStatus: indexable ? "published" : "draft",
    indexable,
    title: page.title,
    h1: page.h1,
    introduction: page.intro,
    description: page.description,
    metadata: metadata(page.title, page.description, `/${page.slug}`, indexable),
    breadcrumbs: [{ label: page.h1 }],
    editorialStatus: indexable ? "reviewed" : "unreviewed",
    contentOwnerId: "suhas-sunder"
  } as ContentRecord;
});

const newTrustRecords: TrustContentRecord[] = [
  {
    id: "trust-methodology", slug: "how-word-searches-are-made", canonicalPath: "/how-word-searches-are-made", contentType: "trust", publicationStatus: "published", indexable: true,
    title: "How Our Word Searches Are Made", h1: "How Our Word Searches Are Made", introduction: "How topics, word lists, deterministic puzzles, answer keys, and output formats are prepared.", description: "The publishing workflow and quality standards used for I Love Word Search puzzles.",
    metadata: metadata("How Our Word Searches Are Made | I Love Word Search", "See how I Love Word Search selects topics, reviews word lists, generates deterministic puzzles, checks answer keys, and prepares online, printable, and PDF versions.", "/how-word-searches-are-made", true),
    breadcrumbs: [{ label: "How Our Word Searches Are Made" }], editorialStatus: "reviewed", contentOwnerId: "suhas-sunder", ownerId: "suhas-sunder"
  },
  {
    id: "trust-editorial-policy", slug: "editorial-policy", canonicalPath: "/editorial-policy", contentType: "trust", publicationStatus: "published", indexable: true,
    title: "Editorial and Puzzle Standards", h1: "Editorial and Puzzle Standards", introduction: "The standards used for topics, word lists, originality, corrections, advertising separation, and accessibility.", description: "Editorial and puzzle publishing standards for I Love Word Search.",
    metadata: metadata("Editorial and Puzzle Standards | I Love Word Search", "Review the topic, word-list, originality, corrections, advertising, and accessibility standards used by I Love Word Search.", "/editorial-policy", true),
    breadcrumbs: [{ label: "Editorial and Puzzle Standards" }], editorialStatus: "reviewed", contentOwnerId: "suhas-sunder", ownerId: "suhas-sunder"
  }
];

const categoryRecords: HubContentRecord[] = categories.map((category) => ({
  id: `category-${category.slug}`, slug: category.slug, canonicalPath: `/categories/${category.slug}`, contentType: "hub",
  publicationStatus: category.publicationStatus === "published" ? "published" : "draft",
  indexable: category.publicationStatus === "published",
  title: category.title, h1: category.title, introduction: category.introduction ?? `${category.accent}: ${category.notes.join(" ")}`, description: category.description,
  metadata: metadata(category.metaTitle ?? `${category.title} | Free Printable Puzzles`, category.metaDescription ?? category.description, `/categories/${category.slug}`, category.publicationStatus === "published"),
  breadcrumbs: [{ label: "Categories", href: "/categories" }, { label: category.title }],
  editorialStatus: category.publicationStatus === "published" ? "reviewed" : "unreviewed",
  contentOwnerId: "suhas-sunder",
  relatedContentIds: category.related
    .map((slug) => categories.find((candidate) => candidate.slug === slug))
    .filter((candidate) => candidate?.publicationStatus === "published")
    .map((candidate) => `category-${candidate!.slug}`),
  childContentIds: topics.filter((topic) => topic.categorySegment === category.pathSegment && topic.publicationStatus === "published").map((topic) => `puzzle-${topic.categorySegment}-${topic.topicSlug}`)
}));

const topicRecords: ContentRecord[] = topics.map((topic) => ({
  id: `puzzle-${topic.categorySegment}-${topic.topicSlug}`,
  slug: topic.slug,
  canonicalPath: `/word-searches/${topic.slug}`,
  contentType: "puzzle" as const,
  publicationStatus: topic.publicationStatus === "published" ? "published" as const : "draft" as const,
  indexable: topic.publicationStatus === "published",
  title: topic.title,
  h1: topic.title,
  introduction: topic.introduction ?? `${topic.title} is intended for ${topic.bestFor}.`,
  description: topic.context ?? topic.description,
  metadata: {
    ...metadata(topic.metaTitle ?? `${topic.title} | Play Online or Print`, topic.metaDescription ?? topic.description, `/word-searches/${topic.slug}`, topic.publicationStatus === "published"),
    ...(topic.reviewedOn ? { lastModified: topic.reviewedOn } : {})
  },
  breadcrumbs: [
    { label: "Categories", href: "/categories" },
    { label: categories.find((category) => category.pathSegment === topic.categorySegment)?.title ?? topic.categorySegment, href: `/categories/${topic.categorySlug}` },
    { label: topic.title }
  ],
  editorialStatus: topic.publicationStatus === "published" ? "reviewed" as const : "unreviewed" as const,
  lastReviewed: topic.reviewedOn,
  relatedContentIds: topic.relatedSlugs?.map((slug) => `puzzle-${slug.replace("/", "-")}`),
  puzzle: {
    puzzleTitle: topic.title,
    words: topic.words,
    seed: topic.seed ?? `ilws-word-searches-${topic.slug.replace(/[^a-z0-9]+/gi, "-")}`,
    rows: topic.rows,
    columns: topic.columns,
    directions: topic.difficulty === "easy"
      ? ["E", "S", "SE"]
      : topic.publicationStatus === "published"
        ? directionsByDifficulty.hard
        : directionsByDifficulty.medium,
    allowOverlap: true,
    alphabetPack: "latin" as const,
    difficulty: topic.difficulty ?? "medium" as const,
    answerKeyAvailable: true,
    onlinePlayAvailable: true,
    printableAvailable: true,
    pdfAvailable: true,
    largePrintSuitable: true
  },
  taxonomy: {
    primaryCategory: topic.categorySlug,
    audience: topic.audience ?? [topic.bestFor],
    format: ["online", "print", "PDF", "answer key", "share", "QR", "large print"],
    season: topic.categorySegment === "holidays" ? topic.topicSlug.replace("-word-search", "") : undefined,
    relatedTerms: topic.words
  },
  editorial: {
    puzzleNote: topic.context ?? topic.notes[0],
    difficultyExplanation: topic.difficultyNote,
    suggestedUses: topic.audience ?? [topic.bestFor],
    printNote: topic.printNote ?? topic.notes[2],
    wordListContext: topic.context ?? topic.notes[0]
  }
}));

const collectionRecords: HubContentRecord[] = collections.map((collection) => ({
  id: `collection-${collection.slug}`, slug: collection.slug, canonicalPath: `/collections/${collection.slug}`, contentType: "collection",
  publicationStatus: collection.publicationStatus === "published" ? "published" : "draft",
  indexable: collection.publicationStatus === "published",
  title: collection.title, h1: collection.title, introduction: collection.angle, description: collection.description,
  metadata: {
    ...metadata(collection.metaTitle ?? collection.title, collection.metaDescription ?? collection.description, `/collections/${collection.slug}`, collection.publicationStatus === "published"),
    ...(collection.reviewedOn ? { lastModified: collection.reviewedOn } : {})
  },
  breadcrumbs: [{ label: "Home", href: "/" }, { label: collection.title }],
  editorialStatus: collection.publicationStatus === "published" ? "reviewed" : "unreviewed",
  lastReviewed: collection.reviewedOn,
  selectionGuidance: collection.selectionGuidance,
  childContentIds: collection.relatedTopics.map((slug) => { const topic = topics.find((item) => item.slug === slug); return topic ? `puzzle-${topic.categorySegment}-${topic.topicSlug}` : `missing-topic-${slug}`; }),
  relatedContentIds: collection.relatedCollections?.map((slug) => `collection-${slug}`)
}));

const guideRecords: ContentRecord[] = guides.map((guide) => ({
  id: `guide-${guide.slug}`, slug: guide.slug, canonicalPath: `/guides/${guide.slug}`, contentType: "guide" as const,
  publicationStatus: guide.publicationStatus === "published" ? "published" as const : "draft" as const,
  indexable: guide.publicationStatus === "published",
  title: guide.title, h1: guide.title, introduction: guide.introduction ?? guide.description, description: guide.description,
  metadata: {
    ...metadata(guide.metaTitle ?? guide.title, guide.metaDescription ?? guide.description, `/guides/${guide.slug}`, guide.publicationStatus === "published"),
    ...(guide.reviewedOn ? { lastModified: guide.reviewedOn } : {})
  },
  breadcrumbs: [{ label: "Guides", href: "/guides" }, { label: guide.title }],
  editorialStatus: guide.publicationStatus === "published" ? "reviewed" as const : "unreviewed" as const,
  lastReviewed: guide.reviewedOn,
  authorId: guide.authorId,
  dateModified: guide.reviewedOn,
  relatedContentIds: guide.relatedGuides?.map((slug) => `guide-${slug}`),
  sections: guide.sections
}));

const specialtyRecords: ContentRecord[] = specialtyRoutes.map((route) => ({
  id: `tool-specialty-${route.slug}`, slug: route.slug, canonicalPath: `/specialty/${route.slug}`, contentType: "tool" as const, publicationStatus: "draft" as const, indexable: false,
  title: route.title, h1: route.title, introduction: route.status, description: route.description, metadata: metadata(route.title, route.description, `/specialty/${route.slug}`, false),
  breadcrumbs: [{ label: "Specialty", href: "/specialty-word-search-generators" }, { label: route.title }], editorialStatus: "unreviewed" as const, capabilities: ["specialty alphabet-pack puzzle generation"]
}));

const redirectDefinitions = [
  ...Object.entries(topicRedirects).map(([source, target]) => ({ source: `/word-searches/${source}`, target: `/word-searches/${target}` })),
  ...Object.entries(collectionRedirects).map(([source, target]) => ({ source: `/collections/${source}`, target: `/collections/${target}` })),
  ...Object.entries(guideRedirects).map(([source, target]) => ({ source: `/guides/${source}`, target: `/guides/${target}` }))
];

const redirectRecords: UtilityContentRecord[] = redirectDefinitions.map(({ source, target }) => {
  const canonicalPath = source;
  return {
    id: `redirect-${source.replace(/^\/|\/$/g, "").replaceAll("/", "-")}`,
    slug: source.replace(/^\/|\/$/g, ""),
    canonicalPath,
    contentType: "utility",
    publicationStatus: "redirect",
    indexable: false,
    redirectTarget: target,
    title: `Redirect for ${source}`,
    h1: `Redirect for ${source}`,
    introduction: "This former draft route redirects to the reviewed canonical puzzle.",
    description: "Canonical consolidation redirect.",
    metadata: metadata(`Redirect for ${source}`, "Canonical consolidation redirect.", canonicalPath, false),
    breadcrumbs: [],
    editorialStatus: "reviewed"
  };
});

export const routeInventory: ContentRecord[] = [home, ...coreRecords, ...supportRecords, ...newTrustRecords, ...categoryRecords, ...topicRecords, ...collectionRecords, ...guideRecords, ...specialtyRecords, ...redirectRecords];

export const utilityRoutePatterns = ["/search?q=", "/play/[id]", "/print/[id]", "/pdf/[id]", "/answer-key/[id]", "/embed/[id]", "/custom/[id]", "?state=", "?print=", "?difficulty=", "?largePrint="] as const;

export function getRouteRecord(path: string) {
  return routeInventory.find((record) => record.canonicalPath === path);
}

export function getSitemapRecords() {
  return routeInventory.filter((record) => record.publicationStatus === "published" && record.indexable && record.metadata.includeInSitemap && !record.redirectTarget);
}
