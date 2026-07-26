import type { BreadcrumbItem } from "@/content/model";
import { SITE_NAME, SITE_URL } from "@/content/registry";

export function breadcrumbJsonLd(items: BreadcrumbItem[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: `${SITE_URL}${item.href ?? path}`
      }))
    ]
  };
}

export function websiteJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      founder: { "@id": `${SITE_URL}/about#suhas-sunder` }
    }
  ];
}

export function aboutProfileJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/about#profile-page`,
    url: `${SITE_URL}/about`,
    name: "About I Love Word Search",
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#suhas-sunder`,
      name: "Suhas Sunder",
      url: `${SITE_URL}/about`,
      jobTitle: "Software developer",
      description: `Creator and maintainer of ${SITE_NAME}`,
      sameAs: ["https://www.suhassunder.com/", "https://www.linkedin.com/in/s-sunder/"],
      owns: { "@id": `${SITE_URL}/#website` }
    }
  };
}

export function itemListJsonLd(name: string, path: string, items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: `${SITE_URL}${path}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${SITE_URL}${item.path}`
      }))
    }
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  authorName: string;
  authorPath: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    author: {
      "@type": "Person",
      name: input.authorName,
      url: `${SITE_URL}${input.authorPath}`
    },
    dateModified: input.dateModified,
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}${input.path}`
  };
}
