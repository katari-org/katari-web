import path from "node:path";
import { readJsonIfExists, listSubdirs } from "./fs";
import { CONTENT_ROOT, versionDir } from "./paths";
import { parseVersionMeta, type VersionMeta } from "./frontmatter";

/** content/docs 直下のバージョン名。降順 (latest first)。 */
export function listVersions(): string[] {
  return listSubdirs(CONTENT_ROOT).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

export function latestVersion(): string {
  const versions = listVersions();
  if (versions.length === 0) {
    throw new Error("No docs versions found under content/docs/");
  }
  return versions[0]!;
}

export function readVersionMeta(version: string): VersionMeta {
  const metaPath = path.join(versionDir(version), "_meta.json");
  const raw = readJsonIfExists(metaPath);
  return raw === undefined ? {} : parseVersionMeta(raw, metaPath);
}
