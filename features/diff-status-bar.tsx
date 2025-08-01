"use client";

import { Check, X, GitCompare } from "lucide-react";
import { forwardRef } from "react";
import NumberFlow from '@number-flow/react'

const formatSize = (bytes: number): { number: number; unit: string } => {
    if (bytes === 0) return { number: 0, unit: "B" };
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return {
        number: parseFloat((bytes / Math.pow(k, i)).toFixed(1)),
        unit: sizes[i]
    };
};

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

type TDiffStatusBarProps = {
    originalValid: boolean;
    modifiedValid: boolean;
    originalError: string;
    modifiedError: string;
    stats: TDiffStats;
    hasContent: boolean;
};

export const DiffStatusBar = forwardRef<HTMLDivElement, TDiffStatusBarProps>(
    ({ originalValid, modifiedValid, originalError, modifiedError, stats, hasContent }, ref) => {
        const hasErrors = !originalValid || !modifiedValid;
        const errorMessage = !originalValid ? originalError : !modifiedValid ? modifiedError : "";

        return (
            <div
                ref={ref}
                className="bg:white dark:bg-black text-foreground border-t border px-3 py-1 text-xs flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    {hasContent && (
                        <div className="flex items-center gap-3">
                            <span className="font-medium flex items-center gap-1">
                                <GitCompare size={12} />
                                Diff Editor
                            </span>
                            <span className="font-medium flex items-center gap-1">
                                {originalValid ? <Check size={12} className="text-green-500" /> : <X size={12} className="text-red-500" />}
                                Original: {originalValid ? "Valid" : "Invalid"}
                            </span>
                            <span className="font-medium flex items-center gap-1">
                                {modifiedValid ? <Check size={12} className="text-green-500" /> : <X size={12} className="text-red-500" />}
                                Modified: {modifiedValid ? "Valid" : "Invalid"}
                            </span>
                        </div>
                    )}
                    {hasErrors && errorMessage && (
                        <span className="truncate max-w-xs" title={errorMessage}>
                            {errorMessage}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <span
                        className="px-1 hover:bg-muted transition-colors cursor-default"
                        title="Original Lines"
                    >
                        Original: <NumberFlow value={stats.original.lines} />
                    </span>
                    <span
                        className="px-1 hover:bg-muted transition-colors cursor-default"
                        title="Modified Lines"
                    >
                        Modified: <NumberFlow value={stats.modified.lines} />
                    </span>
                    <span
                        className="px-1 hover:bg-muted transition-colors cursor-default"
                        title="Total Changes"
                    >
                        Changes: <NumberFlow value={stats.changes.additions + stats.changes.deletions + stats.changes.modifications} />
                    </span>
                    <span
                        className="px-1 hover:bg-muted transition-colors cursor-default text-muted-foreground"
                        title="Creator"
                    >
                        Made by{" "}
                        <a
                            href="https://milindmishra.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline transition-colors"
                        >
                            Milind
                        </a>
                    </span>
                </div>
            </div>
        );
    }
);

DiffStatusBar.displayName = "DiffStatusBar"; 