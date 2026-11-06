import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3231";
const state = Buffer.from(JSON.stringify({
  title: "Icon check",
  wordsText: "APPLE\nBANANA\nCHERRY",
  seed: "ui-icon-review",
  difficulty: "easy",
  alphabetPack: "latin",
  rows: 8,
  cols: 8,
  autoSize: false,
  directions: ["E", "S"]
}), "utf8").toString("base64url");
const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport });
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.goto(`${baseUrl}/pdf/${state}`, { waitUntil: "networkidle" });
    await page.locator('[data-utility-state="ready"]').waitFor();

    const actions = page.locator(".static-utility-controls .utility-actions");
    for (const label of ["Print", "Download this PDF"]) {
      const button = actions.getByRole("button", { name: label, exact: true });
      if (!(await button.isVisible())) failures.push(`${viewport.width}px ${label} action is not visible`);
      if (await button.locator('svg[aria-hidden="true"]').count() !== 1) {
        failures.push(`${viewport.width}px ${label} action does not have one decorative Lucide icon`);
      }
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) failures.push(`${viewport.width}px PDF utility page has horizontal overflow`);
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

console.log("Static PDF route shows one decorative Lucide icon on Print and PDF download actions at desktop and mobile widths.");
