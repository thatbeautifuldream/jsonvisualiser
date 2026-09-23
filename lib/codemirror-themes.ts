import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const hcDark = createTheme({
	theme: "dark",
	settings: {
		background: "#111111",
		foreground: "#fdfdfc",
		caret: "#fdfdfc",
		selection: "#ffffff26",
		selectionMatch: "#ffffff26",
		lineHighlight: "#ffffff0f",
		gutterBackground: "#111111",
		gutterForeground: "#ffffff6b",
		gutterActiveForeground: "#fdfdfc",
		gutterBorder: "transparent",
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
		background: "#fdfdfc",
		foreground: "#111111",
		caret: "#111111",
		selection: "#0000001a",
		selectionMatch: "#0000001a",
		lineHighlight: "#0000000a",
		gutterBackground: "#fdfdfc",
		gutterForeground: "#00000066",
		gutterActiveForeground: "#111111",
		gutterBorder: "transparent",
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
