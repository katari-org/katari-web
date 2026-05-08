// 公開 API barrel: 外部からは `@/lib/content` 経由で参照する。
// 内部モジュール間の参照は相対 import を使い、bundle bloat を避ける。
export type { DocFrontmatter } from "./frontmatter";
export type { NavItem, NavSection, NavTree } from "./navigation";
export type { DocPage } from "./docs";
export type { DocSearchEntry } from "./search";

export { latestVersion, listVersions } from "./versions";
export { getNavigation } from "./navigation";
export { getDoc, listAllSlugs } from "./docs";
export { buildSearchEntries } from "./search";
export { extractHeadings, stripMarkdown } from "./markdown";
