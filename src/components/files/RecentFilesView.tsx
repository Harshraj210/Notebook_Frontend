import React from 'react';
import { useFileStore } from '@/store/useFileStore';
import { Plus, Search, Grip, Calendar, MoreVertical, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const RecentFilesView = () => {
    const { files, selectFile, createFile } = useFileStore();

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

            <div className="mb-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    Active View: Recent Files
                 </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                 {/* Card */}
                 {files.map(file => (
                     <div 
                        key={file.id} 
                        onClick={() => selectFile(file.id)}
                        className="group flex flex-col gap-3 cursor-pointer"
                    >
                        {/* Thumbnail */}
                        <div className="aspect-[3/4] bg-zinc-900/50 rounded-2xl border border-zinc-800 group-hover:border-zinc-700 transition-all flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-transparent to-transparent opacity-50" />
                            <FileText size={48} className="text-zinc-700 group-hover:text-zinc-600 transition-colors" opacity={0.5} />
                            
                            {/* Content Preview (Visual fluff) */}
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
                            <h3 className="font-bold text-zinc-200 truncate group-hover:text-cyan-400 transition-colors">{file.title}</h3>
                            <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">
                                {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                     </div>
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
        </div>
    );
};

export default RecentFilesView;
