import { createMetadata } from "@/lib/metadata";
import { allPages } from "content-collections";
import { StreamdownWrapper } from "@/components/streamdown-wrapper";

const page = allPages.find((p) => p.slug === "support");

export const metadata = createMetadata({
  title: page ? page.title : "Support for JSON Visualiser",
  description: page ? page.description : "Contact support for JSON Visualiser.",
  canonical: "https://jsonvisualiser.com/support",
});

export default function SupportPage() {
  return <StreamdownWrapper content={page?.content || ""} />;
}
