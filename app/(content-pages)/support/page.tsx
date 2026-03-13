import { createMetadata } from "@/lib/metadata";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

const page = allPages.find((p) => p.slug === "support");

export const metadata = createMetadata({
  title: page ? page.title : "Support for JSON Visualiser",
  description: page ? page.description : "Contact support for JSON Visualiser.",
  canonical: "https://jsonvisualiser.com/support",
});

export default function SupportPage() {
  return <Streamdown>{page?.content || ""}</Streamdown>;
}
