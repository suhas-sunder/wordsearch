import { notFound } from "next/navigation";
import Link from "next/link";
import { IndexablePage } from "@/components/page/IndexablePage";
import { collections, getCollection } from "@/content/collections";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return pageMetadata(collection.title, collection.description, `/collections/${collection.slug}`);
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  return (
    <IndexablePage
      title={collection.title}
      h1={collection.title}
      description={collection.description}
      intro={`${collection.angle} The builder above is preloaded, but the list stays editable for real classroom, party, or home use.`}
      path={`/collections/${collection.slug}`}
      words={collection.words}
      difficulty="easy"
      modules={["faq"]}
      breadcrumbs={[{ label: "Collections", href: "/topics" }, { label: collection.title }]}
    >
      <section className="content-section site-shell">
        <div className="section-heading">
          <h2>Related Topic Pages</h2>
          <p>Use these canonical topic pages when the theme, not the collection angle, is the main intent.</p>
        </div>
        <div className="topic-list">
          {collection.relatedTopics.map((topic) => <Link key={topic} href={`/word-searches/${topic}`}>{topic.split("/").pop()?.replace(/-/g, " ")}</Link>)}
        </div>
      </section>
    </IndexablePage>
  );
}
