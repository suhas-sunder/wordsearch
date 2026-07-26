import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import { AdSlot } from "@/components/layout/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGuide, guideRedirects, guides } from "@/content/guides";
import { authors } from "@/content/model";
import { getRouteRecord } from "@/content/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [...guides.map((guide) => ({ slug: guide.slug })), ...Object.keys(guideRedirects).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (guideRedirects[slug]) permanentRedirect(`/guides/${guideRedirects[slug]}`);
  const guide = getGuide(slug);
  if (!guide) return {};
  const record = getRouteRecord(`/guides/${guide.slug}`);
  return pageMetadata(
    record?.metadata.title ?? guide.title,
    record?.metadata.description ?? guide.description,
    `/guides/${guide.slug}`,
    { indexable: record?.indexable ?? false }
  );
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  if (guideRedirects[slug]) permanentRedirect(`/guides/${guideRedirects[slug]}`);
  const guide = getGuide(slug);
  if (!guide) notFound();
  const path = `/guides/${guide.slug}`;
  const record = getRouteRecord(path);
  const author = authors.find((item) => item.id === guide.authorId);
  const relatedGuides = (guide.relatedGuides ?? [])
    .map((relatedSlug) => guides.find((item) => item.slug === relatedSlug))
    .filter((item) => item?.publicationStatus === "published");
  const breadcrumbs = [{ label: "Guides", href: "/guides" }, { label: guide.title }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      {record?.indexable && author && guide.reviewedOn ? (
        <JsonLd data={articleJsonLd({
          headline: guide.title,
          description: guide.description,
          path,
          authorName: author.name,
          authorPath: author.profilePath,
          dateModified: guide.reviewedOn
        })} />
      ) : null}
      <main>
        <AdSlot placement="top-banner" template="guide" />
        <Breadcrumbs items={breadcrumbs} />
        <article>
          <header className="hub-hero site-shell">
            <div>
              <span className="eyebrow">Word search guide</span>
              <h1>{guide.title}</h1>
              <p className="value-prop">{guide.introduction ?? guide.description}</p>
              {author && guide.reviewedOn ? (
                <p className="guide-attribution">
                  Written by <Link href={author.profilePath}>{author.name}</Link>
                  {" · "}Reviewed on <time dateTime={guide.reviewedOn}>{guide.reviewedOn}</time>
                </p>
              ) : null}
            </div>
            <aside className="intent-panel">
              <strong>Related standards</strong>
              <p><Link href="/editorial-policy">Editorial Policy</Link></p>
              <p><Link href="/how-word-searches-are-made">Methodology</Link></p>
            </aside>
          </header>

          <section className="content-section site-shell guide-body">
            <ol className="steps">
              {guide.sections.map((section) => (
                <li key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-section site-shell two-col">
            <div>
              <h2>Related tools</h2>
              <div className="topic-list">
                {(guide.relatedTools ?? []).map((tool) => (
                  <Link key={tool} href={tool}>{tool.split("/").filter(Boolean).pop()?.replace(/-/g, " ")}</Link>
                ))}
              </div>
            </div>
            <AdSlot placement="seo-content-square" template="guide" />
          </section>

          <section className="content-section site-shell">
            <h2>Related guides</h2>
            <div className="topic-list">
              {relatedGuides.map((item) => <Link key={item!.slug} href={`/guides/${item!.slug}`}>{item!.title}</Link>)}
              <Link href="/guides">Browse all reviewed guides</Link>
            </div>
          </section>
        </article>

        <section className="content-section site-shell tools-section">
          <AdSlot placement="bottom-tools-banner" template="guide" />
          <div className="section-heading"><h2>All tools</h2></div>
          <div className="topic-list">
            <Link href="/word-search-generator">Word Search Generator</Link>
            <Link href="/free-printable-word-searches">Printable Word Searches</Link>
            <Link href="/online-word-search">Online Word Search</Link>
            <Link href="/word-search-pdf">Word Search PDFs</Link>
          </div>
        </section>
      </main>
    </>
  );
}
