import type { Metadata } from "next";
import { ExtensionPageClient } from "@/features/extension-page-client";

export const metadata: Metadata = {
  title: "JSON Visualiser Extension",
  description: "Embedded JSON Visualiser workspace for browser extension payloads.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExtensionPage() {
  return <ExtensionPageClient />;
}
