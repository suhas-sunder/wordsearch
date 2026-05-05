import { notFound } from "next/navigation";
import Link from "next/link";
import { IndexablePage } from "@/components/page/IndexablePage";
import { getCategoryBySlug } from "@/content/categories";
import { getTopic, topics } from "@/content/topics";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ category: string; topicSlug: string }>;
}

export function generateStaticParams() {
  return topics.map((topic) => ({ category: topic.categorySegment, topicSlug: topic.topicSlug }));
}

export async function generateMetadata({ params }: Props) {
  const { category, topicSlug } = await params;
  const topic = getTopic(category, topicSlug);
  if (!topic) return {};
  return pageMetadata(topic.title, topic.description, `/word-searches/${topic.slug}`);
}

export default async function TopicPage({ params }: Props) {
  const { category, topicSlug } = await params;
  const topic = getTopic(category, topicSlug);
  if (!topic) notFound();
  const categoryInfo = getCategoryBySlug(topic.categorySegment);
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
