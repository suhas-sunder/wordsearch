import { notFound } from "next/navigation";
import { IndexablePage } from "@/components/page/IndexablePage";
import { hasRouteHub, RouteHub } from "@/components/page/RouteHub";
import { corePages, getSitePage, supportPages } from "@/content/routes";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const explicitRoutes = new Set(["word-search-generator", "search", "categories", "guides"]);
  return [...corePages, ...supportPages]
    .filter((page) => !explicitRoutes.has(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getSitePage(slug);
  if (!page) return {};
  return pageMetadata(page.title, page.description, `/${page.slug}`);
}

export default async function SitePage({ params }: Props) {
  const { slug } = await params;
  const page = getSitePage(slug);
  if (!page) notFound();
  if (hasRouteHub(slug)) return <RouteHub page={page} />;
  return (
    <IndexablePage
      title={page.title}
      h1={page.h1}
      description={page.description}
      intro={page.intro}
      path={`/${page.slug}`}
      words={page.presetWords}
      difficulty={page.difficulty}
      alphabetPack={page.alphabetPack}
      modules={page.modules}
      faq={page.faq}
      breadcrumbs={[{ label: page.h1 }]}
    />
  );
}
