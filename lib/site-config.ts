export const siteConfig = {
  name: "Katari",
  // ロゴはここで参照されます。public/ 直下の差し替えで切り替え可能。
  // SVG は mask-image として使われ、塗りはテーマトークン (foreground) で行う。
  logo: "/katari.svg",
  description: "A language for orchestrating agents.",
  url: "https://katari.dev",
  copyright: "yukikurage",
  copyrightYear: 2026,
  // 仮 URL。実際のリポジトリに合わせて差し替える。
  github: "https://github.com/katari-org/katari",
  // ヘッダーのナビ。docs 以外のページが増えたら追記。
  nav: [{ label: "Docs", href: "/docs" }],
  // フッターの link 群。仮置き。
  footerLinks: [
    {
      heading: "Project",
      items: [
        {
          label: "GitHub",
          href: "https://github.com/katari-org/katari",
          external: true,
        },
        {
          label: "License",
          href: "https://github.com/katari-org/katari/blob/main/LICENSE",
          external: true,
        },
      ],
    },
    {
      heading: "Docs",
      items: [
        { label: "Getting Started", href: "/docs" },
        { label: "Language Reference", href: "/docs" },
        { label: "Toolchains", href: "/docs" },
      ],
    },
    {
      heading: "Community",
      items: [
        {
          label: "Issues",
          href: "https://github.com/katari-org/katari/issues",
          external: true,
        },
        {
          label: "Discussions",
          href: "https://github.com/katari-org/katari/discussions",
          external: true,
        },
      ],
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
