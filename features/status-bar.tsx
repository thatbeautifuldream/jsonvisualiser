"use client";

import { Check, X } from "lucide-react";
import { forwardRef } from "react";
import NumberFlow from "@number-flow/react";
import type { TJsonStats } from "@/stores/json-document-store";

const formatSize = (bytes: number): { number: number; unit: string } => {
	if (bytes === 0) return { number: 0, unit: "B" };
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return {
		number: parseFloat((bytes / k ** i).toFixed(1)),
		unit: sizes[i],
	};
};

type TStatusBarProps = {
	isValid: boolean;
	error: string;
	stats: TJsonStats;
	hasContent: boolean;
};

export const StatusBar = forwardRef<HTMLDivElement, TStatusBarProps>(
	({ isValid, error, stats, hasContent }, ref) => {
		return (
			<div
				ref={ref}
				className="bg-white dark:bg-black text-foreground border-t border px-3 py-1 text-xs flex items-center justify-between"
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
				<div className="flex items-center gap-1">
					<span
						className="px-1 hover:bg-muted transition-colors cursor-default"
						title="Lines"
					>
						Lines: <NumberFlow value={stats.lines} />
					</span>
					<span
						className="px-1 hover:bg-muted transition-colors cursor-default"
						title="Characters"
					>
						Characters: <NumberFlow value={stats.characters} />
					</span>
					<span
						className="px-1 hover:bg-muted transition-colors cursor-default"
						title="Size"
					>
						Size: <NumberFlow value={formatSize(stats.size).number} />{" "}
						{formatSize(stats.size).unit}
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
	},
);

StatusBar.displayName = "StatusBar";
