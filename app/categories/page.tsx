import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/layout/AdSlot";
import { DiscoveryCards } from "@/components/page/DiscoveryCards";
import { CategoryGrid, TopicStrip } from "@/components/page/PageSections";
import { featuredPuzzles } from "@/content/discovery";
import { categories } from "@/content/categories";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Word Search Categories and Puzzle Topics",
  "Browse real word search categories and curated topic pages for animals, holidays, science, math, geography, reading, and more.",
  "/categories"
);

export default function CategoriesPage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Categories" }]} />
      <section className="hub-hero site-shell">
        <div><span className="eyebrow">{categories.filter((category) => category.publicationStatus === "published").length} reviewed categories</span><h1>Word Search Categories</h1><p className="value-prop">Choose a broad subject, then narrow it to an existing printable and online puzzle topic.</p></div>
        <aside className="intent-panel"><strong>Not sure where to begin?</strong><p>Search by theme, audience, season, or format.</p><Link className="primary-button" href="/search">Search the catalog</Link></aside>
      </section>
      <CategoryGrid />
      <AdSlot placement="utility-banner" template="category" />
      <section className="content-section site-shell soft-section"><div className="section-heading"><h2>Featured puzzle topics</h2><p>Start with a real curated puzzle rather than an empty filter page.</p></div><DiscoveryCards items={featuredPuzzles} /></section>
      <TopicStrip />
    </main>
  );
}
