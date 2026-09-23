import { JsonLd } from "@/components/json-ld";
import { createMetadata } from "@/lib/metadata";
import { IndexList } from "@/components/index-list";
import { allPages } from "content-collections";
import { StreamdownWrapper } from "@/components/streamdown-wrapper";

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

      <StreamdownWrapper content={page?.content || ""} />

      <IndexList
        title="Try it"
        items={[{ href: "/", title: "Practice in the editor", meta: "Open editor" }]}
      />
    </>
  );
}
