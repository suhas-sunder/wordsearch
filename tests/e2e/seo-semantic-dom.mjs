// Runs in the browser's DOM implementation for both inert SSR and rendered DOM.
// Every non-script/style text node belongs to a compared partition; none is discarded.
export function semanticDocument({ html, origin, canonicalOrigin, path = "/" }) {
  const doc = html === null ? document : new DOMParser().parseFromString(html, "text/html");
  const text = (value) => (value ?? "").replace(/\s+/gu, " ").trim();
  const partition = (node) => {
    const element = node.nodeType === 1 ? node : node.parentElement;
    if (element.closest(".site-header")) return "header";
    if (element.closest(".site-footer")) return "footer";
    if (element.closest("nav")) return "navigation";
    if (element.closest(".tools-section")) return "shared-tools";
    if (element.closest(".standards-link")) return "shared-standards";
    if (element.closest("[data-related-activities]")) return "contextual-activity-tools";
    if (element.closest(".above-fold-builder,.builder-loading-shell,[role=dialog],form,[data-collection-controls]")) return "interactive-ui";
    if (element.closest("p[hidden]") && element.closest("section")?.querySelector("[data-collection-controls]")) return "interactive-ui";
    const section = element.closest("section");
    if (section?.querySelector("h2")?.textContent.trim() === "Make, Check, Print") return "shared-how-it-works";
    if (section?.querySelector("h2")?.textContent.trim() === "FAQ") return "faq";
    return element.closest("main") ? "editorial" : "other-body";
  };
  const normalizeHref = (href) => {
    try {
      const url = new URL(href, new URL(path, origin));
      if (![origin, canonicalOrigin].includes(url.origin)) return null;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch { return null; }
  };
  const body = {};
  const walker = doc.createTreeWalker(doc.body, 4);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest("script,style,svg,noscript")) continue;
    const value = text(node.textContent);
    if (value) (body[partition(node)] ??= []).push(value);
  }
  for (const key of Object.keys(body)) body[key] = body[key].join(" ");
  const headings = [...doc.querySelectorAll("h1,h2,h3")].map((node) => ({ level: node.tagName.toLowerCase(), text: text(node.textContent), partition: partition(node) }));
  const links = {};
  const providerLinks = [];
  for (const node of doc.querySelectorAll("a[href]")) {
    const href = normalizeHref(node.getAttribute("href"));
    // Cloudflare injects empty bot-management anchors with one random id.
    // Retain the exact path/label/rel/query-key contract separately; opaque
    // challenge values are provider noise, not editorial navigation.
    if (href?.startsWith("/cdn-cgi/content?") && !text(node.textContent) && node.getAttribute("rel") === "nofollow noopener") {
      const url = new URL(href, origin);
      providerLinks.push({ path: url.pathname, queryKeys: [...url.searchParams.keys()], label: "", rel: node.getAttribute("rel") });
      continue;
    }
    if (href !== null) (links[partition(node)] ??= []).push({ href, label: text(node.textContent) || node.getAttribute("aria-label") || "", rel: text(node.getAttribute("rel")) });
  }
  const meta = (name) => [...doc.querySelectorAll("meta[name]")].filter((node) => node.getAttribute("name").toLowerCase() === name).map((node) => text(node.getAttribute("content")));
  const schema = [...doc.querySelectorAll('script[type="application/ld+json"]')].map((node) => JSON.parse(node.textContent));
  const vocab = [...doc.querySelectorAll("textarea,.print-word-bank,.word-bank")].map((node) => text(node.value ?? node.textContent));
  const noscript = [...doc.querySelectorAll("noscript")].map((node) => text(node.textContent));
  return { title: text(doc.title), description: meta("description"), canonical: [...doc.querySelectorAll('link[rel="canonical"]')].map((node) => node.getAttribute("href")), robotsHtml: meta("robots"), h1: headings.filter((node) => node.level === "h1"), headings, body, links, providerLinks, vocabulary: vocab, schema, noscript };
}
