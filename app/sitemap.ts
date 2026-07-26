import type { MetadataRoute } from "next";
import { getSitemapRecords, SITE_URL } from "@/content/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapRecords().map((record) => ({
    url: `${SITE_URL}${record.canonicalPath}`,
    ...(record.metadata.lastModified ? { lastModified: new Date(record.metadata.lastModified) } : {}),
    changeFrequency: record.canonicalPath === "/" ? "weekly" : "monthly",
    priority: record.canonicalPath === "/" ? 1 : record.contentType === "hub" ? 0.8 : 0.7
  }));
}
