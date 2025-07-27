"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

type TTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type THeaderProps = {
  title?: string;
  actions?: React.ReactNode;
  className?: string;
  tabs?: TTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
};

export function Header({
  title,
  actions,
  className = "",
  tabs,
  activeTab,
  onTabChange,
}: THeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-1 border-b flex-shrink-0 text-xs ${className}`}
    >
      <div className="flex items-center gap-4">
        {title && <h1 className="text-xs font-medium">{title}</h1>}
        {tabs && tabs.length > 0 && (
          <div className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`
                  relative px-3 py-1 cursor-pointer select-none text-xs font-medium
                  transition-all duration-150 ease-in-out
                  min-w-0 flex items-center gap-2 h-6
                  ${activeTab === tab.id
                    ? "bg-white dark:bg-[#1e1e1e] text-black dark:text-white border-b-2 border-b-[#0078d4] dark:border-b-[#0078d4]"
                    : "bg-[#f3f3f3] dark:bg-[#2d2d30] text-[#424242] dark:text-[#cccccc] hover:bg-[#e8e8e8] dark:hover:bg-[#37373d]"
                  }
                  hover:after:content-[''] hover:after:absolute hover:after:inset-0 
                  hover:after:border hover:after:border-dashed hover:after:border-[#0078d4] 
                  dark:hover:after:border-[#007acc] hover:after:pointer-events-none
                  ${activeTab === tab.id ? "hover:after:hidden" : ""}
                `}
                onClick={() => onTabChange?.(tab.id)}
              >
                <span className="truncate">{tab.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
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
