"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltip =
    mounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode";
  const activeTransition = useRef<ViewTransition | null>(null);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    const apply = () => {
      root.classList.toggle("dark", next === "dark");
      flushSync(() => setTheme(next));
    };

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced) {
      apply();
      return;
    }

    root.classList.add("theme-transition");
    const transition = document.startViewTransition(apply);
    activeTransition.current = transition;
    // A rapid second toggle skips this transition while the new one is still
    // running — only the latest transition may clean up the class.
    transition.finished.finally(() => {
      if (activeTransition.current === transition) {
        activeTransition.current = null;
        root.classList.remove("theme-transition");
      }
    });
  }, [setTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "d") {
        event.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <button
      type="button"
      onClick={toggle}
      title={tooltip}
      aria-label={tooltip}
      className={cn(
        "text-faint hover:text-foreground inline-flex cursor-pointer items-center",
        className,
      )}
    >
      <Moon className="size-4 shrink-0 dark:hidden" aria-hidden />
      <Sun className="size-4 shrink-0 not-dark:hidden" aria-hidden />
    </button>
  );
}
