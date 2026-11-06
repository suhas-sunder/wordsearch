import { z } from "zod";
import type { StagedPuzzleCandidate } from "@/content/staged/model";

const text = z.string().trim().min(1).max(500);
const optionalText = z.string().max(4000).optional();
const textArray = z.array(text).max(100).optional();
const source = z.object({ title: text, url: z.string().url().max(2048).refine((value) => /^https?:\/\//i.test(value)), note: text }).strict();
export const stagedCandidateSchema: z.ZodType<StagedPuzzleCandidate> = z.object({
  id: text, proposedPath: text, intent: text, title: text, status: z.literal("drafted"),
  sourceReferences: z.array(source).max(30),
  puzzle: z.object({
    puzzleTitle: text, words: z.array(z.string().trim().min(1).max(100)).min(1).max(100), seed: text,
    rows: z.number().int().min(6).max(40).optional(), columns: z.number().int().min(6).max(40).optional(),
    directions: z.array(z.enum(["E", "W", "S", "N", "SE", "SW", "NE", "NW"])).min(1).max(8),
    allowOverlap: z.boolean(), alphabetPack: z.enum(["latin", "morse", "braille", "binary", "hex", "greek", "kana", "spanish", "french", "emoji", "asl"]),
    difficulty: z.enum(["easy", "medium", "hard"]), answerKeyAvailable: z.boolean(), onlinePlayAvailable: z.boolean(), printableAvailable: z.boolean(), pdfAvailable: z.boolean(), largePrintSuitable: z.boolean()
  }).strict(),
  editorial: z.object({ puzzleNote: optionalText, difficultyExplanation: optionalText, suggestedUses: textArray, printNote: optionalText, classroomNote: optionalText, wordListContext: optionalText, faq: z.array(z.object({ question: text, answer: text }).strict()).max(30).optional() }).strict(),
  taxonomy: z.object({ primaryCategory: text, secondaryCategories: textArray, audience: textArray, ageOrGrade: textArray, format: textArray, season: optionalText, educationalSubject: optionalText, relatedTerms: textArray }).strict()
}).strict();
