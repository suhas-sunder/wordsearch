import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
import { collections } from "@/content/collections";
import { guides } from "@/content/guides";
import { corePages, supportPages } from "@/content/routes";
import { specialtyRoutes } from "@/content/specialty";
import { topics } from "@/content/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.ilovewordsearch.com";
  const now = new Date();
  const paths = [
    "/",
    ...corePages.map((page) => `/${page.slug}`),
    ...supportPages.map((page) => `/${page.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`),
    ...topics.map((topic) => `/word-searches/${topic.slug}`),
    ...collections.map((collection) => `/collections/${collection.slug}`),
    ...guides.map((guide) => `/guides/${guide.slug}`),
    ...specialtyRoutes.map((route) => `/specialty/${route.slug}`)
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.includes("/word-searches/") ? 0.7 : 0.8
  }));
}
