import { notFound } from "next/navigation";
import Link from "next/link";
import { CuratedPuzzlePage } from "@/components/page/CuratedPuzzlePage";
import { IndexablePage } from "@/components/page/IndexablePage";
import { categories } from "@/content/categories";
import type { PuzzleContentRecord } from "@/content/model";
import { getRouteRecord, routeInventory } from "@/content/registry";
import { getTopic, topics } from "@/content/topics";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ category: string; topicSlug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((topic) => ({ category: topic.categorySegment, topicSlug: topic.topicSlug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, topicSlug } = await params;
  const topic = getTopic(category, topicSlug);
  if (!topic) return {};
  const record = getRouteRecord(`/word-searches/${topic.slug}`);
  return pageMetadata(record?.metadata.title ?? `${topic.title} | Play Online or Print`, record?.metadata.description ?? topic.description, `/word-searches/${topic.slug}`, { indexable: record?.indexable ?? false });
}

export default async function TopicPage({ params }: Props) {
  const { category, topicSlug } = await params;
  const topic = getTopic(category, topicSlug);
  if (!topic) notFound();
  const categoryInfo = categories.find((item) => item.pathSegment === topic.categorySegment);
  const record = getRouteRecord(`/word-searches/${topic.slug}`);
  if (record?.contentType === "puzzle" && record.indexable) {
    const related = (record.relatedContentIds ?? [])
      .map((id) => routeInventory.find((item) => item.id === id))
      .filter((item): item is PuzzleContentRecord => item?.contentType === "puzzle" && item.indexable)
      .map((item) => ({ id: item.id, title: item.title, path: item.canonicalPath }));
    return (
      <CuratedPuzzlePage
        record={record}
        category={{
          id: `category-${topic.categorySlug}`,
          title: categoryInfo?.title ?? topic.categorySegment,
          path: `/categories/${topic.categorySlug}`
        }}
        related={related}
      />
    );
  }
  const related = topics.filter((item) => item.categorySegment === topic.categorySegment && item.slug !== topic.slug).slice(0, 8);

  return (
    <IndexablePage
      title={topic.title}
      h1={topic.title}
      description={topic.description}
      intro={`${topic.title} is best for ${topic.bestFor}. The word list is visible, editable, printable, and reproducible from the same seed.`}
      path={`/word-searches/${topic.slug}`}
      words={topic.words}
      difficulty="medium"
      modules={["faq"]}
      adTemplate="draft"
      breadcrumbs={[
        { label: "Topics", href: "/topics" },
        { label: categoryInfo?.title ?? topic.categorySegment, href: categoryInfo ? `/categories/${categoryInfo.slug}` : "/categories" },
        { label: topic.title }
      ]}
    >
      <section className="content-section site-shell two-col">
        <div>
          <h2>Word List</h2>
          <p>Use these words as-is or edit the builder above for easy, medium, hard, or large-print versions.</p>
          <div className="topic-list">{topic.words.map((word) => <span key={word}>{word}</span>)}</div>
        </div>
        <div>
          <h2>Best For</h2>
          <p>{topic.bestFor}. {topic.notes[0]}</p>
          <ul className="steps">
            {topic.notes.slice(1).map((note) => <li key={note}><strong>Note</strong><span>{note}</span></li>)}
          </ul>
        </div>
      </section>
      <section className="content-section site-shell">
        <div className="section-heading">
          <h2>Related Topics</h2>
        </div>
        <div className="topic-list">
          {related.map((item) => <Link key={item.slug} href={`/word-searches/${item.slug}`}>{item.title}</Link>)}
        </div>
      </section>
    </IndexablePage>
  );
}
