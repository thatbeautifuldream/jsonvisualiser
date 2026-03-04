import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import Link from "next/link";
import { allPages } from "content-collections";
import { Streamdown } from "streamdown";

const page = allPages.find((p) => p.slug === "json-guide");

export const metadata = createMetadata({
  title: page ? page.title : "JSON Guide - Learn JSON Syntax, Types & Examples",
  description: page
    ? page.description
    : "Complete JSON guide for beginners. Learn JSON syntax, data types, structure, and examples.",
  canonical: "https://jsonvisualiser.com/json-guide",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format. Despite the name, JSON is language-independent and works with virtually every programming language. It was created by Douglas Crockford as a simpler alternative to XML.",
      },
    },
    {
      "@type": "Question",
      name: "What are the JSON data types?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON supports six data types: String (text in double quotes), Number (integers and floats), Boolean (true or false), Array (ordered list in square brackets), Object (unordered key-value pairs in curly braces), and Null (represents empty or missing value).",
      },
    },
    {
      "@type": "Question",
      name: "Do JSON keys need to be in quotes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, in JSON all keys must be enclosed in double quotes. Single quotes are not allowed for keys or string values. This is different from JavaScript objects, where quotes are optional for keys.",
      },
    },
    {
      "@type": "Question",
      name: "Can JSON have trailing commas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, JSON does not allow trailing commas. A comma after the last item in an object or array will cause a parsing error. This is different from JavaScript objects and arrays, where trailing commas are valid.",
      },
    },
    {
      "@type": "Question",
      name: "How do I parse JSON in JavaScript?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use JSON.parse() to convert a JSON string to a JavaScript object, and JSON.stringify() to convert a JavaScript object to a JSON string. Example: const obj = JSON.parse(jsonString); const jsonString = JSON.stringify(obj, null, 2);",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between JSON and JavaScript objects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON requires double quotes for keys and strings, no trailing commas, no comments, no functions, no undefined values, and dates must be strings in ISO format. JavaScript objects are more flexible: keys can be unquoted, trailing commas are allowed, comments are allowed, functions are allowed, undefined is valid, and dates can be Date objects.",
      },
    },
  ],
};

export default function JsonGuidePage() {
  return (
    <>
      <JsonLd data={faqSchema} />

      <Streamdown>{page?.content || ""}</Streamdown>

      <section className="bg-muted/50 p-8 rounded-lg mt-12">
        <h2 className="text-3xl font-bold mb-4">Practice Your JSON Skills</h2>
        <p className="text-lg mb-6">
          Learn JSON by doing. Our free online editor includes real-time
          validation, tree view, graph visualization, and formatting tools to
          help you master JSON—all without registration.
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
