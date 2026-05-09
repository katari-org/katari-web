import { latestVersion } from "@/lib/content";
import { ClientRedirect } from "@/components/site/client-redirect";

export default function DocsIndexPage() {
  const href = `/docs/${latestVersion()}`;
  return (
    <>
      {/* React 19 が <head> に hoist する。JS off でも meta refresh で遷移する。 */}
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <ClientRedirect href={href} />
    </>
  );
}
