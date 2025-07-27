"use client";

import { JSONTree } from "react-json-tree";
import { useTheme } from "next-themes";

interface JSONTreeViewerProps {
  data: any;
  className?: string;
  editorTheme?: "light" | "hc-black";
}

const lightTheme = {
  scheme: "extreme-light",
  base00: "#ffffff", // Extreme light background
  base01: "#f8f8f8", // Lighter background
  base02: "#e8e8e8", // Selection background
  base03: "#d0d0d0", // Comments, invisibles
  base04: "#969896", // Dark foreground
  base05: "#222222", // Default foreground (darker for contrast)
  base06: "#282a2e", // Light foreground
  base07: "#1d1f21", // Light background
  base08: "#cc342b", // Variables, XML Tags, Markup Link Text
  base09: "#f96a38", // Integers, Boolean, Constants
  base0A: "#fba922", // Classes, Markup Bold, Search Text Background
  base0B: "#198844", // Strings, Inherited Class, Markup Code
  base0C: "#3971ed", // Support, Regular Expressions, Escape Characters
  base0D: "#3971ed", // Functions, Methods, Attribute IDs, Headings
  base0E: "#a36ac7", // Keywords, Storage, Selector, Markup Italic
  base0F: "#3971ed", // Deprecated, Opening/Closing Embedded Language Tags
};

const darkTheme = {
  scheme: "extreme-dark",
  base00: "#000000", // Extreme dark background
  base01: "#181818", // Lighter background
  base02: "#222222", // Selection background
  base03: "#444444", // Comments, invisibles
  base04: "#cccccc", // Dark foreground
  base05: "#ffffff", // Default foreground
  base06: "#e0e0e0", // Light foreground
  base07: "#f5f5f5", // Light background
  base08: "#ff5370", // Variables, XML Tags, Markup Link Text
  base09: "#f78c6c", // Integers, Boolean, Constants
  base0A: "#ffcb6b", // Classes, Markup Bold, Search Text Background
  base0B: "#c3e88d", // Strings, Inherited Class, Markup Code
  base0C: "#89ddff", // Support, Regular Expressions, Escape Characters
  base0D: "#82aaff", // Functions, Methods, Attribute IDs, Headings
  base0E: "#c792ea", // Keywords, Storage, Selector, Markup Italic
  base0F: "#ff5370", // Deprecated, Opening/Closing Embedded Language Tags
};

export function JSONTreeViewer({
  data,
  className = "",
  editorTheme,
}: JSONTreeViewerProps) {
  const { theme } = useTheme();

  // Use editor theme if provided, otherwise fall back to app theme
  const isDark = editorTheme ? editorTheme === "hc-black" : theme === "dark";
  const currentTheme = isDark ? darkTheme : lightTheme;

  if (!data) {
    return (
      <div
        className={`flex items-center justify-center h-full text-muted-foreground ${className}`}
      >
        <p>No valid JSON data to display</p>
      </div>
    );
  }

  return (
    <div className={`p-4 overflow-auto h-full ${className}`}>
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
          <span
            className="text-sm"
            style={{
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {raw}
          </span>
        )}
      />
    </div>
  );
}
