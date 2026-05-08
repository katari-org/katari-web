"use client";

import Link from "next/link";
import type { DocSearchEntry } from "@/lib/content";

type Props = {
  query: string;
  results: DocSearchEntry[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (entry: DocSearchEntry) => void;
};

export function SearchResults({ query, results, activeIndex, onHover, onSelect }: Props) {
  if (!query) {
    return (
      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
        Start typing to search the docs.
      </div>
    );
  }
  if (results.length === 0) {
    return <div className="px-3 py-6 text-center text-sm text-muted-foreground">No results.</div>;
  }
  return (
    <ul className="space-y-1">
      {results.map((entry, i) => (
        <li key={entry.href}>
          <Link
            href={entry.href}
            onClick={() => onSelect(entry)}
            onMouseEnter={() => onHover(i)}
            className={`block px-3 py-2 transition-colors ${
              i === activeIndex ? "bg-muted" : "hover:bg-muted"
            }`}
          >
            <div className="text-sm font-medium">{entry.title}</div>
            {entry.description && (
              <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {entry.description}
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
