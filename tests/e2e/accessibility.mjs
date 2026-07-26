import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/word-search-generator",
  "/word-searches/animals/dog-word-search",
  "/word-searches/history/ancient-egypt-word-search",
  "/categories/animals-word-searches",
  "/collections/easy-printable-word-searches",
  "/guides/how-to-print-a-word-search",
  "/free-printable-word-searches",
  "/word-searches-for-teachers",
  "/word-searches-for-seniors",
  "/topics",
  "/search?q=animals",
  "/about",
  "/definitely-not-a-real-page"
];
const failures = [];
const notices = [];
const browser = await chromium.launch({ headless: true });

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
  const context = await browser.newContext({ viewport });
  for (const route of routes) {
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    if (route === "/word-search-generator" || route.startsWith("/word-searches/")) {
      await page.locator(".builder-surface").waitFor({ state: "visible", timeout: 8_000 });
    }
    const results = await new AxeBuilder({ page }).analyze();
    const material = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    if (material.length) {
      failures.push(`${viewport.width}px ${route}: ${material.map((violation) => `${violation.id} (${violation.nodes.map((node) => node.target.join(" ")).join("; ")})`).join(", ")}`);
    }
    const lower = results.violations.filter((violation) => !["serious", "critical"].includes(violation.impact ?? ""));
    if (lower.length) notices.push(`${viewport.width}px ${route}: ${lower.map((violation) => violation.id).join(", ")}`);
    if (runtimeErrors.length) failures.push(`${viewport.width}px ${route}: page errors ${runtimeErrors.join("; ")}`);

    const undersized = await page.locator("button:visible, summary:visible, input:visible, select:visible, textarea:visible, a.primary-button:visible, a.secondary-button:visible, .header-search:visible").evaluateAll((elements) =>
      elements.flatMap((element) => {
        if (element.closest(".solver-grid")) return [];
        const input = element instanceof HTMLInputElement ? element : null;
        const labelledTarget = input && ["checkbox", "radio"].includes(input.type) ? input.closest("label") : null;
        const rect = (labelledTarget ?? element).getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 24 || rect.height < 24)
          ? [`${element.tagName.toLowerCase()} "${(element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 50)}" ${Math.round(rect.width)}x${Math.round(rect.height)}`]
          : [];
      })
    );
    if (undersized.length) failures.push(`${viewport.width}px ${route}: pointer targets under 24px: ${undersized.join(", ")}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${viewport.width}px ${route}: horizontal document overflow`);
    await page.close();
  }
  await context.close();
}

const interactionPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await interactionPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
await interactionPage.keyboard.press("Tab");
if (!(await interactionPage.locator(".skip-link").evaluate((element) => element === document.activeElement))) failures.push("Skip link is not the first keyboard focus target");
await interactionPage.keyboard.press("Enter");
if (!(await interactionPage.locator("#main-content").evaluate((element) => element === document.activeElement))) failures.push("Skip link does not move focus to main content");
await interactionPage.emulateMedia({ reducedMotion: "reduce" });
if ((await interactionPage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)) !== "auto") failures.push("Reduced-motion preference does not disable smooth scrolling");
await interactionPage.setViewportSize({ width: 640, height: 900 });
const zoomOverflow = await interactionPage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (zoomOverflow) failures.push("Homepage has horizontal overflow at a 200% zoom-equivalent CSS viewport");
await interactionPage.close();
await browser.close();

if (notices.length) console.log(`Non-material axe notices (${notices.length} route/viewport combinations):\n${notices.join("\n")}`);
if (failures.length) {
  console.error(`Accessibility audit failed with ${failures.length} issue(s):\n${failures.join("\n")}`);
  process.exit(1);
}
console.log(`Accessibility audit passed ${routes.length} archetypes at mobile and desktop sizes with no serious or critical axe violations, undersized surrounding controls, runtime errors, or document overflow. Skip-link, reduced-motion, and 200% zoom checks passed.`);
