"use client";

import { create } from "zustand";

const STORAGE_KEY = "json-visualiser-content";

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
  loadFromSessionStorage: () => void;
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
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, content);
    }
  },

  clearJson: () => {
    set({ jsonContent: "" });
    validationCache.clear();
    statsCache.clear();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  },

  loadFromSessionStorage: () => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        set({ jsonContent: saved });
      }
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
