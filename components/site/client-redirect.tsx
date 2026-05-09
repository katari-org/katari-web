"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * 静的書き出し時に動く redirect 用シェル。
 * - `next/navigation` の `redirect()` は static export では動かないため、
 *   client-side で `router.replace` を発火させる。
 * - JS off の環境では `<meta http-equiv="refresh">` (page.tsx 側で挿入) でフォールバック。
 */
export function ClientRedirect({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-32 text-center">
      <p className="font-display-text text-base text-muted-foreground">Redirecting…</p>
      <Link
        href={href}
        className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        Click here if you are not redirected.
      </Link>
    </section>
  );
}
