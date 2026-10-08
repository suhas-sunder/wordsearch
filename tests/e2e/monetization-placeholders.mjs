import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const eligibleRoutes = [
  { route: "/", anchor: ".home-hero", square: true },
  { route: "/word-search-generator", anchor: ".above-fold-builder", square: true },
  { route: "/free-printable-word-searches", anchor: ".hub-hero", square: true },
  { route: "/collections/hard-printable-word-searches", anchor: ".hub-hero", square: true },
  { route: "/word-searches/animals/dog-word-search", anchor: ".above-fold-builder", square: true },
  { route: "/categories/animals-word-searches", anchor: ".hub-hero", square: true },
  { route: "/collections/easy-printable-word-searches", anchor: ".hub-hero", square: true },
  { route: "/guides/how-to-print-a-word-search", anchor: ".hub-hero", square: true },
  { route: "/topics", anchor: ".hub-hero", square: false }
];
const adFreeRoutes = [
  "/privacy",
  "/terms",
  "/copyright",
  "/accessibility",
  "/contact",
  "/editorial-policy",
  "/search?q=animals",
  "/print",
  "/pdf",
  "/answer-key",
  "/play",
  "/embed",
  "/custom",
  "/definitely-not-a-real-page"
];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 900 },
  { name: "desktop", width: 1280, height: 960 },
  { name: "large-desktop", width: 1600, height: 1000 },
  { name: "ultra-wide", width: 1920, height: 1080 }
];
const failures = [];
const externalAdRequests = new Set();
const contentWidths = new Map();
const browser = await chromium.launch({ headless: true });

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  context.on("request", (request) => {
    if (/googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i.test(request.url())) {
      externalAdRequests.add(request.url());
    }
  });

  for (const { route, anchor, square } of eligibleRoutes) {
    const page = await context.newPage();
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    check(Boolean(response) && response.status() < 400, `${viewport.name} ${route}: route did not load successfully`);

    const slots = page.locator("[data-ad-placeholder='true']");
    check(await slots.count() === (square ? 6 : 5), `${viewport.name} ${route}: unexpected placeholder count`);
    const labels = await slots.allTextContents();
    check(labels.every((label) => label.trim() === "Advertisements"), `${viewport.name} ${route}: placeholder label changed`);
    check(await slots.locator("a, button, input, select, textarea").count() === 0, `${viewport.name} ${route}: placeholder became interactive`);

    const top = page.locator("[data-ad-placement='top-banner']");
    const topRegion = page.locator(".ad-top-region");
    const left = page.locator("[data-ad-placement='sidebar-left']");
    const right = page.locator("[data-ad-placement='sidebar-right']");
    check(await top.isVisible() === (viewport.width >= 768), `${viewport.name} ${route}: top-banner visibility mismatch`);
    check(await topRegion.isVisible() === (viewport.width >= 768), `${viewport.name} ${route}: top region visibility mismatch`);
    check(await left.isVisible() === (viewport.width >= 1600), `${viewport.name} ${route}: left sidebar visibility mismatch`);
    check(await right.isVisible() === (viewport.width >= 1600), `${viewport.name} ${route}: right sidebar visibility mismatch`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 1, `${viewport.name} ${route}: horizontal overflow of ${overflow}px`);

    const headerBox = await page.locator(".site-header").boundingBox();
    const topBox = await top.boundingBox();
    const topRegionBox = await topRegion.boundingBox();
    const pageFrameBox = await page.locator(".ad-page-frame").boundingBox();
    if (viewport.width < 768) {
      check(topRegionBox === null, `${viewport.name} ${route}: hidden top region still consumes layout space`);
      if (headerBox && pageFrameBox) check(Math.abs(pageFrameBox.y - (headerBox.y + headerBox.height)) <= 1, `${viewport.name} ${route}: blank top-ad gap remains below the header`);
    } else {
      check(Boolean(topRegionBox), `${viewport.name} ${route}: top region is missing`);
      if (topBox) {
        const expectedTopSize = viewport.width >= 1024 ? { width: 728, height: 90 } : { width: 468, height: 60 };
        check(Math.abs(topBox.width - expectedTopSize.width) <= 1, `${viewport.name} ${route}: top-banner width mismatch`);
        check(Math.abs(topBox.height - expectedTopSize.height) <= 1, `${viewport.name} ${route}: top-banner height mismatch`);
      }
      if (topRegionBox && pageFrameBox) check(pageFrameBox.y >= topRegionBox.y + topRegionBox.height, `${viewport.name} ${route}: page content overlaps the top region`);
    }
    if (topBox && headerBox) check(topBox.y >= headerBox.y + headerBox.height, `${viewport.name} ${route}: top banner overlaps the header`);

    const anchorBox = await page.locator(anchor).first().boundingBox();
    const belowBox = await page.locator("[data-ad-placement='below-header-banner']").boundingBox();
    if (anchorBox && belowBox) check(belowBox.y >= anchorBox.y + anchorBox.height, `${viewport.name} ${route}: below-header banner precedes its page introduction`);

    const aboveFooter = await page.locator("[data-ad-placement='above-footer-banner']").boundingBox();
    const footer = await page.locator(".site-footer").boundingBox();
    if (aboveFooter && footer) check(aboveFooter.y + aboveFooter.height <= footer.y, `${viewport.name} ${route}: above-footer banner is inside or below the footer`);
    check(await page.locator(".site-footer [data-ad-placeholder='true']").count() === 0, `${viewport.name} ${route}: footer contains a placeholder`);
    check(await page.locator(".preview-toolbar [data-ad-placeholder='true'], .builder-controls [data-ad-placeholder='true'], .puzzle-grid [data-ad-placeholder='true']").count() === 0, `${viewport.name} ${route}: puzzle controls contain a placeholder`);

    if (square) {
      check(await page.locator("[data-ad-placement='seo-section-square']").count() === 1, `${viewport.name} ${route}: SEO square missing`);
      check(await page.locator(".preview-toolbar [data-ad-placement='seo-section-square'], .builder-controls [data-ad-placement='seo-section-square']").count() === 0, `${viewport.name} ${route}: SEO square entered interactive controls`);
    }

    if (route === "/word-search-generator" && [1280, 1600, 1920].includes(viewport.width)) {
      const contentBox = await page.locator(".above-fold-builder").boundingBox();
      if (contentBox) contentWidths.set(viewport.width, contentBox.width);
    }
    await page.close();
  }
  await context.close();
}

