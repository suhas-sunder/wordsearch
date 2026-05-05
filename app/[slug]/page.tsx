import { notFound } from "next/navigation";
import { IndexablePage } from "@/components/page/IndexablePage";
import { corePages, getSitePage, supportPages } from "@/content/routes";
import { decodeShareState } from "@/lib/share-state/state";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ state?: string }>;
}

export async function generateStaticParams() {
  return [...corePages, ...supportPages].map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getSitePage(slug);
  if (!page) return {};
  return pageMetadata(page.title, page.description, `/${page.slug}`);
}

export default async function SitePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const page = getSitePage(slug);
  if (!page) notFound();
  const state = slug === "word-search-generator" ? decodeShareState(query.state) : null;
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
      requestOverride={state}
      breadcrumbs={[{ label: page.h1 }]}
    />
  );
}
