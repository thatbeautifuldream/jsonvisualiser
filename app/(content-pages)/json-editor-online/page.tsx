import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import { IndexList } from "@/components/index-list";
import { allPages } from "content-collections";
import { StreamdownWrapper } from "@/components/streamdown-wrapper";

const page = allPages.find((p) => p.slug === "json-editor-online");

export const metadata = createMetadata({
  title: page ? page.title : "JSON Editor Online - Free No-Registration Editor",
  description: page
    ? page.description
    : "Free online JSON editor with Monaco syntax highlighting and tree view. For developers, data analysts, and QA engineers.",
  canonical: "https://jsonvisualiser.com/json-editor-online",
});

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON Visualiser",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "JSON Tree View",
    "Monaco Editor Syntax Highlighting",
    "Dark/Light Theme",
    "Session Storage Persistence",
    "Real-time Statistics",
    "No Registration Required",
    "Instant Load",
  ],
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milindmishra.com/",
  },
};

export default function JsonEditorOnlinePage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />

      <StreamdownWrapper content={page?.content || ""} />

      <IndexList
        title="Try it"
        items={[
          { href: "/", title: "Open the JSON editor", meta: "No sign-up" },
          { href: "/json-guide", title: "Learn JSON", meta: "Guide" },
        ]}
      />
    </>
  );
}
