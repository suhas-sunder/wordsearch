import Link from "next/link";
import { BookOpen, FileDown, Grid3X3, Printer, ZoomIn } from "lucide-react";
import { categories } from "@/content/categories";
import { BrandIdentity } from "@/components/layout/BrandIdentity";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <p className="footer-brand brand"><BrandIdentity /><span className="sr-only">I Love Word Search</span></p>
          <p>Find, print, play, and create clean word search puzzles for home, classrooms, and casual solving.</p>
        </div>
        <div>
          <h2>Find puzzles</h2>
          <Link href="/free-printable-word-searches">Printable puzzles</Link>
          <Link href="/online-word-search">Play online</Link>
          <Link href="/word-searches-for-kids">Kids</Link>
          <Link href="/word-searches-for-adults">Adults</Link>
          <Link href="/word-searches-for-teachers">Teachers</Link>
        </div>
        <div>
          <h2>Tools</h2>
          <Link className="footer-tool-link" href="/word-search-generator"><Grid3X3 size={16} aria-hidden="true" /> Generator</Link>
          <Link className="footer-tool-link" href="/word-search-pdf"><FileDown size={16} aria-hidden="true" /> PDF puzzles</Link>
          <Link className="footer-tool-link" href="/large-print-word-searches"><ZoomIn size={16} aria-hidden="true" /> Large print</Link>
          <Link className="footer-tool-link" href="/word-search-worksheets"><Printer size={16} aria-hidden="true" /> Worksheets</Link>
          <Link className="footer-tool-link" href="/guides"><BookOpen size={16} aria-hidden="true" /> Guides</Link>
        </div>
        <div>
          <h2>Browse</h2>
          <Link href="/topics">All topics</Link>
          <Link href="/categories">All categories</Link>
          {categories.slice(0, 4).map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>{category.title.replace(" Word Searches", "")}</Link>
          ))}
        </div>
        <div>
          <h2>Site</h2>
          <Link href="/about">About</Link>
          <Link href="/how-word-searches-are-made">How puzzles are made</Link>
          <Link href="/editorial-policy">Editorial policy</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/accessibility">Accessibility</Link>
        </div>
      </div>
      <nav className="site-shell footer-legal" aria-label="Legal information">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/copyright">Copyright</Link>
      </nav>
    </footer>
  );
}
