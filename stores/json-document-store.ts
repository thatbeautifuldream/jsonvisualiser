"use client";

import { create } from "zustand";
import { indexedDBService, jsonEventEmitter } from "@/lib/json-storage-service";
import { toast } from "sonner";

export type TJsonFile = {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  size: number;
};

export type TValidationResult = {
  isValid: boolean;
  error: string;
  parsedJson: unknown;
};

export type TJsonStats = {
  lines: number;
  characters: number;
  size: number;
};

export type TJsonStore = {
  jsonFiles: TJsonFile[];
  activeFileId: string | null;
  isLoading: boolean;
  error?: string;

  // Actions
  createNewFile: () => Promise<string>;
  loadFile: (id: string) => Promise<void>;
  loadAllFiles: () => Promise<void>;
  saveFile: (id: string, content: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  clearActiveFile: () => void;
  initializeApp: () => Promise<void>;
  ensureActiveFile: () => Promise<void>;
  searchFiles: (query: string) => Promise<TJsonFile[]>;
  bulkDeleteFiles: (fileIds: string[]) => Promise<void>;

  // Computed getters
  getActiveFile: () => TJsonFile | null;
  getAllFiles: () => TJsonFile[];
  getActiveFileContent: () => string;
  getValidation: () => TValidationResult;
  getStats: () => TJsonStats;
  hasActiveFile: () => boolean;
  hasContent: () => boolean;
};

const generateFileName = () => {
  const now = new Date();
  return now
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/[/:]/g, "-")
    .replace(", ", "_");
};

// Type guard for error with message
function isErrorWithMessage(err: unknown): err is { message: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
  );
}

