"use client";

import { useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function SidebarScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = savedScrollTop.current;
  }, [pathname]);

  return (
    <div
      ref={ref}
      onScroll={(e) => {
        savedScrollTop.current = e.currentTarget.scrollTop;
      }}
      className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-visible pr-4"
    >
      {children}
    </div>
  );
}
