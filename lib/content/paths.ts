import path from "node:path";

// Turbopack の静的解析が `process.cwd()` を未確定 path として警告するが、
// この読み込みはサーバー側 (Node) でのみ実行されるため安全。
// テスト時は `KATARI_CONTENT_ROOT` 環境変数で fixture ディレクトリに差し替える。
export const CONTENT_ROOT =
  process.env.KATARI_CONTENT_ROOT ??
  path.join(/*turbopackIgnore: true*/ process.cwd(), "content", "docs");

export function versionDir(version: string): string {
  return path.join(CONTENT_ROOT, version);
}

export function categoryDir(version: string, category: string): string {
  return path.join(CONTENT_ROOT, version, category);
}
