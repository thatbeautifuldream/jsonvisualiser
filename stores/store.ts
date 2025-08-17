import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name)
    },
}

export interface JsonFile {
    id: string
    name: string
    content: string
    createdAt: Date
    updatedAt: Date
    size: number
}

export interface ValidationResult {
    isValid: boolean
    error: string
    parsedJson: any
}

export interface JsonStats {
    lines: number
    characters: number
    size: number
}

export interface JsonStore {
    jsonFiles: JsonFile[]
    activeFileId: string | null

    // Actions
    createNewFile: () => string
    loadFile: (id: string) => void
    saveFile: (id: string, content: string) => void
    deleteFile: (id: string) => void
    renameFile: (id: string, newName: string) => void
    clearActiveFile: () => void
    initializeApp: () => void
    ensureActiveFile: () => void

    // Computed getters
    getActiveFile: () => JsonFile | null
    getAllFiles: () => JsonFile[]
    getActiveFileContent: () => string
    getValidation: () => ValidationResult
    getStats: () => JsonStats
    hasActiveFile: () => boolean
    hasContent: () => boolean
}

const generateFileName = () => {
    const now = new Date()
    return now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/[/:]/g, '-').replace(', ', '_')
}

export const useJsonStore = create<JsonStore>()(
    persist(
        (set, get) => ({
            jsonFiles: [],
            activeFileId: null,

            createNewFile: () => {
                const now = new Date()
                const fileName = generateFileName()

                const newFile: JsonFile = {
                    id: crypto.randomUUID(),
                    name: fileName,
                    content: '',
                    createdAt: now,
                    updatedAt: now,
                    size: 0,
                }

                set((state) => ({
                    jsonFiles: [...state.jsonFiles, newFile],
                    activeFileId: newFile.id,
                }))

                return newFile.id
            },

            loadFile: (id: string) => {
                const fileExists = get().jsonFiles.some(f => f.id === id)
                if (fileExists) {
                    set({ activeFileId: id })
                }
            },

            saveFile: (id: string, content: string) => {
                const now = new Date()
                const size = new Blob([content]).size

                set((state) => ({
                    jsonFiles: state.jsonFiles.map((file) =>
                        file.id === id
                            ? { ...file, content, updatedAt: now, size }
                            : file
                    ),
                }))
            },

            deleteFile: (id: string) => {
                const state = get()
                const isActiveFile = state.activeFileId === id
                const remainingFiles = state.jsonFiles.filter((file) => file.id !== id)

                if (remainingFiles.length === 0) {
                    // If this was the last file, create a new one immediately
                    set({
                        jsonFiles: [],
                        activeFileId: null
                    })
                    // Create new file after state update
                    get().createNewFile()
                } else if (isActiveFile) {
                    // If deleting the active file, select the next best file
                    // Sort by updatedAt to get the most recently modified
                    const sortedFiles = remainingFiles.sort((a, b) =>
                        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    )
                    const nextActiveFile = sortedFiles[0]

                    set({
                        jsonFiles: remainingFiles,
                        activeFileId: nextActiveFile.id,
                    })
                } else {
                    // Deleting a non-active file, just remove it
                    set({
                        jsonFiles: remainingFiles,
                    })
                }
            },

            renameFile: (id: string, newName: string) => {
                const now = new Date()
                set((state) => ({
                    jsonFiles: state.jsonFiles.map((file) =>
                        file.id === id
                            ? { ...file, name: newName, updatedAt: now }
                            : file
                    ),
                }))
            },

            clearActiveFile: () => {
                set({ activeFileId: null })
                // Immediately ensure we have an active file
                get().ensureActiveFile()
            },

            initializeApp: () => {
                const files = get().jsonFiles
                if (files.length > 0) {
                    // Sort by updatedAt to get the most recent file
                    const mostRecentFile = files.sort((a, b) =>
                        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                    )[0]
                    set({ activeFileId: mostRecentFile.id })
                } else {
                    // No files exist, create a new one
                    get().createNewFile()
                }
            },

            ensureActiveFile: () => {
                if (!get().activeFileId) {
                    get().initializeApp()
                }
            },

            getActiveFile: () => {
                const activeId = get().activeFileId
                return activeId ? get().jsonFiles.find(f => f.id === activeId) || null : null
            },

            getAllFiles: () => get().jsonFiles,

            getActiveFileContent: () => {
                const activeFile = get().getActiveFile()
                return activeFile ? activeFile.content : ""
            },

            getValidation: (): ValidationResult => {
                const content = get().getActiveFileContent()

                if (!content.trim()) {
                    return {
                        isValid: true,
                        error: "",
                        parsedJson: null
                    }
                }

                try {
                    const parsed = JSON.parse(content)
                    return {
                        isValid: true,
                        error: "",
                        parsedJson: parsed
                    }
                } catch (err) {
                    return {
                        isValid: false,
                        error: err instanceof Error ? err.message : "Invalid JSON",
                        parsedJson: null
                    }
                }
            },

            getStats: (): JsonStats => {
                const content = get().getActiveFileContent()
                const lines = content ? content.split('\n').length : 0
                const characters = content.length
                const size = new Blob([content]).size

                return {
                    lines,
                    characters,
                    size
                }
            },

            hasActiveFile: () => {
                return get().activeFileId !== null && get().getActiveFile() !== null
            },

            hasContent: () => {
                return get().getActiveFileContent().trim().length > 0
            },
        }),
        {
            name: 'json-store',
            storage: createJSONStorage(() => storage),
        },
    ),
)