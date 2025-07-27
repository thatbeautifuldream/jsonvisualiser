"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import Editor, { type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export function JsonViewer() {
  const [editorTheme, setEditorTheme] = useState<"light" | "hc-black">(
    "hc-black"
  );
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

  const validateJson = useCallback((value: string) => {
    if (!value.trim()) {
      setIsValid(true);
      setError("");
      return;
    }

    try {
      JSON.parse(value);
      setIsValid(true);
      setError("");
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
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
      const currentValue = model.getValue();
      validateJson(currentValue);
    }
  }, [validateJson]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || "";
      setJsonValue(newValue);
      updateStats();
      validateJson(newValue);
    },
    [updateStats, validateJson]
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

      // Initial stats and validation update
      updateStats();
      validateJson(editor.getValue());
    },
    [updateErrorFromMarkers, updateStats, validateJson]
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
      toast.error("Failed to minify JSON");
      console.error("Minification error:", err);
    }
  }, [isValid]);

  const copyToClipboard = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      const value = editorRef.current.getValue();
      await navigator.clipboard.writeText(value);
      toast.success("Copied to Clipboard");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const clearEditor = useCallback(() => {
    if (!editorRef.current) return;

    editorRef.current.setValue("");
    setJsonValue("");
    setIsValid(true);
    setError("");
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
      <div className="flex items-center justify-between px-3 py-1 border-b flex-shrink-0 text-xs">
        <h1 className="text-xs font-medium">JSON Visualiser</h1>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-1">
              <Button
                onClick={formatJson}
                className="text-xs"
                disabled={!jsonValue.trim()}
                size="sm"
                variant="outline"
              >
                Format
              </Button>
              <Button
                onClick={minifyJson}
                className="text-xs"
                disabled={!isValid || !jsonValue.trim()}
                size="sm"
                variant="outline"
              >
                Minify
              </Button>
              <Button
                onClick={copyToClipboard}
                className="text-xs"
                disabled={!jsonValue.trim()}
                size="sm"
                variant="outline"
              >
                Copy
              </Button>
              <Button
                onClick={clearEditor}
                className="text-xs"
                disabled={!jsonValue.trim()}
                size="sm"
                variant="outline"
              >
                Clear
              </Button>
            </div>
            <div className="flex items-center gap-1">
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
            className={`bg:white dark:bg-black text-foreground border-t border px-3 py-1 text-xs flex items-center justify-between`}
          >
            <div className="flex items-center gap-4">
              {jsonValue.trim() && (
                <span className={`font-medium flex items-center gap-1`}>
                  {isValid ? <Check size={12} /> : <X size={12} />}
                  {isValid ? "Valid JSON" : "Invalid JSON"}
                </span>
              )}
              {!isValid && error && (
                <span className="truncate max-w-xs" title={error}>
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
