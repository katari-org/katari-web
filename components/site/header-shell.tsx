"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function HeaderShell({ children }: { children: ReactNode }) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "mx-auto flex h-16 w-full max-w-380 items-center gap-4 px-4 sm:px-6 lg:px-8 transition-[background-color,backdrop-filter] duration-200",
        atTop ? "bg-transparent" : "bg-background/70 backdrop-blur-sm",
      )}
    >
      {children}
    </div>
  );
}
