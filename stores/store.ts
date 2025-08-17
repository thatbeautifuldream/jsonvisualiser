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
    getActiveFile: () => JsonFile | null
    getAllFiles: () => JsonFile[]
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
                set((state) => ({
                    jsonFiles: state.jsonFiles.filter((file) => file.id !== id),
                    activeFileId: state.activeFileId === id ? null : state.activeFileId,
                }))
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
            },

            getActiveFile: () => {
                const activeId = get().activeFileId
                return activeId ? get().jsonFiles.find(f => f.id === activeId) || null : null
            },

            getAllFiles: () => get().jsonFiles,
        }),
        {
            name: 'json-store',
            storage: createJSONStorage(() => storage),
        },
    ),
)