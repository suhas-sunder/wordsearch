import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3231";
const foodCategory = "/categories/food-and-drink-word-searches";
const browser = await chromium.launch({ headless: true });
const failures = [];

async function checkCategoryIcons(locator, surface, viewportWidth) {
  const categories = await locator.evaluateAll((links) => links.map((link) => ({
    hrefSlug: link.getAttribute("href")?.split("/").filter(Boolean).at(-1),
    iconSlug: link.querySelector("svg[data-category-icon]")?.getAttribute("data-category-icon")
  })));
  for (const category of categories) {
    if (!category.hrefSlug || category.iconSlug !== category.hrefSlug) {
      failures.push(`${viewportWidth}px ${surface} category ${category.hrefSlug ?? "(missing href)"} has icon ${category.iconSlug ?? "(missing icon)"}`);
    }
  }
  if (!categories.length) failures.push(`${viewportWidth}px ${surface} has no category links to check`);
}

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await checkCategoryIcons(page.locator('.discovery-card[href^="/categories/"]'), "homepage", viewport.width);
    const categoryCards = page.locator(`.discovery-card[href="${foodCategory}"]`);
    if (await categoryCards.locator(`svg[data-category-icon="food-and-drink-word-searches"]`).count() !== 1) {
      failures.push(`${viewport.width}px homepage food category card is missing its semantic icon`);
    }

    await page.goto(`${baseUrl}/categories`, { waitUntil: "networkidle" });
    await checkCategoryIcons(page.locator('.link-grid a[href^="/categories/"]'), "category index", viewport.width);
    const categoryGrid = page.locator(`.link-grid a[href="${foodCategory}"]`);
    if (await categoryGrid.locator(`svg[data-category-icon="food-and-drink-word-searches"]`).count() !== 1) {
      failures.push(`${viewport.width}px category grid food link is missing its semantic icon`);
    }

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    const search = page.getByRole("combobox", { name: "Search puzzles and categories" });
    await search.fill("food");
    const suggestion = page.locator(`.search-suggestions a[href="${foodCategory}"]`);
    await suggestion.waitFor({ timeout: 10000 });
    if (await suggestion.locator(`svg[data-category-icon="food-and-drink-word-searches"]`).count() !== 1) {
      failures.push(`${viewport.width}px food category search suggestion is missing its semantic icon`);
    }

    await page.goto(`${baseUrl}/search?q=food`, { waitUntil: "networkidle" });
    const result = page.locator(`.search-result-list a[href="${foodCategory}"]`);
    await result.waitFor({ timeout: 10000 });
    if (await result.locator(`svg[data-category-icon="food-and-drink-word-searches"]`).count() !== 1) {
      failures.push(`${viewport.width}px food category search result is missing its semantic icon`);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${viewport.width}px search surface has horizontal overflow`);
    if (runtimeErrors.length) failures.push(`${viewport.width}px runtime errors: ${runtimeErrors.join("; ")}`);
    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("All published category cards have matching icons; food category icons appear in live search suggestions and results at desktop and mobile widths.");
