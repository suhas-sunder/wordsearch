import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/layout/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories, getCategoryBySlug } from "@/content/categories";
import { getRouteRecord } from "@/content/registry";
import { getTopicsForCategory } from "@/content/topics";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const record = getRouteRecord(`/categories/${category.slug}`);
  return pageMetadata(
    record?.metadata.title ?? category.title,
    record?.metadata.description ?? category.description,
    `/categories/${category.slug}`,
    { indexable: record?.indexable ?? false }
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const path = `/categories/${category.slug}`;
  const topics = getTopicsForCategory(category.pathSegment).filter((topic) => topic.publicationStatus === "published");
  const related = category.related
    .map((relatedSlug) => categories.find((item) => item.slug === relatedSlug))
    .filter((item) => item?.publicationStatus === "published");
  const breadcrumbs = [{ label: "Categories", href: "/categories" }, { label: category.title }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      {topics.length ? <JsonLd data={itemListJsonLd(category.title, path, topics.map((topic) => ({ name: topic.title, path: `/word-searches/${topic.slug}` })))} /> : null}
      <main>
        <AdSlot placement="top-banner" template="category" />
        <Breadcrumbs items={breadcrumbs} />
        <section className="hub-hero site-shell">
          <div>
            <span className="eyebrow">Category · {topics.length} reviewed puzzles</span>
            <h1>{category.title}</h1>
            <p className="value-prop">{category.introduction ?? category.description}</p>
          </div>
          <aside className="intent-panel">
            <strong>Need different vocabulary?</strong>
            <p>Use your own list while keeping print, PDF, answers, play, share, and QR output aligned.</p>
            <Link className="primary-button" href="/word-search-generator">Open the generator</Link>
          </aside>
        </section>

        <section className="content-section site-shell">
          <div className="section-heading">
            <h2>All published {category.title.toLowerCase()}</h2>
            <p>Difficulty and output labels come from the reviewed puzzle records.</p>
          </div>
          <div className="link-grid">
            {topics.map((topic) => (
              <Link key={topic.slug} href={`/word-searches/${topic.slug}`}>
                <strong>{topic.title}</strong>
                <span>{topic.description}</span>
                <small>{topic.difficulty} · Online · Print · PDF · Answers</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section site-shell two-col">
          <div>
            <h2>Choosing a puzzle</h2>
            <p>{category.notes[0]} {category.notes[1]}</p>
            <p>Open a topic to see its exact word list and difficulty before printing or sharing it.</p>
          </div>
          <AdSlot placement="seo-content-square" template="category" />
        </section>

        <section className="content-section site-shell">
          <h2>Related categories</h2>
          <div className="topic-list">
            {related.map((item) => <Link key={item!.slug} href={`/categories/${item!.slug}`}>{item!.title}</Link>)}
            <Link href="/categories">All categories</Link>
            <Link href="/word-search-generator">Create a custom word search</Link>
          </div>
        </section>

        <section className="content-section site-shell tools-section">
          <AdSlot placement="bottom-tools-banner" template="category" />
          <div className="section-heading"><h2>All tools</h2></div>
          <div className="topic-list">
            <Link href="/free-printable-word-searches">Printable puzzles</Link>
            <Link href="/online-word-search">Online play</Link>
            <Link href="/word-search-pdf">PDF puzzles</Link>
            <Link href="/word-search-generator">Custom generator</Link>
          </div>
        </section>
      </main>
    </>
  );
}
