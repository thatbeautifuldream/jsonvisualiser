"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DiffEditor } from "@monaco-editor/react"
import { Copy, Moon, Sun } from "lucide-react"
import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { DiffStatusBar } from "@/features/diff-status-bar"

const defaultOriginal = `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming"],
  "isActive": true
}`

const defaultModified = `{
  "name": "John Smith",
  "age": 32,
  "email": "john.smith@example.com",
  "address": {
    "street": "456 Oak Ave",
    "city": "New York",
    "zipCode": "10001",
    "country": "USA"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "lastLogin": "2024-01-20T10:30:00Z"
}`

type TStats = {
    lines: number;
    characters: number;
    size: number;
};

type TDiffStats = {
    original: TStats;
    modified: TStats;
    total: TStats;
    changes: {
        additions: number;
        deletions: number;
        modifications: number;
    };
};

export default function JsonDiff() {
    const [originalJson, setOriginalJson] = useState(defaultOriginal)
    const [modifiedJson, setModifiedJson] = useState(defaultModified)
    const [originalValid, setOriginalValid] = useState(true)
    const [modifiedValid, setModifiedValid] = useState(true)
    const [originalError, setOriginalError] = useState("")
    const [modifiedError, setModifiedError] = useState("")
    const [theme, setTheme] = useState<"hc-black" | "light">("hc-black")
    const [stats, setStats] = useState<TDiffStats>({
        original: { lines: 0, characters: 0, size: 0 },
        modified: { lines: 0, characters: 0, size: 0 },
        total: { lines: 0, characters: 0, size: 0 },
        changes: { additions: 0, deletions: 0, modifications: 0 }
    })
    const diffEditorRef = useRef<any>(null)
    const statusBarRef = useRef<HTMLDivElement>(null)

    const calculateDiff = useCallback((original: string, modified: string) => {
        if (!original.trim() || !modified.trim()) {
            return { additions: 0, deletions: 0, modifications: 0 }
        }

        try {
            const originalObj = JSON.parse(original)
            const modifiedObj = JSON.parse(modified)

            let additions = 0
            let deletions = 0
            let modifications = 0

            // Simple diff calculation by comparing keys
            const originalKeys = new Set(Object.keys(originalObj))
            const modifiedKeys = new Set(Object.keys(modifiedObj))

            // Count additions (keys in modified but not in original)
            for (const key of modifiedKeys) {
                if (!originalKeys.has(key)) {
                    additions++
                }
            }

            // Count deletions (keys in original but not in modified)
            for (const key of originalKeys) {
                if (!modifiedKeys.has(key)) {
                    deletions++
                }
            }

            // Count modifications (keys in both but with different values)
            for (const key of originalKeys) {
                if (modifiedKeys.has(key)) {
                    const originalValue = JSON.stringify(originalObj[key])
                    const modifiedValue = JSON.stringify(modifiedObj[key])
                    if (originalValue !== modifiedValue) {
                        modifications++
                    }
                }
            }

            return { additions, deletions, modifications }
        } catch {
            // If JSON is invalid, return 0 changes
            return { additions: 0, deletions: 0, modifications: 0 }
        }
    }, [])

    const updateStats = useCallback(() => {
        // Use the current state values for real-time updates
        const originalLength = originalJson.length
        const modifiedLength = modifiedJson.length
        const originalLines = originalJson.split('\n').length
        const modifiedLines = modifiedJson.split('\n').length
        const changes = calculateDiff(originalJson, modifiedJson)

        setStats({
            original: {
                lines: originalLines,
                characters: originalLength,
                size: new Blob([originalJson]).size,
            },
            modified: {
                lines: modifiedLines,
                characters: modifiedLength,
                size: new Blob([modifiedJson]).size,
            },
            total: {
                lines: originalLines + modifiedLines,
                characters: originalLength + modifiedLength,
                size: new Blob([originalJson + modifiedJson]).size,
            },
            changes
        })
    }, [originalJson, modifiedJson, calculateDiff])

    const validateJson = useCallback(
        (value: string, setValid: (valid: boolean) => void, setError: (error: string) => void) => {
            if (!value.trim()) {
                setValid(true)
                setError("")
                return true
            }

            try {
                JSON.parse(value)
                setValid(true)
                setError("")
                return true
            } catch (err) {
                setValid(false)
                setError(err instanceof Error ? err.message : "Invalid JSON")
                return false
            }
        },
        [],
    )

    const handleDiffEditorDidMount = useCallback((editor: any, monaco: any) => {
        diffEditorRef.current = editor

        // Configure JSON language features
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: false,
            schemas: [],
            enableSchemaRequest: true,
        })

        // Set up change listeners for both editors
        const originalEditor = editor.getOriginalEditor()
        const modifiedEditor = editor.getModifiedEditor()

        // Ensure both editors are editable
        originalEditor.updateOptions({ readOnly: false })
        modifiedEditor.updateOptions({ readOnly: false })

        originalEditor.onDidChangeModelContent(() => {
            const value = originalEditor.getValue()
            setOriginalJson(value)
            validateJson(value, setOriginalValid, setOriginalError)
            updateStats()
        })

        modifiedEditor.onDidChangeModelContent(() => {
            const value = modifiedEditor.getValue()
            setModifiedJson(value)
            validateJson(value, setModifiedValid, setModifiedError)
            updateStats()
        })

        // Initial stats update
        updateStats()
    }, [validateJson, updateStats])

    const copyDiff = useCallback(async () => {
        if (!diffEditorRef.current) return

        try {
            const originalModel = diffEditorRef.current.getOriginalEditor().getModel()
            const modifiedModel = diffEditorRef.current.getModifiedEditor().getModel()

            const diffText = `=== ORIGINAL ===\n${originalModel.getValue()}\n\n=== MODIFIED ===\n${modifiedModel.getValue()}`

            await navigator.clipboard.writeText(diffText)
            toast.success("Diff content has been copied to your clipboard")
        } catch (err) {
            toast.error("Failed to copy to clipboard")
        }
    }, [])

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "light" ? "hc-black" : "light"))
    }, [])

    return (
        <div className="h-screen flex flex-col">
            {/* Toolbar */}
            <div className="border-b px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button onClick={copyDiff} size="sm" variant="outline">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Diff
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={toggleTheme} size="sm" variant="ghost">
                            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </Button>
                        <Badge variant={originalValid ? "default" : "destructive"}>
                            Original: {originalValid ? "Valid" : "Invalid"}
                        </Badge>
                        <Badge variant={modifiedValid ? "default" : "destructive"}>
                            Modified: {modifiedValid ? "Valid" : "Invalid"}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Diff Editor */}
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
                    <DiffEditor
                        height="100%"
                        language="json"
                        original={originalJson}
                        modified={modifiedJson}
                        theme={theme}
                        onMount={handleDiffEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: "off",
                            folding: true,
                            foldingStrategy: "indentation",
                            showFoldingControls: "always",
                            bracketPairColorization: { enabled: true },
                            renderSideBySide: true,
                            ignoreTrimWhitespace: false,
                            renderWhitespace: "boundary",
                            diffWordWrap: "off",
                            enableSplitViewResizing: true,
                        }}
                    />
                </div>
            </div>

            {/* Status Bar */}
            <DiffStatusBar
                ref={statusBarRef}
                originalValid={originalValid}
                modifiedValid={modifiedValid}
                originalError={originalError}
                modifiedError={modifiedError}
                stats={stats}
                hasContent={originalJson.trim().length > 0 || modifiedJson.trim().length > 0}
            />
        </div>
    )
} 