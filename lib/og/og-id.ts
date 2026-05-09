// (version, slug) ↔ flat segment ID の変換。
// route.tsx と page.tsx の両方から共有するため別モジュールに切り出している
// (route.tsx は named export を制限される)。

const SEPARATOR = "--";

export function encodeOgId(version: string, slug: string[]): string {
  return [version, ...slug].join(SEPARATOR);
}

export function decodeOgId(ogId: string): { version: string; slug: string[] } {
  const [version, ...slug] = ogId.split(SEPARATOR);
  return { version: version ?? "", slug };
}

/** Doc ページの metadata から参照する OG 画像の URL。 */
export function ogImageHref(version: string, slug: string[]): string {
  return `/api/og/${encodeOgId(version, slug)}/og.png`;
}
