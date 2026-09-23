import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = createMetadata({
  title: "Install Chrome Extension",
  description:
    "Install the JSON Visualiser Chrome extension to open raw JSON responses in a cleaner workspace.",
  canonical: "https://jsonvisualiser.com/install-extension",
});

export default function InstallExtensionPage() {
  return (
    <>
      <PageHeader
        title="Install the JSON Visualiser Chrome extension"
        meta="Open raw JSON responses in a cleaner interface with formatting, validation, and tree view directly in Chrome."
      />
      <div>
        <Button asChild>
          <Link
            href="https://chromewebstore.google.com/detail/json-visualiser/ahamfjjhmjpiiogljnpgogegjcecmmll"
            target="_blank"
            rel="noreferrer"
          >
            Install Chrome extension
          </Link>
        </Button>
      </div>
      <img
        alt="JSON Visualiser screenshot"
        src="https://cdn.milind.app/media/projects/screenshots/jsonvisualiser.webp"
        width={2432}
        height={1442}
        className="outline-border w-full rounded-lg outline -outline-offset-1"
      />
    </>
  );
}
