import type { Metadata } from "next";
import Link from "next/link";

import { createMetadata } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = createMetadata({
  title: "Install Chrome Extension",
  description:
    "Install the JSON Visualiser Chrome extension to open raw JSON responses in a cleaner workspace.",
  canonical: "https://jsonvisualiser.com/install-extension",
});

export default function InstallExtensionPage() {
  return (
    <div className="bg-background">
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="px-4 py-14 sm:px-6 sm:py-24 lg:px-8 lg:pb-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-7xl">
              <span className="sm:hidden">Install the JSON Visualiser extension</span>
              <span className="hidden sm:inline">
                Install the JSON Visualiser Chrome extension
              </span>
            </h1>
            <p className="mt-5 text-base leading-7 font-medium text-pretty text-muted-foreground sm:mt-8 sm:text-lg sm:leading-8 lg:text-xl lg:leading-8">
              <span className="sm:hidden">
                Open raw JSON in a cleaner Chrome interface with formatting,
                validation, tree and graph views.
              </span>
              <span className="hidden sm:inline">
                Open raw JSON responses in a cleaner interface with formatting,
                validation, tree view, and graph view directly in Chrome.
              </span>
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6 sm:mt-10">
              <Button asChild size="lg" className="text-sm sm:text-base">
                <Link
                  href="https://chromewebstore.google.com/detail/json-visualiser/ahamfjjhmjpiiogljnpgogegjcecmmll"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="sm:hidden">Install extension</span>
                  <span className="hidden sm:inline">Install Chrome extension</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-card p-2 ring-1 ring-border ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                alt="JSON Visualiser screenshot"
                src="https://cdn.milind.app/media/projects/screenshots/jsonvisualiser.webp"
                width={2432}
                height={1442}
                className="w-304 rounded-md bg-muted shadow-xl ring-1 ring-border"
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-accent to-secondary opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    </div>
  );
}