check(Math.abs((contentWidths.get(1280) ?? 0) - (contentWidths.get(1600) ?? -100)) <= 2, "large-desktop sidebars changed the generator content width");
check(Math.abs((contentWidths.get(1280) ?? 0) - (contentWidths.get(1920) ?? -100)) <= 2, "ultra-wide sidebars changed the generator content width");

for (const viewport of [{ width: 390, height: 844 }, { width: 1600, height: 1000 }]) {
  const context = await browser.newContext({ viewport });
  context.on("request", (request) => {
    if (/googlesyndication|doubleclick|googleadservices|pagead2|adsbygoogle/i.test(request.url())) externalAdRequests.add(request.url());
  });
  for (const route of adFreeRoutes) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    check(await page.locator("[data-ad-placeholder='true']").count() === 0, `${viewport.width}px ${route}: ad-free route rendered a placeholder`);
    await page.close();
  }
  await context.close();
}

const printContext = await browser.newContext({ viewport: { width: 1280, height: 960 } });
const printPage = await printContext.newPage();
await printPage.goto(`${baseUrl}/word-search-generator`, { waitUntil: "networkidle" });
await printPage.emulateMedia({ media: "print" });
const printVisibility = await printPage.locator("[data-ad-placeholder='true']").evaluateAll((elements) => elements.map((element) => getComputedStyle(element).display));
check(printVisibility.every((display) => display === "none"), "print media leaves a placeholder visible");
await printContext.close();

check(externalAdRequests.size === 0, `external ad requests detected: ${[...externalAdRequests].join(", ")}`);
await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Monetization placeholders passed on ${eligibleRoutes.length} eligible routes at ${viewports.length} viewports and ${adFreeRoutes.length} ad-free routes.`);
