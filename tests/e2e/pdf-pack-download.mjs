import { build } from "esbuild";
import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { strict as assert } from "node:assert";

const bundle = await build({
  stdin: { contents: `import { downloadBrowserPuzzlePackPdf } from "./lib/pdf/browser-pack-download";
    import { generatePuzzle } from "./lib/puzzle/generate";

    window.runPackDownload = async () => {
      const puzzles = Array.from({length: 5}, (_, i) => {
        const puzzle = generatePuzzle({title: 'Browser Puzzle ' + (i + 1), wordsText: 'planet\\ncomet\\nstar', seed: 'browser-pack-' + i, difficulty: 'medium', alphabetPack: 'latin', autoSize: false, rows: 10, cols: 10, directions: ['E', 'S', 'SE'], allowOverlap: true, fillerMode: 'alphabet'});
        return {id: 'puzzle-' + (i + 1), puzzle};
      });
      await downloadBrowserPuzzlePackPdf({id: 'browser-pack', name: 'Browser Pack', puzzles}, {paperSize: 'a4', order: 'answers-last'});
    };`, resolveDir: process.cwd(), loader: "ts" },
  alias: { "@": process.cwd() }, bundle: true, write: false, platform: "browser", format: "iife"
});
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ acceptDownloads: true });
  await page.setContent("<html><body><button id='download'>Download</button></body></html>");
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  await page.evaluate(() => document.querySelector("#download").addEventListener("click", () => window.runPackDownload()));
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#download")]);
  assert.equal(download.suggestedFilename(), "browser-pack-word-search-pack.pdf");
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const bytes = Buffer.concat(chunks);
  assert.equal((await PDFDocument.load(bytes)).getPageCount(), 10);
  assert.ok(bytes.length < 2_000_000);
  console.log(`Browser download passed: ${download.suggestedFilename()}, 10 pages, ${bytes.length} bytes.`);
} finally { await browser.close(); }
