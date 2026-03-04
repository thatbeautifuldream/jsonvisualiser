import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

const page = allPages.find((p) => p.slug === "json-editor-online");

export const metadata = createMetadata({
  title: page ? page.title : "JSON Editor Online - Free No-Registration Editor",
  description: page
    ? page.description
    : "Free online JSON editor with Monaco syntax highlighting, tree view, and graph visualization. For developers, data analysts, and QA engineers.",
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
    "JSON Graph Visualization",
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

      <Streamdown>{page?.content || ""}</Streamdown>

      <section className="bg-primary/5 border border-primary/20 p-8 rounded-lg mt-12">
        <h2 className="text-3xl font-bold mb-4">Try JSON Visualiser Now</h2>
        <p className="text-lg mb-6">
          No registration. No download. No limits. Start editing JSON in seconds
          with professional Monaco editing, tree and graph visualization, and
          privacy-first design.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            Open JSON Editor
          </Link>
          <Link
            href="/json-guide"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
          >
            Learn JSON
          </Link>
        </div>
      </section>
    </>
  );
}
