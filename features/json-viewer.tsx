"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Editor, { type Monaco } from "@monaco-editor/react";
import { Copy, FileText, Zap } from "lucide-react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function JsonViewer() {
  const [editorTheme, setEditorTheme] = useState<"light" | "hc-black">("hc-black");
  const [jsonValue, setJsonValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState({ lines: 0, characters: 0, size: 0 });
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  const { theme: appTheme } = useTheme();

  const updateStats = useCallback(() => {
    const model = editorRef.current?.getModel();
    if (!model) {
      setStats({ lines: 0, characters: 0, size: 0 });
      return;
    }

    setStats({
      lines: model.getLineCount(),
      characters: model.getValueLength(),
      size: new Blob([model.getValue()]).size,
    });
  }, []);

  const updateErrorFromMarkers = useCallback(() => {
    const model = editorRef.current?.getModel();
    if (!model || !monacoRef.current) {
      setIsValid(true);
      setError("");
      return;
    }

    const markers = monacoRef.current.editor.getModelMarkers({
      resource: model.uri,
    });
    if (markers?.length) {
      setIsValid(false);
      setError(markers[0].message);
    } else {
      setIsValid(true);
      setError("");
    }
  }, []);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || "";
      setJsonValue(newValue);
      updateStats();
      updateErrorFromMarkers();
    },
    [updateStats, updateErrorFromMarkers]
  );

  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editorRef.current = editor;
      monacoRef.current = monaco;

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
        enableSchemaRequest: true,
      });

      // Listen for marker changes to update validation state
      monaco.editor.onDidChangeMarkers(() => {
        updateErrorFromMarkers();
      });

      // Initial stats update
      updateStats();
    },
    [updateErrorFromMarkers, updateStats]
  );

  const formatJson = useCallback(() => {
    if (!editorRef.current) return;

    const action = editorRef.current.getAction("editor.action.formatDocument");
    if (action) {
      action.run();
    }
  }, []);

  const minifyJson = useCallback(() => {
    if (!editorRef.current || !isValid) return;

    try {
      const currentValue = editorRef.current.getValue();
      const parsed = JSON.parse(currentValue);
      const minified = JSON.stringify(parsed);
      editorRef.current.setValue(minified);
      setJsonValue(minified);
    } catch (err) {
      toast("Failed to minify JSON", {
        description: "Please ensure the JSON is valid before minifying.",
      });
      console.error("Minification error:", err);
    }
  }, [isValid]);

  const copyToClipboard = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      const value = editorRef.current.getValue();
      await navigator.clipboard.writeText(value);
      toast("Copied to Clipboard", {
        description: "JSON content has been copied to your clipboard",
      });
    } catch (err) {
      toast("Failed to copy to clipboard", {
        description: "Please try again or copy manually.",
      });
    }
  }, []);

  const clearEditor = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.setValue("");
    setJsonValue("");
  }, []);

  useEffect(() => {
    if (appTheme === "dark") {
      setEditorTheme("hc-black");
    } else {
      setEditorTheme("light");
    }
  }, [appTheme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        formatJson();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [formatJson]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
        <h1 className="text-xl font-medium">JSON Visualiser</h1>
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={formatJson} size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Format
              </Button>
              <Button
                onClick={minifyJson}
                disabled={!isValid}
                size="sm"
                variant="outline"
              >
                <Zap className="w-4 h-4 mr-2" />
                Minify
              </Button>
              <Button onClick={copyToClipboard} size="sm" variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={clearEditor} size="sm" variant="outline">
                Clear
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col space-y-4 min-h-0">
        <div className="border overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="json"
              value={jsonValue}
              theme={editorTheme}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
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
          <div
            ref={statusBarRef}
            className={`border-t px-3 py-1 text-xs flex items-center justify-between ${
              editorTheme === "hc-black"
                ? "bg-black text-white border-gray-600"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`font-medium ${
                  isValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {isValid ? "✓ Valid JSON" : "✗ Invalid JSON"}
              </span>
              {!isValid && error && (
                <span className="text-red-500 truncate max-w-xs" title={error}>
                  {error}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Lines: {stats.lines}</span>
              <span>Characters: {stats.characters}</span>
              <span>Size: {stats.size} bytes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
