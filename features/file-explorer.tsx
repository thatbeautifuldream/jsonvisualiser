/** biome-ignore-all lint/a11y/useSemanticElements: its ok */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useJsonStore, type TJsonFile } from "@/stores/json-document-store";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Menu, MoreVertical, Edit2, Trash2, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface FileExplorerProps {
	onFileSelect?: (file: TJsonFile) => void;
	onNewFile?: () => void;
}

export function FileExplorer({ onFileSelect, onNewFile }: FileExplorerProps) {
	const { jsonFiles, activeFileId, loadFile, deleteFile, renameFile } =
		useJsonStore();
	const [isOpen, setIsOpen] = useState(false);
	const [editingFileId, setEditingFileId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");

	const handleFileSelect = async (file: TJsonFile) => {
		await loadFile(file.id);
		onFileSelect?.(file);
		setIsOpen(false);
	};

	const handleNewFile = async () => {
		onNewFile?.();
		setIsOpen(false);
	};

	const handleDeleteFile = async (file: TJsonFile) => {
		await deleteFile(file.id);
		toast.success(`File "${file.name}" deleted.`);
	};

	const handleEditFile = (file: TJsonFile) => {
		setEditingFileId(file.id);
		setEditingName(file.name);
	};

	const handleSaveEdit = async (fileId: string) => {
		if (editingName.trim()) {
			await renameFile(fileId, editingName.trim());
		}
		setEditingFileId(null);
		setEditingName("");
	};

	const handleCancelEdit = () => {
		setEditingFileId(null);
		setEditingName("");
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		if (bytes < 1024 * 1024 * 1024)
			return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
	};

	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(date));
	};

	const sortedJsonFiles = useMemo(
		() =>
			[...jsonFiles].sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
			),
		[jsonFiles],
	);

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 w-8 p-0 hover:bg-accent"
				>
					<Menu className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-64 p-0 flex flex-col bg-background [&>button]:hidden"
			>
				{/* Header */}
				<div className="p-3 border-b bg-muted/20">
					<Button
						onClick={handleNewFile}
						size="sm"
						variant="outline"
						className="w-full h-8 text-sm"
					>
						New
					</Button>
				</div>

				{/* File List */}
				<div className="flex-1 overflow-hidden">
					{jsonFiles.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
							<p className="text-sm mb-1">No files</p>
							<p className="text-xs opacity-60">Create a new file to start</p>
						</div>
					) : (
						<div className="overflow-y-auto h-full scrollbar-hide">
							{sortedJsonFiles.map((file) => (
								<div
									role="button"
									tabIndex={0}
									key={file.id}
									className={cn(
										"group relative flex items-center p-3 cursor-pointer transition-all duration-150 w-full text-left",
										"border-b border-border/30 hover:bg-accent/40",
										activeFileId === file.id &&
											"bg-accent border-l-2 border-l-primary",
									)}
									onClick={() => handleFileSelect(file)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleFileSelect(file);
										}
									}}
								>
									<div className="flex-1 min-w-0 pr-2">
										{editingFileId === file.id ? (
											<div className="space-y-2">
												<Input
													value={editingName}
													onChange={(e) => setEditingName(e.target.value)}
													className="h-7 text-sm"
													onKeyDown={(e) => {
														if (e.key === "Enter") handleSaveEdit(file.id);
														if (e.key === "Escape") handleCancelEdit();
													}}
													onClick={(e) => e.stopPropagation()}
													autoFocus
												/>
												<div className="flex gap-1">
													<Button
														size="sm"
														onClick={(e) => {
															e.stopPropagation();
															handleSaveEdit(file.id);
														}}
														className="h-6 px-2 text-xs"
													>
														<Check className="h-3 w-3" />
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={(e) => {
															e.stopPropagation();
															handleCancelEdit();
														}}
														className="h-6 px-2 text-xs"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
										) : (
											<>
												<div
													className={cn(
														"font-medium text-sm truncate mb-1",
														activeFileId === file.id && "text-foreground",
													)}
												>
													{file.name}
												</div>
												<div className="flex items-center gap-2 text-xs text-muted-foreground">
													<Badge
														variant={
															activeFileId === file.id ? "default" : "outline"
														}
														className="font-mono"
													>
														{formatFileSize(file.size)}
													</Badge>
													<span>{formatDate(file.updatedAt)}</span>
												</div>
											</>
										)}
									</div>

									{editingFileId !== file.id && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={(e) => e.stopPropagation()}
												>
													<MoreVertical className="h-3 w-3" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleEditFile(file);
													}}
												>
													<Edit2 className="mr-2 h-3 w-3" />
													Rename
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteFile(file);
													}}
													className="text-destructive focus:text-destructive"
												>
													<Trash2 className="mr-2 h-3 w-3" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Theme Switcher at the bottom */}
				<div className="p-3 border-t bg-muted/20">
					<div className="flex items-center justify-end">
						<ThemeSwitcher />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
