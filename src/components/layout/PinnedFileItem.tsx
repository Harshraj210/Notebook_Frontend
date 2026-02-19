"use client";

import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteFile, useFileStore } from '@/store/useFileStore';

interface PinnedFileItemProps {
    file: NoteFile;
}

const PinnedFileItem = ({ file }: PinnedFileItemProps) => {
    const { activeFileId, selectFile } = useFileStore();
    const isSelected = activeFileId === file.id;

    return (
        <div
            onClick={() => selectFile(file.id)}
            className={cn(
                "group flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors duration-200",
                isSelected ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                "rounded-md mx-2 mb-0.5"
            )}
        >
            <FileText size={16} className={cn("shrink-0", isSelected ? "text-cyan-400" : "text-zinc-500")} />
            <span className="truncate flex-1">{file.title}</span>
        </div>
    );
};

export default PinnedFileItem;
