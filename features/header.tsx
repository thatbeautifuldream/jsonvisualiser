"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

type TTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type THeaderProps = {
  actions?: React.ReactNode;
  className?: string;
  tabs?: TTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
};

export function Header({
  actions,
  className = "",
  tabs,
  activeTab,
  onTabChange,
}: THeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b flex-shrink-0 text-xs",
        "border-border",
        className
      )}
    >
      <div className="flex items-center">
        {tabs && tabs.length > 0 && (
          <div className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "relative px-4 py-2 cursor-pointer select-none text-xs font-medium",
                  "transition-all duration-150 ease-in-out",
                  "min-w-0 flex items-center gap-2 h-8",
                  "border border-transparent border-r-border/50",
                  // Active tab styling
                  activeTab === tab.id
                    ? cn(
                      "bg-background text-foreground",
                      "border-b-transparent",
                      "before:content-[''] before:absolute before:top-0 before:left-0 before:right-0",
                      "before:h-0.5 before:bg-primary"
                    )
                    : cn(
                      // Inactive tab styling
                      "bg-muted/30 text-muted-foreground hover:bg-muted/60",
                      "hover:text-foreground/80",
                      // Hover border effect for inactive tabs
                      "hover:after:content-[''] hover:after:absolute hover:after:inset-0",
                      "hover:after:border hover:after:border-dashed hover:after:border-primary",
                      "hover:after:pointer-events-none"
                    )
                )}
                onClick={() => onTabChange?.(tab.id)}
              >
                <span className="truncate">{tab.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-1">
        <div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          {actions}
          <div className="flex items-center gap-1">
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
