import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/word-search-generator",
  "/free-printable-word-searches",
  "/online-word-search",
  "/word-search-pdf",
  "/word-search-worksheets",
  "/large-print-word-searches",
  "/word-searches-for-kids",
  "/word-searches-for-adults",
  "/word-searches-for-teachers",
  "/categories/animals-word-searches",
  "/word-searches/holidays/halloween-word-search",
  "/collections/road-trip-word-searches",
  "/guides/how-to-print-word-searches",
  "/specialty/morse-code-word-search-generator",
  "/specialty/braille-word-search-generator",
  "/specialty/hidden-message-word-search-generator"
];
const widths = [390, 768, 1024, 1280, 1440, 1920];

const browser = await chromium.launch();
const failures = [];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  page.on("pageerror", (error) => failures.push(`${width} ${page.url()} pageerror ${error.message}`));
  for (const route of routes) {
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const status = response?.status();
    const metrics = await page.evaluate(() => {
      const builder = document.querySelector(".builder-surface");
      const preview = document.querySelector(".preview-paper");
      const h1 = document.querySelector("h1");
      const rect = builder?.getBoundingClientRect();
      return {
        hasH1: Boolean(h1?.textContent?.trim()),
        builderTop: rect?.top ?? 99999,
        hasPreview: Boolean(preview),
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth
      };
    });
    if (status !== 200) failures.push(`${width} ${route} status ${status}`);
    if (!metrics.hasH1) failures.push(`${width} ${route} missing h1`);
    if (!metrics.hasPreview) failures.push(`${width} ${route} missing preview`);
    if (metrics.builderTop > 980) failures.push(`${width} ${route} builder below fold ${metrics.builderTop}`);
    if (metrics.scrollWidth > metrics.innerWidth + 2) failures.push(`${width} ${route} horizontal overflow ${metrics.scrollWidth}/${metrics.innerWidth}`);
  }
  await page.close();
}

const utilityPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
await utilityPage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
for (const label of ["Print", "PDF", "Key", "Play"]) {
  const opened = await utilityPage.locator(".preview-toolbar a").filter({ hasText: new RegExp(label, "i") }).first().getAttribute("href");
  if (!opened) failures.push(`${label} does not expose a utility link`);
  if (!opened) continue;
  const checkPage = await browser.newPage({ viewport: { width: 1024, height: 1000 } });
  await checkPage.goto(new URL(opened, baseUrl).toString(), { waitUntil: "networkidle" });
  const data = await checkPage.evaluate(() => ({
    grid: Boolean(document.querySelector(".puzzle-svg, .solver-grid")),
    qr: Boolean(document.querySelector(".print-footer img")),
    noindex: document.querySelector("meta[name=\"robots\"]")?.getAttribute("content") ?? "",
    path: location.pathname
  }));
  if (!data.grid) failures.push(`${label} utility missing grid at ${data.path}`);
  if (!data.qr) failures.push(`${label} utility missing QR at ${data.path}`);
  if (!data.noindex.includes("noindex")) failures.push(`${label} utility missing noindex at ${data.path}`);
  await checkPage.close();
}
await utilityPage.close();
await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Browser smoke passed ${routes.length} routes x ${widths.length} viewports plus utility QR/noindex checks.`);
