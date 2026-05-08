"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavTree } from "@/lib/content";
import { VersionSwitcher } from "./version-switcher";
import { cn } from "@/lib/cn";

type SidebarProps = {
  versions: string[];
  nav: NavTree;
};

export function Sidebar({ versions, nav }: SidebarProps) {
  const pathname = usePathname();
  return (
    <nav aria-label="Documentation navigation" className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Version
        </p>
        <VersionSwitcher versions={versions} current={nav.version} />
      </div>
      {nav.sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <p className="text-sm font-display-text font-semibold">{section.label}</p>
          <ul className="space-y-1 border-l border-border">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "-ml-px block border-l border-transparent py-1 pl-4 text-sm transition-colors",
                      active
                        ? "border-foreground font-medium text-foreground"
                        : "text-muted-foreground hover:border-border-strong hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
