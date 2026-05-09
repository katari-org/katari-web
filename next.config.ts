import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静的書き出し: ビルド成果物を `out/` に出して、
  // 任意のオブジェクトストレージ / CDN (例: Cloudflare Workers Static Assets) で配信する。
  output: "export",
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
