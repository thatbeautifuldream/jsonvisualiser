"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster } from "sonner";

type TTheme = "light" | "dark" | "system";

export function ToasterProvider() {
  const { resolvedTheme } = useTheme();
  return <Toaster theme={resolvedTheme as TTheme} position="top-center" />;
}
