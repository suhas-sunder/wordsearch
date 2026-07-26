import { notFound } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/layout/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { categories } from "@/content/categories";
import { collections, getCollection } from "@/content/collections";
import type { PuzzleContentRecord } from "@/content/model";
import { getRouteRecord, routeInventory } from "@/content/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  const record = getRouteRecord(`/collections/${collection.slug}`);
  return pageMetadata(
    record?.metadata.title ?? collection.title,
    record?.metadata.description ?? collection.description,
    `/collections/${collection.slug}`,
    { indexable: record?.indexable ?? false }
  );
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const path = `/collections/${collection.slug}`;
  const record = getRouteRecord(path);
  const puzzles = (record?.contentType === "collection" ? record.childContentIds ?? [] : [])
    .map((id) => routeInventory.find((item) => item.id === id))
    .filter((item): item is PuzzleContentRecord => item?.contentType === "puzzle" && item.indexable);
  const relatedCollections = (collection.relatedCollections ?? [])
    .map((relatedSlug) => collections.find((item) => item.slug === relatedSlug))
    .filter((item) => item?.publicationStatus === "published");
  const relatedCategories = (collection.categorySlugs ?? [])
    .map((categorySlug) => categories.find((item) => item.slug === categorySlug))
    .filter((item) => item?.publicationStatus === "published");
  const breadcrumbs = [{ label: "Categories", href: "/categories" }, { label: collection.title }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      <JsonLd data={itemListJsonLd(collection.title, path, puzzles.map((puzzle) => ({ name: puzzle.title, path: puzzle.canonicalPath })))} />
      <main>
        <AdSlot placement="top-banner" template="collection" />
        <Breadcrumbs items={breadcrumbs} />
        <section className="hub-hero site-shell">
          <div>
            <span className="eyebrow">Reviewed collection · {puzzles.length} puzzles</span>
            <h1>{collection.title}</h1>
            <p className="value-prop">{collection.angle}</p>
            <p>{collection.description}</p>
          </div>
          <aside className="intent-panel">
            <strong>Choose and use</strong>
            <p>Open one puzzle page to play online, print, download a PDF, reveal answers, share, or make a QR link.</p>
            <Link className="primary-button" href="/word-search-generator">Create a custom puzzle</Link>
          </aside>
        </section>

        <section className="content-section site-shell">
          <div className="section-heading">
            <h2>Included word searches</h2>
            <p>The count is derived from reviewed, published records in this collection.</p>
          </div>
          <div className="link-grid">
            {puzzles.map((puzzle) => (
              <Link key={puzzle.id} href={puzzle.canonicalPath}>
                <strong>{puzzle.title}</strong>
                <span>{puzzle.description}</span>
                <small>{puzzle.puzzle.difficulty} · Online · Print · PDF · Answers</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-section site-shell two-col">
          <div>
            <h2>How to choose</h2>
            <p>{collection.selectionGuidance}</p>
          </div>
          <AdSlot placement="seo-content-square" template="collection" />
        </section>

        <section className="content-section site-shell">
          <div className="section-heading"><h2>Related collections and categories</h2></div>
          <div className="topic-list">
            {relatedCollections.map((item) => <Link key={item!.slug} href={`/collections/${item!.slug}`}>{item!.title}</Link>)}
            {relatedCategories.map((item) => <Link key={item!.slug} href={`/categories/${item!.slug}`}>{item!.title}</Link>)}
            <Link href="/word-search-generator">Word Search Generator</Link>
          </div>
        </section>

        <section className="content-section site-shell tools-section">
          <AdSlot placement="bottom-tools-banner" template="collection" />
          <div className="section-heading"><h2>All tools</h2><p>Keep the same puzzle definition across each output.</p></div>
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
