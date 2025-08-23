import type { JsonFile } from "@/stores/json-document-store";

// Event emitter for JSON file events
type EventCallback = (...args: unknown[]) => void;

class JsonEventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(...args));
  }
}

export const jsonEventEmitter = new JsonEventEmitter();

const DB_NAME = "JSON_VISUALISER_DOCUMENT";
const DB_VERSION = 1;
const JSON_FILES_STORE = "JSON_FILES";

export type TStoredJsonFile = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  size: number;
};

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create JSON files store
        if (!db.objectStoreNames.contains(JSON_FILES_STORE)) {
          const jsonFilesStore = db.createObjectStore(JSON_FILES_STORE, {
            keyPath: "id",
          });
          jsonFilesStore.createIndex("name", "name", { unique: false });
          jsonFilesStore.createIndex("createdAt", "createdAt", {
            unique: false,
          });
          jsonFilesStore.createIndex("updatedAt", "updatedAt", {
            unique: false,
          });
          jsonFilesStore.createIndex("size", "size", { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error("Failed to initialize database");
    }
  }

  async saveFile(file: JsonFile): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readwrite");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const storedFile: TStoredJsonFile = {
        id: file.id,
        name: file.name,
        content: file.content,
        createdAt: file.createdAt.getTime(),
        updatedAt: file.updatedAt.getTime(),
        size: file.size,
      };

      const request = store.put(storedFile);
      request.onsuccess = () => {
        jsonEventEmitter.emit("file-saved", file.id);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getFile(fileId: string): Promise<JsonFile | null> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readonly");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const request = store.get(fileId);
      request.onsuccess = () => {
        const stored = request.result as TStoredJsonFile | undefined;
        if (stored) {
          const file: JsonFile = {
            id: stored.id,
            name: stored.name,
            content: stored.content,
            createdAt: new Date(stored.createdAt),
            updatedAt: new Date(stored.updatedAt),
            size: stored.size,
          };
          resolve(file);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFiles(): Promise<JsonFile[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readonly");
      const store = transaction.objectStore(JSON_FILES_STORE);
      const index = store.index("updatedAt");

      const request = index.getAll();
      request.onsuccess = () => {
        const storedFiles = request.result as TStoredJsonFile[];
        const files = storedFiles
          .map((stored) => ({
            id: stored.id,
            name: stored.name,
            content: stored.content,
            createdAt: new Date(stored.createdAt),
            updatedAt: new Date(stored.updatedAt),
            size: stored.size,
          }))
          // Sort by updatedAt descending (most recent first)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        resolve(files);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readwrite");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const request = store.delete(fileId);
      request.onsuccess = () => {
        jsonEventEmitter.emit("file-deleted", fileId);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateFileName(fileId: string, newName: string): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readwrite");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const getRequest = store.get(fileId);
      getRequest.onsuccess = () => {
        const storedFile = getRequest.result as TStoredJsonFile;
        if (storedFile) {
          storedFile.name = newName;
          storedFile.updatedAt = Date.now();

          const putRequest = store.put(storedFile);
          putRequest.onsuccess = () => {
            jsonEventEmitter.emit("file-updated", fileId);
            resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error("File not found"));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async updateFileContent(fileId: string, content: string): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readwrite");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const getRequest = store.get(fileId);
      getRequest.onsuccess = () => {
        const storedFile = getRequest.result as TStoredJsonFile;
        if (storedFile) {
          storedFile.content = content;
          storedFile.updatedAt = Date.now();
          storedFile.size = new Blob([content]).size;

          const putRequest = store.put(storedFile);
          putRequest.onsuccess = () => {
            jsonEventEmitter.emit("file-updated", fileId);
            resolve();
          };
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error("File not found"));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async bulkDeleteFiles(fileIds: string[]): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readwrite");
      const store = transaction.objectStore(JSON_FILES_STORE);

      let deletedCount = 0;
      const errors: unknown[] = [];

      fileIds.forEach((fileId) => {
        const request = store.delete(fileId);
        request.onsuccess = () => {
          deletedCount++;
          if (deletedCount === fileIds.length) {
            if (errors.length === 0) {
              jsonEventEmitter.emit("files-bulk-deleted", fileIds);
              resolve();
            } else {
              reject(new Error(`Failed to delete ${errors.length} files`));
            }
          }
        };
        request.onerror = () => {
          errors.push(request.error);
          deletedCount++;
          if (deletedCount === fileIds.length) {
            reject(new Error(`Failed to delete ${errors.length} files`));
          }
        };
      });
    });
  }

  async searchFiles(query: string): Promise<JsonFile[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readonly");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const request = store.getAll();
      request.onsuccess = () => {
        const storedFiles = request.result as TStoredJsonFile[];
        const searchTerm = query.toLowerCase();

        const matchingFiles = storedFiles
          .filter(
            (stored) =>
              stored.name.toLowerCase().includes(searchTerm) ||
              stored.content.toLowerCase().includes(searchTerm)
          )
          .map((stored) => ({
            id: stored.id,
            name: stored.name,
            content: stored.content,
            createdAt: new Date(stored.createdAt),
            updatedAt: new Date(stored.updatedAt),
            size: stored.size,
          }))
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

        resolve(matchingFiles);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getFileStats(): Promise<{ totalFiles: number; totalSize: number }> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readonly");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const request = store.getAll();
      request.onsuccess = () => {
        const storedFiles = request.result as TStoredJsonFile[];
        const totalFiles = storedFiles.length;
        const totalSize = storedFiles.reduce((sum, file) => sum + file.size, 0);

        resolve({ totalFiles, totalSize });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async cleanupLargeFiles(
    maxSizeBytes: number = 10 * 1024 * 1024
  ): Promise<string[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not initialized"));
        return;
      }
      const transaction = this.db.transaction([JSON_FILES_STORE], "readonly");
      const store = transaction.objectStore(JSON_FILES_STORE);

      const request = store.getAll();
      request.onsuccess = () => {
        const storedFiles = request.result as TStoredJsonFile[];
        const largeFiles = storedFiles
          .filter((file) => file.size > maxSizeBytes)
          .map((file) => file.id);

        if (largeFiles.length > 0) {
          this.bulkDeleteFiles(largeFiles)
            .then(() => {
              resolve(largeFiles);
            })
            .catch(reject);
        } else {
          resolve([]);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();

// Initialize on app start
if (typeof window !== "undefined") {
  indexedDBService.init().catch(console.error);
}
