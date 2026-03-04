import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm mb-4 inline-block"
          >
            Back to Editor
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
