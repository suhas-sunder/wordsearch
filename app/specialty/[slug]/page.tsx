import { notFound } from "next/navigation";
import { IndexablePage } from "@/components/page/IndexablePage";
import { getSpecialty, specialtyRoutes } from "@/content/specialty";
import { pageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return specialtyRoutes.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const route = getSpecialty(slug);
  if (!route) return {};
  return pageMetadata(route.title, route.description, `/specialty/${route.slug}`);
}

export default async function SpecialtyPage({ params }: Props) {
  const { slug } = await params;
  const route = getSpecialty(slug);
  if (!route) notFound();
  return (
    <IndexablePage
      title={route.title}
      h1={route.title}
      description={route.description}
      intro={`${route.status} The word bank remains readable while the grid uses the selected token pack.`}
      path={`/specialty/${route.slug}`}
      words={route.words}
      alphabetPack={route.alphabetPack}
      difficulty="medium"
      hiddenMessage={route.slug.includes("hidden-message") ? "GREAT JOB" : undefined}
      modules={["specialty", "faq"]}
      breadcrumbs={[{ label: "Specialty", href: "/specialty-word-search-generators" }, { label: route.title }]}
    />
  );
}
