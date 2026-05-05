import Link from "next/link";
import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata("Custom Word Search", "Noindex custom share surface.");

export default function CustomSharePage() {
  return (
    <main className="utility-page site-shell">
      <h1>Custom word search state</h1>
      <p className="value-prop">Custom state links are reserved for future server-side short links. Use encoded share links from the generator for exact reproduction today.</p>
      <Link className="primary-button" href="/word-search-generator">Open the generator</Link>
    </main>
  );
}
