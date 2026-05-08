"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Check, Clipboard } from "lucide-react";
import { cn } from "@/lib/cn";

// rehype-pretty-code が生成する <pre> をラップしてコピーボタンを右上に出す。
// 位置基準を pre 自身にしたいので <pre> を <div> で包んで group / relative
// を付け、button はその内側で absolute 配置する。
export function CodeBlockPre({
  className,
  children,
  ...rest
}: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);

  const onCopy = async () => {
    const text = preRef.current?.querySelector("code")?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (copied || forceVisible) return;
      setCopied(true);
      setForceVisible(true);
      setTimeout(() => setCopied(false), 1500);
      setTimeout(() => setForceVisible(false), 1200);
    } catch {
      // clipboard が使えない環境では何もしない
    }
  };

  const Icon = copied ? Check : Clipboard;
  const ariaLabel = copied ? "Copied" : "Copy code";

  return (
    <div className="group relative w-full">
      <pre ref={preRef} className={className} {...rest}>
        {children}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={ariaLabel}
        className={cn(
          "absolute top-2 right-2 inline-flex size-8 items-center justify-center border border-border text-foreground transition-all hover:bg-muted hover:border-border-strong hover:cursor-pointer",
          forceVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Icon className="size-3.5" />
      </button>
    </div>
  );
}
