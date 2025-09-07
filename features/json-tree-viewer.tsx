"use client";

import { useTheme } from "next-themes";
import { JSONTree } from "react-json-tree";

interface JsonTreeViewerProps {
	data: unknown;
	className?: string;
}

const DARK_THEME = {
	scheme: "dark-theme",
	base00: "transparent", // Use transparent to inherit app background
	base01: "hsl(var(--muted))",
	base02: "#f3f518",
	base03: "hsl(var(--muted-foreground))",
	base04: "hsl(var(--muted-foreground))",
	base05: "hsl(var(--foreground))",
	base06: "#f38518",
	base07: "hsl(var(--foreground))",
	base08: "#F48771",
	base09: "#f38518",
	base0A: "#f38518",
	base0B: "#33ff2eff",
	base0C: "#f38518",
	base0D: "#f38518",
	base0E: "#f38518",
	base0F: "#FF008F",
};

const LIGHT_THEME = {
	scheme: "light-theme",
	base00: "transparent", // Use transparent to inherit app background
	base01: "hsl(var(--muted))",
	base02: "#1a1a1a",
	base03: "hsl(var(--muted-foreground))",
	base04: "hsl(var(--muted-foreground))",
	base05: "hsl(var(--foreground))",
	base06: "#d97706",
	base07: "hsl(var(--foreground))",
	base08: "#dc2626",
	base09: "#d97706",
	base0A: "#d97706",
	base0B: "#16a34a",
	base0C: "#d97706",
	base0D: "#2563eb",
	base0E: "#7c3aed",
	base0F: "#dc2626",
};

export function JsonTreeViewer({ data, className = "" }: JsonTreeViewerProps) {
	const { theme } = useTheme();

	const isDark = theme === "dark";
	const currentTheme = isDark ? DARK_THEME : LIGHT_THEME;

	if (data === null || data === undefined) {
		return (
			<div
				className={`flex items-center justify-center h-full text-muted-foreground font-mono bg-background ${className}`}
			>
				<p>No valid JSON data to display</p>
			</div>
		);
	}

	return (
		<div className={`px-4 overflow-auto h-full font-mono text-xs bg-background ${className}`}>
			<JSONTree data={data} theme={currentTheme} invertTheme={false} />
		</div>
	);
}
