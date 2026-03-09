"use client";

import { create } from "zustand";
import { indexedDBService } from "@/lib/json-storage-service";

const LEGACY_SESSION_STORAGE_KEY = "json-visualiser-content";
const STALE_TABS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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
  jsonContent: string;
  setJsonContent: (content: string) => void;
  saveJson: (content: string) => void;
  clearJson: () => void;
  loadFromIndexedDB: () => Promise<void>;
  getValidation: () => TValidationResult;
  getStats: () => TJsonStats;
  hasContent: () => boolean;
};

const validationCache = new Map<string, TValidationResult>();
const statsCache = new Map<string, TJsonStats>();

export const useJsonStore = create<TJsonStore>((set, get) => ({
  jsonContent: "",

  setJsonContent: (content: string) => {
    set({ jsonContent: content });
    validationCache.clear();
    statsCache.clear();
  },

  saveJson: (content: string) => {
    set({ jsonContent: content });
    validationCache.clear();
    statsCache.clear();
    if (typeof window === "undefined") return;

    void (async () => {
      const tabId = await indexedDBService.getOrCreateTabId();
      await indexedDBService.saveTabState(tabId, content);
    })();
  },

  clearJson: () => {
    set({ jsonContent: "" });
    validationCache.clear();
    statsCache.clear();
    if (typeof window === "undefined") return;

    void (async () => {
      try {
        const tabId = await indexedDBService.getOrCreateTabId();
        await indexedDBService.deleteTabState(tabId);
      } catch (error) {
        console.error("Failed to clear persisted JSON state", error);
      }
    })();
  },

  loadFromIndexedDB: async () => {
    if (typeof window === "undefined") return;

    indexedDBService.registerLifecycleCleanup();
    const tabId = await indexedDBService.getOrCreateTabId();
    const cutoffMs = Date.now() - STALE_TABS_TTL_MS;
    void indexedDBService.cleanupStaleTabs(cutoffMs);
    void indexedDBService.cleanupClosedTabs();

    const persisted = await indexedDBService.getTabState(tabId);
    if (persisted) {
      set({ jsonContent: persisted.content });
      return;
    }

    // One-time migration from legacy sessionStorage persistence.
    const legacyContent = sessionStorage.getItem(LEGACY_SESSION_STORAGE_KEY);
    if (legacyContent !== null) {
      set({ jsonContent: legacyContent });
      await indexedDBService.saveTabState(tabId, legacyContent);
      sessionStorage.removeItem(LEGACY_SESSION_STORAGE_KEY);
    }
  },

  getValidation: (): TValidationResult => {
    const content = get().jsonContent;
    
    const cached = validationCache.get(content);
    if (cached) return cached;

    if (!content.trim()) {
      const result: TValidationResult = {
        isValid: true,
        error: "",
        parsedJson: null,
      };
      validationCache.set(content, result);
      return result;
    }

    try {
      const parsed = JSON.parse(content);
      const result: TValidationResult = {
        isValid: true,
        error: "",
        parsedJson: parsed,
      };
      validationCache.set(content, result);
      return result;
    } catch (err) {
      const result: TValidationResult = {
        isValid: false,
        error: err instanceof Error ? err.message : "Invalid JSON",
        parsedJson: null,
      };
      validationCache.set(content, result);
      return result;
    }
  },

  getStats: (): TJsonStats => {
    const content = get().jsonContent;
    
    const cached = statsCache.get(content);
    if (cached) return cached;

    const lines = content ? content.split("\n").length : 0;
    const characters = content.length;
    const size = new Blob([content]).size;
    
    const result: TJsonStats = {
      lines,
      characters,
      size,
    };
    statsCache.set(content, result);
    return result;
  },

  hasContent: () => {
    return get().jsonContent.trim().length > 0;
  },
}));
