import type { Metadata } from "next";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [`/opengraph-image?title=${encodeURIComponent(title)}`]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export function noindexMetadata(title: string, description: string, canonical = "/word-search-generator"): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: true
    },
    alternates: {
      canonical
    }
  };
}
