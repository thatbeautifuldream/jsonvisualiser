"use client";

import { useTheme } from "next-themes";
import { JSONTree } from "react-json-tree";

interface JsonTreeViewerProps {
	data: unknown;
	className?: string;
}

const HC_DARK_THEME = {
	scheme: "hc-black",
	base00: "#000000",
	base01: "#0C141F",
	base02: "#f3f518",
	base03: "#444444",
	base04: "#A5A5A5",
	base05: "#FFFFFF",
	base06: "#f38518",
	base07: "#FFFFFF",
	base08: "#F48771",
	base09: "#f38518",
	base0A: "#f38518",
	base0B: "#33ff2eff",
	base0C: "#f38518",
	base0D: "#f38518",
	base0E: "#f38518",
	base0F: "#FF008F",
};

export function JsonTreeViewer({ data, className = "" }: JsonTreeViewerProps) {
	const { theme } = useTheme();

	const isDark = theme === "dark";

	if (data === null || data === undefined) {
		return (
			<div
				className={`flex items-center justify-center h-full text-muted-foreground font-mono ${className}`}
			>
				<p>No valid JSON data to display</p>
			</div>
		);
	}

	return (
		<div className={`px-4 overflow-auto h-full font-mono text-xs ${className}`}>
			<JSONTree data={data} theme={HC_DARK_THEME} invertTheme={!isDark} />
		</div>
	);
}
