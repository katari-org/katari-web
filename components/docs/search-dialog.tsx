"use client";

import {
  Suspense,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Document } from "flexsearch";
import { createPortal } from "react-dom";

type SearchEntry = {
  version: string;
  slug: string[];
  href: string;
  title: string;
  description?: string;
  headings: string[];
  body: string;
};

type SearchDoc = {
  id: number;
  title: string;
  description: string;
  headings: string;
  body: string;
};

type IndexedSearch = {
  entries: SearchEntry[];
  index: Document<SearchDoc>;
};

const indexCache = new Map<string, Promise<IndexedSearch>>();

function loadIndex(version: string): Promise<IndexedSearch> {
  const cached = indexCache.get(version);
  if (cached) return cached;
  const promise = (async () => {
    const res = await fetch(`/search-index/${version}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load search index for ${version}`);
    }
    const entries = (await res.json()) as SearchEntry[];
    const index = new Document<SearchDoc>({
      tokenize: "forward",
      cache: 100,
      document: {
        id: "id",
        index: ["title", "description", "headings", "body"],
        store: false,
      },
    });
    entries.forEach((entry, i) => {
      index.add({
        id: i,
        title: entry.title,
        description: entry.description ?? "",
        headings: entry.headings.join(" "),
        body: entry.body,
      });
    });
    return { entries, index };
  })();
  indexCache.set(version, promise);
  return promise;
}

function DialogContent({
  version,
  onClose,
}: {
  version: string;
  onClose: () => void;
}) {
  const router = useRouter();
  // React 19 の use() で Suspense 経由のデータ取得。indexCache のおかげで
  // 同じ version は同じ Promise が返るので render のたびに refetch しない。
  const data = use(loadIndex(version));

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 入力欄に初期フォーカス: DOM 操作のため useEffect が必要。
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo<SearchEntry[]>(() => {
    if (!query.trim()) return [];
    const hits = data.index.search(query, { limit: 8, enrich: false });
    const seen = new Set<number>();
    const flat: number[] = [];
    for (const field of hits) {
      for (const id of field.result as number[]) {
        if (!seen.has(id)) {
          seen.add(id);
          flat.push(id);
        }
      }
    }
    return flat
      .map((id) => data.entries[id])
      .filter((x): x is SearchEntry => Boolean(x));
  }, [data, query]);

  const onSelect = useCallback(
    (entry: SearchEntry) => {
      onClose();
      router.push(entry.href);
    },
    [onClose, router],
  );

  return (
    <div
      className="w-full max-w-xl overflow-hidden bg-background shadow-2xl border boreder-border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) =>
                Math.min(i + 1, Math.max(0, results.length - 1)),
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const target = results[activeIndex];
              if (target) onSelect(target);
            }
          }}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="px-1.5 py-0.5 text-xs text-muted-foreground">esc</kbd>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {!query && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            Start typing to search the docs.
          </div>
        )}
        {query && results.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No results.
          </div>
        )}
        {results.length > 0 && (
          <ul className="space-y-1">
            {results.map((entry, i) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onClick={() => onSelect(entry)}
                  onMouseEnter={() => setActiveIndex(i)}
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
        )}
      </div>
    </div>
  );
}

function LoadingShell() {
  return (
    <div className="w-full max-w-xl bg-background p-6 text-center text-sm text-muted-foreground shadow-2xl">
      Loading…
    </div>
  );
}

type SearchDialogProps = {
  version: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SearchDialog({
  version,
  open,
  onOpenChange,
}: SearchDialogProps) {
  // ESC で閉じる: window 全体の event なので useEffect 必須。
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/10 p-4 pt-[15vh] backdrop-blur-sm transition-all"
      onClick={() => onOpenChange(false)}
    >
      <Suspense fallback={<LoadingShell />}>
        <DialogContent version={version} onClose={() => onOpenChange(false)} />
      </Suspense>
    </div>,
    document.body,
  );
}

export function SearchTrigger({ version }: { version: string }) {
  const [open, setOpen] = useState(false);

  // Cmd/Ctrl+K グローバルショートカット: window event なので useEffect 必須。
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
        className="inline-flex h-9 w-full max-w-65 items-center gap-2 border border-border px-3 text-sm text-muted-foreground hover:cursor-text"
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left"></span>
        <kbd className="hidden px-1.5 py-0.5 text-sm sm:inline">⌘K</kbd>
      </button>
      <SearchDialog version={version} open={open} onOpenChange={setOpen} />
    </>
  );
}
