import { chromium } from "playwright";
import QRCode from "qrcode";
import { defaultPuzzleRequest } from "../../lib/puzzle/generate";
import { decodePuzzleShareState, puzzlePlayUrl } from "../../lib/share-state/state";

const base = process.env.BASE_URL ?? "http://127.0.0.1:3221";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
try {
  for (const count of [12, 20, 40, 100]) {
    for (const unicode of [false, true]) {
      const request = { ...defaultPuzzleRequest, title: unicode ? "Café 漢字 🔎" : "Share transport", seed: `share-${count}`, wordsText: Array.from({ length: count }, (_, i) => `WORD${String.fromCharCode(65 + Math.floor(i / 26), 65 + i % 26)}${unicode ? "é" : ""}`).join("\n") };
      const url = puzzlePlayUrl(request);
      const encoded = url.split("/").pop()!;
      if (decodePuzzleShareState(encoded)?.wordsText !== request.wordsText) throw new Error("Share state did not round-trip");
      let qr = "overflow";
      try { const code = QRCode.create(url, { errorCorrectionLevel: "M" }); qr = `v${code.version}/${code.modules.size} modules`; } catch { /* measured encoder capacity */ }
      const response = await page.goto(`${base}/play/${encoded}`, { waitUntil: "networkidle", timeout: 60000 });
      await page.locator('[data-utility-state="ready"]').waitFor({ timeout: 60000 });
      if (response?.status() !== 200 || !await page.locator(".solver-grid [data-solver-cell]").count()) throw new Error(`Static browser route failed for ${count} ${unicode}`);
      await page.locator(".solver-control-row").getByRole("button", { name: "Share" }).click();
      const dialog = page.getByRole("dialog", { name: "Share this puzzle" });
      const sharedUrl = await dialog.getByLabel("Share URL").inputValue();
      const sharedState = decodePuzzleShareState(sharedUrl.split("/").pop());
      if (sharedState?.wordsText !== request.wordsText) throw new Error(`Share dialog changed words for ${count} ${unicode}`);
      await dialog.locator('img[alt*="QR code"]').waitFor({ timeout: 30000 });
      await page.keyboard.press("Escape");
      console.log(`${count}\t${unicode ? "unicode" : "ascii"}\t${url.length}\t${qr}\tloaded`);
    }
  }
  const large = { ...defaultPuzzleRequest, title: "Large Unicode", instructions: "漢".repeat(1000), wordsText: "ALPHA\nBETA", seed: "unicode-overflow" };
  const longUrl = puzzlePlayUrl(large);
  let overflow = false;
  try { QRCode.create(longUrl, { errorCorrectionLevel: "M" }); } catch { overflow = true; }
  if (!overflow) throw new Error("Large Unicode fixture unexpectedly fit QR capacity");
  const response = await page.goto(`${base}/play/${longUrl.split("/").pop()}`, { waitUntil: "networkidle", timeout: 60000 });
  if (response?.status() !== 200) throw new Error("Large Unicode static route did not load");
  await page.locator('[data-utility-state="ready"]').waitFor();
  await page.locator(".solver-control-row").getByRole("button", { name: "Share" }).click();
  await page.getByText("QR code could not be generated. The share link is still available.").waitFor({ timeout: 30000 });
  console.log(`large-unicode\t${longUrl.length}\toverflow\tloaded, explicit QR error`);
} finally { await browser.close(); }
