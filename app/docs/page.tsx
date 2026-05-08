import { redirect } from "next/navigation";
import { latestVersion } from "@/lib/content";

export default function DocsIndexPage() {
  redirect(`/docs/${latestVersion()}`);
}
