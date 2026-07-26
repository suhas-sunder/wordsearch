import Link from "next/link";
import { categories } from "@/content/categories";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <p className="footer-brand">I Love Word Search</p>
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
          <Link href="/word-search-generator">Generator</Link>
          <Link href="/word-search-pdf">PDF puzzles</Link>
          <Link href="/large-print-word-searches">Large print</Link>
          <Link href="/word-search-worksheets">Worksheets</Link>
          <Link href="/guides">Guides</Link>
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
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/copyright">Copyright</Link>
        </div>
      </div>
    </footer>
  );
}
