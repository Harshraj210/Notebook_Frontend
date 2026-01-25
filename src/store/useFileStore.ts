import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type NoteFile = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

interface FileState {
    files: NoteFile[];
    activeFileId: string | null;
    isOverviewOpen: boolean;

    // Actions
    createFile: () => void;
    selectFile: (id: string) => void;
    updateFileContent: (id: string, content: string) => void;
    openOverview: () => void;
    closeOverview: () => void;
    closeFile: () => void;
}

export const useFileStore = create<FileState>()(
    persist(
        (set, get) => ({
            files: [],
            activeFileId: null,
            isOverviewOpen: false,

            createFile: () => {
                const newFile: NoteFile = {
                    id: uuidv4(),
                    title: 'Untitled Note',
                    content: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                set((state) => ({
                    files: [newFile, ...state.files], // Add to top
                    // activeFileId: newFile.id, // Don't auto-open in editor, just add to list (per screenshot flow implication? Actually requirement said "opens editor instantly" in previous prompt, but new requirement says "what happens after opening" in screenshot. Screenshot 2 shows editor. User said "it should look and what happens after opening". Usually clicking + opens it. I will keep auto-open behavior for now but route correctly.)
                    activeFileId: newFile.id,
                    isOverviewOpen: true // Ensure we are in the file mode context
                }));
            },

            selectFile: (id) => {
                set({ activeFileId: id, isOverviewOpen: true });
            },

            updateFileContent: (id, content) => {
                set((state) => ({
                    files: state.files.map((file) =>
                        file.id === id
                            ? { ...file, content, updatedAt: new Date().toISOString() }
                            : file
                    ),
                }));
            },

            openOverview: () => set({ isOverviewOpen: true, activeFileId: null }),
            closeOverview: () => set({ isOverviewOpen: false }),
            closeFile: () => set({ activeFileId: null }), // Go back to dashboard
        }),
        {
            name: 'files-storage', // localStorage key
        }
    )
);
