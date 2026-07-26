import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-shell content-section">
      <h1>Page not found</h1>
      <p>The address may be incomplete, expired, or moved. No fallback puzzle was generated in its place.</p>
      <div className="hero-actions">
        <Link className="primary-button" href="/topics">Browse all topics</Link>
        <Link className="secondary-button" href="/word-search-generator">Create a puzzle</Link>
        <Link className="secondary-button" href="/">Return home</Link>
      </div>
    </main>
  );
}
