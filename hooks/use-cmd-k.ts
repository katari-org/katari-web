"use client";

import { useEffect } from "react";

/** Cmd/Ctrl+K のグローバルショートカットを購読する。 */
export function useCmdK(handler: () => void): void {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handler]);
}
