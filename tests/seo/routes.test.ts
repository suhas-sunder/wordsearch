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
    expect(categories.filter((category) => category.publicationStatus === "published")).toHaveLength(15);
    expect(collections.filter((collection) => collection.publicationStatus === "published")).toHaveLength(13);
    expect(guides.filter((guide) => guide.publicationStatus === "published")).toHaveLength(12);
    expect(specialtyRoutes).toHaveLength(13);
    expect(topics.filter((topic) => topic.publicationStatus === "published")).toHaveLength(150);
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
