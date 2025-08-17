import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval'

const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        console.log(name, 'has been retrieved')
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        console.log(name, 'with value', value, 'has been saved')
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        console.log(name, 'has been deleted')
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

export interface JsonStore {
    jsonFiles: JsonFile[]
    currentFile: JsonFile | null

    // Actions
    createNewFile: () => string
    loadJsonFile: (id: string) => void
    deleteJsonFile: (id: string) => void
    renameJsonFile: (id: string, newName: string) => void
    updateCurrentFileContent: (content: string) => void
    getAllFiles: () => JsonFile[]
    getFileById: (id: string) => JsonFile | undefined
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
            currentFile: null,

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
                    currentFile: newFile,
                }))

                return newFile.id
            },

            loadJsonFile: (id: string) => {
                const file = get().jsonFiles.find((f) => f.id === id)
                if (file) {
                    set({ currentFile: file })
                }
            },

            deleteJsonFile: (id: string) => {
                set((state) => ({
                    jsonFiles: state.jsonFiles.filter((file) => file.id !== id),
                    currentFile: state.currentFile?.id === id ? null : state.currentFile,
                }))
            },

            renameJsonFile: (id: string, newName: string) => {
                const now = new Date()
                set((state) => ({
                    jsonFiles: state.jsonFiles.map((file) =>
                        file.id === id
                            ? { ...file, name: newName, updatedAt: now }
                            : file
                    ),
                    currentFile: state.currentFile?.id === id
                        ? { ...state.currentFile, name: newName, updatedAt: now }
                        : state.currentFile
                }))
            },

            updateCurrentFileContent: (content: string) => {
                const currentFile = get().currentFile
                if (!currentFile) {
                    // Auto-create a new file if none exists
                    const newFileId = get().createNewFile()
                    const newFile = get().jsonFiles.find(f => f.id === newFileId)
                    if (newFile) {
                        const now = new Date()
                        const size = new Blob([content]).size

                        set((state) => ({
                            jsonFiles: state.jsonFiles.map((file) =>
                                file.id === newFileId
                                    ? { ...file, content, updatedAt: now, size }
                                    : file
                            ),
                            currentFile: { ...newFile, content, updatedAt: now, size },
                        }))
                    }
                } else {
                    // Update existing file
                    const now = new Date()
                    const size = new Blob([content]).size

                    set((state) => ({
                        jsonFiles: state.jsonFiles.map((file) =>
                            file.id === currentFile.id
                                ? { ...file, content, updatedAt: now, size }
                                : file
                        ),
                        currentFile: { ...currentFile, content, updatedAt: now, size },
                    }))
                }
            },

            getAllFiles: () => get().jsonFiles,

            getFileById: (id: string) => get().jsonFiles.find((f) => f.id === id),
        }),
        {
            name: 'json-store',
            storage: createJSONStorage(() => storage),
        },
    ),
)