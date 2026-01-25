import React from 'react';
import { useFileStore } from '@/store/useFileStore';
import { ArrowLeft, FileText, LayoutTemplate, Share2 } from 'lucide-react';
import SmartEditor from '@/components/editor/SmartEditor';

const FileEditorView = () => {
    const { activeFileId, files, closeFile, updateFileContent } = useFileStore();
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
                     <h1 className="font-bold text-lg pointer-events-none select-none">
                        {activeFile.title}
                     </h1>
                 </div>

                 <div className="flex items-center gap-2">
                     <div className="border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer transition-colors">
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
