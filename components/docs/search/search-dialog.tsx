"use client";

import { Suspense, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { SearchResults } from "./search-results";

type SearchDialogProps = {
  version: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DialogBody({ version, onClose }: { version: string; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, results, activeIndex, setActiveIndex, onKeyDown, onSelect } = useSearch(
    version,
    onClose,
  );

  // 入力欄に初期フォーカス: DOM 操作のため useEffect が必要。
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="w-full max-w-xl overflow-hidden bg-background shadow-2xl border border-border"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="px-1.5 py-0.5 text-xs text-muted-foreground">esc</kbd>
      </div>
      <div className="max-h-[60vh] overflow-y-auto p-2">
        <SearchResults
          query={query}
          results={results}
          activeIndex={activeIndex}
          onHover={setActiveIndex}
          onSelect={onSelect}
        />
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

export function SearchDialog({ version, open, onOpenChange }: SearchDialogProps) {
  useEscapeKey(() => onOpenChange(false), open);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/10 p-4 pt-[15vh] backdrop-blur-sm transition-all"
      onClick={() => onOpenChange(false)}
    >
      <Suspense fallback={<LoadingShell />}>
        <DialogBody version={version} onClose={() => onOpenChange(false)} />
      </Suspense>
    </div>,
    document.body,
  );
}
