import { notFound } from "next/navigation";
import { getNavigation, listVersions } from "@/lib/content";
import { ClientRedirect } from "@/components/site/client-redirect";

type Props = {
  params: Promise<{ version: string }>;
};

export async function generateStaticParams() {
  return listVersions().map((version) => ({ version }));
}

export default async function DocsVersionIndex({ params }: Props) {
  const { version } = await params;
  const nav = getNavigation(version);
  const first = nav.sections[0]?.items[0];
  if (!first) notFound();
  return (
    <>
      {/* React 19 が <head> に hoist する。JS off でも meta refresh で遷移する。 */}
      <meta httpEquiv="refresh" content={`0;url=${first.href}`} />
      <ClientRedirect href={first.href} />
    </>
  );
}
