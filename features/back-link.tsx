import Link from "next/link";
import { Undo2 } from "lucide-react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      data-back-link
      className="text-faint hover:text-foreground relative z-20 inline-flex w-fit items-center gap-1.5 no-underline xl:fixed xl:top-20 xl:left-20"
    >
      <Undo2 className="size-5 shrink-0 sm:size-4" />
      {label}
    </Link>
  );
}
