"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type TThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({
  children,
  ...props
}: TThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
