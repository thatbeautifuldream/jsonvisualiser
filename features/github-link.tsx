"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { GitHub } from "@/components/icons/github";
import { Button } from "@/components/ui/button";

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
    <Button
      asChild
      size="sm"
      variant="ghost"
      className="h-8 shadow-none cursor-pointer"
    >
      <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
        <div className="flex items-center gap-2">
          <GitHub className="h-4 w-4 text-muted-foreground" />
          {!isLoading && (
            <span className="w-fit text-xs text-muted-foreground tabular-nums">
              {formattedCount}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
}
