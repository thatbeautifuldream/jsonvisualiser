import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import { IndexList } from "@/components/index-list";
import { allPages } from "content-collections";
import { StreamdownWrapper } from "@/components/streamdown-wrapper";

const page = allPages.find((p) => p.slug === "json-validator");

export const metadata = createMetadata({
  title: page
    ? page.title
    : "JSON Validator - Real-Time Validation & Error Checking",
  description: page
    ? page.description
    : "Validate JSON instantly with real-time error checking. See syntax errors, line numbers, and error messages.",
  canonical: "https://jsonvisualiser.com/json-validator",
});

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Validate JSON",
  description: "Step-by-step guide to validating JSON using JSON Visualiser",
  step: [
    {
      "@type": "HowToStep",
      name: "Open JSON Visualiser",
      text: "Navigate to the JSON Visualiser homepage. The editor loads instantly with no sign-up required.",
    },
    {
      "@type": "HowToStep",
      name: "Paste or Type JSON",
      text: "Paste your JSON into the editor pane, or type directly. The Monaco editor provides syntax highlighting.",
    },
    {
      "@type": "HowToStep",
      name: "View Validation Results",
      text: "As you type, JSON Visualiser validates in real-time. Valid JSON shows green indicator, invalid JSON shows red squigglies.",
    },
    {
      "@type": "HowToStep",
      name: "Fix Errors",
      text: "Click on error squigglies to jump to the error location. Read the error message for guidance. Fix the issue and validation updates instantly.",
    },
  ],
};

export default function JsonValidatorPage() {
  return (
    <>
      <JsonLd data={howToSchema} />

      <StreamdownWrapper content={page?.content || ""} />

      <IndexList
        title="Try it"
        items={[{ href: "/", title: "Validate your JSON", meta: "Open editor" }]}
      />
    </>
  );
}
