import { ImageResponse } from "next/og";
import { getDoc, listAllSlugs } from "@/lib/content";
import { loadOgFonts } from "@/lib/og/fonts";
import { decodeOgId, encodeOgId } from "@/lib/og/og-id";
import { loadLogoDataUrl, ogBackgroundStyle, ogColors, ogSize } from "@/lib/og/shared";

// 動的 OG: catch-all `[...slug]` の直下に opengraph-image / 固定 segment を置けない Next.js
// ルーティング制約のため、(version, slug) を `--` で flatten した単一 segment `[ogId]` に集約。
// `force-static` + generateStaticParams で build 時に各 doc 分の PNG を `out/` に焼く。

export const dynamic = "force-static";

export async function generateStaticParams() {
  return listAllSlugs().map(({ version, slug }) => ({ ogId: encodeOgId(version, slug) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ ogId: string }> }) {
  const { ogId } = await params;
  const { version, slug } = decodeOgId(ogId);
  const doc = getDoc(version, slug);
  const title = doc?.frontmatter.title ?? "Katari Docs";

  const { lexendRegular, lexendBold, lexendTeraBlack } = await loadOgFonts();
  const logoDataUrl = await loadLogoDataUrl(ogColors.foreground);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        ...ogBackgroundStyle,
      }}
    >
      {/* 左上ロゴ (高さ 64) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoDataUrl} alt="" width={64} height={64} />

      {/* タイトル: flex:1 で中央領域を占有、左寄せ縦中央 */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <div
          style={{
            fontFamily: "Lexend",
            fontWeight: 700,
            fontSize: 88,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: ogColors.foreground,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>

      {/* 右下ブランドネーム: flex flow に入れて、ロゴ (64px) と対称な 64px 高に固定 */}
      {/* これでタイトル領域 (flex:1) の中央が OG の geometric center に一致する */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: 64,
          fontFamily: "LexendTera",
          fontWeight: 900,
          fontSize: 36,
          letterSpacing: "-0.04em",
          color: ogColors.foreground,
        }}
      >
        KATARI
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Lexend", data: lexendRegular, style: "normal", weight: 400 },
        { name: "Lexend", data: lexendBold, style: "normal", weight: 700 },
        { name: "LexendTera", data: lexendTeraBlack, style: "normal", weight: 900 },
      ],
    },
  );
}
