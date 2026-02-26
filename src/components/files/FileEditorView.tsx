import React from 'react';
import { useFileStore } from '@/store/useFileStore';
import { useAIStore } from '@/store/useAIStore';
import { ArrowLeft, FileText, LayoutTemplate, Share2 } from 'lucide-react';
import SmartEditor from '@/components/editor/SmartEditor';
import { cn } from '@/lib/utils';

const FileEditorView = () => {
    const { activeFileId, files, closeFile, updateFileContent, updateFileTitle } = useFileStore();
    const { isAIOpen, toggleAI } = useAIStore();
    const activeFile = files.find(f => f.id === activeFileId);

    if (!activeFile) return null;

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e] text-zinc-100">
            {/* Header */}
            <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-[#0c0c0e] z-50">
                 <div className="flex items-center gap-4">
                     <button 
                        onClick={closeFile}
                        className="p-2 hover:bg-zinc-800 rounded-full text-cyan-500 transition-colors"
                    >
                         <ArrowLeft size={20} />
                     </button>
                     <input
                        type="text"
                        value={activeFile.title}
                        onChange={(e) => updateFileTitle(activeFile.id, e.target.value)}
                        placeholder="Untitled Note"
                        autoComplete="off"
                        spellCheck={false}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-zinc-100 placeholder-zinc-500 w-full cursor-text"
                    />
                 </div>

                 <div className="flex items-center gap-2">
                     <div 
                        onClick={toggleAI}
                        className={cn(
                            "border rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium cursor-pointer transition-all duration-200 select-none",
                            isAIOpen 
                                ? "bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm"
                                : "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                        )}
                     >
                        <FileText size={14} /> 
                        <span className="opacity-50">|</span>
                        <span>Open AI</span>
                     </div>
                 </div>
            </header>

            {/* Editor Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <main className="max-w-4xl mx-auto p-8 md:p-12 min-h-full">
                     <div className="text-zinc-500 text-sm mb-8 italic">
                        {/* Placeholder for "Start writing..." if handled by css, or rendered here */}
                     </div>
                     <SmartEditor
                        key={activeFile.id} 
                        initialContent={activeFile.content}
                        onSync={(content) => updateFileContent(activeFile.id, content)}
                    />
                </main>
            </div>
        </div>
    );
};

export default FileEditorView;
