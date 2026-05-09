import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { formatHex, formatHex8 } from "culori";

// satori (next/og) は `oklch()` をサポートしないため、build 時に hex へ変換して渡す。
// globals.css のトークン値をそのまま受け取り、sRGB gamut にクランプした hex (alpha 付きも可) を返す。
function oklchToHex(l: number, c: number, h: number, alpha: number = 1): string {
  const color = { mode: "oklch" as const, l, c, h, alpha };
  return alpha === 1 ? formatHex(color) : formatHex8(color);
}

export const ogColors = {
  background: oklchToHex(0.233, 0.015, 279.54), // katari-950
  muted: oklchToHex(0.311, 0.025, 284.87), // katari-900
  foreground: oklchToHex(0.931, 0.004, 271.53), // katari-50
  mutedForeground: oklchToHex(0.751, 0.015, 268.48), // katari-300
} as const;

/** muted を alpha 付きで返す (gradient stop 用)。alpha は 0..1。 */
export function mutedAlpha(alpha: number): string {
  return oklchToHex(0.311, 0.025, 284.87, alpha);
}

export const ogSize = { width: 1200, height: 630 } as const;

/** public/katari.svg を読み、fill 色を差し替えて data URL にする。 */
export async function loadLogoDataUrl(fillColor: string): Promise<string> {
  const raw = await readFile(join(process.cwd(), "public", "katari.svg"), "utf-8");
  // 元の fill="#25204D" を任意の色に差し替える (大文字小文字両対応)。
  const colored = raw.replace(/fill="#25204D"/i, `fill="${fillColor}"`);
  return `data:image/svg+xml;utf8,${encodeURIComponent(colored)}`;
}

/**
 * 上部中心から広がる薄い radial gradient (muted → muted alpha 0)。
 * layout.tsx の `radial-gradient(closest-side, var(--muted), transparent_70%)` と同じトーン。
 *
 * satori 向け注意点:
 * - position / size はピクセル指定 (`50% 0%` 表記の % を satori が誤解釈する事例あり)
 * - 終端は `transparent` キーワード (= rgba(0,0,0,0) = 黒の alpha 0) を避け、同色 muted の
 *   alpha 0 を使う。`transparent` で補間すると黒成分が混じり、中間で暗いリングが出る事故あり
 */
export const ogBackgroundStyle = {
  background:
    `radial-gradient(circle 1000px at 600px 0px,` +
    ` ${mutedAlpha(1)} 0%, ${mutedAlpha(0)} 70%, ${mutedAlpha(0)} 100%),` +
    ` ${ogColors.background}`,
} as const;
