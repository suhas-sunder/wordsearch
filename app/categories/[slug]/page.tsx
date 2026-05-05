import { notFound } from "next/navigation";
import Link from "next/link";
import { IndexablePage } from "@/components/page/IndexablePage";
import { categories, getCategoryBySlug } from "@/content/categories";
import { getTopicsForCategory } from "@/content/topics";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return pageMetadata(category.title, category.description, `/categories/${category.slug}`);
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const topics = getTopicsForCategory(category.pathSegment);
  return (
    <IndexablePage
      title={category.title}
      h1={category.title}
      description={category.description}
      intro={`${category.accent}: ${category.notes.join(" ")}`}
      path={`/categories/${category.slug}`}
      words={topics.slice(0, 10).map((topic) => topic.title.replace(" Word Search", ""))}
      modules={["faq"]}
      breadcrumbs={[{ label: "Categories", href: "/categories" }, { label: category.title }]}
    >
      <section className="content-section site-shell">
        <div className="section-heading">
          <h2>Featured {category.title}</h2>
          <p>Use one topic page per real theme. Difficulty, printable, PDF, answer key, and large-print controls live on the page.</p>
        </div>
        <div className="topic-list">
          {topics.slice(0, 24).map((topic) => (
            <Link key={topic.slug} href={`/word-searches/${topic.slug}`}>{topic.title}</Link>
          ))}
        </div>
      </section>
    </IndexablePage>
  );
}
