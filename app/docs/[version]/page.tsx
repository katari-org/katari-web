import { redirect } from "next/navigation";
import { getNavigation } from "@/lib/content";

type Props = {
  params: Promise<{ version: string }>;
};

export default async function DocsVersionIndex({ params }: Props) {
  const { version } = await params;
  const nav = getNavigation(version);
  const first = nav.sections[0]?.items[0];
  if (!first) {
    return (
      <div className="prose">
        <h1>No documentation available</h1>
        <p>このバージョンにはまだページがありません。</p>
      </div>
    );
  }
  redirect(first.href);
}
