import { describe, expect, test } from "vitest";
import { categorySchema, sitePageSchema, topicSchema } from "@/content/schema";
import { categories } from "@/content/categories";
import { corePages } from "@/content/routes";
import { topics } from "@/content/topics";

describe("content schema migration contract", () => {
  test("preserves required fields, string minima and nested-array validation", () => {
    for (const [schema, source, fields] of [
      [topicSchema, topics[0], ["slug", "title", "description", "words", "bestFor", "notes"]],
      [categorySchema, categories[0], ["slug", "title", "description", "accent", "notes", "related"]],
      [sitePageSchema, corePages[0], ["slug", "title", "h1", "description", "intro", "presetWords", "difficulty", "modules"]]
    ] as const) {
      expect(schema.safeParse(source).success).toBe(true);
      for (const field of fields) {
        const missing = { ...source } as Record<string, unknown>;
        delete missing[field];
        expect(schema.safeParse(missing).success, `missing ${field}`).toBe(false);
        expect(schema.safeParse({ ...source, [field]: 42 }).success, `numeric ${field}`).toBe(false);
      }
      expect(schema.safeParse({ ...source, title: "four" }).success).toBe(false);
      expect(schema.safeParse({ ...source, title: "12345" }).success).toBe(true);
      expect(schema.safeParse({ ...source, description: "x".repeat(39) }).success).toBe(false);
      expect(schema.safeParse({ ...source, description: "x".repeat(40) }).success).toBe(true);
    }
    expect(topicSchema.safeParse({ ...topics[0], words: ["a", "b", "c", "d", "e"] }).success).toBe(false);
    expect(topicSchema.safeParse({ ...topics[0], words: ["a", "b", "c", "d", "e", "f"] }).success).toBe(true);
    expect(topicSchema.safeParse({ ...topics[0], words: ["a", "b", "c", "d", "e", ""] }).success).toBe(false);
    expect(categorySchema.safeParse({ ...categories[0], related: [] }).success).toBe(false);
    expect(sitePageSchema.safeParse({ ...corePages[0], difficulty: "expert" }).success).toBe(false);
  });

  test("preserves unknown-key stripping and optional fields without mutating source records", () => {
    const source = { ...corePages[0], alphabetPack: undefined, migrationOnly: "discard" };
    const parsed = sitePageSchema.parse(source);
    expect(parsed).not.toHaveProperty("migrationOnly");
    expect(source).toHaveProperty("migrationOnly", "discard");
    expect(sitePageSchema.safeParse({ ...source, alphabetPack: "latin" }).success).toBe(true);
    expect(sitePageSchema.safeParse({ ...source, alphabetPack: null }).success).toBe(false);
  });
});
