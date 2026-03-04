import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

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

      <Streamdown>{page?.content || ""}</Streamdown>

      <section className="bg-muted/50 p-8 rounded-lg mt-12">
        <h2 className="text-3xl font-bold mb-4">Validate Your JSON Now</h2>
        <p className="text-lg mb-6">
          Check your JSON for errors instantly with real-time validation.
          Features include error highlighting, clear error messages, and
          line/column numbers—all without registration.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          Try JSON Validator
        </Link>
      </section>
    </>
  );
}
