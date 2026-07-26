import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { brotliCompressSync, constants as zlibConstants, gzipSync } from "node:zlib";

const root = process.cwd();
const outputRoot = resolve(root, "out");
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8"
};
const compressibleTypes = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);
const responseCache = new Map();

function matches(pattern, pathname) {
  if (!pattern.includes("*")) return pattern === pathname || `${pattern}/` === pathname;
  const [start, end = ""] = pattern.split("*");
  return pathname.startsWith(start) && pathname.endsWith(end);
}

function parseRedirects(source) {
  return source.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [from, to, rawStatus = "301"] = line.split(/\s+/);
      return { from, to, status: Number(rawStatus.replace("!", "")) };
    });
}

function parseHeaders(source) {
  const rules = [];
  let current = null;
  for (const rawLine of source.split(/\r?\n/)) {
    if (!rawLine.trim()) {
      current = null;
      continue;
    }
    if (!/^\s/.test(rawLine)) {
      current = { pattern: rawLine.trim(), values: {} };
      rules.push(current);
      continue;
    }
    const separator = rawLine.indexOf(":");
    if (!current || separator < 0) continue;
    current.values[rawLine.slice(0, separator).trim()] = rawLine.slice(separator + 1).trim();
  }
  return rules;
}

const redirects = parseRedirects(await readFile(resolve(outputRoot, "_redirects"), "utf8"));
const headerRules = parseHeaders(await readFile(resolve(outputRoot, "_headers"), "utf8"));

function safeOutputPath(pathname) {
  const candidate = resolve(outputRoot, `.${pathname}`);
  return candidate === outputRoot || candidate.startsWith(`${outputRoot}${sep}`) ? candidate : null;
}

async function existingFile(pathname) {
  const candidates = [];
  const direct = safeOutputPath(pathname);
  if (direct) candidates.push(direct);
  if (direct && !extname(direct)) {
    candidates.push(resolve(direct, "index.html"));
    candidates.push(`${direct}.html`);
  }
  if (pathname.endsWith("/") && direct) candidates.push(resolve(direct, "index.html"));
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next static-file shape.
    }
  }
  return null;
}

function responseHeaders(pathname, filePath) {
  const values = {};
  for (const rule of headerRules) {
    if (matches(rule.pattern, pathname)) Object.assign(values, rule.values);
  }
  values["Content-Type"] ??= contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream";
  values["Cache-Control"] ??= pathname.startsWith("/_next/static/")
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";
  return values;
}

async function staticResponse(filePath, acceptEncoding = "") {
  const extension = extname(filePath).toLowerCase();
  const encoding = compressibleTypes.has(extension)
    ? /\bbr\b/.test(acceptEncoding)
      ? "br"
      : /\bgzip\b/.test(acceptEncoding)
        ? "gzip"
        : "identity"
    : "identity";
  const cacheKey = `${filePath}:${encoding}`;
  const cached = responseCache.get(cacheKey);
  if (cached) return cached;
  const source = await readFile(filePath);
  const body = encoding === "br"
    ? brotliCompressSync(source, { params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 5 } })
    : encoding === "gzip"
      ? gzipSync(source, { level: 6 })
      : source;
  const value = { body, encoding };
  responseCache.set(cacheKey, value);
  return value;
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `${host}:${port}`}`);
    let pathname = decodeURIComponent(url.pathname);
    const rule = redirects.find((item) => matches(item.from, pathname));
    if (rule?.status === 301 || rule?.status === 302 || rule?.status === 307 || rule?.status === 308) {
      response.writeHead(rule.status, { Location: `${rule.to}${url.search}` });
      response.end();
      return;
    }
    if (rule?.status === 200) pathname = rule.to;

    const filePath = await existingFile(pathname);
    if (!filePath) {
      const notFoundPath = resolve(outputRoot, "404.html");
      const payload = await staticResponse(notFoundPath, request.headers["accept-encoding"]);
      const headers = responseHeaders(pathname, notFoundPath);
      if (payload.encoding !== "identity") {
        headers["Content-Encoding"] = payload.encoding;
        headers.Vary = "Accept-Encoding";
      }
      headers["Content-Length"] = String(payload.body.length);
      response.writeHead(404, headers);
      if (request.method === "HEAD") response.end();
      else response.end(payload.body);
      return;
    }

    const payload = await staticResponse(filePath, request.headers["accept-encoding"]);
    const headers = responseHeaders(pathname, filePath);
    if (payload.encoding !== "identity") {
      headers["Content-Encoding"] = payload.encoding;
      headers.Vary = "Accept-Encoding";
    }
    headers["Content-Length"] = String(payload.body.length);
    response.writeHead(200, headers);
    if (request.method === "HEAD") response.end();
    else response.end(payload.body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Static server error");
  }
});

server.listen(port, host, () => {
  console.log(`Static export available at http://${host}:${port} from ${outputRoot}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
