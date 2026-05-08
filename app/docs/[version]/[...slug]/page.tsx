import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { getDoc, listAllSlugs } from "@/lib/content";
import { mdxOptions } from "@/lib/mdx/options";
import { mdxComponents } from "@/components/mdx/components";
import { CopyMarkdownButton } from "@/components/docs/copy-markdown-button";

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
  // Next.js は子ページで `openGraph` を上書きすると、親レイアウトに自動挿入された
  // images を引き継がない。app/opengraph-image.tsx の出力を明示的に再指定する必要がある。
  const ogImages = ["/opengraph-image"];
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: ogImages },
    twitter: { card: "summary_large_image", title, description, images: ogImages },
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
