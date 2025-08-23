"use client";

import { JSONTree } from "react-json-tree";
import { useTheme } from "next-themes";

interface JsonTreeViewerProps {
	data: unknown;
	className?: string;
	editorTheme?: "light" | "hc-black";
}

const lightTheme = {
	scheme: "hc-light",
	base00: "#FFFFFF", // High contrast light background
	base01: "#F2F2F2", // Lighter background
	base02: "#0F4A85", // Selection background
	base03: "#CCCCCC", // Comments, invisibles
	base04: "#7F7F7F", // Dark foreground
	base05: "#292929", // Default foreground
	base06: "#0F4A85", // Light foreground
	base07: "#FFFFFF", // Light background
	base08: "#B5200D", // Variables, XML Tags, Markup Link Text
	base09: "#0F4A85", // Integers, Boolean, Constants
	base0A: "#0F4A85", // Classes, Markup Bold, Search Text Background
	base0B: "#374E06", // Strings, Inherited Class, Markup Code
	base0C: "#0F4A85", // Support, Regular Expressions, Escape Characters
	base0D: "#0F4A85", // Functions, Methods, Attribute IDs, Headings
	base0E: "#0F4A85", // Keywords, Storage, Selector, Markup Italic
	base0F: "#0F4A85", // Deprecated, Opening/Closing Embedded Language Tags
};

const darkTheme = {
	scheme: "hc-black",
	base00: "#000000", // High contrast dark background
	base01: "#0C141F", // Lighter background
	base02: "#f3f518", // Selection background
	base03: "#444444", // Comments, invisibles
	base04: "#A5A5A5", // Dark foreground
	base05: "#FFFFFF", // Default foreground
	base06: "#f38518", // Light foreground
	base07: "#FFFFFF", // Light background
	base08: "#F48771", // Variables, XML Tags, Markup Link Text
	base09: "#f38518", // Integers, Boolean, Constants
	base0A: "#f38518", // Classes, Markup Bold, Search Text Background
	base0B: "#33ff2eff", // Strings, Inherited Class, Markup Code
	base0C: "#f38518", // Support, Regular Expressions, Escape Characters
	base0D: "#f38518", // Functions, Methods, Attribute IDs, Headings
	base0E: "#f38518", // Keywords, Storage, Selector, Markup Italic
	base0F: "#FF008F", // Deprecated, Opening/Closing Embedded Language Tags
};

export function JsonTreeViewer({
	data,
	className = "",
	editorTheme,
}: JsonTreeViewerProps) {
	const { theme } = useTheme();

	// Use editor theme if provided, otherwise fall back to app theme
	const isDark = editorTheme ? editorTheme === "hc-black" : theme === "dark";
	const currentTheme = isDark ? darkTheme : lightTheme;

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
		<div className={`px-4 overflow-auto h-full font-mono ${className}`}>
			<JSONTree
				data={data}
				theme={currentTheme}
				invertTheme={false}
				shouldExpandNodeInitially={(keyPath, data, level) => level < 2}
				hideRoot={false}
				sortObjectKeys={true}
				getItemString={(type, data, itemType, itemString) => (
					<span className="opacity-75">
						{itemType} {itemString}
					</span>
				)}
				labelRenderer={([key, ...keyPath]) => (
					<strong className="text-sm">{key}:</strong>
				)}
				valueRenderer={(raw, value) => (
					<span className="text-sm">{String(raw)}</span>
				)}
			/>
		</div>
	);
}
