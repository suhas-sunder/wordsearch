import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { searchCatalog } from "@/lib/search/catalog";

const outputPath = resolve(process.cwd(), "public", "search-index.json");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(searchCatalog)}\n`, "utf8");

console.log(`Generated ${searchCatalog.length} static search records at public/search-index.json.`);
