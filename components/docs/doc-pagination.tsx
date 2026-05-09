import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdjacentDocs } from "@/lib/content";

// Doc 末尾の前後ナビゲーション。Card 自体には border を出さず、上の仕切り線のみ。
// hover で muted 背景を被せる。
export function DocPagination({ prev, next }: AdjacentDocs) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex justify-between gap-4 border-t border-border pt-6"
    >
      {prev ? (
        <Link href={prev.href} className="mr-auto flex flex-col gap-1 group">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <ChevronLeft className="size-4" />
            Previous
          </span>
          <span className="font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span className="mr-auto" />
      )}
      {next ? (
        <Link href={next.href} className="ml-auto flex flex-col items-end gap-1 text-right group">
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Next
            <ChevronRight className="size-4" />
          </span>
          <span className="font-medium">{next.title}</span>
        </Link>
      ) : (
        <span className="ml-auto" />
      )}
    </nav>
  );
}
