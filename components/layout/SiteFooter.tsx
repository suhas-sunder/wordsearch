import Link from "next/link";
import { categories } from "@/content/categories";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <p className="footer-brand">I Love Word Search</p>
          <p>Clean printable and online word search tools for teachers, families, and puzzle fans.</p>
        </div>
        <div>
          <h2>Build</h2>
          <Link href="/word-search-generator">Generator</Link>
          <Link href="/word-search-pdf">PDF maker</Link>
          <Link href="/large-print-word-searches">Large print</Link>
          <Link href="/specialty-word-search-generators">Specialty generators</Link>
        </div>
        <div>
          <h2>Browse</h2>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`}>{category.title.replace(" Word Searches", "")}</Link>
          ))}
        </div>
        <div>
          <h2>Support</h2>
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
