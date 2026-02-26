import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type NoteFile = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    pinned?: boolean;
};

interface FileState {
    files: NoteFile[];
    activeFileId: string | null;
    isOverviewOpen: boolean;
    isFoldersOpen: boolean;
    searchQuery: string;

    // Actions
    createFile: () => void;
    selectFile: (id: string) => void;
    updateFileContent: (id: string, content: string) => void;
    updateFileTitle: (id: string, title: string) => void;
    openOverview: () => void;
    closeOverview: () => void;
    openFolders: () => void;
    closeFolders: () => void;
    setSearchQuery: (query: string) => void;
    closeFile: () => void;
    deleteFile: (id: string) => void;
    toggleFilePin: (id: string) => void;
}

export const useFileStore = create<FileState>()(
    persist(
        (set, get) => ({
            files: [],
            activeFileId: null,
            isOverviewOpen: false,
            isFoldersOpen: false,
            searchQuery: '',

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
                set({ activeFileId: id, isOverviewOpen: true, isFoldersOpen: false });
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

            updateFileTitle: (id: string, title: string) => {
                set((state) => ({
                    files: state.files.map((file) =>
                        file.id === id
                            ? { ...file, title, updatedAt: new Date().toISOString() }
                            : file
                    ),
                }));
            },

            openOverview: () => set({ isOverviewOpen: true, isFoldersOpen: false, activeFileId: null, searchQuery: '' }),
            closeOverview: () => set({ isOverviewOpen: false }),
            openFolders: () => set({ isFoldersOpen: true, isOverviewOpen: false, activeFileId: null, searchQuery: '' }),
            closeFolders: () => set({ isFoldersOpen: false }),
            setSearchQuery: (query: string) => set({ searchQuery: query }),
            closeFile: () => set({ activeFileId: null }), // Go back to dashboard
            deleteFile: (id: string) => {
                set((state) => ({
                    files: state.files.filter((f) => f.id !== id),
                    activeFileId: state.activeFileId === id ? null : state.activeFileId
                }));
            },
            toggleFilePin: (id: string) => {
                set((state) => ({
                    files: state.files.map((file) =>
                        file.id === id
                            ? { ...file, pinned: !file.pinned }
                            : file
                    ),
                }));
            },
        }),
        {
            name: 'files-storage', // localStorage key
        }
    )
);
