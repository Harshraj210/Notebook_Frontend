"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FileText, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteFile } from '@/store/useFileStore';
import { motion } from 'framer-motion';

interface FileCardProps {
    file: NoteFile;
    onClick: () => void;
    onRename: (newName: string) => void;
    onDelete?: () => void;           // Immediate delete (legacy/unused now)
    onDeleteRequest?: () => void;    // Request confirmation
    onPin?: () => void;
}

const FileCard = ({ file, onClick, onRename, onDelete, onDeleteRequest, onPin }: FileCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempTitle, setTempTitle] = useState(file.title);
    const [showMenu, setShowMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null); // For clicking outside

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRenameSubmit = () => {
        if (tempTitle.trim()) {
            onRename(tempTitle.trim());
        } else {
            setTempTitle(file.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRenameSubmit();
        if (e.key === 'Escape') {
            setTempTitle(file.title);
            setIsEditing(false);
        }
        e.stopPropagation();
    };

    return (
        <div
            onClick={!isEditing ? onClick : undefined}
            className="group flex flex-col gap-3 cursor-pointer relative"
        >
             {/* 3-Dot Menu */}
             <div className="absolute top-2 right-2 z-50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1.5 rounded-full bg-black/40 text-zinc-400 hover:text-white hover:bg-black/60 transition-all"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-[#18181b] border border-zinc-800 rounded-lg shadow-xl py-1 flex flex-col z-[60] animate-in fade-in zoom-in-95 duration-100">
                             <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                    setShowMenu(false);
                                }}
                                className="px-3 py-2 text-left text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                            >
                                <Edit2 size={12} /> Rename
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPin?.();
                                    setShowMenu(false);
                                }}
                                className="px-3 py-2 text-left text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                            >
                                {/* Use rotate-45 if pinned? Or just text change? User said "Unpin" */}
                                <div className={cn("transition-transform", file.pinned && "rotate-45 text-cyan-500")}>
                                     {/* Just use plain icon or maybe logic for icon? */}
                                     {/* Icon: Pin. If pinned, maybe fill or color? */}
                                     {/* User requirement: "Pin / Unpin". */}
                                     {/* Let's keeps icon generic or conditional */}
                                     {/* Actually, user said "Menu shows Unpin". */}
                                     <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 24 24" 
                                        fill={file.pinned ? "currentColor" : "none"} 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className={cn("lucide lucide-pin", file.pinned && "text-cyan-500")}
                                     >
                                        <line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
                                     </svg>
                                </div>
                                {file.pinned ? "Unpin" : "Pin"}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteRequest?.();
                                    setShowMenu(false);
                                }}
                                className="px-3 py-2 text-left text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail */}
            <div className="aspect-[3/4] bg-zinc-900/50 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-all flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-transparent to-transparent opacity-50" />
                <FileText size={48} className="text-zinc-700 group-hover:text-zinc-600 transition-colors opacity-50" />
                
                {/* Pinned Indicator on Card? User didn't ask explicitly but it's good UX. 
                    "Pin moves file to sidebar pinned" - verify if indicator needed. 
                    User didn't ask for indicator on card, just sidebar sync. I'll omit to stick to strict constraints "no redesign" unless implied. 
                    Actually, "no redesign file cards" suggests keep it simple. */}

                {/* Content Preview */}
                {file.content ? (
                    <div className="absolute inset-4 text-[6px] text-zinc-600 overflow-hidden leading-relaxed opacity-30 select-none pointer-events-none">
                        {file.content.slice(0, 500)}
                    </div>
                ) : (
                    <span className="absolute bottom-1/2 translate-y-8 text-[10px] text-zinc-600 italic">No content</span>
                )}
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-1 px-1">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-zinc-900 border border-cyan-500/50 rounded px-2 py-0.5 text-sm font-bold text-white outline-none w-full"
                    />
                ) : (
                    <h3 className="font-bold text-zinc-200 truncate group-hover:text-cyan-400 transition-colors">{file.title}</h3>
                )}
                <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">
                    {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
        </div>
    );
};

export default FileCard;
