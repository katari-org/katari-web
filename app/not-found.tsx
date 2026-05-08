import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <p className="font-display text-7xl font-black tracking-tight text-highlight">404</p>
      <h1 className="font-display-text text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground font-light">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center border border-border px-6 font-display-text text-base font-normal transition-all hover:border-border-strong hover:bg-muted"
      >
        Return home
      </Link>
    </section>
  );
}
