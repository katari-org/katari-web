import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CONTENT_ROOT } from "./paths";
import { parseDocFrontmatter, type DocFrontmatter } from "./frontmatter";
import { getNavigation } from "./navigation";
import { listVersions } from "./versions";

export type DocPage = {
  version: string;
  // slug は URL セグメント (category/page-name)。.md / index は除く。
  slug: string[];
  href: string;
  frontmatter: DocFrontmatter;
  body: string;
};

function resolveDocFile(version: string, slugSegments: string[]): string | undefined {
  // /docs/[version]/[category]               → category/index.md
  // /docs/[version]/[category]/[name]        → category/name.md
  if (slugSegments.length === 0) return undefined;
  const dir = path.join(CONTENT_ROOT, version, ...slugSegments.slice(0, -1));
  const last = slugSegments[slugSegments.length - 1]!;
  const indexPath = path.join(CONTENT_ROOT, version, ...slugSegments, "index.md");
  if (fs.existsSync(indexPath)) return indexPath;
  const direct = path.join(dir, `${last}.md`);
  if (fs.existsSync(direct)) return direct;
  return undefined;
}

export function getDoc(version: string, slugSegments: string[]): DocPage | undefined {
  const filePath = resolveDocFile(version, slugSegments);
  if (!filePath) return undefined;
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  // 個別ページ取得は frontmatter を厳格に検証する: 壊れたコンテンツはビルド時に止める。
  const frontmatter = parseDocFrontmatter(parsed.data, filePath);
  return {
    version,
    slug: slugSegments,
    href: `/docs/${version}/${slugSegments.join("/")}`,
    frontmatter,
    body: parsed.content,
  };
}

/** 全ドキュメントの slug を SSG 用に列挙。 */
export function listAllSlugs(): { version: string; slug: string[] }[] {
  const result: { version: string; slug: string[] }[] = [];
  for (const version of listVersions()) {
    const nav = getNavigation(version);
    for (const section of nav.sections) {
      for (const item of section.items) {
        result.push({ version, slug: item.slug });
      }
    }
  }
  return result;
}
