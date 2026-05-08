"use client";

import { useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import type { DocSearchEntry } from "@/lib/content";
import { useSearchIndex } from "./use-search-index";

export type UseSearchResult = {
  query: string;
  setQuery: (query: string) => void;
  results: DocSearchEntry[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (entry: DocSearchEntry) => void;
};

/** クエリ管理 / 結果計算 / キーボード操作をまとめた検索ロジック hook。 */
export function useSearch(version: string, onClose: () => void): UseSearchResult {
  const data = useSearchIndex(version);
  const router = useRouter();
  const [query, setQueryRaw] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // 入力が変わったら active index をリセット。
  const setQuery = useCallback((value: string) => {
    setQueryRaw(value);
    setActiveIndex(0);
  }, []);

  const results = useMemo<DocSearchEntry[]>(() => {
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
      .filter((entry): entry is DocSearchEntry => Boolean(entry));
  }, [data, query]);

  const onSelect = useCallback(
    (entry: DocSearchEntry) => {
      onClose();
      router.push(entry.href);
    },
    [onClose, router],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex(Math.min(activeIndex + 1, Math.max(0, results.length - 1)));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(Math.max(0, activeIndex - 1));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const target = results[activeIndex];
        if (target) onSelect(target);
      }
    },
    [activeIndex, results, onSelect],
  );

  return { query, setQuery, results, activeIndex, setActiveIndex, onKeyDown, onSelect };
}
