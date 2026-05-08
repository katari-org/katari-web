"use client";

import { useEffect } from "react";

// Next.js 16 では従来の `reset` が `unstable_retry` に改名された。
// セグメント単位の error boundary のため、Client Component として実装する。
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <p className="font-display text-7xl font-black tracking-tight text-highlight">!</p>
      <h1 className="font-display-text text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground font-light">
        An unexpected error occurred while rendering this page.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="inline-flex h-11 items-center justify-center border border-border px-6 font-display-text text-base font-normal transition-all hover:cursor-pointer hover:border-border-strong hover:bg-muted"
      >
        Try again
      </button>
    </section>
  );
}
