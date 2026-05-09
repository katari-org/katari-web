import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { loadOgFonts } from "@/lib/og/fonts";
import { loadLogoDataUrl, ogBackgroundStyle, ogColors, ogSize } from "@/lib/og/shared";

export const dynamic = "force-static";

export const alt = `${siteConfig.name} — ${siteConfig.description}`;
export const size = ogSize;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { lexendRegular, lexendBold, lexendTeraBlack } = await loadOgFonts();
  // 中央 KATARI 文字の背後に薄く重ねる用ロゴ (background 色で塗りつぶす)。
  const logoDataUrl = await loadLogoDataUrl(ogColors.background);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...ogBackgroundStyle,
      }}
    >
      {/* 中央の KATARI 文字背後に薄く配置されるロゴ。drop-shadow で微かに浮き上がらせる。 */}
      {/* satori は next/image を扱えないので <img> 直書きが正解。 */}
      <img
        src={logoDataUrl}
        alt=""
        width={400}
        height={400}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -55%)",
        }}
      />
      {/* 中央 KATARI (Lexend Tera Black) */}
      <div
        style={{
          position: "relative",
          fontFamily: "LexendTera",
          fontWeight: 900,
          fontSize: 140,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: ogColors.foreground,
        }}
      >
        KATARI
      </div>
      {/* description (Lexend Light) */}
      <div
        style={{
          position: "relative",
          marginTop: 28,
          fontFamily: "Lexend",
          fontWeight: 300,
          fontSize: 36,
          color: ogColors.mutedForeground,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Lexend", data: lexendRegular, style: "normal", weight: 400 },
        { name: "Lexend", data: lexendBold, style: "normal", weight: 700 },
        { name: "LexendTera", data: lexendTeraBlack, style: "normal", weight: 900 },
      ],
    },
  );
}
