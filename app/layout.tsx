import type { Metadata } from "next";
import {
  Lexend_Tera,
  Lexend,
  DM_Sans,
  DM_Mono,
  Zen_Kaku_Gothic_Antique,
  Noto_Sans_JP,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import localFont from "next/font/local";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

// ブランド名 "Katari" の表示用。Black (900) のみ。
const lexendTera = Lexend_Tera({
  variable: "--font-lexend-tera",
  subsets: ["latin"],
  weight: "900",
});

const lexend = localFont({
  src: "../public/Lexend.ttf",
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Katari",
    template: "%s — Katari",
  },
  description: "A language for orchestrating agents.",
  keywords: [
    "katari",
    "agent orchestration",
    "programming language",
    "effect system",
    "type system",
    "compiler",
    "runtime",
    "LSP",
  ],
  icons: {
    icon: siteConfig.logo,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${lexend.variable} ${lexendTera.variable} ${dmMono.variable} ${dmSans.variable} ${notoSansJP.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground -z-10 relative">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
