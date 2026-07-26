import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export interface TrustSection {
  heading: string;
  paragraphs?: React.ReactNode[];
  items?: React.ReactNode[];
}

export function TrustLinks() {
  return (
    <nav className="trust-links" aria-label="Site information">
      <Link href="/about">About</Link>
      <Link href="/how-word-searches-are-made">How puzzles are made</Link>
      <Link href="/editorial-policy">Editorial standards</Link>
      <Link href="/accessibility">Accessibility</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <Link href="/copyright">Copyright</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}

export function TrustPage({ eyebrow, h1, lede, path, sections, children, jsonLd }: { eyebrow: string; h1: string; lede: string; path: string; sections: TrustSection[]; children?: React.ReactNode; jsonLd?: Record<string, unknown> }) {
  const crumbs = [{ label: h1 }];
  return (
    <>
      <JsonLd data={jsonLd ? [breadcrumbJsonLd(crumbs, path), jsonLd] : breadcrumbJsonLd(crumbs, path)} />
      <main className="trust-page">
        <Breadcrumbs items={crumbs} />
        <header className="trust-hero site-shell">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{h1}</h1>
          <p className="value-prop">{lede}</p>
        </header>
        {children}
        <div className="trust-content site-shell">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {section.items?.length ? <ul>{section.items.map((item, index) => <li key={index}>{item}</li>)}</ul> : null}
            </section>
          ))}
        </div>
        <div className="site-shell"><TrustLinks /></div>
      </main>
    </>
  );
}
