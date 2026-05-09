import Link from "next/link";
import { resolveSiteHref, siteConfig } from "@/lib/site-config";
import { latestVersion } from "@/lib/content";
import { Logo } from "./logo";

export function Footer() {
  // `/docs/{latest}/...` プレースホルダを最新バージョンに展開する。
  // `latestVersion()` は filesystem を参照する Node API のため、
  // Footer は Server Component のままで動作する。
  const version = latestVersion();
  const resolveHref = (href: string) => resolveSiteHref(href, version);

  return (
    <footer>
      <div className="mx-auto w-full max-w-380 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">{siteConfig.description}</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              © {siteConfig.copyrightYear} {siteConfig.copyright}
            </p>
          </div>
          {siteConfig.footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-display-text font-semibold">{group.heading}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {group.items.map((item) => {
                  const external = "external" in item && item.external;
                  return (
                    <li key={item.label}>
                      <Link
                        href={external ? item.href : resolveHref(item.href)}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
