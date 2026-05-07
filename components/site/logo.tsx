import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/cn";

const sizeVariants = {
  sm: { height: "h-6", text: "text-xs" },
  md: { height: "h-8", text: "text-sm" },
  lg: { height: "h-9", text: "text-base" },
  xl: { height: "h-10", text: "text-lg" },
  "2xl": { height: "h-12", text: "text-xl" },
  "3xl": { height: "h-14", text: "text-2xl" },
} as const;

type LogoSize = keyof typeof sizeVariants;

type LogoProps = {
  className?: string;
  size?: LogoSize;
  showText?: boolean;
  isLinked?: boolean;
};

export function Logo({
  className,
  size = "md",
  showText = true,
  isLinked = true,
}: LogoProps) {
  const { height, text } = sizeVariants[size];
  return isLinked ? (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-1 group hover:opacity-80 hover:gap-2 transition-all",
        height,
        className,
      )}
    >
      <LogoMark className={"h-full"} />
      {showText && (
        <span
          className={`font-display group-hover:tracking-wider transition-all ${text} tracking-tight uppercase leading-none`}
        >
          {siteConfig.name}
        </span>
      )}
    </Link>
  ) : (
    <span className={cn("inline-flex items-center gap-1", height, className)}>
      <LogoMark className={"h-full"} />
      {showText && (
        <span
          className={`font-display ${text} tracking-tight uppercase leading-none`}
        >
          {siteConfig.name}
        </span>
      )}
    </span>
  );
}

/**
 * ロゴマーク (ダイヤ型 SVG) を mask-image で描画。
 *  - light モード: katari-900 (foreground と同じ濃い色)
 *  - dark モード: 真っ白 (#fff)
 */
/**
 * ロゴマーク (ダイヤ型 SVG) を描画。
 *  - 親要素: 影 (drop-shadow) を担当。
 *  - 子要素: マスク (mask-image) と背景色を担当。
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-block", className)}>
      <span
        aria-hidden
        className={cn("block h-full max-w-full aspect-square bg-current")}
        style={{
          maskImage: `url(${siteConfig.logo})`,
          WebkitMaskImage: `url(${siteConfig.logo})`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </span>
  );
}
