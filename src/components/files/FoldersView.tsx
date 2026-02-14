"use client";

import { useFolderStore } from '@/store/useFolderStore';
import { Search, Grip, Calendar, MoreVertical, FolderPlus, ArrowLeft, Plus } from 'lucide-react';
import FolderCard from './FolderCard';
import { motion } from 'framer-motion';

const FoldersView = () => {
    // Desktop: use store. Mobile: use store.
    const { folders, activeFolderId, createFolder, openFolder, closeFolder, renameFolder } = useFolderStore();
    
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
                <div className="grid grid-cols-1 gap-2">
                    {activeFolder.files.length > 0 ? (
                        activeFolder.files.map(file => (
                            <div key={file.id} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors flex items-center justify-between group cursor-pointer">
                                <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">{file.title}</span>
                                <span className="text-xs text-zinc-600 font-mono">{new Date(file.updatedAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-zinc-600 gap-4 border-2 border-dashed border-zinc-800/50 rounded-2xl">
                            <FolderPlus size={48} strokeWidth={1} className="opacity-50" />
                            <p className="text-sm">Empty folder</p>
                            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-colors">
                                Create File
                            </button>
                        </div>
                    )}
                </div>
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
                        <Search size={20} />
                    </button>
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
                        onRename={(newName) => renameFolder(folder.id, newName)}
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
            <button
                onClick={createFolder}
                className="absolute bottom-8 right-8 w-14 h-14 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all hover:scale-110 active:scale-95 z-50"
            >
                <FolderPlus size={28} className="text-[#0c0c0e]" strokeWidth={3} />
            </button>
        </div>
    );
};

export default FoldersView;
