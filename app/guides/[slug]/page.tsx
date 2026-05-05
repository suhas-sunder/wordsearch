import { notFound } from "next/navigation";
import { IndexablePage } from "@/components/page/IndexablePage";
import { getGuide, guides } from "@/content/guides";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return pageMetadata(guide.title, guide.description, `/guides/${guide.slug}`);
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return (
    <IndexablePage
      title={guide.title}
      h1={guide.title}
      description={guide.description}
      intro="Use the builder first, then adjust the guide recommendations to match the people who will actually solve the puzzle."
      path={`/guides/${guide.slug}`}
      words={guide.words}
      modules={["guides", "faq"]}
      breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: guide.title }]}
    >
      <section className="content-section site-shell">
        <div className="section-heading">
          <h2>Practical Notes</h2>
        </div>
        <ol className="steps">
          {guide.sections.map((section) => (
            <li key={section.heading}><strong>{section.heading}</strong><span>{section.body}</span></li>
          ))}
        </ol>
      </section>
    </IndexablePage>
  );
}
