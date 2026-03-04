import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

const page = allPages.find((p) => p.slug === "json-formatter");

export const metadata = createMetadata({
  title: page ? page.title : "JSON Formatter - Pretty Print & Minify JSON",
  description: page
    ? page.description
    : "Format JSON with pretty print, minify, and custom indentation. Transform JSON between readable and compact formats.",
  canonical: "https://jsonvisualiser.com/json-formatter",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is JSON pretty printing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON pretty printing adds indentation and line breaks to make JSON human-readable. It transforms compact JSON into a structured format with proper spacing, making it easier to read, edit, and debug.",
      },
    },
    {
      "@type": "Question",
      name: "What is JSON minification?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON minification removes all unnecessary whitespace, indentation, and line breaks from JSON. This creates a compact single-line version that reduces file size by up to 40% and is ideal for API responses and data transmission.",
      },
    },
    {
      "@type": "Question",
      name: "How do I format JSON with custom indentation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use JSON Visualiser's formatting options to choose 2, 4, or custom number of spaces for indentation. Most developers use 2 spaces by default, but you can adjust based on your preferences or coding standards.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I sort JSON keys alphabetically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sorting JSON keys alphabetically makes it easier to find specific keys, ensures consistency across files, creates smaller diffs in version control, and improves readability for complex JSON structures.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use pretty print vs minified JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use pretty-printed JSON for human-readable files like configuration, documentation, and debugging. Use minified JSON for machine-to-machine communication like API responses, data storage, and network transmission to reduce size and improve performance.",
      },
    },
  ],
};

export default function JsonFormatterPage() {
  return (
    <>
      <JsonLd data={faqSchema} />

      <Streamdown>{page?.content || ""}</Streamdown>

      <section className="bg-muted/50 p-8 rounded-lg mt-12">
        <h2 className="text-3xl font-bold mb-4">Format Your JSON Now</h2>
        <p className="text-lg mb-6">
          Transform your JSON between pretty-print and minified formats.
          Features include custom indentation, key sorting, and instant
          preview—all without registration.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          Try JSON Formatter
        </Link>
      </section>
    </>
  );
}
