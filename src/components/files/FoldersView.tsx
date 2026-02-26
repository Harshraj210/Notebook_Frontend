"use client";

import React from 'react';

import { useFolderStore } from '@/store/useFolderStore';
import { Grip, Calendar, MoreVertical, FolderPlus, ArrowLeft, Plus } from 'lucide-react';
import FolderCard from './FolderCard';
import FileRow from './FileRow';
import { motion } from 'framer-motion';

const FoldersView = () => {
    // Desktop: use store. Mobile: use store.
    const { folders, activeFolderId, createFolder, openFolder, closeFolder, renameFolder, deleteFolder, addFileToFolder } = useFolderStore();

    const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

    const handleAddFile = () => {
        if (!activeFolderId) return;
        const newFile = {
            id: crypto.randomUUID(),
            title: "Untitled.md",
            content: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        addFileToFolder(activeFolderId, newFile);
    };

    // Derived state
    const activeFolder = folders.find(f => f.id === activeFolderId);

    // If a folder is open, show the detail view
    if (activeFolderId && activeFolder) {
        return (
            <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-100 p-4 md:p-8 relative gap-8 overflow-y-auto custom-scrollbar">
                {/* Header with Back Button */}
                <header className="flex items-center gap-4 shrink-0">
                    <button
                        onClick={closeFolder}
                        className="p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold tracking-tight">{activeFolder.name}</h1>
                        <span className="text-xs text-zinc-500 font-medium tracking-wide uppercase">
                            {activeFolder.files.length} {activeFolder.files.length === 1 ? 'File' : 'Files'}
                        </span>
                    </div>
                </header>

                {/* File List for this Folder */}
                <div className="grid grid-cols-1 gap-1 pb-20">
                    {activeFolder.files.length > 0 ? (
                        activeFolder.files.map(file => (
                            <FileRow
                                key={file.id}
                                filename={file.title}
                                lastModified={new Date(file.updatedAt).toLocaleDateString()}
                                onRename={() => {
                                    const newName = prompt("Enter new filename", file.title);
                                    if (newName) renameFolder(activeFolder.id, newName); // Using folder rename logic as placeholder or if it handles files
                                }}
                                onDelete={() => {
                                    // Placeholder for file delete logic
                                    console.log("Delete file", file.id);
                                }}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-600 gap-4 border-2 border-dashed border-zinc-800/50 rounded-2xl">
                            <FolderPlus size={48} strokeWidth={1} className="opacity-50" />
                            <p className="text-sm">Empty folder</p>
                            <button
                                onClick={handleAddFile}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors"
                            >
                                Create File
                            </button>
                        </div>
                    )}
                </div>

                {/* FAB inside Folder View */}
                <motion.button
                    onClick={handleAddFile}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        y: [0, -5, 0],
                    }}
                    transition={{
                        y: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="absolute bottom-8 right-8 w-16 h-16 bg-[#22d3ee]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/10 border border-cyan-400/20 z-50 group hover:shadow-cyan-500/20 transition-shadow"
                    title="Add File"
                >
                    <Plus size={28} className="text-[#0c0c0e] group-hover:rotate-90 transition-transform duration-500 ease-out" strokeWidth={2.5} />
                </motion.button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-100 p-4 md:p-8 relative gap-12 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <header className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-extrabold tracking-tight">Folders</h1>
                </div>

                <div className="flex items-center gap-4">

                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Grip size={20} />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-xs font-bold text-cyan-400 tracking-wider">
                        DATE
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>


            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 pb-20">
                {folders.map(folder => (
                    <FolderCard
                        key={folder.id}
                        name={folder.name}
                        // Use files array length if available, else 0
                        fileCount={folder.files?.length || 0}
                        onClick={() => openFolder(folder.id)}
                        onRename={(newName: string) => renameFolder(folder.id, newName)}
                        onDelete={() => {
                            deleteFolder(folder.id);
                            setIsDeletingId(null);
                        }}
                        onDeleteRequest={() => setDeleteTargetId(folder.id)}
                        isDeleting={isDeletingId === folder.id}
                    />
                ))}

                {folders.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-500 gap-4 opacity-50">
                        <FolderPlus size={48} strokeWidth={1} />
                        <p>No folders in this workspace</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <motion.button
                onClick={createFolder}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-8 right-8 w-16 h-16 bg-[#22d3ee] rounded-full flex items-center justify-center z-50 group transition-all hover:bg-[#15abbf] shadow-lg shadow-cyan-500/20"
            >
                <Plus size={28} className="text-white transform group-hover:scale-110 transition-transform duration-500 ease-out" strokeWidth={2.5} />
            </motion.button>

            {/* Delete Confirmation Modal */}
            {deleteTargetId && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-zinc-100 mb-2">Delete Folder?</h3>
                        <p className="text-zinc-400 text-sm mb-6">
                            Are you sure you want to permanently delete this folder? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTargetId(null)}
                                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setIsDeletingId(deleteTargetId);
                                    setDeleteTargetId(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-medium border border-red-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoldersView;
