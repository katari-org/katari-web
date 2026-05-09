import Link from "next/link";
import { resolveSiteHref, siteConfig } from "@/lib/site-config";
import { latestVersion } from "@/lib/content";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { GithubIcon } from "./icons";
import { SearchTrigger } from "@/components/docs/search/search-trigger";
import { HeaderShell } from "./header-shell";

export function Header() {
  let version: string | undefined;
  try {
    version = latestVersion();
  } catch {
    version = undefined;
  }
  // version が解決できない場合は redirect ページを通す fallback。
  const resolveHref = (href: string) => (version ? resolveSiteHref(href, version) : "/docs");

  return (
    <header className="sticky top-0 z-40 w-full">
      <HeaderShell>
        <div className="mx-auto flex h-full w-full max-w-380 items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 h-full py-3">
            <Logo size="xl" showText={false} className="h-full w-auto" />
            <nav className="hidden items-center gap-4 font-display-text text-sm text-muted-foreground sm:flex">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={resolveHref(item.href)}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {version && <SearchTrigger version={version} />}
            <Link
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer"
            >
              <GithubIcon className="size-5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </HeaderShell>
    </header>
  );
}
