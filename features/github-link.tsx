"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { GitHub } from "@/components/icons/github";

const linkClassName =
  "text-faint hover:text-foreground hidden items-center gap-1.5 no-underline sm:flex";

function GitHubLinkFallback() {
  return (
    <Link
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      className={linkClassName}
    >
      <GitHub className="size-4 shrink-0" />
      <span>GitHub</span>
    </Link>
  );
}

type TGitHubLinkErrorBoundaryProps = {
  children: React.ReactNode;
};

type TGitHubLinkErrorBoundaryState = {
  hasError: boolean;
};

class GitHubLinkErrorBoundary extends React.Component<
  TGitHubLinkErrorBoundaryProps,
  TGitHubLinkErrorBoundaryState
> {
  state: TGitHubLinkErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): TGitHubLinkErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("GitHub link failed to render", error);
  }

  render() {
    if (this.state.hasError) {
      return <GitHubLinkFallback />;
    }

    return this.props.children;
  }
}

function GitHubLinkInner() {
  const [starsCount, setStarsCount] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${siteConfig.owner}/${siteConfig.repo}`,
        );

        if (!response.ok) {
          throw new Error(`GitHub API responded with ${response.status}`);
        }

        const json = (await response.json()) as { stargazers_count?: unknown };
        const count = json.stargazers_count;

        if (typeof count !== "number" || !Number.isFinite(count)) {
          throw new Error("GitHub API response missing stargazers_count");
        }

        setStarsCount(count);
      } catch (error) {
        console.error("Failed to fetch GitHub stars", error);
        setStarsCount(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStars();
  }, []);

  const formattedCount = React.useMemo(() => {
    if (starsCount === null) return null;

    return starsCount >= 1000
      ? `${Math.round(starsCount / 1000)}k`
      : starsCount.toLocaleString();
  }, [starsCount]);

  if (!isLoading && formattedCount === null) {
    return <GitHubLinkFallback />;
  }

  return (
    <Link
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      className={linkClassName}
    >
      <GitHub className="size-4 shrink-0" />
      {!isLoading && formattedCount !== null ? (
        <span className="tabular-nums">{formattedCount}</span>
      ) : null}
    </Link>
  );
}

export function GitHubLink() {
  return (
    <GitHubLinkErrorBoundary>
      <GitHubLinkInner />
    </GitHubLinkErrorBoundary>
  );
}
