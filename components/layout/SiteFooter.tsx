import Link from "next/link";
import { BookOpen, ExternalLink, FileDown, Grid3X3, Printer, ZoomIn } from "lucide-react";
import { categories } from "@/content/categories";
import { authors } from "@/content/model";
import { BrandIdentity } from "@/components/layout/BrandIdentity";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const maintainer = authors.find((author) => author.id === "suhas-sunder");
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <p className="footer-brand brand"><BrandIdentity /><span className="sr-only">I Love Word Search</span></p>
          <p>Find, print, play, and create clean word search puzzles for home, classrooms, and casual solving.</p>
          {maintainer && <p className={styles.maintainer}>Built and maintained by <Link href={maintainer.profilePath}>{maintainer.name}</Link>, a software engineer.</p>}
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
      {maintainer && <nav className={`site-shell ${styles.profiles}`} aria-label="Creator profiles">
        <span><strong>Connect with the creator</strong><span>{maintainer.name}&apos;s portfolio and professional profile</span></span>
        <div>
          {maintainer.sameAs.includes("https://www.suhassunder.com/") && <a href="https://www.suhassunder.com/" rel="external noreferrer">Portfolio<ExternalLink size={15} aria-hidden="true" /></a>}
          {maintainer.sameAs.includes("https://www.linkedin.com/in/s-sunder/") && <a href="https://www.linkedin.com/in/s-sunder/" rel="external noreferrer">LinkedIn<ExternalLink size={15} aria-hidden="true" /></a>}
        </div>
      </nav>}
      <nav className="site-shell footer-legal" aria-label="Legal information">
        <span className={styles.copyright}>© {new Date().getUTCFullYear()} I Love Word Search</span>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/copyright">Copyright</Link>
      </nav>
    </footer>
  );
}
