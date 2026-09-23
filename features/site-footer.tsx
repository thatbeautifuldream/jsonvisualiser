import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { siteConfig } from "@/lib/config";

const links = [
  { href: "/", label: "Editor" },
  { href: "/json-guide", label: "Guide" },
  { href: siteConfig.links.github, label: "GitHub", external: true },
];

export function SiteFooter() {
  return (
    <footer className="grid gap-9 pb-20">
      <div aria-hidden="true" className="bg-rule h-px w-12.5" />
      <div className="text-faint grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p>{siteConfig.name}</p>
          <ul role="list" className="flex items-center gap-x-4">
            {links.map(({ href, label, external }) => (
              <li key={label}>
                <Link
                  href={href}
                  {...(external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="hover:text-foreground font-normal no-underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-4">
          <ThemeSwitcher />
          <a
            href={siteConfig.links.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground font-normal no-underline"
          >
            Milind Mishra
          </a>
        </div>
      </div>
    </footer>
  );
}
