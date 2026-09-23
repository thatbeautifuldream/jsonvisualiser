import Link from "next/link";
import { cn } from "@/lib/utils";

type TIndexItem = {
  href: string;
  title: string;
  meta?: string;
};

export function IndexList({
  title,
  items,
  className,
}: {
  title: string;
  items: TIndexItem[];
  className?: string;
}) {
  return (
    <section className={cn("min-w-0", className)}>
      <h2 className="section-title">{title}</h2>
      <ul role="list" className="index-list divide-y divide-border">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-4 py-3 no-underline"
            >
              <span className="min-w-0 truncate">{item.title}</span>
              {item.meta && (
                <span className="text-faint max-w-1/2 shrink-0 truncate tabular-nums">
                  {item.meta}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
