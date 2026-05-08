import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} — ${siteConfig.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#f4ede0",
        color: "#1c1818",
      }}
    >
      <div
        style={{
          fontSize: 200,
          fontWeight: 900,
          letterSpacing: "-0.02em",
        }}
      >
        {siteConfig.name.toUpperCase()}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 300,
          color: "#5a5252",
          maxWidth: 900,
          textAlign: "center",
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
