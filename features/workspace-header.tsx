"use client";

import { cn } from "@/lib/utils";

type TWorkspaceTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TWorkspaceHeaderProps = {
  actions?: React.ReactNode;
  leftActions?: React.ReactNode;
  className?: string;
  tabs?: TWorkspaceTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
};

export function WorkspaceHeader({
  actions,
  leftActions,
  className = "",
  tabs,
  activeTab,
  onTabChange,
}: TWorkspaceHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b shrink-0",
        "border-border",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        {leftActions && <div className="px-3 py-2 min-w-0">{leftActions}</div>}
        {tabs && tabs.length > 0 && (
          <div
            role="tablist"
            aria-label="Workspace Tabs"
            className="flex overflow-x-auto whitespace-nowrap"
            onKeyDown={(e) => {
              if (!tabs || tabs.length === 0) return;
              const currentIdx = tabs.findIndex((tab) => tab.id === activeTab);
              let nextIdx = currentIdx;
              switch (e.key) {
                case "ArrowRight":
                  nextIdx = (currentIdx + 1) % tabs.length;
                  break;
                case "ArrowLeft":
                  nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
                  break;
                case "Home":
                  nextIdx = 0;
                  break;
                case "End":
                  nextIdx = tabs.length - 1;
                  break;
                case "Enter":
                case " ":
                  if (currentIdx !== -1) {
                    e.preventDefault();
                    onTabChange?.(tabs[currentIdx].id);
                  }
                  return;
                default:
                  return;
              }
              e.preventDefault();
              const nextTabId = tabs[nextIdx].id;
              const nextTab = document.getElementById(
                `workspace-tab-${nextTabId}`,
              );
              nextTab?.focus();
            }}
          >
            {tabs.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`workspace-tab-${tab.id}`}
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  aria-controls={
                    tab.content ? `workspace-tabpanel-${tab.id}` : undefined
                  }
                  className={cn(
                    "relative px-4 py-2 cursor-pointer select-none",
                    "shrink-0 flex items-center gap-2 h-10 border-b-2",
                    selected
                      ? "text-foreground border-b-foreground"
                      : "text-faint border-b-transparent hover:text-foreground",
                  )}
                  onClick={() => onTabChange?.(tab.id)}
                  type="button"
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <div className="flex items-center gap-4">{actions}</div>
      </div>
    </div>
  );
}
