"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useJsonStore, type JsonFile } from "@/stores/store";
import { Menu, MoreVertical, Edit2, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface JsonSidebarProps {
    onFileSelect?: (file: JsonFile) => void;
    onNewFile?: () => void;
}

export function JsonSidebar({ onFileSelect, onNewFile }: JsonSidebarProps) {
    const { jsonFiles, currentFile, createNewFile, loadJsonFile, deleteJsonFile, renameJsonFile } = useJsonStore();
    const [isOpen, setIsOpen] = useState(false);
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    const handleFileSelect = (file: JsonFile) => {
        loadJsonFile(file.id);
        onFileSelect?.(file);
        setIsOpen(false);
    };

    const handleNewFile = () => {
        createNewFile();
        onNewFile?.();
        setIsOpen(false);
    };

    const handleDeleteFile = (file: JsonFile) => {
        deleteJsonFile(file.id);
    };

    const handleEditFile = (file: JsonFile) => {
        setEditingFileId(file.id);
        setEditingName(file.name);
    };

    const handleSaveEdit = (fileId: string) => {
        if (editingName.trim()) {
            renameJsonFile(fileId, editingName.trim());
        }
        setEditingFileId(null);
        setEditingName("");
    };

    const handleCancelEdit = () => {
        setEditingFileId(null);
        setEditingName("");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent">
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
                        <div className="overflow-y-auto h-full">
                            {jsonFiles
                                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                .map((file) => (
                                    <div
                                        key={file.id}
                                        className={cn(
                                            "group relative flex items-center p-3 cursor-pointer transition-all duration-150",
                                            "border-b border-border/30 hover:bg-accent/40",
                                            currentFile?.id === file.id && "bg-accent border-l-2 border-l-primary"
                                        )}
                                        onClick={() => handleFileSelect(file)}
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
                                                    <div className={cn(
                                                        "font-medium text-sm truncate mb-1",
                                                        currentFile?.id === file.id && "text-foreground"
                                                    )}>
                                                        {file.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="font-mono">{formatFileSize(file.size)}</span>
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
            </SheetContent>
        </Sheet>
    );
} 