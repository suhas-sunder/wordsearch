import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BelowHeaderAd, MonetizedPageShell, type AdTemplate } from "@/components/layout/AdSlot";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { DeferredWordSearchBuilder } from "@/components/builder/DeferredWordSearchBuilder";
import { EditorialModules, QuickLinks, SearchTools } from "@/components/page/PageSections";
import type { PuzzleRequest } from "@/lib/puzzle/types";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { RelatedActivityTools } from "@/components/page/RelatedActivityTools";
import styles from "./IndexablePage.module.css";

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
  toolStatus?: { label: string; description: string };
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
  toolStatus,
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
      <MonetizedPageShell template={adTemplate}>
        <main>
          <Breadcrumbs items={breadcrumbs.length ? breadcrumbs : [{ label: h1 }]} />
          <section className="hero site-shell">
            <div className="hero-copy">
              <h1>{h1}</h1>
              <p className="value-prop">{description}</p>
              {toolStatus && <div className={styles.toolStatus} role="note" aria-label="Format readiness"><strong>{toolStatus.label}</strong><p>{toolStatus.description}</p></div>}
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
          <BelowHeaderAd template={adTemplate} />
          <section className="content-section site-shell intro-section">
            <p>{intro}</p>
          </section>
          {children}
          <EditorialModules modules={modules} faq={faq} adTemplate={adTemplate} />
          <RelatedActivityTools path={path} />
          <section className="content-section site-shell standards-link">
            <p>Learn about <Link href="/how-word-searches-are-made">how our puzzles are made</Link> and the site&apos;s <Link href="/editorial-policy">editorial and puzzle standards</Link>.</p>
          </section>
          <SearchTools />
        </main>
      </MonetizedPageShell>
    </>
  );
}
