"use client";

import type { Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { WorkspaceHeader } from "./workspace-header";
import { EditorToolbar } from "./editor-toolbar";
import { JsonEditor } from "./json-editor";
import { JsonTreeViewer } from "./json-tree-viewer";
import { StatusBar } from "./status-bar";
import { FileExplorer } from "./file-explorer";
import { useJsonStore } from "@/stores/json-document-store";

type EditorTheme = "light" | "hc-black";

export function JsonWorkspace() {
	const [editorTheme, setEditorTheme] = useState<EditorTheme>("hc-black");
	const [activeTab, setActiveTab] = useState("editor");
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const monacoRef = useRef<Monaco | null>(null);
	const statusBarRef = useRef<HTMLDivElement>(null);

	const { theme: appTheme } = useTheme();
	const {
		activeFileId,
		getActiveFileContent,
		getValidation,
		getStats,
		hasContent,
		saveFile,
		createNewFile,
		initializeApp,
		ensureActiveFile,
	} = useJsonStore();

	// Get all data from store (single source of truth)
	const content = getActiveFileContent();
	const validation = getValidation();
	const stats = getStats();
	const isValid = validation.isValid;
	const error = validation.error;
	const parsedJson = validation.parsedJson;
	const hasFileContent = hasContent();

	// Sync editor with store content when it changes
	useEffect(() => {
		if (editorRef.current && editorRef.current.getValue() !== content) {
			editorRef.current.setValue(content);
		}
	}, [content]);

	const handleEditorChange = useCallback(
		async (value: string | undefined) => {
			const newValue = value || "";

			// Save directly to store if we have an active file
			if (activeFileId) {
				await saveFile(activeFileId, newValue);
			}
		},
		[activeFileId, saveFile],
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
					monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0,
				),
				() => {
					editor.getAction("editor.foldAll")?.run();
				},
			);

			// Ctrl/Cmd + K, Ctrl/Cmd + J - Unfold All
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

			// Save minified content to store
			if (activeFileId) {
				await saveFile(activeFileId, minified);
			}
		} catch (err) {
			toast.error("Failed to minify JSON");
			console.error("Minification error:", err);
		}
	}, [isValid, activeFileId, saveFile]);

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
		if (!editorRef.current) return;

		// Clear the active file content by saving empty string
		if (activeFileId) {
			await saveFile(activeFileId, "");
		}
	}, [activeFileId, saveFile]);

	const handleFileSelect = useCallback(() => {
		setActiveTab("editor");
		if (editorRef.current) {
			editorRef.current.focus();
		}
	}, []);

	const handleNewFile = useCallback(async () => {
		await createNewFile();
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

	// Initialize app on mount: load most recent file or create new one
	useEffect(() => {
		initializeApp();
	}, [initializeApp]);

	// Safeguard: ensure we always have an active file
	useEffect(() => {
		ensureActiveFile();
	}, [ensureActiveFile]);

	const tabs = [
		{
			id: "editor",
			label: "JSON Editor",
			content: (
				<div className="border flex flex-col h-full">
					<div className="flex-1 min-h-0">
						<JsonEditor
							value={content}
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

	// Only show tree view if we have valid JSON and content
	if (isValid && parsedJson && hasFileContent) {
		tabs.push({
			id: "tree",
			label: "Tree View",
			content: (
				<div className="border flex flex-col h-full bg-white dark:bg-black">
					<JsonTreeViewer data={parsedJson} className="flex-1 min-h-0" />
					<StatusBar
						ref={statusBarRef}
						isValid={isValid}
						error={error}
						stats={stats}
						hasContent={hasFileContent}
					/>
				</div>
			),
		});
	}

	const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

	return (
		<div className="h-screen flex flex-col">
			<WorkspaceHeader
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				leftActions={
					<FileExplorer
						onFileSelect={handleFileSelect}
						onNewFile={handleNewFile}
					/>
				}
				actions={
					<EditorToolbar
						onFormat={formatJson}
						onMinify={minifyJson}
						onCopy={copyToClipboard}
						onClear={clearEditor}
						hasContent={hasFileContent}
						isValid={isValid}
						isVisible={activeTab === "editor"}
					/>
				}
			/>
			<div className="flex-1 min-h-0 overflow-hidden">{activeTabContent}</div>
		</div>
	);
}
