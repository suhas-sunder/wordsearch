import type { AlphabetPackId, Difficulty, DirectionKey } from "@/lib/puzzle/types";

export type ContentType = "puzzle" | "hub" | "collection" | "guide" | "tool" | "trust" | "utility";
export type PublicationStatus = "draft" | "published" | "alias" | "redirect" | "invalid";
export type EditorialStatus = "unreviewed" | "in-review" | "reviewed";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SearchMetadata {
  title: string;
  description: string;
  canonical: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  noindex: boolean;
  includeInSitemap: boolean;
  lastModified?: string;
}

interface BaseContentRecord {
  id: string;
  slug: string;
  canonicalPath: string;
  contentType: ContentType;
  publicationStatus: PublicationStatus;
  indexable: boolean;
  redirectTarget?: string;
  title: string;
  h1: string;
  introduction: string;
  description: string;
  metadata: SearchMetadata;
  breadcrumbs: BreadcrumbItem[];
  relatedContentIds?: string[];
  editorialStatus: EditorialStatus;
  lastReviewed?: string;
  contentOwnerId?: string;
}

export interface PuzzleDefinition {
  puzzleTitle: string;
  words: string[];
  seed: string;
  rows?: number;
  columns?: number;
  directions: DirectionKey[];
  allowOverlap: boolean;
  alphabetPack: AlphabetPackId;
  difficulty: Difficulty;
  answerKeyAvailable: boolean;
  onlinePlayAvailable: boolean;
  printableAvailable: boolean;
  pdfAvailable: boolean;
  largePrintSuitable: boolean;
}

export interface PuzzleEditorialContent {
  puzzleNote?: string;
  difficultyExplanation?: string;
  suggestedUses?: string[];
  printNote?: string;
  classroomNote?: string;
  wordListContext?: string;
  faq?: Array<{ question: string; answer: string }>;
}

export interface PuzzleContentRecord extends BaseContentRecord {
  contentType: "puzzle";
  puzzle: PuzzleDefinition;
  taxonomy: {
    primaryCategory: string;
    secondaryCategories?: string[];
    audience?: string[];
    ageOrGrade?: string[];
    format?: string[];
    season?: string;
    educationalSubject?: string;
    relatedTerms?: string[];
  };
  editorial: PuzzleEditorialContent;
}

export interface HubContentRecord extends BaseContentRecord {
  contentType: "hub" | "collection";
  childContentIds?: string[];
  selectionGuidance?: string;
}

export interface GuideContentRecord extends BaseContentRecord {
  contentType: "guide";
  authorId?: string;
  reviewerId?: string;
  datePublished?: string;
  dateModified?: string;
  sections: Array<{ heading: string; body: string }>;
}

export interface ToolContentRecord extends BaseContentRecord {
  contentType: "tool";
  capabilities: string[];
}

export interface TrustContentRecord extends BaseContentRecord {
  contentType: "trust";
  ownerId?: string;
}

export interface UtilityContentRecord extends BaseContentRecord {
  contentType: "utility";
  routePattern?: string;
}

export type ContentRecord =
  | PuzzleContentRecord
  | HubContentRecord
  | GuideContentRecord
  | ToolContentRecord
  | TrustContentRecord
  | UtilityContentRecord;

export interface AuthorRecord {
  id: string;
  name: string;
  profilePath: string;
  role: string;
  sameAs: string[];
}

export const authors: AuthorRecord[] = [
  {
    id: "suhas-sunder",
    name: "Suhas Sunder",
    profilePath: "/about",
    role: "Software developer and creator of I Love Word Search",
    sameAs: ["https://www.suhassunder.com/", "https://www.linkedin.com/in/s-sunder/"]
  }
];
