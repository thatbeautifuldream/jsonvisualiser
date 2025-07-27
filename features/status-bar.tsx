"use client";

import { Check, X } from "lucide-react";
import { forwardRef } from "react";

type TStats = {
  lines: number;
  characters: number;
  size: number;
};

type TStatusBarProps = {
  isValid: boolean;
  error: string;
  stats: TStats;
  hasContent: boolean;
};

export const StatusBar = forwardRef<HTMLDivElement, TStatusBarProps>(
  ({ isValid, error, stats, hasContent }, ref) => {
    return (
      <div
        ref={ref}
        className="bg:white dark:bg-black text-foreground border-t border px-3 py-1 text-xs flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          {hasContent && (
            <span className="font-medium flex items-center gap-1">
              {isValid ? <Check size={12} /> : <X size={12} />}
              {isValid ? "Valid JSON" : "Invalid JSON"}
            </span>
          )}
          {!isValid && error && (
            <span className="truncate max-w-xs" title={error}>
              {error}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>Lines: {stats.lines}</span>
          <span>Characters: {stats.characters}</span>
          <span>Size: {stats.size} bytes</span>
        </div>
      </div>
    );
  }
);

StatusBar.displayName = "StatusBar";