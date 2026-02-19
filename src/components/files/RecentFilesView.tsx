import React from 'react';
import { useFileStore } from '@/store/useFileStore';
import { Plus, Search, Grip, Calendar, MoreVertical, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import FileCard from './FileCard';

const RecentFilesView = () => {
    const { files, selectFile, createFile, updateFileTitle, deleteFile, toggleFilePin } = useFileStore();
    const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);

    const handleDeleteConfirm = () => {
        if (deleteTargetId) {
            deleteFile(deleteTargetId);
            setDeleteTargetId(null);
        }
    };


    return (
        <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-100 p-8 relative">
            {/* Header */}
            <header className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-extrabold tracking-tight">Recent Files</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Search size={20} />
                    </button>
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Grip size={20} />
                    </button>
                    {/* Date Pill */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-full border border-zinc-800 text-xs font-bold text-cyan-400 tracking-wider">
                        DATE
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>


            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {/* Card */}
                {files.map(file => (
                    <FileCard
                        key={file.id}
                        file={file}
                        onClick={() => selectFile(file.id)}
                        onRename={(newName) => updateFileTitle(file.id, newName)}
                        onDeleteRequest={() => setDeleteTargetId(file.id)}
                        onPin={() => toggleFilePin(file.id)}
                    />
                ))}

                {files.length === 0 && (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center text-zinc-500 gap-4 opacity-50">
                        <FileText size={48} strokeWidth={1} />
                        <p>No files created yet</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <button
                onClick={createFile}
                className="absolute bottom-8 right-8 w-14 h-14 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all hover:scale-110 active:scale-95 z-50"
            >
                <Plus size={28} className="text-[#0c0c0e]" strokeWidth={3} />
            </button>

            {/* Delete Confirmation Modal */}
            {deleteTargetId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-zinc-100 mb-2">Delete File?</h3>
                        <p className="text-zinc-400 text-sm mb-6">
                            Are you sure you want to delete this file? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteTargetId(null)}
                                className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
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

export default RecentFilesView;
