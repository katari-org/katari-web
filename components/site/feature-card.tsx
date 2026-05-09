import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  href: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

// トップページの feature カードと doc 内の DocCard で共通利用するプリミティブ。
// グリッド幅は呼び出し側で制御する (Card 自体は中身レイアウトのみ)。
export function FeatureCard({ href, title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 border border-border p-6 hover:bg-muted hover:border-border-strong transition-colors"
    >
      {Icon && <Icon className="size-6" />}
      <h3 className="font-display-text font-semibold text-base">{title}</h3>
      {description && (
        <p className="text-muted-foreground font-light text-sm leading-relaxed">{description}</p>
      )}
    </Link>
  );
}
