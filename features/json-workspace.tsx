"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { WorkspaceHeader } from "./workspace-header";
import { EditorToolbar } from "./editor-toolbar";
import { JsonEditor } from "./json-editor";
import { JsonTreeViewer } from "./json-tree-viewer";
import { StatusBar } from "./status-bar";
import { useJsonStore } from "@/stores/json-document-store";
import { JsonGraphViewer } from "@/components/json-graph-viewer";
import { TypeGeneratorDialog } from "./type-generator-dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GitHubLink } from "./github-link";

type EditorTheme = "light" | "hc-black";

export function JsonWorkspace() {
  const [editorTheme, setEditorTheme] = useState<EditorTheme>("hc-black");
  const [activeTab, setActiveTab] = useState("editor");
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  const { theme: appTheme } = useTheme();

  const validation = useJsonStore((state) => state.getValidation());
  const stats = useJsonStore((state) => state.getStats());
  const hasFileContent = useJsonStore((state) => state.hasContent());
  const jsonContent = useJsonStore((state) => state.jsonContent);
  const saveJson = useJsonStore((state) => state.saveJson);
  const clearJson = useJsonStore((state) => state.clearJson);
  const setJsonContent = useJsonStore((state) => state.setJsonContent);
  const loadFromSessionStorage = useJsonStore(
    (state) => state.loadFromSessionStorage,
  );

  const isValid = validation.isValid;
  const error = validation.error;
  const parsedJson = validation.parsedJson;

  useEffect(() => {
    loadFromSessionStorage();
  }, [loadFromSessionStorage]);

  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== jsonContent) {
      editorRef.current.setValue(jsonContent);
    }
  }, [jsonContent]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || "";
      startTransition(() => {
        setJsonContent(newValue);
        saveJson(newValue);
      });
    },
    [setJsonContent, saveJson],
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

      editor.addCommand(
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0,
        ),
        () => {
          editor.getAction("editor.foldAll")?.run();
        },
      );

      editor.addCommand(
        monaco.KeyMod.chord(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ,
        ),
        () => {
          editor.getAction("editor.unfoldAll")?.run();
        },
      );
    },
    [],
  );

  const formatJson = useCallback(() => {
    if (!editorRef.current) return;

    const action = editorRef.current.getAction("editor.action.formatDocument");
    if (action) {
      action.run();
    }
  }, []);

  const minifyJson = useCallback(async () => {
    if (!editorRef.current || !isValid) return;

    try {
      const currentValue = editorRef.current.getValue();
      const parsed = JSON.parse(currentValue);
      const minified = JSON.stringify(parsed);
      editorRef.current.setValue(minified);
      startTransition(() => {
        setJsonContent(minified);
        saveJson(minified);
      });
    } catch (err) {
      toast.error("Failed to minify JSON");
      console.error("Minification error:", err);
    }
  }, [isValid, setJsonContent, saveJson]);

  const copyToClipboard = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      const value = editorRef.current.getValue();
      await navigator.clipboard.writeText(value);
      toast.success("Copied to Clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, []);

  const clearEditor = useCallback(async () => {
    clearJson();
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  }, [clearJson]);

  const generateTypes = useCallback(() => {
    setIsTypeDialogOpen(true);
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

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: "editor",
        label: "JSON Editor",
        content: (
          <div className="border flex flex-col h-full">
            <div className="flex-1 min-h-0">
              <JsonEditor
                value={jsonContent}
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
              hasContent={hasFileContent}
            />
          </div>
        ),
      },
    ];

    if (isValid && parsedJson && hasFileContent) {
      baseTabs.push({
        id: "tree",
        label: "Tree View",
        content: <JsonTreeViewer data={parsedJson} className="w-full h-full" />,
      });

      baseTabs.push({
        id: "graph",
        label: "Graph View",
        content: (
          <JsonGraphViewer
            data={parsedJson}
            preset="deep"
            onNodeClick={(node, path) => {
              console.log("Node clicked:", { node, path });
            }}
            options={{
              maxDepth: 4,
              createHierarchicalLinks: true,
              createArrayLinks: false,
              getNodeText: (key, value, path) => {
                if (key === "root") return "JSON Root";
                if (typeof value === "string" && value.length < 20)
                  return value;
                if (typeof value === "number") return String(value);
                return key;
              },
            }}
            className="w-full h-full"
          />
        ),
      });
    }

    return baseTabs;
  }, [
    jsonContent,
    handleEditorChange,
    handleEditorDidMount,
    editorTheme,
    isValid,
    parsedJson,
    hasFileContent,
    error,
    stats,
  ]);

  const activeTabContent = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTab)?.content;
  }, [tabs, activeTab]);

  return (
    <>
      <div className="h-screen flex flex-col">
        <WorkspaceHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          leftActions={<div />}
          actions={
            <div className="flex items-center gap-2">
              <EditorToolbar
                onFormat={formatJson}
                onMinify={minifyJson}
                onCopy={copyToClipboard}
                onClear={clearEditor}
                onGenerateTypes={generateTypes}
                hasContent={hasFileContent}
                isValid={isValid}
                isVisible={activeTab === "editor"}
              />
              <GitHubLink />
              <ThemeSwitcher />
            </div>
          }
        />
        <div className="flex-1 min-h-0 overflow-hidden">{activeTabContent}</div>
      </div>
      <TypeGeneratorDialog
        open={isTypeDialogOpen}
        onOpenChange={setIsTypeDialogOpen}
        jsonContent={jsonContent}
        theme={editorTheme}
      />
    </>
  );
}
