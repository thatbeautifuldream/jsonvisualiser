"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster } from "sonner";

type TTheme = "light" | "dark" | "system";

export function ToasterProvider() {
  const { theme } = useTheme();
  return <Toaster theme={theme as TTheme} richColors position="top-center" />;
}
