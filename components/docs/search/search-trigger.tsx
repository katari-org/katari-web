"use client";

import { useCallback, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useCmdK } from "@/hooks/use-cmd-k";
import { SearchDialog } from "./search-dialog";

export function SearchTrigger({ version }: { version: string }) {
  const [open, setOpen] = useState(false);

  // useCmdK は handler を deps に取るので useCallback で安定化させる。
  useCmdK(useCallback(() => setOpen(true), []));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
        className="inline-flex h-9 w-full max-w-65 items-center gap-2 border border-border hover:border-border-strong transition-all px-3 text-sm text-muted-foreground hover:cursor-text"
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left"></span>
        <kbd className="hidden px-1.5 py-0.5 text-sm sm:inline">⌘K</kbd>
      </button>
      <SearchDialog version={version} open={open} onOpenChange={setOpen} />
    </>
  );
}
