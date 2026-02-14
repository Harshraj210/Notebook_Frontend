"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

interface FolderCardProps {
    name: string;
    fileCount: number;
    onClick?: () => void;
    onRename?: (newName: string) => void;
}

const FolderCard = ({ name, fileCount, onClick, onRename }: FolderCardProps) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [tempName, setTempName] = React.useState(name);
    const inputRef = React.useRef<HTMLInputElement>(null);

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

    return (
        <motion.div
            layout
            onClick={(e) => {
                // If editing, don't trigger navigation
                if (isEditing) return;
                onClick?.();
            }}
            whileHover="hover"
            initial="initial"
            className="group flex flex-col gap-4 cursor-pointer relative"
        >
            {/* Options Button -> Trigger Rename */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-zinc-400 hover:text-white hover:bg-black/60 transition-all z-50 opacity-0 group-hover:opacity-100"
                title="Rename"
            >
                <MoreVertical size={14} />
            </button>

            {/* Folder Icon Container */}
            <div className="aspect-[4/3] relative flex items-center justify-center pt-8">
                {/* Back of the folder */}
                <div className="absolute inset-0 top-[25%] bg-[#0e7490] rounded-xl shadow-lg" />

                {/* Folder Tab */}
                <div className="absolute top-[10%] left-[8%] w-[35%] h-[20%] bg-[#0e7490] rounded-t-lg" />

                {/* The "Document" that pops out */}
                <motion.div
                    variants={{
                        initial: { y: 20, opacity: 0.8 },
                        hover: { y: -12, opacity: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute top-4 w-[85%] h-[80%] bg-[#f1f5f9] rounded-lg shadow-md flex flex-col p-4 gap-2 z-0"
                >
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full" />
                    <div className="w-[85%] h-1.5 bg-zinc-200 rounded-full" />
                    <div className="w-[60%] h-1.5 bg-zinc-200 rounded-full" />
                </motion.div>

                {/* Front of the folder (Trapezoid shape) */}
                <div
                    className="absolute inset-x-0 bottom-0 top-[35%] bg-[#22d3ee] rounded-xl shadow-2xl flex items-center justify-center z-10"
                    style={{
                        clipPath: 'polygon(0% 0%, 100% 0%, 96.5% 100%, 3.5% 100%)'
                    }}
                >
                    {/* Folder Line Detail */}
                    <div className="w-[40%] h-0.5 bg-cyan-800/20 rounded-full" />
                </div>
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
                    <h3 className="font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors text-center w-full truncate px-2">{name}</h3>
                )}
                <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
                    {fileCount} {fileCount === 1 ? 'FILE' : 'FILES'}
                </span>
            </div>
        </motion.div>
    );
};

export default FolderCard;
