import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

type MdxCompileOptions = NonNullable<NonNullable<MDXRemoteProps["options"]>["mdxOptions"]>;

// `compileMDX` に渡す remark / rehype プラグイン構成を一元管理する。
// - rehype-slug: 見出しに id を付ける
// - rehype-autolink-headings: 見出しをアンカーリンクで包む
// - rehype-pretty-code: shiki で fenced code をシンタックスハイライト
export const mdxOptions: MdxCompileOptions = {
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
};
