import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";
import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { launchAuditChrome } from "./audit-chrome.mjs";

const destination = process.env.AUDIT_CHROME_OUTPUT;
assert.ok(destination, "AUDIT_CHROME_OUTPUT must be outside the repository");
const output = resolve(destination);
const fromRepo = relative(process.cwd(), output);
assert.ok(fromRepo.startsWith("..") || isAbsolute(fromRepo));
const installed = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const chromePath = process.env.CHROME_PATH ?? (existsSync(installed) ? installed : chromium.executablePath());
const results = [];
for (const mode of ["normal", "audit-error"]) {
  const chrome = await launchAuditChrome({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"], logLevel: "silent" });
  let caught;
  let closed;
  let browserVersion;
  try {
    const response = await fetch(`http://127.0.0.1:${chrome.port}/json/version`);
    assert.equal(response.status, 200);
    browserVersion = (await response.json()).Browser;
    assert.match(browserVersion, /Chrome\//);
    if (mode === "audit-error") throw new Error("Intentional audit failure");
  } catch (error) { caught = error; }
  finally { closed = await chrome.close(); }
  assert.equal(closed.exitCode, 0);
  assert.equal(closed.signal, null);
  assert.equal(closed.profileCleanup, true);
  assert.equal(closed.method, "CDP Browser.close");
  assert.deepEqual(await chrome.close(), closed, "closing twice cannot target a reused process ID");
  assert.equal(caught?.message, mode === "audit-error" ? "Intentional audit failure" : undefined);
  await assert.rejects(fetch(`http://127.0.0.1:${chrome.port}/json/version`, { signal: AbortSignal.timeout(2000) }));
  results.push({ mode, browserVersion, ...closed, debugPortClosed: true });
}
await mkdir(output, { recursive: true });
await writeFile(resolve(output, "cleanup.json"), JSON.stringify({ node: process.version, results }, null, 2) + "\n");
console.log(JSON.stringify(results));
