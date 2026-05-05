import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/print/",
          "/pdf/",
          "/answer-key/",
          "/play/",
          "/embed/",
          "/custom/",
          "/*?difficulty=",
          "/*?largePrint=",
          "/*?seed=",
          "/*?print=",
          "/*?state="
        ]
      }
    ],
    sitemap: "https://www.ilovewordsearch.com/sitemap.xml",
    host: "https://www.ilovewordsearch.com"
  };
}
