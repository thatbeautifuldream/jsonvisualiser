"use client";

import { Button } from "@/components/ui/button";

interface EditorToolbarProps {
	onFormat: () => void;
	onMinify: () => void;
	onCopy: () => void;
	onClear: () => void;
	hasContent: boolean;
	isValid: boolean;
	className?: string;
	isVisible?: boolean;
}

export function EditorToolbar({
	onFormat,
	onMinify,
	onCopy,
	onClear,
	hasContent,
	isValid,
	className = "",
	isVisible = true,
}: EditorToolbarProps) {
	if (!isVisible) return null;
	return (
		<div className={`flex flex-wrap items-center gap-1 ${className}`}>
			<Button
				onClick={onFormat}
				className="text-xs"
				disabled={!hasContent}
				size="xs"
				variant="ghost"
			>
				Format
			</Button>
			<Button
				onClick={onMinify}
				className="text-xs"
				disabled={!isValid || !hasContent}
				size="xs"
				variant="ghost"
			>
				Minify
			</Button>
			<Button
				onClick={onCopy}
				className="text-xs"
				disabled={!hasContent}
				size="xs"
				variant="ghost"
			>
				Copy
			</Button>
			<Button
				onClick={onClear}
				className="text-xs"
				disabled={!hasContent}
				size="xs"
				variant="ghost"
			>
				Clear
			</Button>
		</div>
	);
}
