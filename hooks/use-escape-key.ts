"use client";

import { useEffect } from "react";

/** ESC キーで `handler` を呼ぶ。`enabled` が false のときは購読しない。 */
export function useEscapeKey(handler: () => void, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [handler, enabled]);
}
