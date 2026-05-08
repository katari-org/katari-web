import Link from "next/link";
import type { ComponentProps } from "react";
import type { MDXComponents } from "mdx/types";
import { CodeBlockPre } from "@/components/mdx/code-block-figure";

function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

function MdxLink({ href = "", ...rest }: ComponentProps<"a">) {
  if (isInternalHref(href)) {
    return <Link href={href} {...rest} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...rest} />;
}

// Markdown body の見た目はここで一元的にチューニングする。
export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-8 scroll-mt-24 text-3xl font- font-bold tracking-tight first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-10 scroll-mt-24 pb-2 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-6 scroll-mt-24 text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props) => <p className="mt-4 leading-7" {...props} />,
  a: (props) => (
    <MdxLink
      className="font-medium text-foreground underline underline-offset-4"
      {...props}
    />
  ),
  ul: (props) => <ul className="mt-4 ml-6 list-disc space-y-1.5" {...props} />,
  ol: (props) => (
    <ol className="mt-4 ml-6 list-decimal space-y-1.5" {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-border-strong pl-4 italic"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border bg-muted px-3 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props) => <td className="border border-border px-3 py-2" {...props} />,
  // rehype-pretty-code が生成する <pre> (data-language 付き) は CodeBlockPre で
  // wrap してコピーボタンを右上に表示する。素の <pre> は素通し。
  pre: (props) => {
    const isCodeBlock = "data-language" in (props as Record<string, unknown>);
    if (isCodeBlock) {
      return <CodeBlockPre {...props} />;
    }
    return <pre {...props} />;
  },
  // インラインコード。コードブロック (language-* クラス付き) には何もしない。
  code: ({ className, ...rest }) => {
    const isBlock = "data-language" in (rest as Record<string, unknown>);
    if (isBlock) {
      return <code className={className} {...rest} />;
    }
    return (
      <code
        className={`px-1.5 py-0.5 font-mono text-sm bg-muted/50 border border-border ${className ?? ""}`}
        {...rest}
      />
    );
  },
};
