import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// Turbopack の静的解析が `process.cwd()` を未確定 path として警告するが、
// これらの読み込みはサーバー側 (Node) でのみ実行されるため安全。
const CONTENT_ROOT = path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "docs");

export type DocFrontmatter = {
  title: string;
  description?: string;
};

export type DocPage = {
  version: string;
  // slug は URL セグメント (category/page-name)。.md / index は除く。
  slug: string[];
  href: string;
  frontmatter: DocFrontmatter;
  body: string;
};

type CategoryMeta = {
  label?: string;
  // 並び順。slug ベース名 (拡張子なし、index 含む)。
  order?: string[];
};

type VersionMeta = {
  // 大分類の並び順。ディレクトリ名で指定。
  order?: string[];
  // バージョン表示ラベル (省略時はディレクトリ名)。
  label?: string;
};

export type NavItem = {
  title: string;
  href: string;
  // slug 一致判定用。
  slug: string[];
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
};

export type NavTree = {
  version: string;
  versionLabel: string;
  sections: NavSection[];
};

function readJsonIfExists<T>(filePath: string): T | undefined {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function listSubdirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function listMarkdownBaseNames(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/, ""));
}

function applyOrder<T extends string>(items: T[], order?: T[]): T[] {
  if (!order || order.length === 0) return [...items].sort();
  const set = new Set(items);
  const ordered = order.filter((name) => set.has(name));
  const remaining = items.filter((name) => !order.includes(name)).sort();
  return [...ordered, ...remaining];
}

function humanize(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

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

function readVersionMeta(version: string): VersionMeta {
  const metaPath = path.join(CONTENT_ROOT, version, "_meta.json");
  return readJsonIfExists<VersionMeta>(metaPath) ?? {};
}

function readCategoryMeta(version: string, category: string): CategoryMeta {
  const metaPath = path.join(CONTENT_ROOT, version, category, "_meta.json");
  return readJsonIfExists<CategoryMeta>(metaPath) ?? {};
}

export function getNavigation(version: string): NavTree {
  const versionMeta = readVersionMeta(version);
  const versionDir = path.join(CONTENT_ROOT, version);
  const categories = applyOrder(listSubdirs(versionDir), versionMeta.order);

  const sections: NavSection[] = categories.map((category) => {
    const categoryMeta = readCategoryMeta(version, category);
    const baseNames = listMarkdownBaseNames(path.join(versionDir, category));
    const ordered = applyOrder(baseNames, categoryMeta.order);

    const items: NavItem[] = ordered.map((base) => {
      const slug = base === "index" ? [category] : [category, base];
      const href = `/docs/${version}/${slug.join("/")}`;
      // タイトルは frontmatter があればそちらを優先。なければファイル名から生成。
      const filePath = path.join(versionDir, category, `${base}.md`);
      let title = humanize(base === "index" ? category : base);
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        const fm = matter(raw).data as DocFrontmatter;
        if (fm.title) title = fm.title;
      } catch {
        // noop
      }
      return { title, href, slug };
    });

    return {
      id: category,
      label: categoryMeta.label ?? humanize(category),
      items,
    };
  });

  return {
    version,
    versionLabel: versionMeta.label ?? version,
    sections,
  };
}

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
  const fm = parsed.data as DocFrontmatter;
  return {
    version,
    slug: slugSegments,
    href: `/docs/${version}/${slugSegments.join("/")}`,
    frontmatter: {
      title: fm.title ?? humanize(slugSegments[slugSegments.length - 1]!),
      description: fm.description,
    },
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

export type DocSearchEntry = {
  version: string;
  slug: string[];
  href: string;
  title: string;
  description?: string;
  // headings: 見出しテキスト (見出しレベル 1-3 のみ)
  headings: string[];
  // body: コードブロック除去後のプレーンテキスト
  body: string;
};

function stripMarkdown(md: string): string {
  return md
    // fenced code
    .replace(/```[\s\S]*?```/g, " ")
    // inline code
    .replace(/`[^`]*`/g, " ")
    // images
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    // links: [text](url) → text
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    // headings markers / emphasis / blockquote / hr
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~>]+/g, "")
    .replace(/^---+$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(md: string): string[] {
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)$/);
    if (m) {
      out.push(m[2]!.trim());
    }
  }
  return out;
}

export function buildSearchEntries(version: string): DocSearchEntry[] {
  const nav = getNavigation(version);
  const entries: DocSearchEntry[] = [];
  for (const section of nav.sections) {
    for (const item of section.items) {
      const doc = getDoc(version, item.slug);
      if (!doc) continue;
      entries.push({
        version,
        slug: doc.slug,
        href: doc.href,
        title: doc.frontmatter.title,
        description: doc.frontmatter.description,
        headings: extractHeadings(doc.body),
        body: stripMarkdown(doc.body),
      });
    }
  }
  return entries;
}
