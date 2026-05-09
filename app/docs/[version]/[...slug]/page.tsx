import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { getDoc, listAllSlugs } from "@/lib/content";
import { mdxOptions } from "@/lib/mdx/options";
import { mdxComponents } from "@/components/mdx/components";
import { CopyMarkdownButton } from "@/components/docs/copy-markdown-button";
import { ogImageHref } from "@/lib/og/og-id";

type Props = {
  params: Promise<{ version: string; slug: string[] }>;
};

export async function generateStaticParams() {
  return listAllSlugs().map(({ version, slug }) => ({ version, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { version, slug } = await params;
  const doc = getDoc(version, slug);
  if (!doc) return {};
  const { title, description } = doc.frontmatter;
  // 動的 OG: API ルートで build 時に SSG 化した PNG を参照する。
  // `[...slug]` 直下に opengraph-image / 固定 segment を置けないため、
  // (version, slug) を `--` で flatten した単一 segment ID に encode した URL を使う。
  const ogImage = ogImageHref(version, slug);
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

// CopyMarkdownButton が使う、frontmatter を h1 + description として復元したテキスト。
function toRawMarkdown(title: string, description: string | undefined, body: string): string {
  return [`# ${title}`, description ?? "", body].filter(Boolean).join("\n\n");
}

export default async function DocPage({ params }: Props) {
  const { version, slug } = await params;
  const doc = getDoc(version, slug);
  if (!doc) notFound();

  const { content } = await compileMDX({
    source: doc.body,
    components: mdxComponents,
    options: { mdxOptions },
  });

  const markdownText = toRawMarkdown(doc.frontmatter.title, doc.frontmatter.description, doc.body);

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 space-y-4 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-display-text font-bold tracking-tight text-highlight">
            {doc.frontmatter.title}
          </h1>
          <CopyMarkdownButton markdown={markdownText} />
        </div>
        {doc.frontmatter.description && (
          <p className="text-base text-muted-foreground">{doc.frontmatter.description}</p>
        )}
      </header>
      <div className="prose-content">{content}</div>
    </article>
  );
}
