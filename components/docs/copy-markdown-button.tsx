"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

export function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard が使えない環境では何もしない
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 shrink-0 items-center justify-center gap-2 border border-border px-4 text-sm font-normal transition-all hover:bg-muted hover:border-border-strong hover:cursor-pointer"
    >
      {copied ? <Check className="size-4" /> : <Clipboard className="size-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
