"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search } from "lucide-react";
import { helpNavigation, primaryNavigation, secondaryNavigation } from "@/content/navigation";
import { BrandIdentity } from "@/components/layout/BrandIdentity";
import { PuzzleSearch } from "@/components/search/PuzzleSearch";
import styles from "./SiteHeader.module.css";
import { ThemeToggle } from "./ThemeToggle";

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
  const menu = useRef<HTMLDetailsElement>(null);
  const header = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    menu.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    function outside(event: globalThis.MouseEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) menu.current?.removeAttribute("open");
    }
    document.addEventListener("click", outside);
    return () => document.removeEventListener("click", outside);
  }, []);

  function openSearch(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    returnFocus.current = event.currentTarget;
    if (menu.current) menu.current.open = true;
    window.requestAnimationFrame(() => header.current?.querySelector<HTMLInputElement>('input[role="combobox"]')?.focus());
  }

  return (
    <header className={`site-header ${styles.header}`} ref={header}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current?.open) {
          event.preventDefault();
          menu.current.open = false;
          (returnFocus.current ?? menu.current.querySelector("summary"))?.focus();
        }
      }}
      onSubmitCapture={(event) => {
        if ((event.target as HTMLFormElement).querySelector<HTMLInputElement>('input[type="search"]')?.value.trim()) menu.current?.removeAttribute("open");
      }}
      onClickCapture={(event) => {
        const link = (event.target as Element).closest("a");
        if (link && menu.current?.contains(link)) menu.current.removeAttribute("open");
      }}>
      <div className={`site-shell ${styles.content}`}>
      <div className={`header-inner ${styles.row}`}>
        <Link className="brand" href="/" aria-label="I Love Word Search home">
          <BrandIdentity />
        </Link>
        <nav className={`desktop-nav ${styles.primary}`} aria-label="Primary navigation">
          {primaryNavigation.slice(0, 5).map((item) => <NavLink key={item.href} {...item} pathname={pathname} />)}
        </nav>
        <Link className={`header-search ${styles.search}`} href="/search" aria-label="Search word searches" onClick={openSearch}>
          <Search size={18} aria-hidden="true" />
        </Link>
        <ThemeToggle />
        <span className={styles.reserve} aria-hidden="true" />
      </div>
        <details className={styles.menu} ref={menu}>
          <summary className={styles.trigger} aria-label="Open navigation menu" onClick={(event) => { returnFocus.current = event.currentTarget; }}>
            <Menu size={20} aria-hidden="true" /><span>More</span><ChevronDown size={15} aria-hidden="true" />
          </summary>
          <div className={styles.panel}>
            <PuzzleSearch compact label="Search from the menu" />
            <nav className={styles.groups} aria-label="All site navigation">
              <div><strong>Find a puzzle</strong>{primaryNavigation.map((item) => <NavLink key={item.href} {...item} pathname={pathname} />)}</div>
              <div><strong>Formats and audiences</strong>{secondaryNavigation.map((item) => <NavLink key={item.href} {...item} pathname={pathname} />)}<NavLink href="/topics" label="All topics" pathname={pathname} /></div>
              <div><strong>About and help</strong>{helpNavigation.map((item) => <NavLink key={item.href} {...item} pathname={pathname} />)}</div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
