// satori (next/og) は variable font を扱えないため、Google Fonts の static subset を build 時に
// fetch する。OFL ライセンスのフォントなので埋め込み配布は問題なし。
//
// 重要: Google Fonts CSS API は subset 別に複数の @font-face を返す (latin / latin-ext /
// vietnamese ...) ことがあり、最初の url を素朴に拾うと「必要な大文字が含まれない subset」を
// 引いてしまう事故がある。`text=` パラメータで必要 glyphs だけを含む単一 font を要求する。
import { getDoc, listAllSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

async function fetchGoogleFontTtf(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer> {
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}`;
  // 古めの User-Agent で TTF / WOFF を返してもらう (新しい UA だと WOFF2 → satori 非対応)。
  const userAgent =
    "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
  const cssRes = await fetch(cssUrl, { headers: { "User-Agent": userAgent } });
  if (!cssRes.ok) {
    throw new Error(`Google Fonts CSS fetch failed for ${family} ${weight}: ${cssRes.status}`);
  }
  const css = await cssRes.text();
  const match = css.match(/url\((https?:\/\/[^)]+)\)\s*format\(['"]?(?:truetype|woff|opentype)/);
  if (!match) {
    throw new Error(`Could not extract TTF/WOFF URL for ${family} ${weight}\nCSS:\n${css}`);
  }
  const fontRes = await fetch(match[1]!);
  if (!fontRes.ok) {
    throw new Error(`Font binary fetch failed: ${match[1]} (${fontRes.status})`);
  }
  return fontRes.arrayBuffer();
}

const cache = new Map<string, Promise<ArrayBuffer>>();
function getCachedFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const key = `${family}:${weight}:${text}`;
  let promise = cache.get(key);
  if (!promise) {
    promise = fetchGoogleFontTtf(family, weight, text);
    cache.set(key, promise);
  }
  return promise;
}

/** サイト全体で OG に使う可能性のある unique characters。各 doc title + description + ブランド。 */
export function gatherOgText(): string {
  const set = new Set<string>();
  for (const ch of "KATARI") set.add(ch);
  for (const ch of siteConfig.description) set.add(ch);
  for (const { version, slug } of listAllSlugs()) {
    const doc = getDoc(version, slug);
    if (doc) {
      for (const ch of doc.frontmatter.title) set.add(ch);
    }
  }
  return Array.from(set).join("");
}

export type OgFonts = {
  lexendRegular: ArrayBuffer;
  lexendBold: ArrayBuffer;
  lexendTeraBlack: ArrayBuffer;
};

export async function loadOgFonts(text: string = gatherOgText()): Promise<OgFonts> {
  const [lexendRegular, lexendBold, lexendTeraBlack] = await Promise.all([
    getCachedFont("Lexend", 300, text),
    getCachedFont("Lexend", 700, text),
    getCachedFont("Lexend Tera", 900, text),
  ]);
  return { lexendRegular, lexendBold, lexendTeraBlack };
}
