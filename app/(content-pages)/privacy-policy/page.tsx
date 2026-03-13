import { createMetadata } from "@/lib/metadata";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

const page = allPages.find((p) => p.slug === "privacy-policy");

export const metadata = createMetadata({
  title: page ? page.title : "Privacy Policy for JSON Visualiser",
  description: page
    ? page.description
    : "Privacy policy for JSON Visualiser and its browser extension workflows.",
  canonical: "https://jsonvisualiser.com/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return <Streamdown>{page?.content || ""}</Streamdown>;
}
