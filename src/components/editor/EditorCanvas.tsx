"use client";

import React from 'react';
import SmartEditor from '@/components/editor/SmartEditor';
import { useNotebookStore } from '@/store/useNotebookStore';
import { useFileStore } from '@/store/useFileStore';
import RecentFilesView from '@/components/files/RecentFilesView';
import FileEditorView from '@/components/files/FileEditorView';

const EditorCanvas = () => {
    const { activeNoteId, updateShadowContent } = useNotebookStore();
    const { isOverviewOpen, activeFileId } = useFileStore();

    if (isOverviewOpen) {
        if (activeFileId) {
            return (
                <div className="flex flex-col flex-1 h-screen overflow-hidden bg-brand-dark">
                    <FileEditorView />
                </div>
            );
        }
        return (
            <div className="flex flex-col flex-1 h-screen overflow-hidden bg-brand-dark">
                 <RecentFilesView />
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 h-screen overflow-hidden bg-brand-dark">


            <main className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
                <div className="max-w-3xl mx-auto min-h-full">
                    {activeNoteId ? (
                        <SmartEditor
                            onSync={(content) => updateShadowContent(activeNoteId, content)}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-zinc-600 italic text-sm">
                            Select a note to start writing...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default EditorCanvas;
