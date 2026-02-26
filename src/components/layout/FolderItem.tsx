"use client";

import React from 'react';
import { NotebookItem, useNotebookStore } from '@/store/useNotebookStore';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FolderItemProps {
    item: NotebookItem;
    level: number;
    isCollapsed?: boolean;
}

const FolderItem = React.memo(({ item, level, isCollapsed }: FolderItemProps) => {
    const { activeNoteId, setActiveNoteId, toggleFolder } = useNotebookStore();

    const isSelected = activeNoteId === item.id;
    const isFolder = item.type === 'folder';

    // 12px indentation rule: Level 1 = 12px, Level 2 = 24px, etc.
    // In collapsed mode, we ignore padding to center the icon.
    const paddingLeft = isCollapsed ? 0 : level * 12;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isFolder) {
            toggleFolder(item.id);
        } else {
            setActiveNoteId(item.id);
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={handleClick}
                style={{ paddingLeft: isCollapsed ? '0px' : `${paddingLeft}px` }}
                className={cn(
                    "group flex items-center transition-all duration-300 cursor-pointer",
                    isCollapsed ? "justify-center h-10 px-0" : "gap-2 px-3 py-1.5 text-sm",
                    isSelected ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                    "rounded-md mx-2 mb-0.5"
                )}
            >
                {!isCollapsed && (
                    <div className="flex items-center justify-center w-4 h-4 shrink-0">
                        {isFolder && (
                            item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        )}
                    </div>
                )}

                {isFolder ? (
                    <Folder size={16} className={cn("shrink-0", item.isOpen && !isCollapsed ? "text-blue-400" : "text-zinc-500")} />
                ) : (
                    <FileText size={16} className={cn("shrink-0", isSelected ? "text-cyan-400" : "text-zinc-500")} />
                )}

                {!isCollapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                )}
            </div>

            {isFolder && item.isOpen && item.children && !isCollapsed && (
                <div className="flex flex-col">
                    {item.children.map((child) => (
                        <FolderItem key={child.id} item={child} level={level + 1} isCollapsed={isCollapsed} />
                    ))}
                </div>
            )}
        </div>
    );
});

FolderItem.displayName = 'FolderItem';

export default FolderItem;
