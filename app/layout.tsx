import { JsonLd } from "@/components/json-ld";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { createMetadata } from "@/lib/metadata";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
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
    { media: "(prefers-color-scheme: light)", color: "#fdfdfc" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
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
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <JsonLd data={softwareApplicationSchema} />
      </head>
      <body className="bg-background text-foreground min-h-svh">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
