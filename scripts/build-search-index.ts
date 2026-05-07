/**
 * Generate a JSON search index for each docs version under public/search-index/.
 * Runs as `prebuild` and `predev` so the client search dialog has data to load.
 */
import fs from "node:fs";
import path from "node:path";
import { buildSearchEntries, listVersions } from "../lib/docs";

const outDir = path.join(process.cwd(), "public", "search-index");
fs.mkdirSync(outDir, { recursive: true });

const versions = listVersions();
if (versions.length === 0) {
  console.warn("[search-index] No docs versions found under content/docs/");
}

for (const version of versions) {
  const entries = buildSearchEntries(version);
  const outPath = path.join(outDir, `${version}.json`);
  fs.writeFileSync(outPath, JSON.stringify(entries));
  console.log(`[search-index] ${version}: ${entries.length} entries → ${path.relative(process.cwd(), outPath)}`);
}
