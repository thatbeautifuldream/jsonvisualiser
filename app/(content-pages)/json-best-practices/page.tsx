import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

const page = allPages.find((p) => p.slug === "json-best-practices");

export const metadata = createMetadata({
  title: page
    ? page.title
    : "JSON Best Practices - Conventions, Tips & Security",
  description: page
    ? page.description
    : "JSON best practices for developers. Learn naming conventions, structure design, performance tips, and security practices.",
  canonical: "https://jsonvisualiser.com/json-best-practices",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What naming convention should I use for JSON keys?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use camelCase for JSON keys (e.g., firstName, lastName, isActive). Avoid snake_case, UPPER_CASE, or kebab-case as they're not idiomatic for JSON. For booleans, use prefixes like is, has, can, or should (e.g., isActive, hasPermission).",
      },
    },
    {
      "@type": "Question",
      name: "Should I use numbers or strings for numeric values in JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Always use numbers for numeric values in JSON (e.g., age: 30, price: 99.99). Using strings like age: '30' is incorrect because it prevents proper numeric operations and type checking. JSON supports both integers and floating-point numbers.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use null vs empty string in JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use null when a value is intentionally missing or unknown. Use empty string '' when a string exists but has no content. Don't use 'null' as a string or 0 to represent missing data. For required fields, throw an error instead of returning null.",
      },
    },
    {
      "@type": "Question",
      name: "What format should I use for dates in JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Always use ISO 8601 format for dates in JSON (e.g., '2026-03-04T12:00:00Z'). This format includes timezone information ('Z' for UTC) and is universally supported. Don't use custom formats like MM/DD/YYYY or timestamp numbers.",
      },
    },
    {
      "@type": "Question",
      name: "Should I pretty print or minify JSON for APIs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For APIs, use minified JSON to reduce payload size by 30-40% and improve transmission speed. Enable gzip or brotli compression for an additional 60-90% reduction. Pretty printing is only for human-readable files like configuration, documentation, and debugging.",
      },
    },
    {
      "@type": "Question",
      name: "How can I secure JSON APIs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Validate all input JSON against a schema, sanitize output to remove sensitive data like passwords and credit cards, escape user input to prevent JSON injection, use HTTPS for encryption, implement rate limiting to prevent abuse, and implement authentication and authorization for your endpoints.",
      },
    },
  ],
};

export default function JsonBestPracticesPage() {
  return (
    <>
      <JsonLd data={faqSchema} />

      <Streamdown>{page?.content || ""}</Streamdown>

      <section className="bg-primary/5 border border-primary/20 p-8 rounded-lg mt-12">
        <h2 className="text-3xl font-bold mb-4">
          Validate Your JSON Practices
        </h2>
        <p className="text-lg mb-6">
          Check your JSON structure and format with our free online editor.
          Features include real-time validation, best practices checker, tree
          view, and graph visualization—all without registration.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          Try JSON Visualiser
        </Link>
      </section>
    </>
  );
}
