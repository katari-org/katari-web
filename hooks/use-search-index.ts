"use client";

import { use } from "react";
import { Document } from "flexsearch";
import type { DocSearchEntry } from "@/lib/content";

type SearchDoc = {
  id: number;
  title: string;
  description: string;
  headings: string;
  body: string;
};

export type IndexedSearch = {
  entries: DocSearchEntry[];
  index: Document<SearchDoc>;
};

// version -> Promise でキャッシュ。同じ version を render するたびに refetch せず、
// React 19 の use() が同一 Promise を unwrap して Suspense キャッシュを利用する。
const indexCache = new Map<string, Promise<IndexedSearch>>();

function loadIndex(version: string): Promise<IndexedSearch> {
  const cached = indexCache.get(version);
  if (cached) return cached;
  const promise = (async () => {
    const res = await fetch(`/search-index/${version}.json`);
    if (!res.ok) {
      throw new Error(`Failed to load search index for ${version}`);
    }
    const entries = (await res.json()) as DocSearchEntry[];
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

/** Suspense 経由で検索インデックスを取得する。React 19 の `use()` を内部で利用。 */
export function useSearchIndex(version: string): IndexedSearch {
  return use(loadIndex(version));
}
