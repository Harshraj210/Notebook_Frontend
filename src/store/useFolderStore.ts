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

export type Folder = {
    id: string;
    name: string;
    files: NoteFile[];
    createdAt: string;
};

interface FolderState {
    folders: Folder[];
    activeFolderId: string | null;

    // Actions
    createFolder: () => void;
    deleteFolder: (id: string) => void;
    renameFolder: (id: string, name: string) => void;
    openFolder: (id: string) => void;
    closeFolder: () => void;
    addFileToFolder: (folderId: string, file: NoteFile) => void;
}

export const useFolderStore = create<FolderState>()(
    persist(
        (set) => ({
            folders: [],
            activeFolderId: null,

            createFolder: () => {
                const newFolder: Folder = {
                    id: uuidv4(),
                    name: 'Untitled Folder',
                    files: [],
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({ folders: [...state.folders, newFolder] }));
            },

            deleteFolder: (id) => {
                set((state) => ({
                    folders: state.folders.filter((f) => f.id !== id),
                    activeFolderId: state.activeFolderId === id ? null : state.activeFolderId
                }));
            },

            renameFolder: (id, name) => {
                set((state) => ({
                    folders: state.folders.map((f) =>
                        f.id === id ? { ...f, name } : f
                    ),
                }));
            },

            openFolder: (id) => set({ activeFolderId: id }),
            closeFolder: () => set({ activeFolderId: null }),

            addFileToFolder: (folderId, file) => {
                set((state) => ({
                    folders: state.folders.map((f) =>
                        f.id === folderId
                            ? { ...f, files: [...f.files, file] }
                            : f
                    ),
                }));
            },
        }),
        {
            name: 'notebook-folders',
        }
    )
);
