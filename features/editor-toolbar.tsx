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
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled: boolean;
  className?: string;
}) => (
  <Button
    onClick={onClick}
    className={`relative h-auto p-0 has-[>svg]:p-0 ${className}`}
    disabled={disabled}
    size="sm"
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
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <ToolbarButton onClick={onFormat} disabled={!hasContent}>
        Format
      </ToolbarButton>
      <ToolbarButton
        onClick={onMinify}
        disabled={!isValid || !hasContent}
        className="hidden sm:inline-flex"
      >
        Minify
      </ToolbarButton>
      <ToolbarButton
        onClick={onUnescapeJson}
        disabled={!hasContent}
        className="hidden sm:inline-flex"
      >
        Unescape
      </ToolbarButton>
      <ToolbarButton onClick={onCopy} disabled={!hasContent}>
        Copy
      </ToolbarButton>
      <ToolbarButton
        onClick={onClear}
        disabled={!hasContent}
        className="hidden sm:inline-flex"
      >
        Clear
      </ToolbarButton>
      {onGenerateTypes && (
        <ToolbarButton
          onClick={onGenerateTypes}
          disabled={!isValid || !hasContent}
          className="hidden sm:inline-flex"
        >
          Generate Types
        </ToolbarButton>
      )}
    </div>
  );
}
