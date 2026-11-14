import { SearchTools } from "@/components/page/PageSections";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BelowHeaderAd, MonetizedPageShell, SeoSectionAd } from "@/components/layout/AdSlot";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGuide, guides } from "@/content/guides";
import { authors } from "@/content/model";
import { getRouteRecord } from "@/content/registry";
import { editorialAdTemplate } from "@/lib/monetization/editorial-template";
import { pageMetadata } from "@/lib/seo/metadata";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/structured-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
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
  const guide = getGuide(slug);
  if (!guide) notFound();
  const path = `/guides/${guide.slug}`;
  const record = getRouteRecord(path);
  const adTemplate = editorialAdTemplate(record, "guide");
  const author = authors.find((item) => item.id === guide.authorId);
  const relatedGuides = (guide.relatedGuides ?? [])
    .map((relatedSlug) => guides.find((item) => item.slug === relatedSlug))
    .filter((item) => item?.publicationStatus === "published");
  const breadcrumbs = [{ label: "Guides", href: "/guides" }, { label: guide.title }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs, path)} />
      {record?.indexable && author ? (
        <JsonLd data={articleJsonLd({
          headline: guide.title,
          description: guide.description,
          path,
          authorName: author.name,
          authorPath: author.profilePath
        })} />
      ) : null}
      <MonetizedPageShell template={adTemplate}>
        <main>
          <Breadcrumbs items={breadcrumbs} />
        <article>
          <header className="hub-hero site-shell">
            <div>
              <span className="eyebrow">Word search guide</span>
              <h1>{guide.title}</h1>
              <p className="value-prop">{guide.introduction ?? guide.description}</p>
              {author ? (
                <p className="guide-attribution">
                  Written by <Link href={author.profilePath}>{author.name}</Link>
                </p>
              ) : null}
            </div>
            <aside className="intent-panel">
              <strong>Related standards</strong>
              <p><Link href="/editorial-policy">Editorial Policy</Link></p>
              <p><Link href="/how-word-searches-are-made">Methodology</Link></p>
            </aside>
          </header>

          <BelowHeaderAd template={adTemplate} />

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
            <SeoSectionAd template={adTemplate} />
          </section>

          <section className="content-section site-shell">
            <h2>Related guides</h2>
            <div className="topic-list">
              {relatedGuides.map((item) => <Link key={item!.slug} href={`/guides/${item!.slug}`}>{item!.title}</Link>)}
              <Link href="/guides">Browse all reviewed guides</Link>
            </div>
          </section>
        </article>

        <SearchTools />
        </main>
      </MonetizedPageShell>
    </>
  );
}
