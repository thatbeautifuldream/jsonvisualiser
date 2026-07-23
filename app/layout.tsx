import { JsonLd } from "@/components/json-ld";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { createMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON Visualiser",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "JSON Tree View",
    "Monaco Editor Syntax Highlighting",
    "JSON Validation",
    "JSON Formatting",
    "Dark/Light Theme",
    "Session Storage Persistence",
    "Real-time Statistics",
  ],
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milindmishra.com/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata = createMetadata({
  title: "JSON Visualiser - Free Online JSON Editor with Tree View",
  description:
    "Visualize, validate, and format JSON data with ease. A free, no-registration JSON editor with Monaco syntax highlighting and tree view.",
  canonical: "https://jsonvisualiser.com",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={softwareApplicationSchema} />
      </head>
      <body
        className={cn(
          `antialiased min-h-screen bg-background text-foreground`,
          geist.className,
          geistMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="h-full flex flex-col">{children}</div>
          <ToasterProvider />
        </ThemeProvider>
        <ServiceWorkerProvider />
      </body>
    </html>
  );
}
