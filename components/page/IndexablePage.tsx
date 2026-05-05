import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WordSearchBuilder } from "@/components/builder/WordSearchBuilder";
import { EditorialModules, QuickLinks } from "@/components/page/PageSections";
import type { PuzzleRequest } from "@/lib/puzzle/types";

interface IndexablePageProps {
  title: string;
  h1: string;
  description: string;
  intro: string;
  path: string;
  words: string[];
  difficulty?: PuzzleRequest["difficulty"];
  alphabetPack?: PuzzleRequest["alphabetPack"];
  modules?: string[];
  faq?: Array<{ question: string; answer: string }>;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  children?: React.ReactNode;
  hiddenMessage?: string;
  requestOverride?: Partial<PuzzleRequest> | null;
}

export function IndexablePage({
  h1,
  description,
  intro,
  path,
  words,
  difficulty = "medium",
  alphabetPack = "latin",
  modules = [],
  faq,
  breadcrumbs = [],
  children,
  hiddenMessage,
  requestOverride
}: IndexablePageProps) {
  const request: Partial<PuzzleRequest> = {
    title: h1.replace(/\s+\|.*$/, ""),
    wordsText: words.join("\n"),
    difficulty,
    alphabetPack,
    seed: `ilws-${path.replace(/[^a-z0-9]+/gi, "-")}`,
    autoSize: true,
    allowOverlap: true,
    hiddenMessage,
    nameDateLine: true,
    wordBankOrder: "alphabetical",
    instructions: "Find each word in the grid. Words may run forward, backward, up, down, or diagonally.",
    ...requestOverride
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.ilovewordsearch.com/" },
        ...breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 2,
          name: item.label,
          item: item.href ? `https://www.ilovewordsearch.com${item.href}` : `https://www.ilovewordsearch.com${path}`
        }))
      ]
    },
    ...(faq?.length
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer }
          }))
        }]
      : [])
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <Breadcrumbs items={breadcrumbs.length ? breadcrumbs : [{ label: h1 }]} />
        <section className="hero site-shell">
          <div className="hero-copy">
            <h1>{h1}</h1>
            <p className="value-prop">{description}</p>
            <QuickLinks />
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="mini-sheet">
              <span>WORD SEARCH</span>
              <div className="mini-grid">
                {Array.from({ length: 49 }, (_, index) => <i key={index}>{["W", "O", "R", "D", "S", "E", "A"][index % 7]}</i>)}
              </div>
            </div>
          </div>
        </section>
        <section className="site-shell above-fold-builder">
          <WordSearchBuilder initialRequest={request} />
        </section>
        <section className="content-section site-shell intro-section">
          <p>{intro}</p>
        </section>
        {children}
        <EditorialModules modules={modules} faq={faq} />
      </main>
    </>
  );
}
