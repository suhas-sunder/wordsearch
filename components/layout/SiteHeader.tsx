import Link from "next/link";
import { Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="brand" href="/" aria-label="I Love Word Search home">
          <span className="brand-mark" aria-hidden="true">IL</span>
          <span>I Love Word Search</span>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/word-search-generator">Generator</Link>
          <Link href="/free-printable-word-searches">Printable</Link>
          <Link href="/online-word-search">Online</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/specialty-word-search-generators">Specialty</Link>
          <Link href="/guides">Guides</Link>
        </nav>
        <Link className="header-search" href="/search" aria-label="Search">
          <Search size={18} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
