import { redirect } from "next/navigation";
import { latestVersion } from "@/lib/docs";

export default function DocsIndexPage() {
  redirect(`/docs/${latestVersion()}`);
}
