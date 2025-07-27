"use client";

import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef } from "react";

type TJSONEditorProps = {
  value: string;
  onChange: (value: string | undefined) => void;
  onMount: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
  theme: "light" | "hc-black";
  className?: string;
};

export function JSONEditor({
  value,
  onChange,
  onMount,
  theme,
  className = ""
}: TJSONEditorProps) {
  return (
    <div className={`h-full ${className}`}>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value}
        theme={theme}
        onChange={onChange}
        onMount={onMount}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          folding: true,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}