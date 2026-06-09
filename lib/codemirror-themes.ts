import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const hcDark = createTheme({
	theme: "dark",
	settings: {
		background: "#000000",
		foreground: "#ffffff",
		caret: "#ffffff",
		selection: "#264f78",
		selectionMatch: "#264f78",
		lineHighlight: "#ffffff0f",
		gutterBackground: "#000000",
		gutterForeground: "#858585",
		gutterActiveForeground: "#ffffff",
	},
	styles: [
		{ tag: t.propertyName, color: "#9cdcfe" },
		{ tag: t.string, color: "#ce9178" },
		{ tag: t.number, color: "#b5cea8" },
		{ tag: [t.bool, t.null], color: "#569cd6" },
		{ tag: [t.brace, t.squareBracket, t.separator], color: "#ffd700" },
		{ tag: t.invalid, color: "#f44747" },
		{ tag: t.keyword, color: "#569cd6" },
		{ tag: t.typeName, color: "#4ec9b0" },
		{ tag: t.variableName, color: "#9cdcfe" },
		{ tag: t.comment, color: "#7ca668" },
	],
});

export const hcLight = createTheme({
	theme: "light",
	settings: {
		background: "#ffffff",
		foreground: "#000000",
		caret: "#000000",
		selection: "#add6ff",
		selectionMatch: "#add6ff",
		lineHighlight: "#0000000a",
		gutterBackground: "#ffffff",
		gutterForeground: "#6e7681",
		gutterActiveForeground: "#000000",
	},
	styles: [
		{ tag: t.propertyName, color: "#0451a5" },
		{ tag: t.string, color: "#a31515" },
		{ tag: t.number, color: "#098658" },
		{ tag: [t.bool, t.null], color: "#0000ff" },
		{ tag: [t.brace, t.squareBracket, t.separator], color: "#319331" },
		{ tag: t.invalid, color: "#cd3131" },
		{ tag: t.keyword, color: "#0000ff" },
		{ tag: t.typeName, color: "#267f99" },
		{ tag: t.variableName, color: "#001080" },
		{ tag: t.comment, color: "#008000" },
	],
});

export function getEditorTheme(theme: "light" | "dark") {
	return theme === "dark" ? hcDark : hcLight;
}
