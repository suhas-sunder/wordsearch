import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/content/registry";

export const DEFAULT_SOCIAL_IMAGE = "/opengraph-image";

export function pageMetadata(title: string, description: string, path: string, options: { indexable?: boolean; socialImage?: string } = {}): Metadata {
  const indexable = options.indexable ?? true;
  const socialImage = options.socialImage ?? DEFAULT_SOCIAL_IMAGE;
  return {
    title: { absolute: title },
    description,
    robots: { index: indexable, follow: true },
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: SITE_NAME,
      images: socialImage ? [{ url: socialImage, width: 1200, height: 630, alt: SITE_NAME }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage ? [socialImage] : undefined
    }
  };
}

export function noindexMetadata(title: string, description: string, canonical = "/word-search-generator"): Metadata {
  return {
    title: { absolute: title },
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

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
