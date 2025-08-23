"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type React from "react";

type TThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: TThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