export const useJsonStore = create<TJsonStore>()((set, get) => ({
  jsonFiles: [],
  activeFileId: null,
  isLoading: false,
  error: undefined,

  createNewFile: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const now = new Date();
      const fileName = generateFileName();

      const newFile: TJsonFile = {
        id: crypto.randomUUID(),
        name: fileName,
        content: "",
        createdAt: now,
        updatedAt: now,
        size: 0,
      };

      await indexedDBService.saveFile(newFile);

      set((state) => ({
        jsonFiles: [...state.jsonFiles, newFile],
        activeFileId: newFile.id,
        isLoading: false,
      }));

      jsonEventEmitter.emit("active-file-changed", newFile.id);
      return newFile.id;
    } catch (err: unknown) {
      let errorMsg = "Failed to create new file";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw err;
    }
  },

  loadFile: async (id: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const file = await indexedDBService.getFile(id);
      if (file) {
        // Update local state if file exists
        set((state) => {
          const existingIndex = state.jsonFiles.findIndex((f) => f.id === id);
          const updatedFiles =
            existingIndex >= 0
              ? state.jsonFiles.map((f, i) => (i === existingIndex ? file : f))
              : [...state.jsonFiles, file];

          return {
            jsonFiles: updatedFiles,
            activeFileId: id,
            isLoading: false,
          };
        });
        jsonEventEmitter.emit("active-file-changed", id);
      } else {
        set({ isLoading: false });
        toast.error("File not found");
      }
    } catch (err: unknown) {
      let errorMsg = "Failed to load file";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  loadAllFiles: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const files = await indexedDBService.getAllFiles();
      set({
        jsonFiles: files,
        isLoading: false,
      });
    } catch (err: unknown) {
      let errorMsg = "Failed to load files";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  saveFile: async (id: string, content: string) => {
    try {
      const now = new Date();
      const size = new Blob([content]).size;

      // Update local state immediately for responsive UI
      set((state) => ({
        jsonFiles: state.jsonFiles.map((file) =>
          file.id === id ? { ...file, content, updatedAt: now, size } : file
        ),
      }));

      // Save to IndexedDB
      await indexedDBService.updateFileContent(id, content);
    } catch (err: unknown) {
      let errorMsg = "Failed to save file";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg });
      toast.error(errorMsg);
    }
  },

  deleteFile: async (id: string) => {
    set({ isLoading: true, error: undefined });
    try {
      const state = get();
      const isActiveFile = state.activeFileId === id;
      const remainingFiles = state.jsonFiles.filter((file) => file.id !== id);

      await indexedDBService.deleteFile(id);

      if (remainingFiles.length === 0) {
        // If this was the last file, create a new one immediately
        set({
          jsonFiles: [],
          activeFileId: null,
          isLoading: false,
        });
        // Create new file after state update
        await get().createNewFile();
      } else if (isActiveFile) {
        // If deleting the active file, select the next best file
        // Sort by updatedAt to get the most recently modified
        const sortedFiles = remainingFiles.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        const nextActiveFile = sortedFiles[0];

        set({
          jsonFiles: remainingFiles,
          activeFileId: nextActiveFile.id,
          isLoading: false,
        });
        jsonEventEmitter.emit("active-file-changed", nextActiveFile.id);
      } else {
        // Deleting a non-active file, just remove it
        set({
          jsonFiles: remainingFiles,
          isLoading: false,
        });
      }
    } catch (err: unknown) {
      let errorMsg = "Failed to delete file";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  renameFile: async (id: string, newName: string) => {
    try {
      const now = new Date();

      // Update local state immediately
      set((state) => ({
        jsonFiles: state.jsonFiles.map((file) =>
          file.id === id ? { ...file, name: newName, updatedAt: now } : file
        ),
      }));

      // Update in IndexedDB
      await indexedDBService.updateFileName(id, newName);
    } catch (err: unknown) {
      let errorMsg = "Failed to rename file";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg });
      toast.error(errorMsg);
    }
  },

  clearActiveFile: () => {
    set({ activeFileId: null });
    jsonEventEmitter.emit("active-file-changed", null);
    // Immediately ensure we have an active file
    get().ensureActiveFile();
  },

  initializeApp: async () => {
    set({ isLoading: true, error: undefined });
    try {
      await get().loadAllFiles();
      const files = get().jsonFiles;

      if (files.length > 0) {
        // Sort by updatedAt to get the most recent file
        const mostRecentFile = files.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0];
        set({ activeFileId: mostRecentFile.id, isLoading: false });
        jsonEventEmitter.emit("active-file-changed", mostRecentFile.id);
      } else {
        // No files exist, create a new one
        set({ isLoading: false });
        await get().createNewFile();
      }
    } catch (err: unknown) {
      let errorMsg = "Failed to initialize app";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  ensureActiveFile: async () => {
    if (!get().activeFileId) {
      await get().initializeApp();
    }
  },

  searchFiles: async (query: string) => {
    try {
      const results = await indexedDBService.searchFiles(query);
      return results;
    } catch (err: unknown) {
      let errorMsg = "Failed to search files";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg });
      toast.error(errorMsg);
      return [];
    }
  },

  bulkDeleteFiles: async (fileIds: string[]) => {
    set({ isLoading: true, error: undefined });
    try {
      await indexedDBService.bulkDeleteFiles(fileIds);

      const state = get();
      const remainingFiles = state.jsonFiles.filter(
        (file) => !fileIds.includes(file.id)
      );
      const isActiveFileDeleted =
        state.activeFileId && fileIds.includes(state.activeFileId);

      if (remainingFiles.length === 0) {
        set({
          jsonFiles: [],
          activeFileId: null,
          isLoading: false,
        });
        await get().createNewFile();
      } else if (isActiveFileDeleted) {
        const sortedFiles = remainingFiles.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        const nextActiveFile = sortedFiles[0];

        set({
          jsonFiles: remainingFiles,
          activeFileId: nextActiveFile.id,
          isLoading: false,
        });
        jsonEventEmitter.emit("active-file-changed", nextActiveFile.id);
      } else {
        set({
          jsonFiles: remainingFiles,
          isLoading: false,
        });
      }

      toast.success(`Deleted ${fileIds.length} files`);
    } catch (err: unknown) {
      let errorMsg = "Failed to delete files";
      if (isErrorWithMessage(err)) {
        errorMsg = err.message;
      }
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
    }
  },

  getActiveFile: () => {
    const activeId = get().activeFileId;
    return activeId
      ? get().jsonFiles.find((f) => f.id === activeId) || null
      : null;
  },

  getAllFiles: () => get().jsonFiles,

  getActiveFileContent: () => {
    const activeFile = get().getActiveFile();
    return activeFile ? activeFile.content : "";
  },

  getValidation: (): TValidationResult => {
    const content = get().getActiveFileContent();

    if (!content.trim()) {
      return {
        isValid: true,
        error: "",
        parsedJson: null,
      };
    }

    try {
      const parsed = JSON.parse(content);
      return {
        isValid: true,
        error: "",
        parsedJson: parsed,
      };
    } catch (err) {
      return {
        isValid: false,
        error: err instanceof Error ? err.message : "Invalid JSON",
        parsedJson: null,
      };
    }
  },

  getStats: (): TJsonStats => {
    const content = get().getActiveFileContent();
    const lines = content ? content.split("\n").length : 0;
    const characters = content.length;
    const size = new Blob([content]).size;

    return {
      lines,
      characters,
      size,
    };
  },

  hasActiveFile: () => {
    return get().activeFileId !== null && get().getActiveFile() !== null;
  },

  hasContent: () => {
    return get().getActiveFileContent().trim().length > 0;
  },
}));
