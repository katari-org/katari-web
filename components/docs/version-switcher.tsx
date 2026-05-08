"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

type VersionSwitcherProps = {
  versions: string[];
  current: string;
};

export function VersionSwitcher({ versions, current }: VersionSwitcherProps) {
  const router = useRouter();
  return (
    <div className="relative">
      <select
        value={current}
        onChange={(e) => {
          const next = e.target.value;
          if (next !== current) {
            router.push(`/docs/${next}`);
          }
        }}
        className="h-9 w-full appearance-none border border-border pl-3 pr-9 text-sm font-medium transition-colors hover:border-border-strong hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background"
        aria-label="Documentation version"
      >
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
