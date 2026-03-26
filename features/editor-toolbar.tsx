"use client";

import { Button } from "@/components/ui/button";

type TEditorToolbarProps = {
  onFormat: () => void;
  onMinify: () => void;
  onUnescapeJson: () => void;
  onCopy: () => void;
  onClear: () => void;
  onGenerateTypes?: () => void;
  hasContent: boolean;
  isValid: boolean;
  className?: string;
  isVisible?: boolean;
};

const ToolbarButton = ({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled: boolean;
}) => (
  <Button
    onClick={onClick}
    className="text-xs"
    disabled={disabled}
    size="xs"
    variant="ghost"
    type="button"
  >
    {children}
  </Button>
);

export function EditorToolbar({
  onFormat,
  onMinify,
  onUnescapeJson,
  onCopy,
  onClear,
  onGenerateTypes,
  hasContent,
  isValid,
  className = "",
  isVisible = true,
}: TEditorToolbarProps) {
  if (!isVisible) return null;
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      <ToolbarButton onClick={onFormat} disabled={!hasContent}>
        Format
      </ToolbarButton>
      <ToolbarButton onClick={onMinify} disabled={!isValid || !hasContent}>
        Minify
      </ToolbarButton>
      <ToolbarButton onClick={onUnescapeJson} disabled={!hasContent}>
        Unescape
      </ToolbarButton>
      <ToolbarButton onClick={onCopy} disabled={!hasContent}>
        Copy
      </ToolbarButton>
      <ToolbarButton onClick={onClear} disabled={!hasContent}>
        Clear
      </ToolbarButton>
      {onGenerateTypes && (
        <ToolbarButton onClick={onGenerateTypes} disabled={!isValid || !hasContent}>
          Generate Types
        </ToolbarButton>
      )}
    </div>
  );
}
