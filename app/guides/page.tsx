import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot } from "@/components/layout/AdSlot";
import { GuideGrid } from "@/components/page/PageSections";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Word Search Guides for Printing, Teaching, and Creating",
  "Read practical word search guides for printing, choosing difficulty, classroom use, large print, solving, and custom word lists.",
  "/guides"
);

export default function GuidesIndex() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Guides" }]} />
      <section className="hub-hero site-shell">
        <div><span className="eyebrow">{guides.filter((guide) => guide.publicationStatus === "published").length} reviewed guides</span><h1>Word Search Guides</h1><p className="value-prop">Clear guidance for making, printing, and solving word search puzzles.</p><div className="hero-actions"><Link className="primary-button" href="/guides/how-to-make-a-word-search">Start with the creation guide</Link><Link className="secondary-button" href="/word-search-generator">Open the generator</Link></div></div>
        <aside className="intent-panel"><strong>Guide topics</strong><ul><li>Printing and PDF setup</li><li>Difficulty and word lists</li><li>Classroom and homeschool use</li></ul></aside>
      </section>
      <GuideGrid />
      <AdSlot placement="utility-banner" template="guide" />
      <section className="content-section site-shell editorial-copy"><div><span className="eyebrow">How these guides help</span><h2>Practical answers without filler</h2></div><div><p>Use a guide when you need to make a choice about grid size, word difficulty, printing, large print, or classroom workflow. Use the puzzle directories when you are ready to choose a topic.</p><p>Every guide links back to real tools or puzzle pages, so reading does not lead to empty search combinations.</p></div></section>
    </main>
  );
}
