import type { Metadata } from "next";
import {
  Noto_Sans,
  Noto_Sans_JP,
  Geist_Mono,
  Lexend_Tera,
  Lexend,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ブランド名 "Katari" の表示用。Black (900) のみ。
const lexendTera = Lexend_Tera({
  variable: "--font-lexend-tera",
  subsets: ["latin"],
  weight: "900",
});

// 特に強調したいテキスト用。
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Katari",
    template: "%s — Katari",
  },
  description: "A language for orchestrating agents.",
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
      className={`${notoSans.variable} ${notoSansJP.variable} ${lexend.variable} ${geistMono.variable} ${lexendTera.variable}`}
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
