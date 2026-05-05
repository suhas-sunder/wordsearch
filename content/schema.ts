import { z } from "zod";

export const topicSchema = z.object({
  slug: z.string().min(3),
  topicSlug: z.string().min(3),
  categorySegment: z.string().min(3),
  categorySlug: z.string().min(3),
  title: z.string().min(5),
  description: z.string().min(40),
  words: z.array(z.string().min(1)).min(6),
  bestFor: z.string().min(8),
  notes: z.array(z.string().min(10)).min(2)
});

export const categorySchema = z.object({
  slug: z.string().min(3),
  pathSegment: z.string().min(3),
  title: z.string().min(5),
  description: z.string().min(40),
  accent: z.string().min(3),
  notes: z.array(z.string().min(10)).min(1),
  related: z.array(z.string()).min(1)
});

export const sitePageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(5),
  h1: z.string().min(3),
  description: z.string().min(40),
  intro: z.string().min(40),
  presetWords: z.array(z.string().min(1)).min(5),
  difficulty: z.enum(["easy", "medium", "hard"]),
  alphabetPack: z.string().optional(),
  modules: z.array(z.string())
});
