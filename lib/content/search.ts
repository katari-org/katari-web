import { getDoc } from "./docs";
import { extractHeadings, stripMarkdown } from "./markdown";
import { getNavigation } from "./navigation";

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
