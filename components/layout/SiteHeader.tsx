"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { primaryNavigation, secondaryNavigation } from "@/content/navigation";

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const current = isCurrent(pathname, href);
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={current ? "active" : undefined}>
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    mobileMenu.current?.removeAttribute("open");
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="brand" href="/" aria-label="I Love Word Search home">
          <span className="brand-mark" aria-hidden="true">IL</span>
          <span>I Love Word Search</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => <NavLink key={item.href} {...item} pathname={pathname} />)}
        </nav>
        <Link className="header-search" href="/search" aria-label="Search word searches">
          <Search size={18} aria-hidden="true" />
        </Link>
        <details className="mobile-nav" ref={mobileMenu}>
          <summary aria-label="Open navigation menu"><Menu size={20} aria-hidden="true" /></summary>
          <div className="mobile-nav-panel">
            <nav aria-label="Mobile primary navigation">
              {[...primaryNavigation, ...secondaryNavigation].map((item) => <NavLink key={item.href} {...item} pathname={pathname} />)}
            </nav>
            <Link className="mobile-search-link" href="/search"><Search size={17} aria-hidden="true" /> Search puzzles</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
