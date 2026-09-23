"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { GitHub } from "@/components/icons/github";

export function GitHubLink() {
  const [starsCount, setStarsCount] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${siteConfig.owner}/${siteConfig.repo}`,
          {
            next: { revalidate: 86400 },
          },
        );
        const json = await response.json();
        const count = json.stargazers_count;
        setStarsCount(count);
      } catch {
        console.error("Failed to fetch GitHub stars");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStars();
  }, []);

  const formattedCount = React.useMemo(() => {
    if (starsCount === null) return "...";

    return starsCount >= 1000
      ? `${Math.round(starsCount / 1000)}k`
      : starsCount.toLocaleString();
  }, [starsCount]);

  return (
    <Link
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      className="text-faint hover:text-foreground hidden items-center gap-1.5 no-underline sm:flex"
    >
      <GitHub className="size-4 shrink-0" />
      {!isLoading && <span className="tabular-nums">{formattedCount}</span>}
    </Link>
  );
}
