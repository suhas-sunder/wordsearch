import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { AdSlot, type AdTemplate } from "@/components/layout/AdSlot";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeferredWordSearchBuilder } from "@/components/builder/DeferredWordSearchBuilder";
import { EditorialModules, QuickLinks } from "@/components/page/PageSections";
import type { PuzzleRequest } from "@/lib/puzzle/types";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

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
  persistBuilderState?: boolean;
  adTemplate?: AdTemplate;
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
  requestOverride,
  persistBuilderState = false,
  adTemplate = "major-hub"
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

  const breadcrumbItems = breadcrumbs.length ? breadcrumbs : [{ label: h1 }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems, path)} />
      <main>
        <AdSlot placement="top-banner" template={adTemplate} />
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
          <DeferredWordSearchBuilder initialRequest={request} persistState={persistBuilderState} />
        </section>
        <AdSlot placement="utility-banner" template={adTemplate} />
        <section className="content-section site-shell intro-section">
          <p>{intro}</p>
        </section>
        {children}
        <EditorialModules modules={modules} faq={faq} adTemplate={adTemplate} />
        <section className="content-section site-shell standards-link">
          <p>Learn about <Link href="/how-word-searches-are-made">how our puzzles are made</Link> and the site&apos;s <Link href="/editorial-policy">editorial and puzzle standards</Link>.</p>
        </section>
        <section className="content-section site-shell tools-section">
          <AdSlot placement="bottom-tools-banner" template={adTemplate} />
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
