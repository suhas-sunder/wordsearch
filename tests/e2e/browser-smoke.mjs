import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/word-search-generator",
  "/free-printable-word-searches",
  "/online-word-search",
  "/categories",
  "/word-search-pdf",
  "/word-search-worksheets",
  "/large-print-word-searches",
  "/word-searches-for-kids",
  "/word-searches-for-adults",
  "/word-searches-for-teachers",
  "/guides",
  "/categories/animals-word-searches",
  "/word-searches/holidays/halloween-word-search",
  "/collections/road-trip-word-searches",
  "/guides/how-to-print-word-searches",
  "/specialty/morse-code-word-search-generator"
];
const hubRoutes = new Set([
  "/",
  "/free-printable-word-searches",
  "/online-word-search",
  "/categories",
  "/word-search-pdf",
  "/word-search-worksheets",
  "/large-print-word-searches",
  "/word-searches-for-kids",
  "/word-searches-for-adults",
  "/word-searches-for-teachers",
  "/guides"
]);
const widths = [360, 390, 768, 1024, 1440, 1920];

const browser = await chromium.launch();
const failures = [];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  page.on("pageerror", (error) => failures.push(`${width} ${page.url()} pageerror ${error.message}`));
  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const status = response?.status();
    const metrics = await page.evaluate(() => ({
      h1Count: document.querySelectorAll("h1").length,
      hasBuilder: Boolean(document.querySelector(".builder-surface")),
      hasPreview: Boolean(document.querySelector(".preview-paper")),
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth
    }));
    if (status !== 200) failures.push(`${width} ${route} status ${status}`);
    if (metrics.h1Count !== 1) failures.push(`${width} ${route} expected one h1, found ${metrics.h1Count}`);
    if (hubRoutes.has(route) && metrics.hasBuilder) failures.push(`${width} ${route} unexpectedly renders builder`);
    if (route === "/word-search-generator" && (!metrics.hasBuilder || !metrics.hasPreview)) failures.push(`${width} generator missing builder or preview`);
    if (metrics.scrollWidth > metrics.innerWidth + 2) failures.push(`${width} ${route} horizontal overflow ${metrics.scrollWidth}/${metrics.innerWidth}`);
  }
  await page.close();
}

const interactionPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
await interactionPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await interactionPage.getByRole("combobox", { name: "Search puzzles and categories" }).fill("animals");
const suggestions = interactionPage.getByRole("option");
if (await suggestions.count() === 0) failures.push("homepage autocomplete returned no known animal results");
await interactionPage.getByRole("combobox", { name: "Search puzzles and categories" }).press("ArrowDown");
await interactionPage.getByRole("combobox", { name: "Search puzzles and categories" }).press("Escape");
const mobileMenu = interactionPage.locator('summary[aria-label="Open navigation menu"]');
if (!(await mobileMenu.isVisible())) failures.push("mobile navigation control is not visible");
await mobileMenu.click();
if (!(await interactionPage.getByRole("navigation", { name: "Mobile primary navigation" }).isVisible())) failures.push("mobile navigation panel did not open");
await interactionPage.close();

const searchPage = await browser.newPage({ viewport: { width: 1024, height: 900 } });
await searchPage.goto(`${baseUrl}/search?q=animals`, { waitUntil: "networkidle" });
const searchData = await searchPage.evaluate(() => ({
  noindex: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
  results: document.querySelectorAll(".search-result-list > a").length,
  canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? ""
}));
if (!searchData.noindex.includes("noindex")) failures.push("search results missing noindex");
if (!searchData.results) failures.push("search results returned no known animal records");
if (!searchData.canonical.endsWith("/search")) failures.push(`search canonical is ${searchData.canonical}`);
await searchPage.goto(`${baseUrl}/search?q=zzzz-no-real-puzzle-zzzz`, { waitUntil: "networkidle" });
if (!(await searchPage.getByText("Create a custom puzzle").isVisible())) failures.push("search empty state is missing generator link");
await searchPage.close();

const utilityPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
await utilityPage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
for (const label of ["Print", "PDF", "Key", "Play"]) {
  const link = utilityPage.locator(".preview-toolbar a").filter({ hasText: new RegExp(label, "i") });
  const opened = await link.getAttribute("href");
  const target = await link.getAttribute("target");
  if (!opened) failures.push(`${label} does not expose a utility link`);
  if (target) failures.push(`${label} unexpectedly opens a new tab`);
  if (!opened) continue;
  const checkPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
  await checkPage.goto(new URL(opened, baseUrl).toString(), { waitUntil: "networkidle" });
  const data = await checkPage.evaluate(() => ({
    grid: Boolean(document.querySelector(".puzzle-svg, .solver-grid")),
    qr: Boolean(document.querySelector(".print-footer img")),
    noindex: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
    path: location.pathname
  }));
  if (!data.grid) failures.push(`${label} utility missing grid at ${data.path}`);
  if (!data.qr) failures.push(`${label} utility missing QR at ${data.path}`);
  if (!data.noindex.includes("noindex")) failures.push(`${label} utility missing noindex at ${data.path}`);
  await checkPage.close();
}
await utilityPage.emulateMedia({ media: "print" });
const visiblePrintAds = await utilityPage.locator(".ad-slot").evaluateAll((slots) => slots.filter((slot) => getComputedStyle(slot).display !== "none").length);
if (visiblePrintAds) failures.push(`${visiblePrintAds} advertisement placeholders remain visible in print media`);
await utilityPage.close();
await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Browser smoke passed ${routes.length} routes x ${widths.length} viewports plus search, mobile navigation, same-tab utility, QR, noindex, and print-ad checks.`);
