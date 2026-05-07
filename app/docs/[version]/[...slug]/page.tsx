import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { getDoc, listAllSlugs } from "@/lib/docs";
import { mdxComponents } from "@/components/mdx/components";

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
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({ params }: Props) {
  const { version, slug } = await params;
  const doc = getDoc(version, slug);
  if (!doc) notFound();

  const { content } = await compileMDX({
    source: doc.body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: { className: ["heading-anchor"] },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: { light: "github-light", dark: "github-dark" },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 space-y-4 pb-4 border-b border-border">
        <h1 className="text-4xl font-display-text font-bold tracking-tight text-highlight">
          {doc.frontmatter.title}
        </h1>
        {doc.frontmatter.description && (
          <p className="text-base text-muted-foreground">
            {doc.frontmatter.description}
          </p>
        )}
      </header>
      <div className="prose-content">{content}</div>
    </article>
  );
}
