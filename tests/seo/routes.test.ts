import { describe, expect, test } from "vitest";
import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { corePages, supportPages } from "@/content/routes";
import { specialtyRoutes } from "@/content/specialty";
import { topics } from "@/content/topics";
import { categorySchema, sitePageSchema, topicSchema } from "@/content/schema";

describe("route and content architecture", () => {
  test("contains required route families", () => {
    expect(corePages.map((page) => page.slug)).toContain("word-search-generator");
    expect(categories).toHaveLength(16);
    expect(collections).toHaveLength(10);
    expect(guides).toHaveLength(12);
    expect(specialtyRoutes).toHaveLength(13);
    expect(topics.length).toBeGreaterThan(120);
  });

  test("validates structured content", () => {
    categories.forEach((category) => expect(categorySchema.parse(category)).toBeTruthy());
    topics.forEach((topic) => expect(topicSchema.parse(topic)).toBeTruthy());
    [...corePages, ...supportPages].forEach((page) => expect(sitePageSchema.parse(page)).toBeTruthy());
  });

  test("does not create duplicate topic URLs", () => {
    const urls = topics.map((topic) => `/word-searches/${topic.slug}`);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
