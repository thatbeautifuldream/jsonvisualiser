import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { createMetadata } from "@/lib/metadata";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = createMetadata({
  title: "JSON Visualiser",
  description:
    "Visualise and edit JSON data with ease. A powerful tool for developers to format, validate, and explore JSON structures with an intuitive interface.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `antialiased h-screen overflow-hidden`,
          geist.className,
          geistMono.variable
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
      </body>
    </html>
  );
}
