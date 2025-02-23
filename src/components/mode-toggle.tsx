"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  return (
    <Button
      variant="ghost"
      size="xs"
      onClick={cycleTheme}
      title={`Current theme: ${theme}`}
    >
      {theme === "light" && <Sun className="h-[1rem] w-[1rem]" />}
      {theme === "dark" && <Moon className="h-[1rem] w-[1rem]" />}
      {theme === "system" && <Monitor className="h-[1rem] w-[1rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
