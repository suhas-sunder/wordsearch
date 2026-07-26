import { existsSync, readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import sitemap from "@/app/sitemap";
import { routeInventory, SITE_URL, utilityRoutePatterns } from "@/content/registry";
import { aboutProfileJsonLd, breadcrumbJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";

const root = process.cwd();

describe("central SEO architecture", () => {
  test("sitemap contains only unique published canonical records", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls.every((url) => url.startsWith(SITE_URL))).toBe(true);
    expect(urls).toEqual(expect.arrayContaining([`${SITE_URL}/about`, `${SITE_URL}/how-word-searches-are-made`, `${SITE_URL}/editorial-policy`, `${SITE_URL}/contact`, `${SITE_URL}/accessibility`, `${SITE_URL}/privacy`, `${SITE_URL}/terms`, `${SITE_URL}/copyright`, `${SITE_URL}/topics`]));
    for (const pattern of utilityRoutePatterns) expect(urls.some((url) => url.includes(pattern.replace("[id]", "")))).toBe(false);
    expect(urls.filter((url) => url.includes("/word-searches/"))).toHaveLength(150);
  });

  test("registry has unique metadata and canonical URLs for indexable routes", () => {
    const records = routeInventory.filter((record) => record.indexable);
    expect(new Set(records.map((record) => record.metadata.title.toLocaleLowerCase())).size).toBe(records.length);
    expect(new Set(records.map((record) => record.metadata.description.toLocaleLowerCase())).size).toBe(records.length);
    expect(new Set(records.map((record) => record.canonicalPath)).size).toBe(records.length);
    expect(records.every((record) => !record.metadata.noindex)).toBe(true);
  });

  test("homepage and profile JSON-LD are accurate and parseable", () => {
    const website = websiteJsonLd();
    expect(() => JSON.parse(JSON.stringify(website))).not.toThrow();
    expect(website[0]).toMatchObject({ "@type": "WebSite", url: `${SITE_URL}/`, name: "I Love Word Search" });
    const profile = aboutProfileJsonLd();
    expect(() => JSON.parse(JSON.stringify(profile))).not.toThrow();
    expect(profile).toMatchObject({ "@type": "ProfilePage", mainEntity: { "@type": "Person", name: "Suhas Sunder", jobTitle: "Software developer", sameAs: ["https://www.suhassunder.com/", "https://www.linkedin.com/in/s-sunder/"] } });
  });

  test("visible breadcrumb items match BreadcrumbList entries", () => {
    const visible = [{ label: "Animals", href: "/categories/animals-word-searches" }, { label: "Dogs Word Search" }];
    const data = breadcrumbJsonLd(visible, "/word-searches/animals/dogs-word-search");
    expect(data.itemListElement.map((item) => item.name)).toEqual(["Home", ...visible.map((item) => item.label)]);
  });

  test("does not emit prohibited structured-data types or fabricated publication dates", () => {
    const sourceFiles = ["app/layout.tsx", "app/about/page.tsx", "components/page/IndexablePage.tsx", "lib/seo/structured-data.ts"];
    const source = sourceFiles.map((file) => readFileSync(`${root}/${file}`, "utf8")).join("\n");
    for (const type of ["AggregateRating", '"Review"', "FAQPage", "QAPage", "HowTo", "datePublished"]) expect(source).not.toContain(type);
    expect(source).toContain("dateModified");
  });

  test("dynamic sitemap and robots files are the only sources of truth", () => {
    expect(existsSync(`${root}/public/sitemap.xml`)).toBe(false);
    expect(existsSync(`${root}/public/robots.txt`)).toBe(false);
  });
});
