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
				"flex items-center justify-between border-b flex-shrink-0 text-xs",
				"border-border",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				{leftActions && <div className="px-3 py-1">{leftActions}</div>}
				{tabs && tabs.length > 0 && (
					<div
						role="tablist"
						aria-label="Workspace Tabs"
						className="flex"
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
										"relative px-4 py-2 cursor-pointer select-none text-xs font-medium",
										"transition-all duration-150 ease-in-out",
										"min-w-0 flex items-center gap-2 h-8",
										"border border-transparent border-r-border/50",
										selected
											? cn(
													"bg-background text-foreground",
													"border-b-transparent",
													"before:content-[''] before:absolute before:top-0 before:left-0 before:right-0",
													"before:h-0.5 before:bg-primary",
												)
											: cn(
													"bg-muted/30 text-muted-foreground hover:bg-muted/60",
													"hover:text-foreground/80",
													"hover:after:content-[''] hover:after:absolute hover:after:inset-0",
													"hover:after:border hover:after:border-dashed hover:after:border-primary",
													"hover:after:pointer-events-none",
												),
									)}
									style={{ outline: selected ? undefined : "none" }}
									onClick={() => onTabChange?.(tab.id)}
									type="button"
								>
									<span className="truncate">{tab.label}</span>
									{/* Optionally, add a focus ring for accessibility */}
								</button>
							);
						})}
					</div>
				)}
			</div>
			<div className="flex items-center gap-2 px-3 py-1">
				<div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
					{actions}
				</div>
			</div>
		</div>
	);
}
