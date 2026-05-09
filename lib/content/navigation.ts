import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { listMarkdownBaseNames, listSubdirs, readJsonIfExists } from "./fs";
import { categoryDir, versionDir } from "./paths";
import { parseCategoryMeta, tryParseDocFrontmatter, type CategoryMeta } from "./frontmatter";
import { readVersionMeta } from "./versions";

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

export type AdjacentDocs = { prev?: NavItem; next?: NavItem };

function applyOrder<T extends string>(items: T[], order?: T[]): T[] {
  if (!order || order.length === 0) return [...items].sort();
  const set = new Set(items);
  const ordered = order.filter((name) => set.has(name));
  const remaining = items.filter((name) => !order.includes(name)).sort();
  return [...ordered, ...remaining];
}

function humanize(slug: string): string {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function readCategoryMeta(version: string, category: string): CategoryMeta {
  const metaPath = path.join(categoryDir(version, category), "_meta.json");
  const raw = readJsonIfExists(metaPath);
  return raw === undefined ? {} : parseCategoryMeta(raw, metaPath);
}

export function getNavigation(version: string): NavTree {
  const versionMeta = readVersionMeta(version);
  const dir = versionDir(version);
  const categories = applyOrder(listSubdirs(dir), versionMeta.order);

  const sections: NavSection[] = categories.map((category) => {
    const categoryMeta = readCategoryMeta(version, category);
    const baseNames = listMarkdownBaseNames(categoryDir(version, category));
    const ordered = applyOrder(baseNames, categoryMeta.order);

    const items: NavItem[] = ordered.map((base) => {
      const slug = base === "index" ? [category] : [category, base];
      const href = `/docs/${version}/${slug.join("/")}`;
      // タイトルは frontmatter があればそちらを優先。なければファイル名から生成。
      // ナビ列挙は best-effort: 1 ファイルが壊れても全体を止めたくないので tryParse を使う。
      const filePath = path.join(categoryDir(version, category), `${base}.md`);
      let title = humanize(base === "index" ? category : base);
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        const fm = tryParseDocFrontmatter(matter(raw).data);
        if (fm) title = fm.title;
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

function slugEquals(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((segment, index) => segment === b[index]);
}

/**
 * 同 version の nav 順 (= `_meta.json.order`) で section を flatten し、
 * 与えられた slug の前後にある doc を返す。section 跨ぎは連続する。
 */
export function getAdjacentDocs(version: string, slug: string[]): AdjacentDocs {
  const nav = getNavigation(version);
  const flat = nav.sections.flatMap((section) => section.items);
  const index = flat.findIndex((item) => slugEquals(item.slug, slug));
  if (index < 0) return {};
  return {
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index < flat.length - 1 ? flat[index + 1] : undefined,
  };
}
