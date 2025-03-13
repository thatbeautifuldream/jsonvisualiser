import { Metadata } from "next";
import { AboutContent } from "./page.client";

export const metadata: Metadata = {
  title: "About | JSON Visualizer",
  description: "About the JSON Visualizer",
};

export default function AboutPage() {
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AboutContent />
      </div>
    </div>
  );
}
