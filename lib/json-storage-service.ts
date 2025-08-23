import Dexie, { type Table } from "dexie";
import type { TJsonFile } from "@/stores/json-document-store";

// Event emitter for JSON file events
type TJsonFileEvents = {
  "file-saved": [fileId: string];
  "file-deleted": [fileId: string];
  "file-updated": [fileId: string];
  "files-bulk-deleted": [fileIds: string[]];
  "active-file-changed": [fileId: string | null];
};

class JsonEventEmitter<E extends Record<string, unknown[]>> {
  private events: { [K in keyof E]?: Array<(...args: E[K]) => void> } = {};

  on<K extends keyof E>(event: K, callback: (...args: E[K]) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    (this.events[event] as Array<(...args: E[K]) => void>).push(callback);
    return () => this.off(event, callback);
  }

  off<K extends keyof E>(event: K, callback: (...args: E[K]) => void) {
    const list = this.events[event];
    if (!list) return;
    this.events[event] = list.filter((cb) => cb !== callback);
  }

  emit<K extends keyof E>(event: K, ...args: E[K]) {
    this.events[event]?.forEach((cb) => cb(...args));
  }
}

export const jsonEventEmitter = new JsonEventEmitter<TJsonFileEvents>();

export type TStoredJsonFile = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  size: number;
};

// Dexie database class
class JsonVisualizerDB extends Dexie {
  jsonFiles!: Table<TStoredJsonFile>;

  constructor() {
    super("JSON_VISUALISER_DOCUMENT");

    this.version(1).stores({
      jsonFiles: "id, name, createdAt, updatedAt, size",
    });
  }
}

// Create the database instance
const db = new JsonVisualizerDB();

class DexieDBService {
  private convertStoredToJsonFile(stored: TStoredJsonFile): TJsonFile {
    return {
      id: stored.id,
      name: stored.name,
      content: stored.content,
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
      size: stored.size,
    };
  }

  private convertJsonFileToStored(file: TJsonFile): TStoredJsonFile {
    return {
      id: file.id,
      name: file.name,
      content: file.content,
      createdAt: file.createdAt.getTime(),
      updatedAt: file.updatedAt.getTime(),
      size: file.size,
    };
  }

  async init(): Promise<void> {
    // Dexie handles initialization automatically
    // This method is kept for API compatibility
    await db.open();
  }

  async saveFile(file: TJsonFile): Promise<void> {
    try {
      const storedFile = this.convertJsonFileToStored(file);
      await db.jsonFiles.put(storedFile);
      jsonEventEmitter.emit("file-saved", file.id);
    } catch (error) {
      throw new Error(`Failed to save file: ${error}`);
    }
  }

  async getFile(fileId: string): Promise<TJsonFile | null> {
    try {
      const stored = await db.jsonFiles.get(fileId);
      return stored ? this.convertStoredToJsonFile(stored) : null;
    } catch (error) {
      throw new Error(`Failed to get file: ${error}`);
    }
  }

  async getAllFiles(): Promise<TJsonFile[]> {
    try {
      const storedFiles = await db.jsonFiles
        .orderBy("updatedAt")
        .reverse()
        .toArray();

      return storedFiles.map((stored) => this.convertStoredToJsonFile(stored));
    } catch (error) {
      throw new Error(`Failed to get all files: ${error}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await db.jsonFiles.delete(fileId);
      jsonEventEmitter.emit("file-deleted", fileId);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  async updateFileName(fileId: string, newName: string): Promise<void> {
    try {
      const result = await db.jsonFiles.update(fileId, {
        name: newName,
        updatedAt: Date.now(),
      });

      if (result === 0) {
        throw new Error("File not found");
      }

      jsonEventEmitter.emit("file-updated", fileId);
    } catch (error) {
      throw new Error(`Failed to update file name: ${error}`);
    }
  }

  async updateFileContent(fileId: string, content: string): Promise<void> {
    try {
      const size = new Blob([content]).size;
      const result = await db.jsonFiles.update(fileId, {
        content,
        updatedAt: Date.now(),
        size,
      });

      if (result === 0) {
        throw new Error("File not found");
      }

      jsonEventEmitter.emit("file-updated", fileId);
    } catch (error) {
      throw new Error(`Failed to update file content: ${error}`);
    }
  }

  async bulkDeleteFiles(fileIds: string[]): Promise<void> {
    try {
      await db.transaction("rw", db.jsonFiles, async () => {
        await db.jsonFiles.bulkDelete(fileIds);
      });

      jsonEventEmitter.emit("files-bulk-deleted", fileIds);
    } catch (error) {
      throw new Error(`Failed to bulk delete files: ${error}`);
    }
  }

  async searchFiles(query: string): Promise<TJsonFile[]> {
    try {
      const searchTerm = query.toLowerCase();

      const storedFiles = await db.jsonFiles
        .filter((file) => {
          return (
            file.name.toLowerCase().includes(searchTerm) ||
            file.content.toLowerCase().includes(searchTerm)
          );
        })
        .sortBy("updatedAt");

      // Sort by updatedAt descending (most recent first)
      return storedFiles
        .reverse()
        .map((stored) => this.convertStoredToJsonFile(stored));
    } catch (error) {
      throw new Error(`Failed to search files: ${error}`);
    }
  }

  async getFileStats(): Promise<{ totalFiles: number; totalSize: number }> {
    try {
      const files = await db.jsonFiles.toArray();
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return { totalFiles, totalSize };
    } catch (error) {
      throw new Error(`Failed to get file stats: ${error}`);
    }
  }

  async cleanupLargeFiles(
    maxSizeBytes: number = 10 * 1024 * 1024
  ): Promise<string[]> {
    try {
      const largeFiles = await db.jsonFiles
        .where("size")
        .above(maxSizeBytes)
        .toArray();

      const largeFileIds = largeFiles.map((file) => file.id);

      if (largeFileIds.length > 0) {
        await this.bulkDeleteFiles(largeFileIds);
      }

      return largeFileIds;
    } catch (error) {
      throw new Error(`Failed to cleanup large files: ${error}`);
    }
  }
}

export const indexedDBService = new DexieDBService();

// Initialize on app start
if (typeof window !== "undefined") {
  indexedDBService.init().catch(console.error);
}
