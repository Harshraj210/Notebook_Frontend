"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2 } from 'lucide-react';

interface FolderCardProps {
    name: string;
    fileCount: number;
    onClick?: () => void;
    onRename?: (newName: string) => void;
    onDelete?: () => void;
    onDeleteRequest?: () => void;
    isDeleting?: boolean;
}

const FolderCard = ({ name, fileCount, onClick, onRename, onDelete, onDeleteRequest, isDeleting: isDeletingProp }: FolderCardProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [isDeletingLocal, setIsDeletingLocal] = React.useState(false);
    const [tempName, setTempName] = React.useState(name);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Sync prop state to local for animation
    React.useEffect(() => {
        if (isDeletingProp) {
            setIsDeletingLocal(true);
            const timer = setTimeout(() => {
                onDelete?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isDeletingProp, onDelete]);

    React.useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleRenameSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (tempName.trim()) {
            onRename?.(tempName.trim());
        } else {
            setTempName(name); // Revert if empty
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRenameSubmit();
        if (e.key === 'Escape') {
            setTempName(name);
            setIsEditing(false);
        }
        e.stopPropagation(); // Prevent triggering parent click
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeleteRequest?.();
    };

    const isAnimatingDelete = isDeletingLocal || isDeletingProp;

    return (
        <motion.div
            layout
            onClick={(e) => {
                // If editing or deleting, don't trigger navigation
                if (isEditing || isAnimatingDelete) return;
                onClick?.();
            }}
            variants={{
                initial: { scale: 1 },
                hover: { scale: 1 }
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            whileHover="hover"
            initial="initial"
            className={`group flex flex-col gap-4 cursor-pointer relative ${isAnimatingDelete ? 'blur-sm opacity-0 scale-95 pointer-events-none' : ''}`}
            style={{ perspective: 600 }}
        >
            {/* Folder Icon Container */}
            <div className="aspect-[6/5] relative flex items-center justify-center pt-8 overflow-hidden">
                {/* Back of the folder */}
                <div className="absolute inset-0 top-[20%] bg-[#08617a] rounded-xl shadow-lg" />

                {/* Folder Tab */}
                <div className="absolute top-[8%] left-[5%] w-[35%] h-[18%] bg-[#08617a] rounded-t-lg" />

                {/* The "Document" that stays tucked in */}
                <motion.div
                    variants={{
                        initial: { y: 20, opacity: 0.9 },
                        hover: { y: 4, opacity: 1 }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute top-8 w-[85%] h-[80%] bg-white rounded-lg shadow-md flex flex-col p-4 gap-2 z-0"
                />

                {/* Front of the folder */}
                <motion.div
                    variants={{
                        initial: {
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            transformOrigin: "bottom"
                        },
                        hover: {
                            y: 4,
                            scale: 1.02,
                            rotateX: -18,
                            transformOrigin: "bottom"
                        }
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute inset-x-0 bottom-0 top-[28%] bg-[#22d3ee] rounded-xl shadow-2xl flex items-center justify-center z-10 overflow-hidden"
                >
                    {/* Action Buttons Pill */}
                    <div className="absolute top-2 right-2 flex items-center z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/45 backdrop-blur-sm rounded-full border border-white/10 overflow-hidden px-0.5 py-0.5 shadow-lg">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="p-1.5 flex items-center justify-center text-white hover:text-white/80 transition-colors duration-150"
                            title="Rename"
                        >
                            <Edit2 size={12} strokeWidth={2} />
                        </button>
                        <div className="w-px h-3 bg-white/10" />
                        <button
                            onClick={handleDeleteClick}
                            className="p-1.5 flex items-center justify-center text-white hover:text-[#ff4444] transition-colors duration-150"
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>

                    {/* Folder Line Detail */}
                    <div className="w-[45%] h-px bg-cyan-900/30 rounded-full" />
                </motion.div>
            </div>

            {/* Folder Meta */}
            <div className="flex flex-col items-center gap-0.5 px-1 relative z-30">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => handleRenameSubmit()}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-zinc-900/90 border border-cyan-500/50 rounded px-1 py-0.5 text-center text-sm font-bold text-white outline-none w-full min-w-[100px]"
                    />
                ) : (
                    <h3 className="font-bold text-white text-center w-full truncate px-2">{name}</h3>
                )}
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                    {fileCount} {fileCount === 1 ? 'FILE' : 'FILES'}
                </span>
            </div>
        </motion.div>
    );
};

export default FolderCard;
