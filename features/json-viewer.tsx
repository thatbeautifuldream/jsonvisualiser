"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "./header";
import { JSONActions } from "./json-actions";
import { JSONEditor } from "./json-editor";
import { JSONTreeViewer } from "./json-tree-viewer";
import { StatusBar } from "./status-bar";
import { JsonSidebar } from "./json-sidebar";
import { useJsonStore, type JsonFile } from "@/stores/store";

type TEditorTheme = "light" | "hc-black";

type TStats = {
  lines: number;
  characters: number;
  size: number;
};


export function JsonViewer() {
  const [editorTheme, setEditorTheme] = useState<TEditorTheme>("hc-black");
  const [jsonValue, setJsonValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState<TStats>({ lines: 0, characters: 0, size: 0 });
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("editor");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  const { theme: appTheme } = useTheme();
  const { activeFileId, getActiveFile, loadFile, saveFile, createNewFile, clearActiveFile } = useJsonStore();

  // Get the current active file
  const activeFile = getActiveFile();

  // Load active file content when it changes
  useEffect(() => {
    if (activeFile && activeFile.content !== jsonValue) {
      setJsonValue(activeFile.content);
      if (editorRef.current) {
        editorRef.current.setValue(activeFile.content);
      }
    } else if (!activeFile && jsonValue) {
      // Clear editor if no active file
      setJsonValue("");
      if (editorRef.current) {
        editorRef.current.setValue("");
      }
    }
  }, [activeFile, jsonValue]);

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
      setParsedJson(null);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      setError("");
      setParsedJson(parsed);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setParsedJson(null);
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

      // Simple auto-save: if we have an active file, save to it
      if (activeFileId) {
        saveFile(activeFileId, newValue);
      }
    },
    [updateStats, validateJson, activeFileId, saveFile]
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

      // Add VS Code native keybindings for folding
      // Ctrl/Cmd + K, Ctrl/Cmd + 0 - Fold All
      editor.addCommand(
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0
        ),
        () => {
          editor.getAction("editor.foldAll")?.run();
        }
      );

      // Ctrl/Cmd + K, Ctrl/Cmd + J - Unfold All
      editor.addCommand(
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ
        ),
        () => {
          editor.getAction("editor.unfoldAll")?.run();
        }
      );

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
    setParsedJson(null);
  }, []);

  const handleFileSelect = useCallback((file: JsonFile) => {
    loadFile(file.id);
  }, [loadFile]);

  const handleNewFile = useCallback(() => {
    const newFileId = createNewFile();
    // The new file is automatically set as active in the store
  }, [createNewFile]);

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

  const tabs = [
    {
      id: "editor",
      label: "JSON Editor",
      content: (
        <div className="border flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <JSONEditor
              value={jsonValue}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={editorTheme}
            />
          </div>
          <StatusBar
            ref={statusBarRef}
            isValid={isValid}
            error={error}
            stats={stats}
            hasContent={!!jsonValue.trim()}
          />
        </div>
      ),
    },
  ];

  if (isValid && parsedJson) {
    tabs.push({
      id: "tree",
      label: "Tree View",
      content: (
        <div className="border flex flex-col h-full bg-white dark:bg-black">
          <JSONTreeViewer
            data={parsedJson}
            className="flex-1 min-h-0"
            editorTheme={editorTheme}
          />
          <StatusBar
            ref={statusBarRef}
            isValid={isValid}
            error={error}
            stats={stats}
            hasContent={!!jsonValue.trim()}
          />
        </div>
      ),
    });
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="h-screen flex flex-col">
      <Header
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        leftActions={
          <JsonSidebar
            onFileSelect={handleFileSelect}
            onNewFile={handleNewFile}
          />
        }
        actions={
          <JSONActions
            onFormat={formatJson}
            onMinify={minifyJson}
            onCopy={copyToClipboard}
            onClear={clearEditor}
            hasContent={!!jsonValue.trim()}
            isValid={isValid}
            isVisible={activeTab === "editor"}
          />
        }
      />
      <div className="flex-1 min-h-0 overflow-hidden">{activeTabContent}</div>
    </div>
  );
}
