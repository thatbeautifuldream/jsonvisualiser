"use client";

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
import { JsonEditor, type TJsonEditorHandle } from "./json-editor";
import { JsonTreeViewer } from "./json-tree-viewer";
import { StatusBar } from "./status-bar";
import { useJsonStore } from "@/stores/json-document-store";
import { JsonGraphViewer } from "@/components/json-graph-viewer";
import { TypeGeneratorDialog } from "./type-generator-dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GitHubLink } from "./github-link";
import { unescapeJsonText } from "@/lib/unescape-json";

type EditorTheme = "light" | "dark";

type TJsonWorkspaceProps = {
  mode?: "default" | "extension";
  shouldLoadPersistedState?: boolean;
};

export function JsonWorkspace({
  mode = "default",
  shouldLoadPersistedState = true,
}: TJsonWorkspaceProps) {
  const [editorTheme, setEditorTheme] = useState<EditorTheme>("dark");
  const [activeTab, setActiveTab] = useState("editor");
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<TJsonEditorHandle | null>(null);
  const statusBarRef = useRef<HTMLDivElement>(null);

  const { theme: appTheme } = useTheme();

  const validation = useJsonStore((state) => state.getValidation());
  const stats = useJsonStore((state) => state.getStats());
  const hasFileContent = useJsonStore((state) => state.hasContent());
  const jsonContent = useJsonStore((state) => state.jsonContent);
  const metadata = useJsonStore((state) => state.metadata);
  const saveJson = useJsonStore((state) => state.saveJson);
  const clearJson = useJsonStore((state) => state.clearJson);
  const setJsonContent = useJsonStore((state) => state.setJsonContent);
  const loadFromIndexedDB = useJsonStore((state) => state.loadFromIndexedDB);

  const isValid = validation.isValid;
  const error = validation.error;
  const parsedJson = validation.parsedJson;
  const isExtensionMode = mode === "extension";

  useEffect(() => {
    if (!shouldLoadPersistedState) {
      return;
    }
    void loadFromIndexedDB();
  }, [loadFromIndexedDB, shouldLoadPersistedState]);

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

  const formatJson = useCallback(() => {
    if (!editorRef.current) return;

    try {
      const currentValue = editorRef.current.getValue();
      const formatted = JSON.stringify(JSON.parse(currentValue), null, 2);
      editorRef.current.setValue(formatted);
      startTransition(() => {
        setJsonContent(formatted);
        saveJson(formatted);
      });
    } catch {
      toast.error("Cannot format invalid JSON");
    }
  }, [setJsonContent, saveJson]);

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

  const unescapeJson = useCallback(() => {
    if (!editorRef.current) return;

    const currentValue = editorRef.current.getValue();
    const { value, replacementCount } = unescapeJsonText(currentValue);

    if (replacementCount === 0) {
      toast.error("No supported escape sequences found");
      return;
    }

    editorRef.current.setValue(value);
    startTransition(() => {
      setJsonContent(value);
      saveJson(value);
    });
    toast.success("JSON escape sequences removed");
  }, [saveJson, setJsonContent]);

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
    setEditorTheme(appTheme === "dark" ? "dark" : "light");
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
                ref={editorRef}
                value={jsonContent}
                onChange={handleEditorChange}
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

  const leftActions = useMemo(() => {
    if (!isExtensionMode) {
      return <div />;
    }

    const sourceLabel = (() => {
      if (!metadata.sourceUrl) {
        return "Waiting for URL";
      }

      const maxLength = 56;
      if (metadata.sourceUrl.length <= maxLength) {
        return metadata.sourceUrl;
      }

      return `${metadata.sourceUrl.slice(0, maxLength - 3)}...`;
    })();

    return (
      <span
        className="block max-w-[360px] truncate text-xs text-muted-foreground"
        title={metadata.sourceUrl ?? undefined}
      >
        {sourceLabel}
      </span>
    );
  }, [isExtensionMode, metadata.sourceUrl]);

  const headerActions = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <EditorToolbar
          onFormat={formatJson}
          onMinify={minifyJson}
          onUnescapeJson={unescapeJson}
          onCopy={copyToClipboard}
          onClear={clearEditor}
          onGenerateTypes={generateTypes}
          hasContent={hasFileContent}
          isValid={isValid}
          isVisible={activeTab === "editor"}
        />
        {!isExtensionMode ? <GitHubLink /> : null}
        <ThemeSwitcher />
      </div>
    );
  }, [
    activeTab,
    copyToClipboard,
    formatJson,
    generateTypes,
    hasFileContent,
    isValid,
    minifyJson,
    unescapeJson,
    clearEditor,
  ]);

  return (
    <>
      <div className="h-screen flex flex-col">
        <WorkspaceHeader
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          leftActions={leftActions}
          actions={headerActions}
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
