import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell content-section">
      <h1>Page not found</h1>
      <p>The page may have moved into the generator, category, topic, or guide library.</p>
      <Link className="primary-button" href="/word-search-generator">Open the generator</Link>
    </main>
  );
}
