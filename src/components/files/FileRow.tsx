"use client";

import React from 'react';
import { FileText, FileCode, File, MoreVertical, Trash2, Edit2, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileRowProps {
    filename: string;
    lastModified: string;
    isPinned?: boolean;
    onRename?: () => void;
    onDelete?: () => void;
    onPin?: () => void;
    onClick?: () => void;
}

const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'md':
        case 'txt':
            return <FileText size={18} className="text-blue-400" />;
        case 'js':
        case 'ts':
        case 'tsx':
        case 'jsx':
        case 'py':
            return <FileCode size={18} className="text-yellow-400" />;
        default:
            return <File size={18} className="text-zinc-400" />;
    }
};

const FileRow = ({ filename, lastModified, isPinned, onRename, onDelete, onPin, onClick }: FileRowProps) => {
    const [showActions, setShowActions] = React.useState(false);

    return (
        <div
            onClick={onClick}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-900/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-800/50"
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="shrink-0">
                    {getFileIcon(filename)}
                </div>
                <span className="truncate text-zinc-300 group-hover:text-white font-medium transition-colors">
                    {filename}
                </span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-zinc-500 font-mono">
                    {lastModified}
                </span>

                <div className="relative flex items-center h-5 w-5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowActions(!showActions);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded transition-all text-zinc-400 hover:text-white"
                    >
                        <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                        {showActions && (
                            <>
                                <div
                                    className="fixed inset-0 z-60"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowActions(false);
                                    }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full mt-2 w-32 bg-[#18181b] border border-zinc-800 rounded-lg shadow-xl z-70 py-1 overflow-hidden"
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRename?.();
                                            setShowActions(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                    >
                                        <Edit2 size={12} />
                                        Rename
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPin?.();
                                            setShowActions(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                    >
                                        <Pin size={12} className={isPinned ? 'text-cyan-400 rotate-45' : ''} />
                                        {isPinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete?.();
                                            setShowActions(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FileRow;
